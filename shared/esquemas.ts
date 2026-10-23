import { z } from 'zod';

// As mensagens de erro chegam ao painel e ao formulário do site, então
// precisam sair em português.
z.config(z.locales.ptBR());

/* =========================================================================
 * ESQUEMAS COMPARTILHADOS
 *
 * Um único lugar define o formato de cada bloco de conteúdo. O servidor
 * valida toda escrita contra estes esquemas; o painel administrativo e o
 * site público derivam os tipos daqui. Mudou o formato, mudou nos dois lados.
 * ====================================================================== */

const textoCurto = z
  .string({ error: 'Preencha este campo.' })
  .trim()
  .min(1, 'Preencha este campo.')
  .max(220, 'Texto longo demais para este campo (máximo de 220 caracteres).');

const textoLongo = z
  .string({ error: 'Preencha este campo.' })
  .trim()
  .min(1, 'Preencha este campo.')
  .max(4000, 'Texto longo demais (máximo de 4000 caracteres).');
const caminhoImagem = z
  .string()
  .trim()
  .refine((v) => v.startsWith('/') || v.startsWith('https://'), {
    message: 'A imagem deve ser um caminho interno (/midia/...) ou uma URL https.',
  });

export const esquemaIdentidade = z.object({
  nome: textoCurto,
  nomeCompleto: textoCurto,
  assinatura: textoCurto,
  cidade: textoCurto,
  uf: z.string().trim().length(2),
  site: z.string().trim().url(),
});

export const esquemaEndereco = z.object({
  logradouro: textoCurto,
  bairro: textoCurto,
  cidade: textoCurto,
  estado: textoCurto,
  uf: z.string().trim().length(2),
  cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, 'CEP no formato 00000-000.'),
});

export const esquemaContato = z.object({
  telefoneExibicao: textoCurto,
  telefoneInternacional: z.string().trim().regex(/^\d{12,13}$/, 'Somente dígitos, com DDI e DDD.'),
  instagramUsuario: textoCurto,
  instagramUrl: z.string().trim().url(),
  mapsUrl: z.string().trim().url(),
  avaliacoesUrl: z.string().trim().url(),
  placeId: z.string().trim().min(1).max(200),
});

export const esquemaReputacao = z.object({
  nota: z.string().trim().min(1).max(5),
  notaNumerica: z.number().min(0).max(5),
  totalAvaliacoes: z.number().int().min(0),
  referencia: textoCurto,
});

export const esquemaHorario = z.object({
  dia: textoCurto,
  diaSchema: z.enum([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  ]),
  abertura: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  fechamento: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  rotulo: textoCurto,
});

export const esquemaHorarios = z.array(esquemaHorario).length(7);

export const esquemaTextos = z.object({
  hero: z.object({
    etiqueta: textoCurto,
    titulo: textoCurto,
    texto: textoLongo,
  }),
  tratamentos: z.object({
    titulo: textoCurto,
    subtitulo: textoLongo,
  }),
  clinica: z.object({
    titulo: textoCurto,
    descricao: textoLongo,
  }),
  avaliacoes: z.object({
    titulo: textoCurto,
    texto: textoLongo,
  }),
  agendamento: z.object({
    titulo: textoCurto,
    descricao: textoLongo,
    observacao: textoLongo,
  }),
  contato: z.object({
    titulo: textoCurto,
    descricao: textoLongo,
  }),
  avisoCasos: textoLongo,
  avisoTratamentos: textoLongo,
  avisoRodape: textoLongo,
});

const imagemOpcional = z.object({
  arquivo: caminhoImagem.nullable(),
  largura: z.number().int().positive(),
  altura: z.number().int().positive(),
  alt: z.string().trim().max(300),
});

export const esquemaLogo = imagemOpcional;
export const esquemaHeroImagem = imagemOpcional;
export const esquemaFachada = imagemOpcional.extend({
  legenda: z.string().trim().max(300),
});

/** Ícones liberados no painel — restritos aos que o site sabe desenhar. */
export const ICONES = [
  'Activity', 'Armchair', 'CalendarCheck', 'ClipboardCheck', 'MapPin',
  'MessageCircle', 'Microscope', 'Smile', 'Sparkles', 'Star', 'Stethoscope',
] as const;
export const esquemaIcone = z.enum(ICONES);

export const esquemaProfissional = z.object({
  id: z.string().trim().min(1).max(80),
  nome: textoCurto,
  atuacao: textoCurto,
  cro: z.string().trim().max(60),
  descricao: textoLongo,
  destaques: z.array(textoCurto).max(6),
  foto: caminhoImagem.nullable(),
  iniciais: z.string().trim().min(1).max(3),
  contexto: z.enum(['agendamento', 'implantes', 'reabilitacao', 'avaliacao', 'harmonizacao', 'geral']),
  rotuloBotao: textoCurto,
});
export const esquemaProfissionais = z.array(esquemaProfissional).max(12);

export const esquemaTratamento = z.object({
  id: z.string().trim().min(1).max(80),
  nome: textoCurto,
  resumo: textoCurto,
  descricao: textoLongo,
  topicos: z.array(textoCurto).max(8),
  icone: esquemaIcone,
  contexto: z.enum(['agendamento', 'implantes', 'reabilitacao', 'avaliacao', 'harmonizacao', 'geral']),
  profissionalId: z.string().trim().max(80).nullable(),
  destaque: z.boolean(),
});
export const esquemaTratamentos = z.array(esquemaTratamento).max(16);

export const esquemaIndicador = z.object({
  id: z.string().trim().min(1).max(80),
  valor: textoCurto,
  rotulo: textoCurto,
  observacao: textoCurto,
  icone: esquemaIcone,
});
export const esquemaIndicadores = z.array(esquemaIndicador).max(8);

export const esquemaEtapa = z.object({
  numero: z.string().trim().min(1).max(4),
  titulo: textoCurto,
  descricao: textoLongo,
  icone: esquemaIcone,
});
export const esquemaEtapas = z.array(esquemaEtapa).max(6);

export const esquemaAmbiente = z.object({
  id: z.string().trim().min(1).max(80),
  titulo: textoCurto,
  descricao: textoLongo,
  icone: esquemaIcone,
  foto: caminhoImagem.nullable(),
  largura: z.number().int().positive(),
  altura: z.number().int().positive(),
});
export const esquemaAmbientes = z.array(esquemaAmbiente).max(9);

export const esquemaFotoClinica = z.object({
  id: z.string().trim().min(1).max(80),
  arquivo: caminhoImagem,
  largura: z.number().int().positive(),
  altura: z.number().int().positive(),
  descricao: textoLongo,
  larga: z.boolean(),
});
export const esquemaFotosClinica = z.array(esquemaFotoClinica).max(40);

export const esquemaCasoClinico = z.object({
  id: z.string().trim().min(1).max(80),
  arquivo: caminhoImagem,
  largura: z.number().int().positive(),
  altura: z.number().int().positive(),
  descricao: textoLongo,
  categoria: z.enum(['implantes', 'reabilitacao', 'harmonizacao']),
  /**
   * Marca as imagens em que o paciente pode ser reconhecido. Continua sendo
   * a trava que mantém esses registros fora do ar sem autorização assinada.
   */
  identificavel: z.boolean(),
  /** Autorização de uso de imagem registrada para este paciente. */
  autorizado: z.boolean(),
});
export const esquemaCasosClinicos = z.array(esquemaCasoClinico).max(80);

export const esquemaNavegacao = z.array(
  z.object({
    id: z.enum(['inicio', 'tratamentos', 'profissionais', 'clinica', 'avaliacoes', 'contato']),
    rotulo: textoCurto,
  }),
).max(8);

/** Mapa de todos os blocos editáveis: chave no banco → esquema de validação. */
export const ESQUEMAS_BLOCOS = {
  identidade: esquemaIdentidade,
  endereco: esquemaEndereco,
  contato: esquemaContato,
  reputacao: esquemaReputacao,
  horarios: esquemaHorarios,
  textos: esquemaTextos,
  logo: esquemaLogo,
  heroImagem: esquemaHeroImagem,
  fachada: esquemaFachada,
  navegacao: esquemaNavegacao,
  profissionais: esquemaProfissionais,
  tratamentos: esquemaTratamentos,
  indicadores: esquemaIndicadores,
  etapas: esquemaEtapas,
  ambientes: esquemaAmbientes,
  fotosClinica: esquemaFotosClinica,
  casosClinicos: esquemaCasosClinicos,
} as const;

export type ChaveBloco = keyof typeof ESQUEMAS_BLOCOS;
export const CHAVES_BLOCOS = Object.keys(ESQUEMAS_BLOCOS) as ChaveBloco[];

export type ConteudoSite = {
  [K in ChaveBloco]: z.infer<(typeof ESQUEMAS_BLOCOS)[K]>;
};

export type Identidade = z.infer<typeof esquemaIdentidade>;
export type Endereco = z.infer<typeof esquemaEndereco>;
export type Contato = z.infer<typeof esquemaContato>;
export type Reputacao = z.infer<typeof esquemaReputacao>;
export type Horario = z.infer<typeof esquemaHorario>;
export type Textos = z.infer<typeof esquemaTextos>;
export type Profissional = z.infer<typeof esquemaProfissional>;
export type Tratamento = z.infer<typeof esquemaTratamento>;
export type Indicador = z.infer<typeof esquemaIndicador>;
export type Etapa = z.infer<typeof esquemaEtapa>;
export type Ambiente = z.infer<typeof esquemaAmbiente>;
export type FotoClinica = z.infer<typeof esquemaFotoClinica>;
export type CasoClinico = z.infer<typeof esquemaCasoClinico>;
export type Icone = z.infer<typeof esquemaIcone>;

/* --- Entidades operacionais --- */

export const esquemaLogin = z.object({
  email: z.string().trim().email('Informe um e-mail válido.'),
  senha: z.string().min(1, 'Informe a senha.').max(200),
});

export const esquemaNovoUsuario = z.object({
  nome: z.string().trim().min(3).max(120),
  email: z.string().trim().email(),
  senha: z
    .string()
    .min(12, 'A senha precisa de pelo menos 12 caracteres.')
    .max(200)
    .refine((v) => /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v), {
      message: 'Use ao menos uma letra maiúscula, uma minúscula e um número.',
    }),
  papel: z.enum(['administrador', 'editor']),
});

export const esquemaTrocaSenha = z.object({
  senhaAtual: z.string().min(1).max(200),
  novaSenha: esquemaNovoUsuario.shape.senha,
});

export const esquemaContatoRecebido = z.object({
  nome: z.string().trim().min(3, 'Informe seu nome completo.').max(120),
  telefone: z.string().trim().min(10, 'Informe DDD e número.').max(20),
  assunto: z.string().trim().min(1, 'Selecione um assunto.').max(120),
  mensagem: z.string().trim().min(10, 'Conte um pouco mais.').max(2000),
});

export type DadosLogin = z.infer<typeof esquemaLogin>;
export type DadosNovoUsuario = z.infer<typeof esquemaNovoUsuario>;
export type DadosContatoRecebido = z.infer<typeof esquemaContatoRecebido>;

export interface UsuarioPublico {
  readonly id: string;
  readonly nome: string;
  readonly email: string;
  readonly papel: 'administrador' | 'editor';
  readonly ativo: boolean;
  readonly criadoEm: string;
  readonly ultimoAcessoEm: string | null;
}

export interface Midia {
  readonly id: string;
  readonly arquivo: string;
  readonly nomeOriginal: string;
  readonly mime: string;
  readonly bytes: number;
  readonly largura: number;
  readonly altura: number;
  readonly alt: string;
  readonly criadoEm: string;
}

export interface ContatoRecebido {
  readonly id: string;
  readonly nome: string;
  readonly telefone: string;
  readonly assunto: string;
  readonly mensagem: string;
  readonly criadoEm: string;
  readonly lidoEm: string | null;
  readonly arquivadoEm: string | null;
}
