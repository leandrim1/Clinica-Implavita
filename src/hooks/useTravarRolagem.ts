import { useEffect } from 'react';

/**
 * Trava a rolagem do corpo enquanto o menu mobile está aberto, compensando
 * a largura da barra de rolagem para o layout não "saltar".
 */
export function useTravarRolagem(ativo: boolean): void {
  useEffect(() => {
    if (!ativo) return;

    const { body } = document;
    const overflowAnterior = body.style.overflow;
    const paddingAnterior = body.style.paddingRight;
    const larguraBarra = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (larguraBarra > 0) {
      body.style.paddingRight = `${larguraBarra}px`;
    }

    return () => {
      body.style.overflow = overflowAnterior;
      body.style.paddingRight = paddingAnterior;
    };
  }, [ativo]);
}
