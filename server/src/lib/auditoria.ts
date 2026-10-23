import type { Request } from 'express';

import { pool } from '../db/pool.js';

/** Registra uma ação relevante. Nunca derruba a requisição se falhar. */
export async function registrar(
  req: Request,
  acao: string,
  entidade: string,
  entidadeId?: string | null,
  detalhe?: unknown,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO registros_auditoria (usuario_id, acao, entidade, entidade_id, detalhe, ip)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.sessao?.usuarioId ?? null,
        acao,
        entidade,
        entidadeId ?? null,
        detalhe === undefined ? null : JSON.stringify(detalhe),
        ipDaRequisicao(req),
      ],
    );
  } catch (erro) {
    console.error('[auditoria] falha ao registrar:', erro);
  }
}

/** IP do cliente, considerando proxy reverso quando `trust proxy` está ligado. */
export function ipDaRequisicao(req: Request): string {
  return (req.ip ?? req.socket.remoteAddress ?? 'desconhecido').slice(0, 60);
}
