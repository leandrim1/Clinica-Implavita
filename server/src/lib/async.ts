import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Encaminha rejeições de handlers assíncronos ao middleware de erro.
 * Sem isso, um `await` que falha derruba a requisição sem resposta.
 */
export function rota(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
