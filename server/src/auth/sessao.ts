import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Response } from 'express';

import { ambiente, emProducao } from '../lib/ambiente.js';
import { pool } from '../db/pool.js';

export const COOKIE_SESSAO = 'implavita_sessao';
export const COOKIE_CSRF = 'implavita_csrf';
export const CABECALHO_CSRF = 'x-csrf-token';

/**
 * O cookie guarda um token aleatório; o banco guarda apenas o SHA-256 dele,
 * temperado com SEGREDO_SESSAO. Vazamento do banco não entrega sessões ativas.
 */
function digerir(token: string): string {
  return createHash('sha256').update(`${token}${ambiente.SEGREDO_SESSAO}`).digest('hex');
}

function gerarToken(): string {
  return randomBytes(32).toString('base64url');
}

export interface SessaoCriada {
  readonly id: string;
  readonly token: string;
  readonly csrf: string;
  readonly expiraEm: Date;
}

export async function criarSessao(
  usuarioId: string,
  ip: string | undefined,
  agente: string | undefined,
): Promise<SessaoCriada> {
  const token = gerarToken();
  const csrf = gerarToken();
  const expiraEm = new Date(Date.now() + ambiente.SESSAO_HORAS * 3_600_000);

  const { rows } = await pool.query<{ id: string }>(
    `INSERT INTO sessoes (usuario_id, token_hash, expira_em, ip, agente)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [usuarioId, digerir(token), expiraEm, ip ?? null, agente?.slice(0, 300) ?? null],
  );

  return { id: rows[0]!.id, token, csrf, expiraEm };
}

export interface SessaoValida {
  readonly sessaoId: string;
  readonly usuarioId: string;
  readonly nome: string;
  readonly email: string;
  readonly papel: 'administrador' | 'editor';
}

export async function buscarSessao(token: string): Promise<SessaoValida | null> {
  const { rows } = await pool.query<{
    sessao_id: string;
    usuario_id: string;
    nome: string;
    email: string;
    papel: 'administrador' | 'editor';
  }>(
    `SELECT s.id AS sessao_id, u.id AS usuario_id, u.nome, u.email, u.papel
       FROM sessoes s
       JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.token_hash = $1
        AND s.revogada_em IS NULL
        AND s.expira_em > now()
        AND u.ativo = TRUE`,
    [digerir(token)],
  );

  const linha = rows[0];
  if (!linha) return null;

  return {
    sessaoId: linha.sessao_id,
    usuarioId: linha.usuario_id,
    nome: linha.nome,
    email: linha.email,
    papel: linha.papel,
  };
}

export async function revogarSessao(token: string): Promise<void> {
  await pool.query(
    `UPDATE sessoes SET revogada_em = now()
      WHERE token_hash = $1 AND revogada_em IS NULL`,
    [digerir(token)],
  );
}

/** Usado ao trocar a senha: derruba todas as outras sessões do usuário. */
export async function revogarSessoesDoUsuario(
  usuarioId: string,
  exceto?: string,
): Promise<void> {
  await pool.query(
    `UPDATE sessoes SET revogada_em = now()
      WHERE usuario_id = $1 AND revogada_em IS NULL
        AND ($2::uuid IS NULL OR id <> $2::uuid)`,
    [usuarioId, exceto ?? null],
  );
}

export async function limparSessoesExpiradas(): Promise<number> {
  const { rowCount } = await pool.query(
    `DELETE FROM sessoes WHERE expira_em < now() - INTERVAL '7 days'`,
  );
  return rowCount ?? 0;
}

/**
 * O cookie de sessão é httpOnly (inacessível a scripts); o de CSRF não é, de
 * propósito: o painel precisa lê-lo para devolvê-lo no cabeçalho. Como a
 * origem é verificada e o SameSite é estrito, só o próprio painel consegue.
 */
export function definirCookies(res: Response, sessao: SessaoCriada): void {
  const comum = {
    sameSite: 'strict' as const,
    secure: emProducao,
    path: '/',
    expires: sessao.expiraEm,
  };

  res.cookie(COOKIE_SESSAO, sessao.token, { ...comum, httpOnly: true });
  res.cookie(COOKIE_CSRF, sessao.csrf, { ...comum, httpOnly: false });
}

export function limparCookies(res: Response): void {
  const comum = { sameSite: 'strict' as const, secure: emProducao, path: '/' };
  res.clearCookie(COOKIE_SESSAO, { ...comum, httpOnly: true });
  res.clearCookie(COOKIE_CSRF, { ...comum, httpOnly: false });
}

/** Comparação em tempo constante, para não vazar o token por tempo de resposta. */
export function compararSegredos(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
