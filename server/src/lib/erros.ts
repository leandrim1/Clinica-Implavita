/** Erro com código HTTP, usado para respostas previsíveis da API. */
export class ErroHttp extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly codigo?: string,
    readonly detalhes?: unknown,
  ) {
    super(message);
    this.name = 'ErroHttp';
  }
}

export const erroRequisicao = (msg: string, detalhes?: unknown) =>
  new ErroHttp(400, msg, 'requisicao_invalida', detalhes);

export const erroNaoAutenticado = (msg = 'Faça login para continuar.') =>
  new ErroHttp(401, msg, 'nao_autenticado');

export const erroSemPermissao = (msg = 'Você não tem permissão para esta ação.') =>
  new ErroHttp(403, msg, 'sem_permissao');

export const erroNaoEncontrado = (msg = 'Não encontrado.') =>
  new ErroHttp(404, msg, 'nao_encontrado');

export const erroConflito = (msg: string) => new ErroHttp(409, msg, 'conflito');

export const erroExcessoTentativas = (msg: string) =>
  new ErroHttp(429, msg, 'excesso_tentativas');
