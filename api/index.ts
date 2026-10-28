import { criarApp } from '../server/src/app.js';

/**
 * Ponto de entrada da API na Vercel.
 *
 * Lá cada rota vira uma função sem servidor, e um app Express já é um
 * manipulador `(req, res)` válido — então basta exportá-lo. O app é criado
 * uma vez por instância e reaproveitado entre as invocações.
 *
 * As migrações NÃO rodam aqui de propósito: várias instâncias subindo ao
 * mesmo tempo tentariam migrar em paralelo. Rode `npm run db:migrar` no
 * deploy ou localmente, apontando para o banco de produção.
 */
export default criarApp();
