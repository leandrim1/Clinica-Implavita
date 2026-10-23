import { Clock, MapPin } from 'lucide-react';

import { Secao, TituloSecao } from '@/components/ui/Secao';
import {
  AMBIENTES,
  CASOS_VISIVEIS,
  ENDERECO,
  FOTOS_CLINICA,
  TEXTOS,
} from '@/config/clinica';
import type { AmbienteClinica } from '@/types';

import './ClinicGallery.css';

/**
 * Ambiente em destaque, com título e descrição.
 *
 * Quando `foto` está vazio, exibe um painel gráfico identificado como
 * ilustrativo, para nunca simular uma fotografia que não existe.
 */
function CartaoAmbiente({ ambiente }: { readonly ambiente: AmbienteClinica }) {
  const { titulo, descricao, icone: Icone, foto, largura, altura } = ambiente;

  return (
    <figure className="ambiente">
      <div className="ambiente__visual">
        {foto ? (
          <img
            src={foto}
            alt={`${titulo} da Clínica Implavita`}
            width={largura}
            height={altura}
            loading="lazy"
            decoding="async"
            className="ambiente__foto"
          />
        ) : (
          <>
            <Icone size={30} className="ambiente__icone" aria-hidden="true" />
            <span className="ambiente__marca-dagua" aria-hidden="true">
              Imagem ilustrativa
            </span>
          </>
        )}
      </div>

      <figcaption className="ambiente__legenda">
        <h3 className="ambiente__titulo">{titulo}</h3>
        <p className="ambiente__descricao">{descricao}</p>
      </figcaption>
    </figure>
  );
}

export function ClinicGallery() {
  return (
    <Secao id="clinica" fundo="papel" rotuladaPor="clinica-titulo">
      <TituloSecao
        sobretitulo="A Clínica"
        titulo={TEXTOS.clinica.titulo}
        descricao={TEXTOS.clinica.descricao}
        id="clinica-titulo"
      />

      <div className="clinica__ambientes">
        {AMBIENTES.map((ambiente) => (
          <CartaoAmbiente key={ambiente.id} ambiente={ambiente} />
        ))}
      </div>

      {FOTOS_CLINICA.length > 0 ? (
        <ul className="galeria">
          {FOTOS_CLINICA.map((foto) => (
            <li
              key={foto.id}
              className={`galeria__item ${foto.larga ? 'galeria__item--larga' : ''}`}
            >
              <img
                src={foto.arquivo}
                alt={foto.descricao}
                width={foto.largura}
                height={foto.altura}
                loading="lazy"
                decoding="async"
                className="galeria__foto"
              />
            </li>
          ))}
        </ul>
      ) : null}

      {CASOS_VISIVEIS.length > 0 ? (
        <div className="casos">
          <div className="casos__cabecalho">
            <h3 className="casos__titulo">Casos atendidos na Implavita</h3>
            <p className="casos__aviso">{TEXTOS.avisoCasos}</p>
          </div>

          <ul className="casos__grade">
            {CASOS_VISIVEIS.map((caso) => (
              <li key={caso.id} className="casos__item">
                <figure className="caso">
                  <img
                    src={caso.arquivo}
                    alt={caso.descricao}
                    width={caso.largura}
                    height={caso.altura}
                    loading="lazy"
                    decoding="async"
                    className="caso__imagem"
                  />
                  <figcaption className="caso__legenda">{caso.descricao}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="clinica__endereco">
        <p>
          <MapPin size={16} aria-hidden="true" />
          <span>{ENDERECO.linhaUnica}</span>
        </p>
        <p>
          <Clock size={16} aria-hidden="true" />
          <span>Segunda a sexta, 08h às 19h · Sábado, 08h às 13h</span>
        </p>
      </div>
    </Secao>
  );
}
