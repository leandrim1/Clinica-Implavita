import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import './Botao.css';

export type VarianteBotao = 'primario' | 'secundario' | 'contorno' | 'texto' | 'whatsapp';
export type TamanhoBotao = 'md' | 'lg';

interface BaseBotao {
  readonly children: ReactNode;
  readonly variante?: VarianteBotao;
  readonly tamanho?: TamanhoBotao;
  readonly iconeEsquerda?: ReactNode;
  readonly iconeDireita?: ReactNode;
  readonly larguraTotal?: boolean;
  readonly className?: string;
}

interface BotaoLinkExterno extends BaseBotao {
  readonly href: string;
  readonly externo: true;
  readonly rotuloAcessivel?: string;
}

interface BotaoAncora extends BaseBotao {
  readonly href: string;
  readonly externo?: false;
  readonly rotuloAcessivel?: string;
}

interface BotaoRota extends BaseBotao {
  readonly para: string;
  readonly rotuloAcessivel?: string;
}

interface BotaoAcao extends BaseBotao {
  readonly onClick?: () => void;
  readonly tipo?: 'button' | 'submit';
  readonly desabilitado?: boolean;
  readonly rotuloAcessivel?: string;
}

type PropsBotao = BotaoLinkExterno | BotaoAncora | BotaoRota | BotaoAcao;

function montarClasse({
  variante = 'primario',
  tamanho = 'md',
  larguraTotal,
  className,
}: BaseBotao): string {
  return [
    'botao',
    `botao--${variante}`,
    `botao--${tamanho}`,
    larguraTotal ? 'botao--largo' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

function Conteudo({ iconeEsquerda, children, iconeDireita }: BaseBotao) {
  return (
    <>
      {iconeEsquerda ? (
        <span className="botao__icone" aria-hidden="true">
          {iconeEsquerda}
        </span>
      ) : null}
      <span className="botao__rotulo">{children}</span>
      {iconeDireita ? (
        <span className="botao__icone botao__icone--direita" aria-hidden="true">
          {iconeDireita}
        </span>
      ) : null}
    </>
  );
}

/**
 * Botão único do projeto. Renderiza `<a>`, `<Link>` ou `<button>` conforme
 * as props recebidas, para que a semântica acompanhe sempre a ação real —
 * nunca existe botão decorativo sem destino.
 */
export function Botao(props: PropsBotao) {
  const classe = montarClasse(props);

  if ('para' in props) {
    return (
      <Link to={props.para} className={classe} aria-label={props.rotuloAcessivel}>
        <Conteudo {...props} />
      </Link>
    );
  }

  if ('href' in props) {
    const atributosExternos = props.externo
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <a className={classe} href={props.href} aria-label={props.rotuloAcessivel} {...atributosExternos}>
        <Conteudo {...props} />
      </a>
    );
  }

  return (
    <button
      type={props.tipo ?? 'button'}
      className={classe}
      onClick={props.onClick}
      disabled={props.desabilitado}
      aria-label={props.rotuloAcessivel}
    >
      <Conteudo {...props} />
    </button>
  );
}
