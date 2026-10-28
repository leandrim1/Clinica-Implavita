import { randomUUID } from 'node:crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import { MulterError } from 'multer';

import { carregarSessao } from './auth/middleware.js';
import { ambiente, emProducao } from './lib/ambiente.js';
import { ErroHttp } from './lib/erros.js';
import { rota } from './lib/async.js';
import { rotasAutenticacao } from './rotas/autenticacao.js';
import { rotasConteudo } from './rotas/conteudo.js';
import { rotasContatos } from './rotas/contatos.js';
import { rotasMidia } from './rotas/midia.js';
import { rotasUsuarios } from './rotas/usuarios.js';
import { buscarAvaliacoes } from './servicos/avaliacoesGoogle.js';

export function criarApp() {
  const app = express();

  // Atrás de proxy reverso (Vercel, Nginx), req.ip precisa vir do cabeçalho.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // --- Cabeçalhos de segurança ---
  app.use((_req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    });
    if (emProducao) {
      res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // --- CORS restrito às origens configuradas ---
  app.use((req, res, next) => {
    const origem = req.get('origin');

    /**
     * Quando front e API são servidos no mesmo domínio — o caso de um deploy
     * na Vercel — a origem é a própria. Liberar isso automaticamente evita
     * ter de repetir o domínio em ORIGENS_PERMITIDAS a cada ambiente de
     * pré-visualização, que ganha um subdomínio novo a cada deploy.
     */
    const proprioHost = req.get('host');
    const mesmaOrigem =
      !!origem && !!proprioHost && origem.replace(/^https?:\/\//, '') === proprioHost;

    if (origem && (mesmaOrigem || ambiente.ORIGENS_PERMITIDAS.includes(origem))) {
      res.set({
        'Access-Control-Allow-Origin': origem,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Max-Age': '600',
        Vary: 'Origin',
      });
    } else if (origem) {
      // Origem desconhecida não recebe os cabeçalhos: o navegador bloqueia.
      console.warn(`[cors] origem recusada: ${origem}`);
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(
        origem && (mesmaOrigem || ambiente.ORIGENS_PERMITIDAS.includes(origem)) ? 204 : 403,
      );
      return;
    }

    next();
  });

  app.use(carregarSessao);

  // --- Rotas ---
  app.get('/api/saude', (_req, res) => {
    res.json({ ok: true, ambiente: ambiente.AMBIENTE, horario: new Date().toISOString() });
  });

  app.get(
    '/api/avaliacoes',
    rota(async (_req, res) => {
      const avaliacoes = await buscarAvaliacoes();
      res.set('Cache-Control', 'public, max-age=1800');
      res.json({ avaliacoes });
    }),
  );

  app.use('/api/autenticacao', rotasAutenticacao);
  app.use('/api/conteudo', rotasConteudo);
  app.use('/api/midia', rotasMidia);
  app.use('/api/contatos', rotasContatos);
  app.use('/api/usuarios', rotasUsuarios);

  app.use('/api', (_req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada.' });
  });

  // --- Tratamento de erros ---
  app.use((erro: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (erro instanceof ErroHttp) {
      res.status(erro.status).json({
        erro: erro.message,
        codigo: erro.codigo,
        detalhes: erro.detalhes,
      });
      return;
    }

    if (erro instanceof MulterError) {
      const mensagem =
        erro.code === 'LIMIT_FILE_SIZE'
          ? 'A imagem passa do tamanho máximo de 12 MB.'
          : 'Não foi possível processar o envio da imagem.';
      res.status(400).json({ erro: mensagem, codigo: 'upload_invalido' });
      return;
    }

    if (erro instanceof Error && erro.message.startsWith('Formato não aceito')) {
      res.status(400).json({ erro: erro.message, codigo: 'formato_invalido' });
      return;
    }

    // Erro inesperado: registra com um identificador e devolve mensagem neutra,
    // para não vazar detalhes internos ao cliente.
    const referencia = randomUUID().slice(0, 8);
    console.error(`[erro ${referencia}] ${req.method} ${req.originalUrl}`, erro);

    res.status(500).json({
      erro: 'Erro inesperado no servidor. Tente novamente.',
      codigo: 'erro_interno',
      referencia,
    });
  });

  return app;
}
