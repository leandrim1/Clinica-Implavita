# API e painel administrativo

Backend em Node + Express + PostgreSQL que serve o conteúdo do site e sustenta
o painel em `/admin`.

## Subir em desenvolvimento

```bash
cp .env.example .env     # ajuste DATABASE_URL e SEGREDO_SESSAO
npm install
npm run db:semear        # cria as tabelas, carrega o conteúdo e o 1º admin
npm run dev:api          # API em http://localhost:3333
npm run dev              # site em http://localhost:5173 (já faz proxy de /api)
```

Gere o segredo de sessão com:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

> **Nunca coloque `NODE_ENV` no `.env`.** O Vite lê esse arquivo durante o build
> e passaria a empacotar a versão de desenvolvimento do React — o pacote dobra
> de tamanho. A variável do servidor se chama `AMBIENTE` justamente por isso.

## Estrutura

```
server/src/
├─ index.ts              sobe o servidor, confere o banco, aplica migrações
├─ app.ts                Express: CORS, cabeçalhos, rotas, tratamento de erro
├─ db/
│  ├─ pool.ts            pool de conexões e helper de transação
│  ├─ migracoes/         SQL versionado, aplicado em ordem
│  ├─ migrar.ts          executor idempotente
│  └─ semear.ts          conteúdo inicial e primeiro administrador
├─ auth/
│  ├─ sessao.ts          sessões opacas, cookies, CSRF
│  ├─ senha.ts           hash, comparação em tempo constante, limite de tentativas
│  └─ middleware.ts      carregar sessão, exigir papel, verificar CSRF
├─ rotas/                autenticação, conteúdo, mídia, contatos, usuários
├─ servicos/             armazenamento de imagens, avaliações do Google
└─ lib/                  ambiente, erros, auditoria
```

`shared/` guarda o que os dois lados usam: `esquemas.ts` (validação com Zod,
em português) e `conteudoPadrao.ts` (o conteúdo original do site).

## Modelo de dados

O conteúdo do site é um documento, não um conjunto relacional — por isso vive
em `blocos_conteudo`, uma linha por bloco (`textos`, `profissionais`,
`casosClinicos`…), com o JSON validado pelo esquema correspondente. Cada
gravação guarda a versão anterior em `versoes_conteudo`, o que permite
restaurar uma alteração indevida.

As demais tabelas são relacionais de verdade: `usuarios`, `sessoes`,
`tentativas_login`, `midias`, `contatos`, `registros_auditoria` e
`cache_integracoes`.

## Autenticação

- **Sessões opacas, não JWT.** O cookie carrega um token aleatório de 32 bytes;
  o banco guarda apenas o SHA-256 dele temperado com `SEGREDO_SESSAO`. Isso
  permite revogar na hora — coisa que um JWT não faz — e o vazamento do banco
  não entrega sessões ativas.
- **Cookie `HttpOnly`, `SameSite=Strict`**, e `Secure` em produção.
- **CSRF por dupla submissão.** Um segundo cookie, legível por script, precisa
  ser devolvido no cabeçalho `X-CSRF-Token`. Um site de terceiros consegue
  fazer o navegador mandar o cookie, mas não consegue lê-lo.
- **Senhas em bcrypt** com custo 12. E-mail inexistente gasta o mesmo tempo de
  comparação de um existente, para não revelar quais contas existem.
- **Limite de tentativas** por e-mail (5) e por IP (20) em janela de 15 minutos.
- **Papéis:** `editor` altera conteúdo; `administrador` também gerencia contas.
  O sistema impede ficar sem nenhum administrador ativo.

## Imagens

Enviadas pelo painel, são convertidas para WebP, giradas conforme o EXIF,
reduzidas a no máximo 2000px de largura e têm os metadados descartados.

`ARMAZENAMENTO=local` grava em `public/midia/enviados` — bom para
desenvolvimento e para hospedagem com disco persistente. `ARMAZENAMENTO=blob`
usa o Vercel Blob, necessário em plataformas serverless, onde o disco é
efêmero.

Uma imagem em uso em algum bloco não pode ser excluída: a API recusa e diz
onde ela está sendo usada.

## Integrações

- **Avaliações do Google** (`GOOGLE_PLACES_API_KEY`): busca nota e total reais
  pela Places API, com cache de 6 horas no banco. Sem a chave, o site segue
  exibindo os números informados pela clínica — que continuam identificados
  como tal.
- **Formulário de contato:** grava o recado e só então leva ao WhatsApp. Se o
  registro falhar, o fluxo do WhatsApp continua: o que importa é a pessoa
  conseguir falar com a clínica.

## Publicar

```bash
npm run build        # site -> dist/
npm run build:api    # API  -> server/dist/
npm start            # sobe a API (sirva dist/ na mesma origem)
```

A API precisa responder em `/api` na mesma origem do site; se forem origens
diferentes, inclua a do site em `ORIGENS_PERMITIDAS`. Rotas internas do site e
do painel devem cair no `index.html` (veja `public/_redirects`).

Com Neon ou outro Postgres gerenciado, use `DATABASE_SSL=true`.

As migrações rodam sozinhas ao subir o servidor; `npm run db:semear` é só para
o primeiro provisionamento.
