import {
  Activity,
  Armchair,
  CalendarCheck,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  Microscope,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
} from 'lucide-react';

import type {
  AmbienteClinica,
  CasoClinico,
  DiaDeFuncionamento,
  Endereco,
  EtapaAgendamento,
  Indicador,
  ItemNavegacao,
  Profissional,
  Tratamento,
} from '@/types';

/* -------------------------------------------------------------------------
 * FONTE ÚNICA DE DADOS DA CLÍNICA
 *
 * Todo conteúdo editável pela clínica vive neste arquivo. Os componentes
 * apenas consomem estes dados — nenhum texto institucional fica embutido
 * na camada visual.
 *
 * Regra de conteúdo: não acrescentar CRO, especializações, certificações,
 * prêmios, tempo de experiência ou depoimentos que não tenham sido
 * formalmente fornecidos pela clínica.
 * ---------------------------------------------------------------------- */

export const CLINICA = {
  nome: 'Clínica Implavita',
  nomeCompleto: 'Clínica Implavita Implantes',
  assinatura: 'Odontologia e Harmonização Facial',
  cidade: 'Patos de Minas',
  uf: 'MG',
  /** Ajuste para o domínio definitivo antes de publicar (usado em SEO/JSON-LD). */
  site: 'https://www.clinicaimplavita.com.br',
} as const;

/* -------------------------------------------------------------------------
 * MARCA
 *
 * A clínica ainda não forneceu o arquivo vetorial do logotipo. O material
 * disponível traz apenas a marca aplicada como marca d'água sobre as fotos,
 * em baixa resolução — insuficiente para uso em tela e que não deve ser
 * redesenhada por conta própria.
 *
 * Enquanto isso, o site exibe um letreiro tipográfico com o nome e a
 * assinatura reais da clínica. Para usar o logotipo oficial, basta colocar
 * o arquivo em `public/midia/` e apontar `arquivo` para ele — nenhuma outra
 * alteração é necessária.
 * ---------------------------------------------------------------------- */

export const LOGO = {
  /** Ex.: '/midia/logo-implavita.svg'. `null` mantém o letreiro tipográfico. */
  arquivo: null as string | null,
  largura: 190,
  altura: 52,
  alt: 'Clínica Implavita — Odontologia e Harmonização Facial',
} as const;

export const ENDERECO: Endereco = {
  logradouro: 'Rua Três Marias, 101',
  bairro: 'Aurélio Caixeta',
  cidade: 'Patos de Minas',
  estado: 'Minas Gerais',
  uf: 'MG',
  cep: '38702-050',
  linhaUnica:
    'Rua Três Marias, 101 — Aurélio Caixeta, Patos de Minas — MG, CEP 38702-050',
};

export const CONTATO = {
  telefoneExibicao: '(34) 99797-9728',
  /** Formato E.164 sem símbolos, usado pelos links wa.me e tel:. */
  telefoneInternacional: '5534997979728',
  telefoneLink: '+5534997979728',
  instagramUsuario: '@clinicaimplavita',
  instagramUrl:
    'https://www.instagram.com/invites/contact/?i=iuywd8jfh2bd&utm_content=kv3xe7q',
  mapsUrl:
    'https://www.google.com/maps/place/?q=place_id:ChIJswQVCSmLrpQRgtx3q7MRGNU',
  avaliacoesUrl:
    'https://search.google.com/local/reviews?placeid=ChIJswQVCSmLrpQRgtx3q7MRGNU&q=clinicas&authuser=0&hl=pt&gl=BR',
  placeId: 'ChIJswQVCSmLrpQRgtx3q7MRGNU',
} as const;

/** Reputação informada pela clínica — não é atualizada em tempo real. */
export const REPUTACAO = {
  nota: '5,0',
  notaNumerica: 5,
  totalAvaliacoes: 112,
  /** Data da coleta das informações, exibida junto aos números. */
  referencia: 'dados informados pela clínica',
} as const;

export const HORARIOS: readonly DiaDeFuncionamento[] = [
  { dia: 'Segunda-feira', diaSchema: 'Monday', abertura: '08:00', fechamento: '19:00', rotulo: '08h às 19h' },
  { dia: 'Terça-feira', diaSchema: 'Tuesday', abertura: '08:00', fechamento: '19:00', rotulo: '08h às 19h' },
  { dia: 'Quarta-feira', diaSchema: 'Wednesday', abertura: '08:00', fechamento: '19:00', rotulo: '08h às 19h' },
  { dia: 'Quinta-feira', diaSchema: 'Thursday', abertura: '08:00', fechamento: '19:00', rotulo: '08h às 19h' },
  { dia: 'Sexta-feira', diaSchema: 'Friday', abertura: '08:00', fechamento: '19:00', rotulo: '08h às 19h' },
  { dia: 'Sábado', diaSchema: 'Saturday', abertura: '08:00', fechamento: '13:00', rotulo: '08h às 13h' },
  { dia: 'Domingo', diaSchema: 'Sunday', abertura: null, fechamento: null, rotulo: 'Fechado' },
];

export const NAVEGACAO: readonly ItemNavegacao[] = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'tratamentos', rotulo: 'Tratamentos' },
  { id: 'profissionais', rotulo: 'Profissionais' },
  { id: 'clinica', rotulo: 'A Clínica' },
  { id: 'contato', rotulo: 'Contato' },
];

export const PROFISSIONAIS: readonly Profissional[] = [
  {
    id: 'carlos-adolfo-silva',
    nome: 'Dr. Carlos Adolfo Silva',
    atuacao: 'Implantes dentários',
    descricao:
      'Referência em implantes dentários na Implavita, o Dr. Carlos Adolfo Silva conduz os ' +
      'atendimentos da clínica voltados à reposição de dentes ausentes, do planejamento inicial ' +
      'ao acompanhamento de cada etapa do tratamento.',
    destaques: ['Mais de 30 mil implantes realizados'],
    foto: null,
    iniciais: 'CA',
    contexto: 'implantes',
    rotuloBotao: 'Agendar avaliação',
  },
  {
    id: 'thailha-pinheiro',
    nome: 'Dra. Thaílha Pinheiro',
    atuacao: 'Harmonização facial',
    descricao:
      'A Dra. Thaílha Pinheiro é responsável pela área de harmonização facial da Implavita, ' +
      'com atendimentos conduzidos a partir de uma avaliação individual de cada paciente.',
    destaques: [],
    foto: null,
    iniciais: 'TP',
    contexto: 'harmonizacao',
    rotuloBotao: 'Falar sobre harmonização facial',
  },
];

export const TRATAMENTOS: readonly Tratamento[] = [
  {
    id: 'implantes',
    nome: 'Implantes dentários',
    resumo: 'A principal área de atuação da Implavita.',
    descricao:
      'Reposição de dentes ausentes com implantes, conduzida pelo Dr. Carlos Adolfo Silva. ' +
      'O planejamento é definido após avaliação clínica, considerando as condições de cada paciente.',
    topicos: ['Avaliação clínica prévia', 'Planejamento individual', 'Acompanhamento das etapas'],
    icone: Stethoscope,
    contexto: 'implantes',
    profissionalId: 'carlos-adolfo-silva',
    destaque: true,
  },
  {
    id: 'reabilitacao',
    nome: 'Reabilitação oral com implantes',
    resumo: 'Devolver função e estética ao sorriso.',
    descricao:
      'Área de interesse da clínica voltada à reabilitação do sorriso em casos que envolvem ' +
      'implantes. As possibilidades de tratamento são apresentadas durante a avaliação.',
    topicos: ['Casos com múltiplos dentes ausentes', 'Conversa sobre alternativas'],
    icone: Smile,
    contexto: 'reabilitacao',
    profissionalId: 'carlos-adolfo-silva',
  },
  {
    id: 'avaliacao',
    nome: 'Avaliação odontológica',
    resumo: 'O ponto de partida de qualquer tratamento.',
    descricao:
      'Consulta em que a equipe examina sua situação, esclarece dúvidas e explica os caminhos ' +
      'possíveis antes de qualquer decisão sobre tratamento.',
    topicos: ['Exame clínico', 'Espaço para dúvidas', 'Orientação sobre próximos passos'],
    icone: ClipboardCheck,
    contexto: 'avaliacao',
  },
  {
    id: 'harmonizacao',
    nome: 'Harmonização facial',
    resumo: 'Com a Dra. Thaílha Pinheiro.',
    descricao:
      'Atendimentos de harmonização facial conduzidos pela Dra. Thaílha Pinheiro, definidos ' +
      'a partir de avaliação individual.',
    topicos: ['Avaliação individual', 'Conversa sobre expectativas'],
    icone: Sparkles,
    contexto: 'harmonizacao',
    profissionalId: 'thailha-pinheiro',
  },
];

export const INDICADORES: readonly Indicador[] = [
  {
    id: 'implantes-realizados',
    valor: '+30 mil',
    rotulo: 'implantes realizados',
    observacao: 'Informação fornecida pela clínica',
    icone: Activity,
  },
  {
    id: 'nota',
    valor: REPUTACAO.nota,
    rotulo: 'de avaliação no Google',
    observacao: 'Nota informada, não atualizada em tempo real',
    icone: Star,
  },
  {
    id: 'avaliacoes',
    valor: String(REPUTACAO.totalAvaliacoes),
    rotulo: 'avaliações recebidas',
    observacao: 'Total informado pela clínica',
    icone: MessageCircle,
  },
  {
    id: 'localizacao',
    valor: 'Patos de Minas',
    rotulo: 'atendimento presencial',
    observacao: 'Bairro Aurélio Caixeta',
    icone: MapPin,
  },
];

export const ETAPAS_AGENDAMENTO: readonly EtapaAgendamento[] = [
  {
    numero: '01',
    titulo: 'Entre em contato pelo WhatsApp',
    descricao:
      'Toque no botão de agendamento e inicie a conversa. A mensagem já vai preenchida — ' +
      'basta enviar.',
    icone: MessageCircle,
  },
  {
    numero: '02',
    titulo: 'Converse com a equipe',
    descricao:
      'Conte o que procura e tire suas dúvidas. A equipe verifica os horários disponíveis ' +
      'para a sua avaliação.',
    icone: Stethoscope,
  },
  {
    numero: '03',
    titulo: 'Agende sua avaliação',
    descricao:
      'A data é confirmada diretamente com a equipe da clínica, por WhatsApp ou telefone.',
    icone: CalendarCheck,
  },
];

export const AMBIENTES: readonly AmbienteClinica[] = [
  {
    id: 'recepcao',
    titulo: 'Recepção',
    descricao: 'O espaço de acolhida de quem chega para a avaliação.',
    icone: Armchair,
    foto: null,
  },
  {
    id: 'consultorios',
    titulo: 'Consultórios',
    descricao: 'Salas de atendimento onde os tratamentos são realizados.',
    icone: Stethoscope,
    foto: null,
  },
  {
    id: 'equipamentos',
    titulo: 'Equipamentos',
    descricao: 'Estrutura utilizada no apoio ao diagnóstico e aos procedimentos.',
    icone: Microscope,
    foto: null,
  },
];

/* -------------------------------------------------------------------------
 * CASOS CLÍNICOS
 *
 * Imagens reais cedidas pela clínica (material publicado no Instagram, com
 * marca d'água da Implavita).
 *
 * `identificavel: true` marca as imagens em que o rosto do paciente aparece.
 * Elas ficam fora do ar por padrão: para publicá-las, a clínica precisa ter
 * autorização de uso de imagem assinada por cada paciente. Depois de reunir
 * as autorizações, basta ligar a chave abaixo.
 * ---------------------------------------------------------------------- */

/** Libera a exibição de imagens em que o paciente pode ser identificado. */
export const EXIBIR_CASOS_IDENTIFICAVEIS = false;

export const CASOS_CLINICOS: readonly CasoClinico[] = [
  // --- Sem rosto visível: publicados por padrão ---
  {
    id: 'reabilitacao-total',
    arquivo: '/midia/casos/caso-reabilitacao-total.jpg',
    largura: 1100,
    altura: 1100,
    descricao: 'Registro de reabilitação oral: situação inicial acima e resultado do tratamento abaixo.',
    categoria: 'reabilitacao',
    identificavel: false,
  },
  {
    id: 'reabilitacao-anterior',
    arquivo: '/midia/casos/caso-reabilitacao-anterior.jpg',
    largura: 1100,
    altura: 1100,
    descricao: 'Reabilitação da região anterior: situação inicial acima e resultado do tratamento abaixo.',
    categoria: 'reabilitacao',
    identificavel: false,
  },
  {
    id: 'reabilitacao-protese',
    arquivo: '/midia/casos/caso-reabilitacao-protese.jpg',
    largura: 1100,
    altura: 1100,
    descricao: 'Reabilitação sobre implantes: situação inicial acima e resultado do tratamento abaixo.',
    categoria: 'reabilitacao',
    identificavel: false,
  },
  {
    id: 'sorriso-detalhe',
    arquivo: '/midia/casos/caso-sorriso-detalhe.jpg',
    largura: 1100,
    altura: 1372,
    descricao: 'Detalhe de um sorriso após a conclusão do tratamento reabilitador.',
    categoria: 'reabilitacao',
    identificavel: false,
  },
  {
    id: 'implantes-superior',
    arquivo: '/midia/casos/caso-implantes-superior.jpg',
    largura: 1100,
    altura: 1372,
    descricao: 'Implantes instalados na arcada superior e inferior, registrados durante o tratamento.',
    categoria: 'implantes',
    identificavel: false,
  },
  {
    id: 'implantes-multiplos',
    arquivo: '/midia/casos/caso-implantes-multiplos.jpg',
    largura: 1100,
    altura: 1372,
    descricao: 'Etapa intermediária de um caso com múltiplos implantes na arcada superior.',
    categoria: 'implantes',
    identificavel: false,
  },
  // --- Rosto visível: exigem autorização de uso de imagem ---
  {
    id: 'retrato-01',
    arquivo: '/midia/casos/retrato-caso-01.jpg',
    largura: 1100,
    altura: 1375,
    descricao: 'Paciente após tratamento com implantes.',
    categoria: 'implantes',
    identificavel: true,
  },
  {
    id: 'retrato-02',
    arquivo: '/midia/casos/retrato-caso-02.jpg',
    largura: 1100,
    altura: 1372,
    descricao: 'Paciente após tratamento reabilitador.',
    categoria: 'reabilitacao',
    identificavel: true,
  },
  {
    id: 'retrato-03',
    arquivo: '/midia/casos/retrato-caso-03.jpg',
    largura: 1100,
    altura: 1375,
    descricao: 'Paciente após tratamento com implantes.',
    categoria: 'implantes',
    identificavel: true,
  },
  {
    id: 'retrato-04',
    arquivo: '/midia/casos/retrato-caso-04.jpg',
    largura: 1100,
    altura: 1375,
    descricao: 'Paciente após tratamento reabilitador.',
    categoria: 'reabilitacao',
    identificavel: true,
  },
  {
    id: 'retrato-05',
    arquivo: '/midia/casos/retrato-caso-05.jpg',
    largura: 1100,
    altura: 1375,
    descricao: 'Paciente após conclusão do tratamento.',
    categoria: 'reabilitacao',
    identificavel: true,
  },
  {
    id: 'retrato-06',
    arquivo: '/midia/casos/retrato-caso-06.jpg',
    largura: 1100,
    altura: 1375,
    descricao: 'Paciente durante etapa do tratamento com implantes.',
    categoria: 'implantes',
    identificavel: true,
  },
  {
    id: 'retrato-07',
    arquivo: '/midia/casos/retrato-caso-07.jpg',
    largura: 1100,
    altura: 1375,
    descricao: 'Paciente após tratamento reabilitador.',
    categoria: 'reabilitacao',
    identificavel: true,
  },
  {
    id: 'harmonizacao-frontal',
    arquivo: '/midia/casos/retrato-harmonizacao-frontal.jpg',
    largura: 1100,
    altura: 1100,
    descricao: 'Registro frontal de atendimento de harmonização facial.',
    categoria: 'harmonizacao',
    identificavel: true,
  },
  {
    id: 'harmonizacao-perfil',
    arquivo: '/midia/casos/retrato-harmonizacao-perfil.jpg',
    largura: 1100,
    altura: 1100,
    descricao: 'Registro de perfil de atendimento de harmonização facial.',
    categoria: 'harmonizacao',
    identificavel: true,
  },
];

/** Casos liberados para exibição conforme a chave de consentimento. */
export const CASOS_VISIVEIS: readonly CasoClinico[] = CASOS_CLINICOS.filter(
  (caso) => EXIBIR_CASOS_IDENTIFICAVEIS || !caso.identificavel,
);

/** Aviso obrigatório exibido junto aos registros clínicos. */
export const AVISO_CASOS =
  'Registros de casos atendidos na Implavita, cedidos pela clínica. ' +
  'Resultados variam conforme as condições clínicas de cada paciente e ' +
  'não representam garantia de resultado.';

/* -------------------------------------------------------------------------
 * IMAGEM PRINCIPAL (HERO)
 *
 * O material recebido contém apenas registros clínicos de pacientes —
 * nenhuma foto da equipe, da recepção ou dos consultórios. Em vez de
 * recorrer a banco de imagens com sorrisos genéricos, a primeira dobra usa
 * uma composição gráfica construída a partir da própria marca.
 *
 * Assim que a clínica fornecer uma fotografia da equipe ou do ambiente,
 * aponte `arquivo` para ela: a composição dá lugar à foto automaticamente.
 * ---------------------------------------------------------------------- */

export const HERO_IMAGEM = {
  /** Ex.: '/midia/equipe-implavita.jpg'. `null` mantém a composição gráfica. */
  arquivo: null as string | null,
  largura: 1040,
  altura: 1300,
  alt: '',
} as const;

export const TEXTOS = {
  hero: {
    etiqueta: 'Implantes dentários em Patos de Minas',
    titulo: 'Seu sorriso merece cuidado e confiança.',
    texto:
      'Conheça nossos tratamentos odontológicos e agende uma avaliação com a equipe Implavita.',
  },
  tratamentos: {
    titulo: 'Tratamentos para cuidar do seu sorriso',
    subtitulo:
      'O que a Implavita atende hoje. Cada caso é definido durante a avaliação, ' +
      'conforme as condições clínicas do paciente.',
  },
} as const;
