import { useEffect, useState } from 'react';

import type { SecaoId } from '@/types';

/**
 * Acompanha qual seção âncora ocupa a faixa de leitura, para destacar
 * o item correspondente no menu.
 */
export function useSecaoAtiva(ids: readonly SecaoId[]): SecaoId | null {
  const [ativa, setAtiva] = useState<SecaoId | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const secoes = ids
      .map((id) => document.getElementById(id))
      .filter((elemento): elemento is HTMLElement => elemento !== null);

    if (secoes.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const visiveis = entradas
          .filter((entrada) => entrada.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const primeira = visiveis[0];
        if (primeira) {
          setAtiva(primeira.target.id as SecaoId);
        }
      },
      {
        // Faixa central da tela: evita trocas bruscas no topo e no rodapé.
        rootMargin: '-28% 0px -58% 0px',
        threshold: [0, 0.25, 0.5],
      },
    );

    secoes.forEach((secao) => observador.observe(secao));
    return () => observador.disconnect();
  }, [ids]);

  return ativa;
}
