# Publicar na Vercel

O site é estático, mas o painel precisa de API e banco. Na Vercel isso vira
uma função sem servidor (`api/index.ts`) mais um Postgres gerenciado.

Sem esses três passos — banco, variáveis e migração — o painel abre a tela de
login e não passa dela.

## 1. Banco de dados

A Vercel não tem banco: é preciso um Postgres gerenciado. O **Neon** tem plano
gratuito e integração direta.

No painel da Vercel: **Storage → Create Database → Neon**. Ao conectar ao
projeto, a `DATABASE_URL` é preenchida sozinha.

Se criar o banco fora da Vercel, use a connection string **pooled** — no Neon,
a que tem `-pooler` no host. Sem ela, cada instância da função abre a própria
conexão e o banco esgota o limite.

## 2. Variáveis de ambiente

Em **Settings → Environment Variables**, para Production e Preview:

| Variável | Valor |
| --- | --- |
| `DATABASE_URL` | connection string *pooled* do Neon |
| `DATABASE_SSL` | `true` |
| `SEGREDO_SESSAO` | gere com o comando abaixo |
| `AMBIENTE` | `production` |
| `ARMAZENAMENTO` | `blob` |
| `BLOB_READ_WRITE_TOKEN` | criado junto com o Vercel Blob |

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

`ARMAZENAMENTO=blob` **não é opcional** na Vercel: o disco das funções é
descartado a cada invocação, então imagens enviadas pelo painel sumiriam. Crie
o armazenamento em **Storage → Create → Blob**.

Não é preciso informar `ORIGENS_PERMITIDAS`: front e API ficam no mesmo
domínio, e a própria origem é liberada automaticamente.

## 3. Preparar o banco

As migrações **não** rodam sozinhas na função — várias instâncias subindo ao
mesmo tempo tentariam migrar em paralelo. Rode do seu computador, apontando
para o banco de produção:

```bash
DATABASE_URL='postgres://...-pooler...' DATABASE_SSL=true npm run db:migrar
DATABASE_URL='postgres://...-pooler...' DATABASE_SSL=true npm run db:semear
DATABASE_URL='postgres://...-pooler...' DATABASE_SSL=true npm run db:admin
```

O último cria a conta de acesso ao painel e pergunta e-mail e senha.

## 4. Publicar

Faça o deploy da branch. O `vercel.json` já cuida do resto:

- `/api/*` vai para a função;
- qualquer outra rota cai no `index.html`, que é o que faz `/admin`,
  `/politica-de-privacidade` e as demais funcionarem.

**É esse redirecionamento que faltava** quando `/admin` devolvia o 404 da
Vercel: sem ele, a plataforma procura um arquivo chamado `admin` no disco, não
encontra e responde antes de o site carregar.

## Conferir se deu certo

```bash
curl -s https://SEU-DOMINIO/api/saude          # {"ok":true,...}
curl -s -o /dev/null -w '%{http_code}\n' https://SEU-DOMINIO/admin   # 200
```

Depois entre em `https://SEU-DOMINIO/admin` com a conta do passo 3.

| Sintoma | Causa |
| --- | --- |
| 404 da Vercel em `/admin` | deploy anterior ao `vercel.json` — publique de novo |
| `/api/saude` devolve 500 | falta `DATABASE_URL` ou `DATABASE_SSL=true` |
| "E-mail ou senha incorretos" | a conta não existe nesse banco — rode `db:admin` |
| Login entra e cai logo depois | falta `SEGREDO_SESSAO`, ou ele mudou entre deploys |
| Imagem enviada some | falta `ARMAZENAMENTO=blob` |

## Outras hospedagens

Em servidor próprio (VPS, Render, Railway), rode a API como processo:

```bash
npm run build && npm run build:api
npm start
```

Sirva `dist/` e redirecione `/api` para a porta da API. Toda rota que não for
arquivo nem `/api` precisa cair no `index.html` — é o mesmo redirecionamento
que o `vercel.json` faz.
