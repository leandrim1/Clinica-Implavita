import { CLINICA, CONTATO } from '@/config/clinica';
import type { ContextoWhatsApp } from '@/types';

/**
 * Mensagens iniciais por contexto. O texto é codificado para URL no momento
 * de montar o link, portanto pode conter acentos e pontuação normalmente.
 */
const MENSAGENS: Record<ContextoWhatsApp, string> = {
  agendamento:
    `Olá! Vim pelo site da ${CLINICA.nome} e gostaria de agendar uma avaliação.`,
  implantes:
    `Olá! Vim pelo site da ${CLINICA.nome} e gostaria de informações sobre implantes dentários.`,
  reabilitacao:
    `Olá! Vim pelo site da ${CLINICA.nome} e gostaria de informações sobre reabilitação oral com implantes.`,
  avaliacao:
    `Olá! Vim pelo site da ${CLINICA.nome} e gostaria de agendar uma avaliação odontológica.`,
  harmonizacao:
    `Olá! Vim pelo site da ${CLINICA.nome} e gostaria de informações sobre harmonização facial.`,
  geral: `Olá! Vim pelo site da ${CLINICA.nome} e gostaria de mais informações.`,
  formulario: `Olá! Vim pelo site da ${CLINICA.nome}.`,
};

/** Monta o link wa.me com a mensagem inicial já codificada. */
export function linkWhatsApp(
  contexto: ContextoWhatsApp = 'geral',
  mensagemPersonalizada?: string,
): string {
  const texto = mensagemPersonalizada ?? MENSAGENS[contexto];
  return `https://wa.me/${CONTATO.telefoneInternacional}?text=${encodeURIComponent(texto)}`;
}

/** Texto padrão de um contexto, útil para pré-visualização ou testes. */
export function mensagemDoContexto(contexto: ContextoWhatsApp): string {
  return MENSAGENS[contexto];
}

export interface DadosFormulario {
  readonly nome: string;
  readonly telefone: string;
  readonly assunto: string;
  readonly mensagem: string;
}

/**
 * Monta a mensagem de WhatsApp a partir dos dados preenchidos no formulário.
 * Nenhum dado é enviado ou armazenado pelo site — o conteúdo apenas compõe
 * o texto que o próprio visitante envia pelo WhatsApp.
 */
export function mensagemDoFormulario(dados: DadosFormulario): string {
  return [
    `Olá! Vim pelo site da ${CLINICA.nome}.`,
    '',
    `Nome: ${dados.nome}`,
    `Telefone: ${dados.telefone}`,
    `Assunto: ${dados.assunto}`,
    '',
    dados.mensagem,
  ].join('\n');
}
