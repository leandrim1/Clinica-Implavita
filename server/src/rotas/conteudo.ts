import { Router } from 'express';

import {
  CHAVES_BLOCOS,
  ESQUEMAS_BLOCOS,
  type ChaveBloco,
  type ConteudoSite,
} from '../../../shared/esquemas.js';
import { CONTEUDO_PADRAO } from '../../../shared/conteudoPadrao.js';
import { exigirSessao, verificarCsrf } from '../auth/middleware.js';
import { emTransacao, pool } from '../db/pool.js';
import { registrar } from '../lib/auditoria.js';
import { rota } from '../lib/async.js';
import { erroNaoEncontrado, erroRequisicao } from '../lib/erros.js';

export const rotasConteudo = Router();

/** No Express 5 um parâmetro de rota pode chegar como array; só aceitamos string. */
const ehChaveValida = (v: unknown): v is ChaveBloco =>
  typeof v === 'string' && (CHAVES_BLOCOS as string[]).includes(v);

/**
 * Monta o conteúdo completo do site.
 *
 * Qualquer bloco ausente no banco cai para o padrão empacotado, de modo que
 * um bloco novo (adicionado numa versão posterior do código) nunca derruba a
 * página antes de a migração de seed rodar.
 */
export async function montarConteudo(): Promise<ConteudoSite> {
  const { rows } = await pool.query<{ chave: string; dados: unknown }>(
    'SELECT chave, dados FROM blocos_conteudo',
  );

  const salvos = new Map(rows.map((r) => [r.chave, r.dados]));
  const conteudo = {} as Record<ChaveBloco, unknown>;

  for (const chave of CHAVES_BLOCOS) {
    const bruto = salvos.get(chave);
    if (bruto === undefined) {
      conteudo[chave] = CONTEUDO_PADRAO[chave];
      continue;
    }

    // Dado salvo fora do formato atual não deve derrubar o site inteiro.
    const analise = ESQUEMAS_BLOCOS[chave].safeParse(bruto);
    conteudo[chave] = analise.success ? analise.data : CONTEUDO_PADRAO[chave];

    if (!analise.success) {
      console.error(`[conteudo] bloco "${chave}" salvo em formato inválido; usando o padrão.`);
    }
  }

  return conteudo as ConteudoSite;
}

/** Conteúdo público do site. Sem autenticação — é o que a home consome. */
rotasConteudo.get(
  '/',
  rota(async (_req, res) => {
    const conteudo = await montarConteudo();

    // Casos em que o paciente é identificável só saem daqui com autorização.
    const casosPublicos = conteudo.casosClinicos.filter(
      (caso) => !caso.identificavel || caso.autorizado,
    );

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ ...conteudo, casosClinicos: casosPublicos });
  }),
);

/** Conteúdo completo para o painel, incluindo os casos ainda não liberados. */
rotasConteudo.get(
  '/admin',
  exigirSessao,
  rota(async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(await montarConteudo());
  }),
);

rotasConteudo.get(
  '/:chave',
  exigirSessao,
  rota(async (req, res) => {
    const { chave } = req.params;
    if (!ehChaveValida(chave)) throw erroNaoEncontrado('Bloco inexistente.');

    const { rows } = await pool.query<{ dados: unknown; versao: number; atualizado_em: Date }>(
      'SELECT dados, versao, atualizado_em FROM blocos_conteudo WHERE chave = $1',
      [chave],
    );

    const linha = rows[0];
    res.json({
      chave,
      dados: linha?.dados ?? CONTEUDO_PADRAO[chave],
      versao: linha?.versao ?? 0,
      atualizadoEm: linha?.atualizado_em?.toISOString() ?? null,
    });
  }),
);

rotasConteudo.put(
  '/:chave',
  exigirSessao,
  verificarCsrf,
  rota(async (req, res) => {
    const { chave } = req.params;
    if (!ehChaveValida(chave)) throw erroNaoEncontrado('Bloco inexistente.');

    const analise = ESQUEMAS_BLOCOS[chave].safeParse(req.body?.dados);
    if (!analise.success) {
      throw erroRequisicao(
        'Conteúdo inválido.',
        analise.error.issues.map((p) => ({
          campo: p.path.join('.') || '(raiz)',
          mensagem: p.message,
        })),
      );
    }

    const atualizado = await emTransacao(async (cliente) => {
      // Guarda a versão anterior antes de sobrescrever, para permitir desfazer.
      const { rows: anteriores } = await cliente.query<{ dados: unknown; versao: number }>(
        'SELECT dados, versao FROM blocos_conteudo WHERE chave = $1 FOR UPDATE',
        [chave],
      );
      const anterior = anteriores[0];

      if (anterior) {
        await cliente.query(
          `INSERT INTO versoes_conteudo (chave, dados, versao, criado_por)
           VALUES ($1, $2, $3, $4)`,
          [chave, JSON.stringify(anterior.dados), anterior.versao, req.sessao!.usuarioId],
        );
      }

      const { rows } = await cliente.query<{ versao: number; atualizado_em: Date }>(
        `INSERT INTO blocos_conteudo (chave, dados, versao, atualizado_por, atualizado_em)
         VALUES ($1, $2, 1, $3, now())
         ON CONFLICT (chave) DO UPDATE
           SET dados = EXCLUDED.dados,
               versao = blocos_conteudo.versao + 1,
               atualizado_por = EXCLUDED.atualizado_por,
               atualizado_em = now()
         RETURNING versao, atualizado_em`,
        [chave, JSON.stringify(analise.data), req.sessao!.usuarioId],
      );

      return rows[0]!;
    });

    await registrar(req, 'atualizar_conteudo', 'bloco', chave, { versao: atualizado.versao });

    res.json({
      chave,
      dados: analise.data,
      versao: atualizado.versao,
      atualizadoEm: atualizado.atualizado_em.toISOString(),
    });
  }),
);

/** Histórico de um bloco, para conferir ou restaurar uma versão anterior. */
rotasConteudo.get(
  '/:chave/versoes',
  exigirSessao,
  rota(async (req, res) => {
    const { chave } = req.params;
    if (!ehChaveValida(chave)) throw erroNaoEncontrado('Bloco inexistente.');

    const { rows } = await pool.query(
      `SELECT v.id, v.versao, v.criado_em, u.nome AS autor
         FROM versoes_conteudo v
         LEFT JOIN usuarios u ON u.id = v.criado_por
        WHERE v.chave = $1
        ORDER BY v.versao DESC
        LIMIT 20`,
      [chave],
    );

    res.json({
      versoes: rows.map((r) => ({
        id: String(r.id),
        versao: r.versao,
        criadoEm: r.criado_em.toISOString(),
        autor: r.autor ?? 'desconhecido',
      })),
    });
  }),
);

rotasConteudo.post(
  '/:chave/restaurar/:id',
  exigirSessao,
  verificarCsrf,
  rota(async (req, res) => {
    const { chave, id } = req.params;
    if (!ehChaveValida(chave)) throw erroNaoEncontrado('Bloco inexistente.');

    const { rows } = await pool.query<{ dados: unknown }>(
      'SELECT dados FROM versoes_conteudo WHERE id = $1 AND chave = $2',
      [id, chave],
    );
    const versao = rows[0];
    if (!versao) throw erroNaoEncontrado('Versão não encontrada.');

    const analise = ESQUEMAS_BLOCOS[chave].safeParse(versao.dados);
    if (!analise.success) {
      throw erroRequisicao('Esta versão não é mais compatível com o formato atual.');
    }

    await pool.query(
      `UPDATE blocos_conteudo
          SET dados = $2, versao = versao + 1, atualizado_por = $3, atualizado_em = now()
        WHERE chave = $1`,
      [chave, JSON.stringify(analise.data), req.sessao!.usuarioId],
    );

    await registrar(req, 'restaurar_conteudo', 'bloco', chave, { versaoId: id });
    res.json({ chave, dados: analise.data });
  }),
);
