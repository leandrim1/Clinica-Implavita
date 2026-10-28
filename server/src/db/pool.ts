import { Pool } from 'pg';

import { ambiente, semServidor } from '../lib/ambiente.js';

/**
 * Pool único da aplicação.
 *
 * `DATABASE_SSL=true` cobre Postgres gerenciado (Neon, Supabase, RDS), que
 * exige TLS. Em desenvolvimento, contra um Postgres local, fica desligado.
 *
 * Sem servidor, cada instância tem o próprio pool e dezenas delas podem
 * existir ao mesmo tempo — por isso o limite por instância cai para 1 e as
 * conexões ociosas são liberadas rápido. Use a connection string *pooled*
 * do provedor (no Neon, a que tem `-pooler` no host).
 */
export const pool = new Pool({
  connectionString: ambiente.DATABASE_URL,
  ssl: ambiente.DATABASE_SSL ? { rejectUnauthorized: true } : false,
  max: semServidor ? 1 : 10,
  idleTimeoutMillis: semServidor ? 10_000 : 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (erro) => {
  console.error('[banco] erro em conexão ociosa:', erro.message);
});

/** Executa uma função dentro de uma transação, revertendo em caso de erro. */
export async function emTransacao<T>(
  tarefa: (cliente: import('pg').PoolClient) => Promise<T>,
): Promise<T> {
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const resultado = await tarefa(cliente);
    await cliente.query('COMMIT');
    return resultado;
  } catch (erro) {
    await cliente.query('ROLLBACK');
    throw erro;
  } finally {
    cliente.release();
  }
}

export async function encerrarPool(): Promise<void> {
  await pool.end();
}
