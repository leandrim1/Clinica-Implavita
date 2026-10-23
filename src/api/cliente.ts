/**
 * Cliente HTTP da API.
 *
 * Em desenvolvimento o Vite redireciona /api para o servidor Express; em
 * produção front e API são servidos na mesma origem. Por isso o caminho é
 * relativo — não há URL de API espalhada pelo código.
 */
const BASE = '/api';

export class ErroApi extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly codigo?: string,
    readonly detalhes?: unknown,
  ) {
    super(message);
    this.name = 'ErroApi';
  }
}

/** Lê o token CSRF do cookie que o servidor define no login. */
function tokenCsrf(): string {
  const achado = document.cookie
    .split('; ')
    .find((parte) => parte.startsWith('implavita_csrf='));
  return achado ? decodeURIComponent(achado.slice('implavita_csrf='.length)) : '';
}

interface OpcoesPedido {
  readonly metodo?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly corpo?: unknown;
  /** Envio de arquivo: o navegador define o Content-Type com o boundary. */
  readonly formulario?: FormData;
  readonly sinal?: AbortSignal;
}

export async function pedir<T>(caminho: string, opcoes: OpcoesPedido = {}): Promise<T> {
  const { metodo = 'GET', corpo, formulario, sinal } = opcoes;

  const cabecalhos: Record<string, string> = {};
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';
  if (metodo !== 'GET') cabecalhos['X-CSRF-Token'] = tokenCsrf();

  let resposta: Response;

  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      credentials: 'same-origin',
      body: formulario ?? (corpo !== undefined ? JSON.stringify(corpo) : undefined),
      signal: sinal,
    });
  } catch (erro) {
    if (erro instanceof DOMException && erro.name === 'AbortError') throw erro;
    throw new ErroApi(0, 'Não foi possível falar com o servidor. Verifique sua conexão.');
  }

  if (resposta.status === 204) return undefined as T;

  const texto = await resposta.text();
  let dados: unknown = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      throw new ErroApi(resposta.status, 'Resposta inesperada do servidor.');
    }
  }

  if (!resposta.ok) {
    const info = dados as { erro?: string; codigo?: string; detalhes?: unknown } | null;
    throw new ErroApi(
      resposta.status,
      info?.erro ?? 'Não foi possível concluir a operação.',
      info?.codigo,
      info?.detalhes,
    );
  }

  return dados as T;
}
