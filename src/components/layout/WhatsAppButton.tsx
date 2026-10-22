import { useEffect, useState } from 'react';

import { linkWhatsApp } from '@/lib/whatsapp';

import './WhatsAppButton.css';

/** Ícone oficial do WhatsApp (o Lucide não traz marcas registradas). */
function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23z" />
    </svg>
  );
}

/**
 * Atalho flutuante para o WhatsApp.
 *
 * Aparece só depois da primeira dobra, para não competir com os botões do
 * hero, e some quando o rodapé entra em cena — evitando cobrir os links
 * legais e o conteúdo do fim da página.
 */
export function WhatsAppButton() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    let aguardando = false;
    // O rodapé traz os mesmos contatos: com ele à vista, o atalho só atrapalha.
    let rodapeAVista = false;

    function avaliar() {
      const passouDoHero = window.scrollY > window.innerHeight * 0.6;
      setVisivel(passouDoHero && !rodapeAVista);
    }

    function aoRolar() {
      if (aguardando) return;
      aguardando = true;
      window.requestAnimationFrame(() => {
        avaliar();
        aguardando = false;
      });
    }

    const rodape = document.querySelector('.rodape');
    let observador: IntersectionObserver | undefined;

    if (rodape && typeof IntersectionObserver !== 'undefined') {
      observador = new IntersectionObserver(
        (entradas) => {
          const entrada = entradas[0];
          if (!entrada) return;
          rodapeAVista = entrada.isIntersecting;
          avaliar();
        },
        { rootMargin: '0px 0px -40px 0px' },
      );
      observador.observe(rodape);
    }

    avaliar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      observador?.disconnect();
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
    };
  }, []);

  return (
    <a
      className={`whatsapp-flutuante ${visivel ? 'whatsapp-flutuante--visivel' : ''}`}
      href={linkWhatsApp('geral')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a Clínica Implavita pelo WhatsApp (abre em nova aba)"
      tabIndex={visivel ? 0 : -1}
      aria-hidden={!visivel}
    >
      <IconeWhatsApp />
      <span className="whatsapp-flutuante__rotulo">Fale conosco</span>
    </a>
  );
}
