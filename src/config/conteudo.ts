import type { ConteudoSite } from '@compartilhado/esquemas';
import { CONTEUDO_PADRAO } from '@compartilhado/conteudoPadrao';

/**
 * Conteúdo vigente do site.
 *
 * Começa com o padrão empacotado e é substituído pelo que vem da API antes
 * de o React montar. Se a API demorar ou falhar, o padrão permanece e a
 * página renderiza do mesmo jeito — o site nunca fica em branco por causa
 * do backend.
 */
let conteudoAtual: ConteudoSite = CONTEUDO_PADRAO;

export function obterConteudo(): ConteudoSite {
  return conteudoAtual;
}

/** Por quanto tempo esperamos a API antes de seguir com o padrão. */
const TEMPO_LIMITE_MS = 2500;

export async function hidratarConteudo(): Promise<'api' | 'padrao'> {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch('/api/conteudo', {
      signal: controle.signal,
      headers: { Accept: 'application/json' },
    });

    if (!resposta.ok) return 'padrao';

    const dados = (await resposta.json()) as Partial<ConteudoSite>;

    // Mescla por bloco: um bloco ausente ou nulo mantém o padrão, em vez de
    // deixar a página sem aquela seção.
    const mesclado = { ...CONTEUDO_PADRAO };
    for (const chave of Object.keys(CONTEUDO_PADRAO) as Array<keyof ConteudoSite>) {
      const bloco = dados[chave];
      if (bloco !== undefined && bloco !== null) {
        (mesclado as Record<string, unknown>)[chave] = bloco;
      }
    }

    conteudoAtual = mesclado;
    return 'api';
  } catch {
    return 'padrao';
  } finally {
    clearTimeout(limite);
  }
}
