import type { LucideIcon } from 'lucide-react';

/** Identificadores das seções âncora da página inicial. */
export type SecaoId =
  | 'inicio'
  | 'tratamentos'
  | 'profissionais'
  | 'clinica'
  | 'avaliacoes'
  | 'contato';

export interface ItemNavegacao {
  readonly id: SecaoId;
  readonly rotulo: string;
}

/** Contextos de conversa usados para pré-preencher a mensagem do WhatsApp. */
export type ContextoWhatsApp =
  | 'agendamento'
  | 'implantes'
  | 'reabilitacao'
  | 'avaliacao'
  | 'harmonizacao'
  | 'geral'
  | 'formulario';

export interface Endereco {
  readonly logradouro: string;
  readonly bairro: string;
  readonly cidade: string;
  readonly estado: string;
  readonly uf: string;
  readonly cep: string;
  readonly linhaUnica: string;
}

export interface DiaDeFuncionamento {
  readonly dia: string;
  /** Formato ISO usado pelos dados estruturados (schema.org). */
  readonly diaSchema: string;
  readonly abertura: string | null;
  readonly fechamento: string | null;
  readonly rotulo: string;
}

export interface Profissional {
  readonly id: string;
  readonly nome: string;
  readonly atuacao: string;
  /** Registro no Conselho Regional de Odontologia, confirmado pela clínica. */
  readonly cro: string;
  readonly contexto: ContextoWhatsApp;
  readonly descricao: string;
  /** Destaques fornecidos pela clínica. Não adicionar dados não confirmados. */
  readonly destaques: readonly string[];
  /** Caminho da foto oficial. `null` enquanto a clínica não fornecer o arquivo. */
  readonly foto: string | null;
  readonly iniciais: string;
  readonly rotuloBotao: string;
}

export interface Tratamento {
  readonly id: string;
  readonly nome: string;
  readonly resumo: string;
  readonly descricao: string;
  readonly topicos: readonly string[];
  readonly icone: LucideIcon;
  readonly contexto: ContextoWhatsApp;
  readonly profissionalId?: string;
  /** Destaque visual: ocupa duas colunas na composição em grade. */
  readonly destaque?: boolean;
}

export interface Indicador {
  readonly id: string;
  readonly valor: string;
  readonly rotulo: string;
  readonly observacao: string;
  readonly icone: LucideIcon;
}

export interface EtapaAgendamento {
  readonly numero: string;
  readonly titulo: string;
  readonly descricao: string;
  readonly icone: LucideIcon;
}

export interface CasoClinico {
  readonly id: string;
  readonly arquivo: string;
  readonly largura: number;
  readonly altura: number;
  readonly descricao: string;
  readonly categoria: 'implantes' | 'reabilitacao' | 'harmonizacao';
  /**
   * `true` quando a imagem permite identificar o paciente (rosto visível).
   * Imagens identificáveis só vão ao ar com `autorizado`.
   */
  readonly identificavel: boolean;
  /** Autorização de uso de imagem registrada para este paciente. */
  readonly autorizado: boolean;
}

export interface AmbienteClinica {
  readonly id: string;
  readonly titulo: string;
  readonly descricao: string;
  readonly icone: LucideIcon;
  /** Foto oficial do ambiente. `null` exibe o painel ilustrativo. */
  readonly foto: string | null;
  readonly largura: number;
  readonly altura: number;
}

/** Imagem da galeria de ambientes da clínica. */
export interface FotoClinica {
  readonly id: string;
  readonly arquivo: string;
  readonly largura: number;
  readonly altura: number;
  readonly descricao: string;
  /** Ocupa duas colunas na composição em grade. */
  readonly larga?: boolean;
}
