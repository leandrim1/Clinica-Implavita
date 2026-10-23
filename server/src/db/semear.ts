import bcrypt from 'bcryptjs';

import { CONTEUDO_PADRAO } from '../../../shared/conteudoPadrao.js';
import { CHAVES_BLOCOS, ESQUEMAS_BLOCOS } from '../../../shared/esquemas.js';
import { ambiente } from '../lib/ambiente.js';
import { emTransacao, pool } from './pool.js';
import { migrar } from './migrar.js';

/**
 * Preenche o banco com o conteúdo padrão e cria o primeiro administrador.
 *
 * É seguro rodar mais de uma vez: blocos já existentes não são sobrescritos,
 * para não apagar o que a clínica editou pelo painel.
 */
export async function semear(): Promise<void> {
  await migrar();

  // --- Conteúdo ---
  let inseridos = 0;

  await emTransacao(async (cliente) => {
    for (const chave of CHAVES_BLOCOS) {
      const dados = CONTEUDO_PADRAO[chave];

      // Falha cedo se o conteúdo padrão não bater com o esquema.
      const validado = ESQUEMAS_BLOCOS[chave].safeParse(dados);
      if (!validado.success) {
        throw new Error(
          `Conteúdo padrão inválido no bloco "${chave}":\n` +
            validado.error.issues
              .map((p) => `  - ${p.path.join('.') || '(raiz)'}: ${p.message}`)
              .join('\n'),
        );
      }

      const { rowCount } = await cliente.query(
        `INSERT INTO blocos_conteudo (chave, dados)
         VALUES ($1, $2)
         ON CONFLICT (chave) DO NOTHING`,
        [chave, JSON.stringify(validado.data)],
      );
      if (rowCount) inseridos += 1;
    }
  });

  console.log(
    inseridos === 0
      ? '[seed] conteúdo já existia; nada foi sobrescrito.'
      : `[seed] ${inseridos} bloco(s) de conteúdo inserido(s).`,
  );

  // --- Primeiro administrador ---
  const { rows } = await pool.query<{ total: string }>('SELECT count(*) AS total FROM usuarios');

  if (Number(rows[0]?.total ?? 0) > 0) {
    console.log('[seed] já existe usuário cadastrado; nenhum administrador criado.');
    return;
  }

  if (!ambiente.ADMIN_EMAIL || !ambiente.ADMIN_SENHA) {
    console.log(
      '[seed] nenhum usuário no banco. Defina ADMIN_EMAIL e ADMIN_SENHA no .env e rode novamente.',
    );
    return;
  }

  if (ambiente.ADMIN_SENHA.length < 12) {
    throw new Error('ADMIN_SENHA precisa de pelo menos 12 caracteres.');
  }

  const hash = await bcrypt.hash(ambiente.ADMIN_SENHA, 12);
  await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, papel)
     VALUES ($1, $2, $3, 'administrador')`,
    [ambiente.ADMIN_NOME, ambiente.ADMIN_EMAIL, hash],
  );

  console.log(`[seed] administrador criado: ${ambiente.ADMIN_EMAIL}`);
}

if (process.argv[1]?.includes('semear')) {
  semear()
    .then(() => pool.end())
    .catch((erro) => {
      console.error(erro instanceof Error ? erro.message : erro);
      process.exit(1);
    });
}
