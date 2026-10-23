import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { z } from 'zod';

import type { Midia } from '../../../shared/esquemas.js';
import { exigirSessao, verificarCsrf } from '../auth/middleware.js';
import { pool } from '../db/pool.js';
import { registrar } from '../lib/auditoria.js';
import { rota } from '../lib/async.js';
import { erroNaoEncontrado, erroRequisicao } from '../lib/erros.js';
import { armazenamento } from '../servicos/armazenamento.js';

export const rotasMidia = Router();

const TAMANHO_MAXIMO = 12 * 1024 * 1024;
const TIPOS_ACEITOS = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
/** Acima disso a imagem é reduzida: nenhuma foto de site precisa de mais. */
const LARGURA_MAXIMA = 2000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANHO_MAXIMO, files: 1 },
  fileFilter: (_req, arquivo, cb) => {
    if (!TIPOS_ACEITOS.has(arquivo.mimetype)) {
      cb(new Error('Formato não aceito. Envie JPG, PNG, WebP ou AVIF.'));
      return;
    }
    cb(null, true);
  },
});

const paraMidia = (r: {
  id: string; arquivo: string; nome_original: string; mime: string;
  bytes: number; largura: number; altura: number; alt: string; criado_em: Date;
}): Midia => ({
  id: r.id,
  arquivo: r.arquivo,
  nomeOriginal: r.nome_original,
  mime: r.mime,
  bytes: r.bytes,
  largura: r.largura,
  altura: r.altura,
  alt: r.alt,
  criadoEm: r.criado_em.toISOString(),
});

rotasMidia.get(
  '/',
  exigirSessao,
  rota(async (_req, res) => {
    const { rows } = await pool.query(
      'SELECT * FROM midias ORDER BY criado_em DESC LIMIT 200',
    );
    res.json({ midias: rows.map(paraMidia) });
  }),
);

rotasMidia.post(
  '/',
  exigirSessao,
  verificarCsrf,
  upload.single('arquivo'),
  rota(async (req, res) => {
    const arquivo = req.file;
    if (!arquivo) throw erroRequisicao('Nenhuma imagem foi enviada.');

    let processada: Buffer;
    let largura: number;
    let altura: number;

    try {
      const imagem = sharp(arquivo.buffer, { failOn: 'error' });
      const meta = await imagem.metadata();

      if (!meta.width || !meta.height) {
        throw new Error('sem dimensões');
      }

      // Converte tudo para WebP: menor, com suporte universal hoje.
      const redimensionada =
        meta.width > LARGURA_MAXIMA
          ? imagem.resize({ width: LARGURA_MAXIMA, withoutEnlargement: true })
          : imagem;

      processada = await redimensionada
        .rotate() // respeita a orientação EXIF antes de descartar os metadados
        .webp({ quality: 82 })
        .toBuffer();

      const metaFinal = await sharp(processada).metadata();
      largura = metaFinal.width ?? meta.width;
      altura = metaFinal.height ?? meta.height;
    } catch {
      throw erroRequisicao('Não foi possível ler esta imagem. Ela pode estar corrompida.');
    }

    const nome = `${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
    const caminho = await armazenamento.salvar(nome, processada, 'image/webp');

    const alt = typeof req.body?.alt === 'string' ? req.body.alt.trim().slice(0, 300) : '';

    const { rows } = await pool.query(
      `INSERT INTO midias (arquivo, nome_original, mime, bytes, largura, altura, alt, criado_por)
       VALUES ($1, $2, 'image/webp', $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        caminho,
        arquivo.originalname.slice(0, 200),
        processada.byteLength,
        largura,
        altura,
        alt,
        req.sessao!.usuarioId,
      ],
    );

    const midia = paraMidia(rows[0]);
    await registrar(req, 'enviar_midia', 'midia', midia.id, { arquivo: caminho });

    res.status(201).json({ midia });
  }),
);

rotasMidia.patch(
  '/:id',
  exigirSessao,
  verificarCsrf,
  rota(async (req, res) => {
    const analise = z.object({ alt: z.string().trim().max(300) }).safeParse(req.body);
    if (!analise.success) throw erroRequisicao('Texto alternativo inválido.');

    const { rows } = await pool.query(
      'UPDATE midias SET alt = $2 WHERE id = $1 RETURNING *',
      [req.params.id, analise.data.alt],
    );
    if (!rows[0]) throw erroNaoEncontrado('Imagem não encontrada.');

    res.json({ midia: paraMidia(rows[0]) });
  }),
);

rotasMidia.delete(
  '/:id',
  exigirSessao,
  verificarCsrf,
  rota(async (req, res) => {
    const { rows } = await pool.query<{ arquivo: string }>(
      'SELECT arquivo FROM midias WHERE id = $1',
      [req.params.id],
    );
    const midia = rows[0];
    if (!midia) throw erroNaoEncontrado('Imagem não encontrada.');

    // Uma imagem em uso no site não pode sumir sem aviso.
    const { rows: usos } = await pool.query<{ chave: string }>(
      `SELECT chave FROM blocos_conteudo WHERE dados::text LIKE '%' || $1 || '%'`,
      [midia.arquivo],
    );

    if (usos.length > 0) {
      throw erroRequisicao(
        `Esta imagem está em uso em: ${usos.map((u) => u.chave).join(', ')}. ` +
          'Troque-a nesses lugares antes de excluir.',
      );
    }

    await pool.query('DELETE FROM midias WHERE id = $1', [req.params.id]);
    await armazenamento.remover(midia.arquivo);
    await registrar(req, 'excluir_midia', 'midia', String(req.params.id));

    res.json({ ok: true });
  }),
);
