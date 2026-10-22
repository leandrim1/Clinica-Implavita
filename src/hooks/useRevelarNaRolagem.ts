import { useEffect, useRef } from 'react';

/**
 * Revela o elemento quando ele entra na viewport, uma única vez.
 *
 * Se o visitante prefere menos movimento, ou se o navegador não suporta
 * IntersectionObserver, o conteúdo já nasce visível.
 */
export function useRevelarNaRolagem<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const prefereMenosMovimento = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefereMenosMovimento || typeof IntersectionObserver === 'undefined') {
      elemento.dataset.visivel = 'true';
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            elemento.dataset.visivel = 'true';
            observador.unobserve(elemento);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return ref;
}
