import { criarApp } from './app.js';
import { limparSessoesExpiradas } from './auth/sessao.js';
import { migrar } from './db/migrar.js';
import { encerrarPool, pool } from './db/pool.js';
import { ambiente } from './lib/ambiente.js';

async function iniciar() {
  // Confere o banco antes de abrir a porta: melhor falhar agora do que
  // responder 500 na primeira requisição.
  try {
    await pool.query('SELECT 1');
  } catch (erro) {
    console.error(
      '[servidor] não foi possível conectar ao banco. Confira DATABASE_URL no .env.\n',
      erro instanceof Error ? erro.message : erro,
    );
    process.exit(1);
  }

  await migrar();

  const app = criarApp();
  const servidor = app.listen(ambiente.PORT, () => {
    console.log(`[servidor] API no ar em http://localhost:${ambiente.PORT} (${ambiente.AMBIENTE})`);
  });

  // Faxina periódica das sessões vencidas.
  const faxina = setInterval(
    () => {
      limparSessoesExpiradas()
        .then((n) => n > 0 && console.log(`[sessões] ${n} sessão(ões) antiga(s) removida(s).`))
        .catch((e) => console.error('[sessões] falha na limpeza:', e));
    },
    6 * 60 * 60 * 1000,
  );
  faxina.unref();

  const encerrar = (sinal: string) => () => {
    console.log(`\n[servidor] ${sinal} recebido, encerrando...`);
    servidor.close(() => {
      encerrarPool().finally(() => process.exit(0));
    });
    // Se as conexões não fecharem a tempo, sai assim mesmo.
    setTimeout(() => process.exit(0), 10_000).unref();
  };

  process.on('SIGTERM', encerrar('SIGTERM'));
  process.on('SIGINT', encerrar('SIGINT'));
}

iniciar().catch((erro) => {
  console.error('[servidor] falha ao iniciar:', erro);
  process.exit(1);
});
