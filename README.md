# Clínica Implavita Implantes — site institucional

Site institucional da **Clínica Implavita Implantes**, em Patos de Minas (MG).
Esta é a **primeira fase do projeto: apenas front-end**. Não há backend, banco de
dados, autenticação, painel administrativo nem integração com agenda.

## Tecnologias

| Camada | Escolha |
| --- | --- |
| Interface | React 18 + TypeScript (`strict`) |
| Build | Vite 5 |
| Rotas | React Router 7 |
| Estilo | CSS por componente + camada de tokens (sem framework) |
| Ícones | lucide-react |
| API | Node + Express 5 |
| Banco | PostgreSQL (pronto para Neon) |
| Validação | Zod, com esquemas compartilhados entre front e back |
| Imagens | sharp (conversão para WebP no envio) |

Optamos por CSS próprio em vez de Tailwind para que a direção de arte fosse
desenhada para a Implavita, sem aparência de template pronto.

## Como rodar

```bash
npm install
cp .env.example .env   # ajuste DATABASE_URL e SEGREDO_SESSAO
npm run db:semear      # cria as tabelas, carrega o conteúdo e o 1º admin
npm run dev:api        # API   -> http://localhost:3333
npm run dev            # site  -> http://localhost:5173
```

O site abre em `/` e o painel em `/admin`.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | site em desenvolvimento (faz proxy de `/api`) |
| `npm run dev:api` | API em desenvolvimento, com recarga |
| `npm run build` | verificação de tipos + build do site |
| `npm run build:api` | compila a API para `server/dist` |
| `npm start` | sobe a API compilada |
| `npm run db:migrar` | aplica migrações pendentes |
| `npm run db:semear` | migra, carrega o conteúdo inicial e cria o 1º admin |

> O site funciona mesmo sem a API no ar: se ela não responder em 2,5 s, a
> página renderiza com o conteúdo empacotado em `shared/conteudoPadrao.ts`.
> Um backend fora do ar nunca deixa a clínica sem site.

> O arquivo `public/_redirects` já direciona as rotas internas para o
> `index.html`. Em servidores que não leem esse arquivo (Apache, Nginx, IIS),
> configure o mesmo redirecionamento, ou `/politica-de-privacidade` responderá 404.

## Onde editar o conteúdo

**Pelo painel, em `/admin`** — é para isso que ele existe. A clínica altera
textos, fotos, profissionais, tratamentos, horários e dados de contato sem
tocar no código, e a alteração vai ao ar no mesmo instante.

O painel cobre:

| Seção | O que dá para mudar |
| --- | --- |
| Textos do site | títulos e textos de cada seção, inclusive os avisos legais |
| Profissionais | nome, atuação, CRO, descrição, destaques e foto |
| Tratamentos | cartões, tópicos, ícone, responsável e destaque |
| Imagens do site | logotipo, primeira dobra, fachada, ambientes, galeria e casos |
| Dados da clínica | identificação, endereço, contatos, horários e reputação |
| Contatos | mensagens recebidas pelo formulário |
| Biblioteca de mídia | envio e exclusão de imagens |
| Usuários | contas, papéis e acesso |

Cada alteração guarda a versão anterior, então dá para voltar atrás.

Continuam no código:

- `src/lib/whatsapp.ts` — mensagens iniciais do WhatsApp, por contexto.
- `src/pages/PrivacidadePage.tsx` e `src/pages/InformacoesLegaisPage.tsx` — textos legais.
- `src/styles/tokens.css` — cores, tipografia e espaçamentos.
- `shared/conteudoPadrao.ts` — o conteúdo de partida, usado como rede de segurança.

## Identidade visual

A paleta foi extraída do **material real da clínica**. A marca aplicada nas fotos
oficiais é um monograma dourado (dente integrado a um perfil feminino) sobre a
assinatura “Odontologia e Harmonização Facial”. O dourado foi amostrado
diretamente desse material (`#C39A6A` nas luzes, `#91745C` nas sombras) e
assentado sobre um **verde-petróleo profundo**, que dá contraste ao metal e
carrega a leitura clínica sem recorrer ao azul genérico de consultório.

## Material da clínica

O site usa o material enviado pela clínica:

- **Equipe** — fotografia dos dois profissionais. Aparece inteira na primeira
  dobra e recortada em retratos individuais nas seções de cada um
  (`public/midia/equipe/`).
- **Ambientes** — 11 imagens do espaço: três nos cartões de Recepção,
  Consultórios e Sala de espera, sete na galeria logo abaixo e a fachada na
  seção de contato, junto ao endereço (`public/midia/clinica/`).
- **Casos clínicos** — registros de tratamentos (`public/midia/casos/`).

> Nota para quem mantiver o projeto: as imagens de ambiente são renders, não
> fotografias do espaço construído, e vários detalhes de texto dentro delas
> estão deformados. Dois casos são legíveis no tamanho em que aparecem no site:
> a fachada (`fachada.jpg`), em que a titulação do Dr. Carlos aparece como
> “Espcecilalize o Implantardotmia”, o nome da Dra. Thaílha como “Thallha” e a
> área como “Harmonizaina Facial”; e `consultorio-arcada.jpg`, em que a parede
> escreve “IPLAVTA Implantes”. A clínica optou por publicá-las assim mesmo.
> Se vierem versões corrigidas, basta substituir os arquivos: os nomes e as
> dimensões já estão registrados em `clinica.ts`.

### Ainda pendente

| O que falta | Como está hoje | Como substituir |
| --- | --- | --- |
| Logotipo em arquivo | Letreiro tipográfico com o nome e a assinatura reais | `LOGO.arquivo` em `clinica.ts` |
| Razão social, CNPJ, CRO da pessoa jurídica, responsável técnico | Marcados como pendentes na página de informações legais | `InformacoesLegaisPage.tsx` |

Para trocar qualquer foto, coloque o arquivo em `public/midia/` e aponte o
campo correspondente em `src/config/clinica.ts` — nenhum componente precisa
ser alterado.

### Registros profissionais

Os CRO exibidos no site (Dr. Carlos Adolfo Silva — CRO-MG 3917; Dra. Thaílha
Pinheiro — CRO-MG 88553) foram confirmados pela clínica e aparecem na seção de
cada profissional, na página de informações legais e nos dados estruturados.
A titulação “Especialista em Implantodontia”, que aparece na imagem da fachada,
**não** foi incluída: não houve confirmação e o texto daquela imagem está
corrompido. Para publicá-la, acrescente o campo em `PROFISSIONAIS`.

## Imagens de pacientes — leia antes de publicar

As 15 fotos recebidas são registros clínicos reais. Elas foram classificadas uma
a uma e divididas em dois grupos em `CASOS_CLINICOS`:

- **`identificavel: false`** (6 imagens) — registros intraorais e recortes de
  sorriso, **sem rosto visível**. São as que o site publica hoje, com o aviso de
  que resultados variam conforme cada paciente.
- **`identificavel: true`** (9 imagens) — fotos em que **o rosto do paciente
  aparece**. Estão no repositório, catalogadas, mas **fora do ar**.

A trava agora é **por paciente** e fica no painel, em *Imagens do site →
Casos clínicos*. Cada caso tem duas chaves: uma marca que o paciente pode ser
reconhecido, a outra registra que a **autorização de uso de imagem assinada**
está em mãos. Sem a segunda, a imagem não vai ao ar.

O filtro é aplicado no servidor, antes de o conteúdo público sair da API, e
repetido no cliente — então uma imagem sem autorização não aparece nem quando
o site roda com o conteúdo padrão.

Essa trava existe porque publicar a imagem de um paciente identificável sem
autorização expressa contraria o Código de Ética Odontológica e a LGPD — e o
risco recai sobre a clínica, não sobre o site.

## Funcionalidades

- **WhatsApp contextual** — `linkWhatsApp(contexto)` gera o link `wa.me` com a
  mensagem inicial já codificada para URL. Contextos: agendamento, implantes,
  reabilitação, avaliação, harmonização, geral e formulário.
- **Formulário de contato** — valida nome, telefone (com máscara progressiva),
  assunto e mensagem; registra o recado para a clínica e, em seguida, abre o
  WhatsApp com o texto pronto. Se o registro falhar, o caminho do WhatsApp
  continua funcionando.
- **Mapa sob demanda** — o iframe do Google só é montado se a pessoa pedir,
  mantendo a primeira carga leve e sem cookies de terceiros.
- **Navegação** — rolagem suave, menu mobile com trava de rolagem, foco preso e
  fechamento por `Esc`, destaque da seção ativa e link “pular para o conteúdo”.

## Acessibilidade e performance

- Um único `<h1>` por página e hierarquia de títulos contínua.
- Todas as imagens com `alt`, `width`/`height` explícitos e `loading="lazy"`
  fora da primeira dobra.
- Alvos de toque de no mínimo 44 px; campos com `font-size: 16px` para evitar o
  zoom automático do iOS.
- `prefers-reduced-motion` respeitado: as animações de entrada são desligadas.
- Links externos sempre com `rel="noopener noreferrer"`.
- Build de produção: ~71 KB de JS e ~8 KB de CSS, comprimidos.

## SEO local

Metadados em pt-BR por rota, canônicas, Open Graph, `robots.txt` e `sitemap.xml`.

Os dados estruturados (`schema.org/Dentist`) declaram **apenas informação
verificável**: identificação, endereço, telefone, canais oficiais, horários,
serviços e a equipe com os respectivos CRO. A nota de 5,0 e as 112 avaliações **não** entram como
`aggregateRating` — são dados autodeclarados, e marcação de avaliação própria
contraria as diretrizes do Google. Os números aparecem no conteúdo da página,
sempre identificados como informados pela clínica.

> Antes de publicar, troque `CLINICA.site` em `clinica.ts` e as URLs em
> `public/robots.txt` e `public/sitemap.xml` pelo domínio definitivo.

## O que ainda não existe

Agendamento integrado a uma agenda real, pagamentos e prontuário eletrônico.
O site segue sem confirmar consultas sozinho: a data é combinada com a equipe
pelo WhatsApp ou por telefone, e a página diz isso ao visitante.

Nenhum dado clínico de paciente é armazenado. O banco guarda conteúdo do site,
contas do painel, imagens enviadas e as mensagens do formulário de contato.
