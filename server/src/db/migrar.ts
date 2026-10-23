import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { pool } from './pool.js';

const PASTA = join(dirname(fileURLToPath(import.meta.url)), 'migracoes');

/**
 * Aplica as migrações ainda não executadas, em ordem de nome de arquivo.
 * Cada migração roda dentro de uma transação e fica registrada, de modo que
 * rodar o comando duas vezes não repete nada.
 */
export async function migrar(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migracoes (
      nome       TEXT PRIMARY KEY,
      aplicada_em TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await pool.query<{ nome: string }>('SELECT nome FROM migracoes');
  const aplicadas = new Set(rows.map((r) => r.nome));

  const arquivos = (await readdir(PASTA)).filter((f) => f.endsWith('.sql')).sort();
  let novas = 0;

  for (const arquivo of arquivos) {
    if (aplicadas.has(arquivo)) continue;

    const sql = await readFile(join(PASTA, arquivo), 'utf8');
    const cliente = await pool.connect();

    try {
      await cliente.query('BEGIN');
      await cliente.query(sql);
      await cliente.query('INSERT INTO migracoes (nome) VALUES ($1)', [arquivo]);
      await cliente.query('COMMIT');
      console.log(`[migração] aplicada: ${arquivo}`);
      novas += 1;
    } catch (erro) {
      await cliente.query('ROLLBACK');
      throw new Error(
        `Falha na migração ${arquivo}: ${erro instanceof Error ? erro.message : String(erro)}`,
      );
    } finally {
      cliente.release();
    }
  }

  console.log(
    novas === 0
      ? '[migração] banco já estava atualizado.'
      : `[migração] ${novas} migração(ões) aplicada(s).`,
  );
}

// Permite rodar como script: `npm run db:migrar`
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop() ?? '')) {
  migrar()
    .then(() => pool.end())
    .catch((erro) => {
      console.error(erro.message);
      process.exit(1);
    });
}
