import bcrypt from 'bcryptjs';

import { pool } from '../db/pool.js';
import { erroExcessoTentativas } from '../lib/erros.js';

const CUSTO = 12;

/** Hash de referência, usado para gastar o mesmo tempo quando o e-mail não existe. */
const HASH_FALSO = bcrypt.hashSync('senha-inexistente-para-tempo-constante', CUSTO);

export function gerarHash(senha: string): Promise<string> {
  return bcrypt.hash(senha, CUSTO);
}

export function conferirSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}

/**
 * Compara contra um hash descartável quando o usuário não existe, para que
 * e-mail cadastrado e não cadastrado levem o mesmo tempo de resposta.
 */
export async function gastarTempoDeComparacao(senha: string): Promise<void> {
  await bcrypt.compare(senha, HASH_FALSO);
}

const JANELA_MINUTOS = 15;
const LIMITE_POR_EMAIL = 5;
const LIMITE_POR_IP = 20;

export async function registrarTentativa(identificador: string, sucesso: boolean): Promise<void> {
  await pool.query(
    'INSERT INTO tentativas_login (identificador, sucesso) VALUES ($1, $2)',
    [identificador.toLowerCase().slice(0, 200), sucesso],
  );
}

async function contarFalhas(identificador: string): Promise<number> {
  const { rows } = await pool.query<{ total: string }>(
    `SELECT count(*) AS total
       FROM tentativas_login
      WHERE identificador = $1
        AND sucesso = FALSE
        AND criado_em > now() - ($2 || ' minutes')::interval`,
    [identificador.toLowerCase().slice(0, 200), String(JANELA_MINUTOS)],
  );
  return Number(rows[0]?.total ?? 0);
}

/** Trava força bruta por e-mail e por IP, com janela deslizante. */
export async function conferirLimite(email: string, ip: string): Promise<void> {
  const [falhasEmail, falhasIp] = await Promise.all([
    contarFalhas(`email:${email}`),
    contarFalhas(`ip:${ip}`),
  ]);

  if (falhasEmail >= LIMITE_POR_EMAIL || falhasIp >= LIMITE_POR_IP) {
    throw erroExcessoTentativas(
      `Muitas tentativas de login. Tente novamente em ${JANELA_MINUTOS} minutos.`,
    );
  }
}

export async function limparTentativas(email: string, ip: string): Promise<void> {
  await pool.query('DELETE FROM tentativas_login WHERE identificador = ANY($1)', [
    [`email:${email.toLowerCase()}`, `ip:${ip.toLowerCase()}`],
  ]);
}
