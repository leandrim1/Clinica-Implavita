import { CLINICA, LOGO } from '@/config/clinica';

import './Marca.css';

interface PropsMarca {
  /** `rodape` clareia o letreiro para uso sobre fundo escuro. */
  readonly tom?: 'claro' | 'escuro';
  readonly compacta?: boolean;
}

/**
 * Letreiro da clínica.
 *
 * Quando `LOGO.arquivo` estiver preenchido, exibe o logotipo oficial.
 * Até lá, apresenta um letreiro tipográfico com o nome e a assinatura reais
 * da Implavita — um espaço desenhado para receber a marca definitiva, não
 * uma tentativa de recriá-la.
 */
export function Marca({ tom = 'escuro', compacta = false }: PropsMarca) {
  if (LOGO.arquivo) {
    return (
      <img
        src={LOGO.arquivo}
        alt={LOGO.alt}
        width={LOGO.largura}
        height={LOGO.altura}
        className="marca__imagem"
      />
    );
  }

  return (
    <span
      className={`marca marca--${tom} ${compacta ? 'marca--compacta' : ''}`}
      aria-label={LOGO.alt}
      role="img"
    >
      <span className="marca__simbolo" aria-hidden="true">
        <svg viewBox="0 0 44 44" focusable="false">
          <circle cx="22" cy="22" r="20.5" className="marca__anel" />
          <path
            className="marca__traco"
            d="M22 11.4c-2.4-1.9-5.3-2.3-7.3-.6-2.2 1.9-2.5 5.5-1.6 9.3.5 2.2.7 3.6.5 5.4-.2 2.1-.6 3.7.3 4.4 1 .8 2.2-.2 3-2.1.6-1.5 1-3 1.4-4.2.5-1.4 1.1-2.3 2-2.3"
          />
          <path
            className="marca__traco"
            d="M24.6 11.9c2.6 1.1 4.6 3.4 5.3 6.3.6 2.5.2 4.6-.9 6.2-.9 1.3-1.5 2.3-1.8 3.7-.3 1.4-.3 2.6-1.1 3.4"
          />
        </svg>
      </span>

      <span className="marca__texto">
        <span className="marca__nome">
          <span className="marca__nome-um">Clínica</span>
          <span className="marca__nome-dois">Implavita</span>
        </span>
        {!compacta ? (
          <span className="marca__assinatura">{CLINICA.assinatura}</span>
        ) : null}
      </span>
    </span>
  );
}
