import type { NextFunction, Request, Response } from 'express';

import { erroNaoAutenticado, erroSemPermissao } from '../lib/erros.js';
import {
  CABECALHO_CSRF,
  COOKIE_CSRF,
  COOKIE_SESSAO,
  buscarSessao,
  compararSegredos,
  type SessaoValida,
} from './sessao.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      sessao?: SessaoValida;
      tokenSessao?: string;
    }
  }
}

/** Anexa a sessão à requisição quando houver cookie válido. Não bloqueia. */
export async function carregarSessao(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.[COOKIE_SESSAO];

  if (typeof token === 'string' && token.length > 0) {
    try {
      const sessao = await buscarSessao(token);
      if (sessao) {
        req.sessao = sessao;
        req.tokenSessao = token;
      }
    } catch (erro) {
      console.error('[auth] falha ao carregar sessão:', erro);
    }
  }

  next();
}

export function exigirSessao(req: Request, _res: Response, next: NextFunction): void {
  if (!req.sessao) {
    next(erroNaoAutenticado());
    return;
  }
  next();
}

export function exigirPapel(...papeis: Array<'administrador' | 'editor'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.sessao) {
      next(erroNaoAutenticado());
      return;
    }
    if (!papeis.includes(req.sessao.papel)) {
      next(erroSemPermissao());
      return;
    }
    next();
  };
}

const METODOS_SEGUROS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Dupla submissão de token: o valor do cookie precisa bater com o cabeçalho.
 * Um site de terceiros consegue fazer o navegador enviar o cookie, mas não
 * consegue ler o valor dele para montar o cabeçalho.
 */
export function verificarCsrf(req: Request, _res: Response, next: NextFunction): void {
  if (METODOS_SEGUROS.has(req.method)) {
    next();
    return;
  }

  const doCookie = req.cookies?.[COOKIE_CSRF];
  const doCabecalho = req.get(CABECALHO_CSRF);

  if (
    typeof doCookie !== 'string' ||
    typeof doCabecalho !== 'string' ||
    doCookie.length === 0 ||
    !compararSegredos(doCookie, doCabecalho)
  ) {
    next(erroSemPermissao('Token de verificação ausente ou inválido. Recarregue a página.'));
    return;
  }

  next();
}
