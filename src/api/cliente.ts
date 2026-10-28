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

/**
 * Mensagem para respostas que não trazem um erro da própria API.
 *
 * Os casos de servidor fora do ar são os mais comuns em desenvolvimento, e
 * um texto genérico só atrasa o diagnóstico — por isso cada um diz o que
 * realmente aconteceu.
 */
function mensagemPadrao(status: number, corpoVazio: boolean): string {
  if (status === 502 || status === 503 || status === 504) {
    return 'A API não está respondendo. Verifique se o servidor está no ar (npm run dev:api).';
  }
  if (status === 404) {
    return 'Endereço não encontrado na API. Confira se o servidor está no ar e atendendo em /api.';
  }
  if (status === 413) return 'O arquivo enviado é grande demais.';

  // Erro 5xx com corpo vazio é o que o proxy devolve quando não consegue
  // alcançar a API — a API, quando responde, sempre manda um JSON.
  if (status >= 500 && corpoVazio) {
    return 'A API não está respondendo. Verifique se o servidor está no ar (npm run dev:api).';
  }
  if (status >= 500) return 'O servidor encontrou um erro. Tente novamente em instantes.';

  return 'Não foi possível concluir a operação.';
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
    throw new ErroApi(
      0,
      'Não foi possível falar com o servidor. Verifique sua conexão e se a API está no ar.',
    );
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
      info?.erro ?? mensagemPadrao(resposta.status, texto.trim().length === 0),
      info?.codigo,
      info?.detalhes,
    );
  }

  return dados as T;
}
