import { Router } from 'express';

import { esquemaLogin, esquemaTrocaSenha, type UsuarioPublico } from '../../../shared/esquemas.js';
import { exigirSessao, verificarCsrf } from '../auth/middleware.js';
import {
  conferirLimite,
  conferirSenha,
  gastarTempoDeComparacao,
  gerarHash,
  limparTentativas,
  registrarTentativa,
} from '../auth/senha.js';
import {
  criarSessao,
  definirCookies,
  limparCookies,
  revogarSessao,
  revogarSessoesDoUsuario,
} from '../auth/sessao.js';
import { pool } from '../db/pool.js';
import { ipDaRequisicao, registrar } from '../lib/auditoria.js';
import { rota } from '../lib/async.js';
import { erroRequisicao, ErroHttp } from '../lib/erros.js';

export const rotasAutenticacao = Router();

interface LinhaUsuario {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  papel: 'administrador' | 'editor';
  ativo: boolean;
  criado_em: Date;
  ultimo_acesso_em: Date | null;
}

const paraPublico = (u: LinhaUsuario): UsuarioPublico => ({
  id: u.id,
  nome: u.nome,
  email: u.email,
  papel: u.papel,
  ativo: u.ativo,
  criadoEm: u.criado_em.toISOString(),
  ultimoAcessoEm: u.ultimo_acesso_em?.toISOString() ?? null,
});

rotasAutenticacao.post(
  '/entrar',
  rota(async (req, res) => {
    const analise = esquemaLogin.safeParse(req.body);
    if (!analise.success) {
      throw erroRequisicao('Dados de login inválidos.', analise.error.flatten().fieldErrors);
    }

    const { email, senha } = analise.data;
    const ip = ipDaRequisicao(req);

    await conferirLimite(email, ip);

    const { rows } = await pool.query<LinhaUsuario>(
      'SELECT * FROM usuarios WHERE email = $1',
      [email],
    );
    const usuario = rows[0];

    // Mensagem única para e-mail inexistente, senha errada e conta desativada:
    // não informamos a um atacante qual e-mail existe.
    const recusar = async () => {
      await registrarTentativa(`email:${email}`, false);
      await registrarTentativa(`ip:${ip}`, false);
      throw new ErroHttp(401, 'E-mail ou senha incorretos.', 'credenciais_invalidas');
    };

    if (!usuario || !usuario.ativo) {
      await gastarTempoDeComparacao(senha);
      await recusar();
      return;
    }

    if (!(await conferirSenha(senha, usuario.senha_hash))) {
      await recusar();
      return;
    }

    await limparTentativas(email, ip);

    const sessao = await criarSessao(usuario.id, ip, req.get('user-agent'));
    definirCookies(res, sessao);

    await pool.query('UPDATE usuarios SET ultimo_acesso_em = now() WHERE id = $1', [usuario.id]);

    req.sessao = {
      sessaoId: sessao.id,
      usuarioId: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
    };
    await registrar(req, 'login', 'usuario', usuario.id);

    res.json({ usuario: paraPublico({ ...usuario, ultimo_acesso_em: new Date() }) });
  }),
);

rotasAutenticacao.post(
  '/sair',
  verificarCsrf,
  rota(async (req, res) => {
    if (req.tokenSessao) {
      await registrar(req, 'logout', 'usuario', req.sessao?.usuarioId ?? null);
      await revogarSessao(req.tokenSessao);
    }
    limparCookies(res);
    res.json({ ok: true });
  }),
);

/** Quem sou eu. O painel chama no carregamento para restaurar a sessão. */
rotasAutenticacao.get(
  '/eu',
  rota(async (req, res) => {
    if (!req.sessao) {
      res.status(401).json({ erro: 'Sessão não encontrada.' });
      return;
    }

    const { rows } = await pool.query<LinhaUsuario>(
      'SELECT * FROM usuarios WHERE id = $1',
      [req.sessao.usuarioId],
    );
    const usuario = rows[0];
    if (!usuario) {
      res.status(401).json({ erro: 'Sessão não encontrada.' });
      return;
    }

    res.json({ usuario: paraPublico(usuario) });
  }),
);

rotasAutenticacao.post(
  '/trocar-senha',
  exigirSessao,
  verificarCsrf,
  rota(async (req, res) => {
    const analise = esquemaTrocaSenha.safeParse(req.body);
    if (!analise.success) {
      throw erroRequisicao('Dados inválidos.', analise.error.flatten().fieldErrors);
    }

    const { senhaAtual, novaSenha } = analise.data;
    const usuarioId = req.sessao!.usuarioId;

    const { rows } = await pool.query<{ senha_hash: string }>(
      'SELECT senha_hash FROM usuarios WHERE id = $1',
      [usuarioId],
    );
    const hashAtual = rows[0]?.senha_hash;
    if (!hashAtual || !(await conferirSenha(senhaAtual, hashAtual))) {
      throw new ErroHttp(400, 'A senha atual está incorreta.', 'senha_incorreta');
    }

    if (await conferirSenha(novaSenha, hashAtual)) {
      throw erroRequisicao('A nova senha precisa ser diferente da atual.');
    }

    await pool.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [
      await gerarHash(novaSenha),
      usuarioId,
    ]);

    // Trocar a senha derruba as demais sessões, mas mantém a atual.
    await revogarSessoesDoUsuario(usuarioId, req.sessao!.sessaoId);
    await registrar(req, 'trocar_senha', 'usuario', usuarioId);

    res.json({ ok: true });
  }),
);
