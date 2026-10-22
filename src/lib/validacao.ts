import type { DadosFormulario } from '@/lib/whatsapp';

export type CampoFormulario = keyof DadosFormulario;
export type ErrosFormulario = Partial<Record<CampoFormulario, string>>;

/** Mantém apenas dígitos, preservando o que o usuário digitou de útil. */
export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

/**
 * Formata progressivamente um telefone brasileiro enquanto o usuário digita:
 * (34) 99797-9728 para celulares e (34) 3821-0000 para fixos.
 */
export function formatarTelefone(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, 11);

  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;

  const corte = digitos.length <= 10 ? 6 : 7;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, corte)}-${digitos.slice(corte)}`;
}

function validarNome(valor: string): string | undefined {
  const limpo = valor.trim();
  if (!limpo) return 'Informe seu nome.';
  if (limpo.length < 3) return 'Informe seu nome completo.';
  return undefined;
}

function validarTelefone(valor: string): string | undefined {
  const digitos = apenasDigitos(valor);
  if (!digitos) return 'Informe um telefone para contato.';
  if (digitos.length < 10) return 'Informe o DDD e o número completo.';
  if (digitos.length > 11) return 'Telefone com dígitos a mais.';
  return undefined;
}

function validarAssunto(valor: string): string | undefined {
  if (!valor.trim()) return 'Selecione um assunto.';
  return undefined;
}

function validarMensagem(valor: string): string | undefined {
  const limpo = valor.trim();
  if (!limpo) return 'Escreva sua mensagem.';
  if (limpo.length < 10) return 'Conte um pouco mais para a equipe te ajudar.';
  return undefined;
}

const VALIDADORES: Record<CampoFormulario, (valor: string) => string | undefined> = {
  nome: validarNome,
  telefone: validarTelefone,
  assunto: validarAssunto,
  mensagem: validarMensagem,
};

/** Valida um único campo. Retorna `undefined` quando o valor está correto. */
export function validarCampo(campo: CampoFormulario, valor: string): string | undefined {
  return VALIDADORES[campo](valor);
}

/** Valida o formulário inteiro e devolve apenas os campos com erro. */
export function validarFormulario(dados: DadosFormulario): ErrosFormulario {
  const erros: ErrosFormulario = {};

  (Object.keys(VALIDADORES) as CampoFormulario[]).forEach((campo) => {
    const erro = validarCampo(campo, dados[campo]);
    if (erro) erros[campo] = erro;
  });

  return erros;
}
