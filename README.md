# Clínica Implavita Implantes — site institucional

Site institucional da **Clínica Implavita Implantes**, em Patos de Minas (MG).
Esta é a **primeira fase do projeto: apenas front-end**. Não há backend, banco de
dados, autenticação, painel administrativo nem integração com agenda.

## Tecnologias

| Recurso | Escolha |
| --- | --- |
| Biblioteca | React 18 + TypeScript (modo `strict`) |
| Build | Vite 5 |
| Rotas | React Router 6 |
| Ícones | lucide-react |
| Estilo | CSS por componente + camada de tokens (sem framework) |

Apenas quatro dependências de execução: `react`, `react-dom`, `react-router-dom`
e `lucide-react`. Optamos por CSS próprio em vez de Tailwind para que a direção
de arte fosse desenhada para a Implavita, sem a aparência de template pronto.

## Como rodar

```bash
npm install
npm run dev        # ambiente de desenvolvimento
npm run build      # verificação de tipos + build de produção
npm run preview    # serve a build gerada
npm run typecheck  # apenas a verificação de tipos
```

> O arquivo `public/_redirects` já direciona as rotas internas para o
> `index.html`. Em servidores que não leem esse arquivo (Apache, Nginx, IIS),
> configure o mesmo redirecionamento, ou `/politica-de-privacidade` responderá 404.

## Onde editar o conteúdo

**Praticamente tudo que a clínica vai querer alterar está em um único arquivo:**

### `src/config/clinica.ts`

Endereço, telefone, redes sociais, horários, profissionais, tratamentos,
indicadores, etapas de agendamento, ambientes e casos clínicos. Os componentes
apenas consomem esses dados — nenhum texto institucional está embutido no código
visual.

Outros pontos de edição:

- `src/lib/whatsapp.ts` — mensagens iniciais do WhatsApp, por contexto.
- `src/pages/PrivacidadePage.tsx` e `src/pages/InformacoesLegaisPage.tsx` — textos legais.
- `src/styles/tokens.css` — cores, tipografia e espaçamentos.

## Identidade visual

A paleta foi extraída do **material real da clínica**. A marca aplicada nas fotos
oficiais é um monograma dourado (dente integrado a um perfil feminino) sobre a
assinatura “Odontologia e Harmonização Facial”. O dourado foi amostrado
diretamente desse material (`#C39A6A` nas luzes, `#91745C` nas sombras) e
assentado sobre um **verde-petróleo profundo**, que dá contraste ao metal e
carrega a leitura clínica sem recorrer ao azul genérico de consultório.

## Pendências de material da clínica

O acervo recebido contém **apenas registros clínicos de pacientes**. Não havia
logotipo em arquivo, fotos da equipe nem fotos das instalações. Em vez de
preencher esses espaços com banco de imagens ou sorrisos artificiais, cada lacuna
virou um espaço desenhado para receber o material oficial:

| O que falta | Como está hoje | Como substituir |
| --- | --- | --- |
| Logotipo | Letreiro tipográfico com o nome e a assinatura reais | `LOGO.arquivo` em `clinica.ts` |
| Foto da primeira dobra | Composição gráfica construída a partir da marca | `HERO_IMAGEM.arquivo` |
| Retratos dos profissionais | Medalhão com as iniciais | campo `foto` em `PROFISSIONAIS` |
| Recepção, consultórios, equipamentos | Painéis marcados “Imagem ilustrativa” | campo `foto` em `AMBIENTES` |
| CNPJ, razão social, CRO-MG, responsável técnico | Marcados como pendentes na página de informações legais | `InformacoesLegaisPage.tsx` |

Basta apontar o campo para o arquivo colocado em `public/midia/` — a troca é
automática, sem mexer em componente.

## Imagens de pacientes — leia antes de publicar

As 15 fotos recebidas são registros clínicos reais. Elas foram classificadas uma
a uma e divididas em dois grupos em `CASOS_CLINICOS`:

- **`identificavel: false`** (6 imagens) — registros intraorais e recortes de
  sorriso, **sem rosto visível**. São as que o site publica hoje, com o aviso de
  que resultados variam conforme cada paciente.
- **`identificavel: true`** (9 imagens) — fotos em que **o rosto do paciente
  aparece**. Estão no repositório, catalogadas, mas **fora do ar**.

Para publicar o segundo grupo, a clínica precisa ter **autorização de uso de
imagem assinada por cada paciente**. Com as autorizações em mãos, basta alterar
em `src/config/clinica.ts`:

```ts
export const EXIBIR_CASOS_IDENTIFICAVEIS = true;
```

Essa trava existe porque publicar a imagem de um paciente identificável sem
autorização expressa contraria o Código de Ética Odontológica e a LGPD — e o
risco recai sobre a clínica, não sobre o site.

## Funcionalidades

- **WhatsApp contextual** — `linkWhatsApp(contexto)` gera o link `wa.me` com a
  mensagem inicial já codificada para URL. Contextos: agendamento, implantes,
  reabilitação, avaliação, harmonização, geral e formulário.
- **Formulário demonstrativo** — valida nome, telefone (com máscara progressiva),
  assunto e mensagem. **Não envia e não armazena nada.** Após a validação, monta
  a mensagem e oferece abrir o WhatsApp, deixando o envio com o visitante.
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
verificável**: identificação, endereço, telefone, canais oficiais, horários e
serviços. A nota de 5,0 e as 112 avaliações **não** entram como
`aggregateRating` — são dados autodeclarados, e marcação de avaliação própria
contraria as diretrizes do Google. Os números aparecem no conteúdo da página,
sempre identificados como informados pela clínica.

> Antes de publicar, troque `CLINICA.site` em `clinica.ts` e as URLs em
> `public/robots.txt` e `public/sitemap.xml` pelo domínio definitivo.

## Limites desta fase

Não foram implementados — e a arquitetura está preparada para recebê-los depois:
banco de dados, backend, login, painel administrativo, agendamento integrado,
envio de formulário para servidor, pagamentos, prontuários ou armazenamento de
dados de pacientes.
