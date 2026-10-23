import { Router } from 'express';
import { z } from 'zod';

import { esquemaNovoUsuario, type UsuarioPublico } from '../../../shared/esquemas.js';
import { exigirPapel, verificarCsrf } from '../auth/middleware.js';
import { gerarHash } from '../auth/senha.js';
import { revogarSessoesDoUsuario } from '../auth/sessao.js';
import { pool } from '../db/pool.js';
import { registrar } from '../lib/auditoria.js';
import { rota } from '../lib/async.js';
import { erroConflito, erroNaoEncontrado, erroRequisicao } from '../lib/erros.js';

export const rotasUsuarios = Router();

const paraPublico = (u: {
  id: string; nome: string; email: string; papel: 'administrador' | 'editor';
  ativo: boolean; criado_em: Date; ultimo_acesso_em: Date | null;
}): UsuarioPublico => ({
  id: u.id,
  nome: u.nome,
  email: u.email,
  papel: u.papel,
  ativo: u.ativo,
  criadoEm: u.criado_em.toISOString(),
  ultimoAcessoEm: u.ultimo_acesso_em?.toISOString() ?? null,
});

// Gestão de contas é exclusiva de administradores.
rotasUsuarios.use(exigirPapel('administrador'));

rotasUsuarios.get(
  '/',
  rota(async (_req, res) => {
    const { rows } = await pool.query('SELECT * FROM usuarios ORDER BY criado_em');
    res.json({ usuarios: rows.map(paraPublico) });
  }),
);

rotasUsuarios.post(
  '/',
  verificarCsrf,
  rota(async (req, res) => {
    const analise = esquemaNovoUsuario.safeParse(req.body);
    if (!analise.success) {
      throw erroRequisicao('Dados inválidos.', analise.error.flatten().fieldErrors);
    }

    const { nome, email, senha, papel } = analise.data;

    const { rows: existentes } = await pool.query('SELECT 1 FROM usuarios WHERE email = $1', [email]);
    if (existentes.length > 0) throw erroConflito('Já existe uma conta com este e-mail.');

    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, papel)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, email, await gerarHash(senha), papel],
    );

    const usuario = paraPublico(rows[0]);
    await registrar(req, 'criar_usuario', 'usuario', usuario.id, { papel });

    res.status(201).json({ usuario });
  }),
);

rotasUsuarios.patch(
  '/:id',
  verificarCsrf,
  rota(async (req, res) => {
    const analise = z
      .object({
        nome: z.string().trim().min(3).max(120).optional(),
        papel: z.enum(['administrador', 'editor']).optional(),
        ativo: z.boolean().optional(),
      })
      .safeParse(req.body);

    if (!analise.success) throw erroRequisicao('Dados inválidos.');

    const id = String(req.params.id);
    const { nome, papel, ativo } = analise.data;

    // Um administrador não pode rebaixar nem desativar a própria conta: isso
    // deixaria o painel sem ninguém capaz de gerenciar usuários.
    if (id === req.sessao!.usuarioId && (papel === 'editor' || ativo === false)) {
      throw erroRequisicao('Você não pode alterar o próprio acesso de administrador.');
    }

    if (papel === 'editor' || ativo === false) {
      const { rows } = await pool.query<{ total: string }>(
        `SELECT count(*) AS total FROM usuarios
          WHERE papel = 'administrador' AND ativo = TRUE AND id <> $1`,
        [id],
      );
      if (Number(rows[0]?.total ?? 0) === 0) {
        throw erroRequisicao('É preciso manter pelo menos um administrador ativo.');
      }
    }

    const { rows } = await pool.query(
      `UPDATE usuarios
          SET nome  = COALESCE($2, nome),
              papel = COALESCE($3, papel),
              ativo = COALESCE($4, ativo)
        WHERE id = $1
        RETURNING *`,
      [id, nome ?? null, papel ?? null, ativo ?? null],
    );
    if (!rows[0]) throw erroNaoEncontrado('Usuário não encontrado.');

    // Desativar precisa derrubar as sessões abertas na hora.
    if (ativo === false) await revogarSessoesDoUsuario(id);

    await registrar(req, 'atualizar_usuario', 'usuario', id, analise.data);
    res.json({ usuario: paraPublico(rows[0]) });
  }),
);

rotasUsuarios.delete(
  '/:id',
  verificarCsrf,
  rota(async (req, res) => {
    const id = String(req.params.id);
    if (id === req.sessao!.usuarioId) {
      throw erroRequisicao('Você não pode excluir a própria conta.');
    }

    const { rows } = await pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM usuarios
        WHERE papel = 'administrador' AND ativo = TRUE AND id <> $1`,
      [id],
    );
    if (Number(rows[0]?.total ?? 0) === 0) {
      throw erroRequisicao('É preciso manter pelo menos um administrador ativo.');
    }

    const { rowCount } = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    if (!rowCount) throw erroNaoEncontrado('Usuário não encontrado.');

    await registrar(req, 'excluir_usuario', 'usuario', id);
    res.json({ ok: true });
  }),
);
