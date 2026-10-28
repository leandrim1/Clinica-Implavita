import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { gerarHash } from '../auth/senha.js';
import { revogarSessoesDoUsuario } from '../auth/sessao.js';
import { pool } from './pool.js';
import { migrar } from './migrar.js';

/* -------------------------------------------------------------------------
 * CRIAR OU REDEFINIR O ADMINISTRADOR
 *
 * Existe para que ninguém fique trancado para fora do painel: cria a conta
 * quando ela não existe e redefine a senha quando existe.
 *
 *   npm run db:admin
 *       pergunta os dados no terminal.
 *
 *   ADMIN_EMAIL=... ADMIN_SENHA=... npm run db:admin
 *       sem perguntas, para provisionamento automatizado.
 *
 * Também aceita `npm run db:admin -- email senha`, mas a senha fica no
 * histórico do shell e na lista de processos — prefira as variáveis.
 * ---------------------------------------------------------------------- */

function validarSenha(senha: string): string | null {
  if (senha.length < 12) return 'A senha precisa de pelo menos 12 caracteres.';
  if (!/[a-z]/.test(senha)) return 'Inclua ao menos uma letra minúscula.';
  if (!/[A-Z]/.test(senha)) return 'Inclua ao menos uma letra maiúscula.';
  if (!/\d/.test(senha)) return 'Inclua ao menos um número.';
  return null;
}

const ehEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

/** Pergunta no terminal; falha com instrução clara se não houver terminal. */
async function perguntar(rotulo: string): Promise<string> {
  if (!stdin.isTTY) {
    throw new Error(
      `Faltou informar ${rotulo}. Sem terminal interativo, passe os valores assim:\n` +
        '  ADMIN_EMAIL=voce@clinica.com.br ADMIN_SENHA=sua-senha npm run db:admin',
    );
  }

  const leitor = createInterface({ input: stdin, output: stdout });
  try {
    return (await leitor.question(`${rotulo}: `)).trim();
  } finally {
    leitor.close();
  }
}

async function principal(): Promise<void> {
  await migrar();

  const [emailArg, senhaArg] = process.argv.slice(2);

  const email = (emailArg ?? process.env['ADMIN_EMAIL'] ?? (await perguntar('E-mail do administrador'))).trim();
  if (!ehEmail(email)) throw new Error(`E-mail inválido: "${email}"`);

  const { rows } = await pool.query<{ id: string; nome: string }>(
    'SELECT id, nome FROM usuarios WHERE email = $1',
    [email],
  );
  const existente = rows[0];

  if (existente) {
    console.log(`Conta encontrada (${existente.nome}). A senha será redefinida.`);
  }

  const nome = existente
    ? existente.nome
    : (process.env['ADMIN_NOME'] ?? (await perguntar('Nome'))).trim() || 'Administrador';

  const senha = senhaArg ?? process.env['ADMIN_SENHA'] ?? (await perguntar('Senha'));

  const problema = validarSenha(senha);
  if (problema) throw new Error(`${problema} Nada foi alterado.`);

  const hash = await gerarHash(senha);

  if (existente) {
    await pool.query(
      `UPDATE usuarios SET senha_hash = $2, papel = 'administrador', ativo = TRUE WHERE id = $1`,
      [existente.id, hash],
    );
    // Se a senha antiga vazou, as sessões abertas com ela caem junto.
    await revogarSessoesDoUsuario(existente.id);
    console.log(`\nSenha redefinida para ${email}. As sessões abertas foram encerradas.`);
  } else {
    await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES ($1, $2, $3, 'administrador')`,
      [nome, email, hash],
    );
    console.log(`\nAdministrador criado: ${email}`);
  }

  console.log('Entre no painel em /admin com esses dados.');
}

principal()
  .then(() => pool.end())
  .catch((erro) => {
    console.error(`\n${erro instanceof Error ? erro.message : erro}`);
    pool.end().finally(() => process.exit(1));
  });
