import type { ReactNode } from 'react';

import { useRevelarNaRolagem } from '@/hooks/useRevelarNaRolagem';

import './Secao.css';

interface PropsSecao {
  readonly id?: string;
  readonly children: ReactNode;
  /** Fundo da faixa. `escuro` ativa automaticamente o tema invertido. */
  readonly fundo?: 'papel' | 'alternado' | 'escuro' | 'petroleo';
  readonly className?: string;
  readonly espacamento?: 'padrao' | 'compacto' | 'amplo';
  readonly rotuladaPor?: string;
}

export function Secao({
  id,
  children,
  fundo = 'papel',
  className,
  espacamento = 'padrao',
  rotuladaPor,
}: PropsSecao) {
  const ref = useRevelarNaRolagem<HTMLElement>();
  const escuro = fundo === 'escuro' || fundo === 'petroleo';

  const classes = [
    'secao',
    `secao--${fundo}`,
    `secao--esp-${espacamento}`,
    escuro ? 'sobre-escuro' : '',
    'revelar',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section ref={ref} id={id} className={classes} aria-labelledby={rotuladaPor}>
      <div className="container">{children}</div>
    </section>
  );
}

interface PropsTituloSecao {
  readonly sobretitulo?: string;
  readonly titulo: string;
  readonly descricao?: string;
  readonly id?: string;
  readonly alinhamento?: 'esquerda' | 'centro';
  readonly nivel?: 2 | 3;
}

export function TituloSecao({
  sobretitulo,
  titulo,
  descricao,
  id,
  alinhamento = 'esquerda',
  nivel = 2,
}: PropsTituloSecao) {
  const Tag = nivel === 2 ? 'h2' : 'h3';

  return (
    <header className={`titulo-secao titulo-secao--${alinhamento}`}>
      {sobretitulo ? <p className="sobretitulo">{sobretitulo}</p> : null}
      <Tag id={id} className="titulo-secao__titulo">
        {titulo}
      </Tag>
      {descricao ? <p className="titulo-secao__descricao">{descricao}</p> : null}
    </header>
  );
}
