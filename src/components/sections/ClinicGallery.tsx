import { Clock, Info, MapPin } from 'lucide-react';

import { Secao, TituloSecao } from '@/components/ui/Secao';
import {
  AMBIENTES,
  AVISO_CASOS,
  CASOS_VISIVEIS,
  CLINICA,
  ENDERECO,
} from '@/config/clinica';

import './ClinicGallery.css';

/**
 * Painel ilustrativo de ambiente.
 *
 * A clínica ainda não forneceu fotos da recepção, dos consultórios ou dos
 * equipamentos. Em vez de simular fotografias das instalações — o que
 * induziria o visitante a erro — cada ambiente aparece como um painel
 * gráfico identificado como ilustrativo, pronto para receber a foto real
 * pelo campo `foto` em `src/config/clinica.ts`.
 */
function PainelAmbiente({ ambiente }: { readonly ambiente: (typeof AMBIENTES)[number] }) {
  const { titulo, descricao, icone: Icone, foto } = ambiente;

  return (
    <figure className="ambiente">
      <div className="ambiente__visual">
        {foto ? (
          <img
            src={foto}
            alt={`${titulo} da Clínica Implavita`}
            width={800}
            height={600}
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
        titulo="Um espaço pensado para o seu atendimento"
        descricao={
          `A ${CLINICA.nome} atende em ${ENDERECO.bairro}, ${CLINICA.cidade}. ` +
          'Da recepção ao consultório, o percurso é organizado para que cada ' +
          'etapa do tratamento aconteça com calma e atenção.'
        }
        id="clinica-titulo"
      />

      <div className="clinica__ambientes">
        {AMBIENTES.map((ambiente) => (
          <PainelAmbiente key={ambiente.id} ambiente={ambiente} />
        ))}
      </div>

      <p className="clinica__nota">
        <Info size={15} aria-hidden="true" />
        <span>
          Os painéis acima são ilustrativos e serão substituídos pelas fotografias
          oficiais da clínica.
        </span>
      </p>

      {CASOS_VISIVEIS.length > 0 ? (
        <div className="casos">
          <div className="casos__cabecalho">
            <h3 className="casos__titulo">Casos atendidos na Implavita</h3>
            <p className="casos__aviso">{AVISO_CASOS}</p>
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
