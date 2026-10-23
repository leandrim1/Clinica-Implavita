import { Router } from 'express';

import { esquemaContatoRecebido, type ContatoRecebido } from '../../../shared/esquemas.js';
import { exigirSessao, verificarCsrf } from '../auth/middleware.js';
import { pool } from '../db/pool.js';
import { ipDaRequisicao, registrar } from '../lib/auditoria.js';
import { rota } from '../lib/async.js';
import { erroExcessoTentativas, erroNaoEncontrado, erroRequisicao } from '../lib/erros.js';

export const rotasContatos = Router();

const paraContato = (r: {
  id: string; nome: string; telefone: string; assunto: string; mensagem: string;
  criado_em: Date; lido_em: Date | null; arquivado_em: Date | null;
}): ContatoRecebido => ({
  id: r.id,
  nome: r.nome,
  telefone: r.telefone,
  assunto: r.assunto,
  mensagem: r.mensagem,
  criadoEm: r.criado_em.toISOString(),
  lidoEm: r.lido_em?.toISOString() ?? null,
  arquivadoEm: r.arquivado_em?.toISOString() ?? null,
});

const LIMITE_POR_IP = 5;
const JANELA_MINUTOS = 30;

/**
 * Registro público de contato.
 *
 * O site continua levando a pessoa ao WhatsApp — este endpoint só garante que
 * a mensagem não se perca caso ela desista no meio do caminho.
 */
rotasContatos.post(
  '/',
  rota(async (req, res) => {
    const analise = esquemaContatoRecebido.safeParse(req.body);
    if (!analise.success) {
      throw erroRequisicao('Dados inválidos.', analise.error.flatten().fieldErrors);
    }

    const ip = ipDaRequisicao(req);

    const { rows: recentes } = await pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM contatos
        WHERE ip = $1 AND criado_em > now() - ($2 || ' minutes')::interval`,
      [ip, String(JANELA_MINUTOS)],
    );

    if (Number(recentes[0]?.total ?? 0) >= LIMITE_POR_IP) {
      throw erroExcessoTentativas(
        'Recebemos várias mensagens deste dispositivo. Fale com a clínica pelo WhatsApp.',
      );
    }

    const { nome, telefone, assunto, mensagem } = analise.data;

    const { rows } = await pool.query<{ id: string }>(
      `INSERT INTO contatos (nome, telefone, assunto, mensagem, ip)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nome, telefone, assunto, mensagem, ip],
    );

    res.status(201).json({ id: rows[0]!.id });
  }),
);

// Daqui para baixo, só com sessão.
rotasContatos.use(exigirSessao);

rotasContatos.get(
  '/',
  rota(async (req, res) => {
    const arquivados = req.query.arquivados === 'true';

    const { rows } = await pool.query(
      `SELECT * FROM contatos
        WHERE arquivado_em IS ${arquivados ? 'NOT NULL' : 'NULL'}
        ORDER BY criado_em DESC
        LIMIT 200`,
    );

    const { rows: naoLidos } = await pool.query<{ total: string }>(
      'SELECT count(*) AS total FROM contatos WHERE lido_em IS NULL AND arquivado_em IS NULL',
    );

    res.json({
      contatos: rows.map(paraContato),
      naoLidos: Number(naoLidos[0]?.total ?? 0),
    });
  }),
);

rotasContatos.post(
  '/:id/lido',
  verificarCsrf,
  rota(async (req, res) => {
    const { rows } = await pool.query(
      'UPDATE contatos SET lido_em = COALESCE(lido_em, now()) WHERE id = $1 RETURNING *',
      [req.params.id],
    );
    if (!rows[0]) throw erroNaoEncontrado('Contato não encontrado.');
    res.json({ contato: paraContato(rows[0]) });
  }),
);

rotasContatos.post(
  '/:id/arquivar',
  verificarCsrf,
  rota(async (req, res) => {
    const { rows } = await pool.query(
      `UPDATE contatos
          SET arquivado_em = CASE WHEN arquivado_em IS NULL THEN now() ELSE NULL END,
              lido_em = COALESCE(lido_em, now())
        WHERE id = $1
        RETURNING *`,
      [req.params.id],
    );
    if (!rows[0]) throw erroNaoEncontrado('Contato não encontrado.');
    res.json({ contato: paraContato(rows[0]) });
  }),
);

rotasContatos.delete(
  '/:id',
  verificarCsrf,
  rota(async (req, res) => {
    const { rowCount } = await pool.query('DELETE FROM contatos WHERE id = $1', [req.params.id]);
    if (!rowCount) throw erroNaoEncontrado('Contato não encontrado.');

    await registrar(req, 'excluir_contato', 'contato', String(req.params.id));
    res.json({ ok: true });
  }),
);
