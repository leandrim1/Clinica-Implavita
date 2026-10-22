import { ArrowRight, CalendarCheck, MapPin, Star } from 'lucide-react';

import { Botao } from '@/components/ui/Botao';
import { CLINICA, HERO_IMAGEM, REPUTACAO, TEXTOS } from '@/config/clinica';
import { linkWhatsApp } from '@/lib/whatsapp';

import './Hero.css';

/**
 * Composição gráfica da primeira dobra.
 *
 * Desenho original, construído com os arcos e o dourado da identidade da
 * clínica. Não reproduz o logotipo da Implavita — ocupa o lugar dele até
 * que a fotografia oficial esteja disponível.
 */
function ComposicaoMarca() {
  return (
    <svg
      className="hero__arte"
      viewBox="0 0 420 520"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-ouro" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8d4b6" />
          <stop offset="48%" stopColor="#c39a6a" />
          <stop offset="100%" stopColor="#8a6a43" />
        </linearGradient>
      </defs>

      {/* Arcos concêntricos: precisão e cuidado, sem ruído decorativo. */}
      <g className="hero__arcos" stroke="url(#hero-ouro)" fill="none">
        <circle cx="210" cy="252" r="152" strokeWidth="0.9" opacity="0.30" />
        <circle cx="210" cy="252" r="118" strokeWidth="0.9" opacity="0.45" />
        <circle cx="210" cy="252" r="186" strokeWidth="0.7" opacity="0.18" />
      </g>

      {/* Silhueta de dente em traço contínuo. */}
      <g fill="none" stroke="url(#hero-ouro)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M210 148c-20-17-45-21-62-6-19 17-22 48-14 81 5 20 7 32 5 48-2 19-6 33 2 39 9 7 19-2 26-19 6-13 9-27 12-38 4-12 9-20 17-20"
          strokeWidth="2.1"
        />
        <path
          d="M210 148c20-17 45-21 62-6 19 17 22 48 14 81-5 20-7 32-5 48 2 19 6 33-2 39-9 7-19-2-26-19-6-13-9-27-12-38-4-12-9-20-17-20"
          strokeWidth="2.1"
          opacity="0.5"
        />
        {/* Linha do sorriso. */}
        <path d="M128 404c26 22 56 33 82 33s56-11 82-33" strokeWidth="1.6" opacity="0.6" />
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="hero sobre-escuro" aria-labelledby="hero-titulo">
      <div className="container hero__interno">
        <div className="hero__conteudo">
          <p className="hero__etiqueta">
            <MapPin size={14} aria-hidden="true" />
            {TEXTOS.hero.etiqueta}
          </p>

          <h1 id="hero-titulo" className="hero__titulo">
            {TEXTOS.hero.titulo}
          </h1>

          <p className="hero__texto">{TEXTOS.hero.texto}</p>

          <div className="hero__acoes">
            <Botao
              href={linkWhatsApp('agendamento')}
              externo
              variante="secundario"
              tamanho="lg"
              iconeEsquerda={<CalendarCheck size={18} />}
            >
              Agendar avaliação
            </Botao>

            <Botao
              href="#tratamentos"
              variante="contorno"
              tamanho="lg"
              iconeDireita={<ArrowRight size={17} />}
            >
              Conhecer tratamentos
            </Botao>
          </div>

          <p className="hero__nota">
            <Star size={15} aria-hidden="true" />
            <span>
              <strong>{REPUTACAO.nota}</strong> no Google em{' '}
              <strong>{REPUTACAO.totalAvaliacoes}</strong> avaliações
            </span>
            <span className="hero__nota-fonte">({REPUTACAO.referencia})</span>
          </p>
        </div>

        <div className="hero__visual">
          <figure className="hero__moldura">
            {/* O quadro recorta a imagem; o selo fica fora dele para não ser cortado. */}
            <div className="hero__quadro">
              {HERO_IMAGEM.arquivo ? (
                <img
                  src={HERO_IMAGEM.arquivo}
                  alt={HERO_IMAGEM.alt}
                  width={HERO_IMAGEM.largura}
                  height={HERO_IMAGEM.altura}
                  className="hero__foto"
                  /* Primeira dobra: carrega cedo, sem lazy. */
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              ) : (
                <ComposicaoMarca />
              )}
            </div>

            <figcaption className="hero__selo">
              <span className="hero__selo-valor">+30 mil</span>
              <span className="hero__selo-rotulo">
                implantes realizados
                <small>informação fornecida pela clínica</small>
              </span>
            </figcaption>
          </figure>

          <p className="hero__local">
            {CLINICA.cidade}, {CLINICA.uf}
          </p>
        </div>
      </div>
    </section>
  );
}
