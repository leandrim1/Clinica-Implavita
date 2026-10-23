import { pool } from '../db/pool.js';
import { ambiente } from '../lib/ambiente.js';

const CHAVE_CACHE = 'avaliacoes_google';
const HORAS_DE_CACHE = 6;

export interface AvaliacoesGoogle {
  readonly nota: number;
  readonly total: number;
  readonly obtidoEm: string;
}

async function lerCache(): Promise<AvaliacoesGoogle | null> {
  const { rows } = await pool.query<{ dados: AvaliacoesGoogle }>(
    'SELECT dados FROM cache_integracoes WHERE chave = $1 AND expira_em > now()',
    [CHAVE_CACHE],
  );
  return rows[0]?.dados ?? null;
}

async function gravarCache(dados: AvaliacoesGoogle): Promise<void> {
  await pool.query(
    `INSERT INTO cache_integracoes (chave, dados, expira_em)
     VALUES ($1, $2, now() + ($3 || ' hours')::interval)
     ON CONFLICT (chave) DO UPDATE
       SET dados = EXCLUDED.dados, expira_em = EXCLUDED.expira_em`,
    [CHAVE_CACHE, JSON.stringify(dados), String(HORAS_DE_CACHE)],
  );
}

/**
 * Busca nota e total de avaliações no Google Places.
 *
 * Sem chave configurada, devolve `null` — e o site segue exibindo os números
 * informados pela clínica. A resposta fica em cache por horas: a cota da API
 * é paga e os números mudam devagar.
 */
export async function buscarAvaliacoes(): Promise<AvaliacoesGoogle | null> {
  const chave = ambiente.GOOGLE_PLACES_API_KEY;
  const placeId = ambiente.GOOGLE_PLACE_ID;
  if (!chave || !placeId) return null;

  const emCache = await lerCache();
  if (emCache) return emCache;

  try {
    const resposta = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': chave,
        'X-Goog-FieldMask': 'rating,userRatingCount',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!resposta.ok) {
      console.error(`[google] resposta ${resposta.status} ao buscar avaliações.`);
      return null;
    }

    const dados = (await resposta.json()) as { rating?: number; userRatingCount?: number };
    if (typeof dados.rating !== 'number' || typeof dados.userRatingCount !== 'number') {
      return null;
    }

    const resultado: AvaliacoesGoogle = {
      nota: dados.rating,
      total: dados.userRatingCount,
      obtidoEm: new Date().toISOString(),
    };

    await gravarCache(resultado);
    return resultado;
  } catch (erro) {
    console.error('[google] falha ao buscar avaliações:', erro instanceof Error ? erro.message : erro);
    return null;
  }
}
