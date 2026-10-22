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

## Material da clínica

O site usa o material enviado pela clínica:

- **Equipe** — fotografia dos dois profissionais. Aparece inteira na primeira
  dobra e recortada em retratos individuais nas seções de cada um
  (`public/midia/equipe/`).
- **Ambientes** — 9 imagens do espaço, usadas nos cartões de Recepção,
  Consultórios e Sala de espera e na galeria logo abaixo
  (`public/midia/clinica/`).
- **Casos clínicos** — registros de tratamentos (`public/midia/casos/`).

Duas imagens do segundo lote ficaram de fora porque trazem texto incorreto
legível: a da fachada (nomes e titulações corrompidos) e a de um consultório
em que a parede escreve “IPLAVTA Implantes”. Os arquivos originais seguem no
material enviado, caso a clínica queira versões corrigidas.

> Nota para quem mantiver o projeto: as imagens de ambiente são renders, não
> fotografias do espaço construído. Vários detalhes de texto dentro delas estão
> deformados. A clínica optou por publicá-las como imagens do espaço.

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
verificável**: identificação, endereço, telefone, canais oficiais, horários,
serviços e a equipe com os respectivos CRO. A nota de 5,0 e as 112 avaliações **não** entram como
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
