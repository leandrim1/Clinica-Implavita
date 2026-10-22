import { useEffect, useState } from 'react';

/** `true` depois que a página passa do limite indicado. */
export function useCabecalhoCompacto(limite = 24): boolean {
  const [compacto, setCompacto] = useState(false);

  useEffect(() => {
    let aguardando = false;

    function aoRolar() {
      if (aguardando) return;
      aguardando = true;

      window.requestAnimationFrame(() => {
        setCompacto(window.scrollY > limite);
        aguardando = false;
      });
    }

    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, [limite]);

  return compacto;
}
