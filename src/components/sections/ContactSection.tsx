import { useState } from 'react';
import { Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';

import { FormularioContato } from '@/components/sections/FormularioContato';
import { Botao } from '@/components/ui/Botao';
import { Secao, TituloSecao } from '@/components/ui/Secao';
import { CONTATO, ENDERECO, FACHADA, HORARIOS, TEXTOS } from '@/config/clinica';
import { linkWhatsApp } from '@/lib/whatsapp';

import './ContactSection.css';

/** Índice do dia atual no formato usado por HORARIOS (segunda = 0). */
function indiceDeHoje(): number {
  return (new Date().getDay() + 6) % 7;
}

/**
 * Mapa carregado sob demanda.
 *
 * O iframe do Google Maps é pesado e traz cookies de terceiros. Só o
 * montamos depois que a pessoa pede, mantendo a primeira carga leve.
 */
function Mapa() {
  const [ativo, setAtivo] = useState(false);
  const consulta = encodeURIComponent(
    `${ENDERECO.logradouro}, ${ENDERECO.bairro}, ${ENDERECO.cidade} - ${ENDERECO.uf}, ${ENDERECO.cep}`,
  );

  if (!ativo) {
    return (
      <div className="mapa mapa--inativo">
        <MapPin size={26} aria-hidden="true" className="mapa__icone" />
        <p className="mapa__texto">
          O mapa é carregado pelo Google e define cookies próprios. Escolha como
          prefere ver o endereço.
        </p>
        <div className="mapa__acoes">
          <Botao onClick={() => setAtivo(true)} variante="contorno">
            Carregar mapa aqui
          </Botao>
          <Botao href={CONTATO.mapsUrl} externo variante="texto">
            Abrir no Google Maps
          </Botao>
        </div>
      </div>
    );
  }

  return (
    <div className="mapa">
      <iframe
        title={`Mapa com a localização da Clínica Implavita em ${ENDERECO.cidade}`}
        src={`https://www.google.com/maps?q=${consulta}&output=embed&hl=pt-BR`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="mapa__quadro"
      />
    </div>
  );
}

export function ContactSection() {
  const hoje = indiceDeHoje();

  return (
    <Secao id="contato" fundo="papel" rotuladaPor="contato-titulo">
      <TituloSecao
        sobretitulo="Localização e contato"
        titulo={TEXTOS.contato.titulo}
        descricao={TEXTOS.contato.descricao}
        id="contato-titulo"
      />

      <div className="contato">
        <div className="contato__coluna">
          {FACHADA.arquivo ? (
            <figure className="fachada">
              <img
                src={FACHADA.arquivo}
                alt={FACHADA.alt}
                width={FACHADA.largura}
                height={FACHADA.altura}
                loading="lazy"
                decoding="async"
                className="fachada__foto"
              />
              <figcaption className="fachada__legenda">{FACHADA.legenda}</figcaption>
            </figure>
          ) : null}

          <ul className="contato__dados">
            <li>
              <span className="contato__icone" aria-hidden="true">
                <MapPin size={18} />
              </span>
              <div>
                <h3 className="contato__rotulo">Endereço</h3>
                <address className="contato__valor">
                  {ENDERECO.logradouro}
                  <br />
                  {ENDERECO.bairro}, {ENDERECO.cidade} — {ENDERECO.uf}
                  <br />
                  CEP {ENDERECO.cep}
                </address>
                <a
                  className="contato__link"
                  href={CONTATO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir no Google Maps
                  <span className="apenas-leitor"> (abre em nova aba)</span>
                </a>
              </div>
            </li>

            <li>
              <span className="contato__icone" aria-hidden="true">
                <Phone size={18} />
              </span>
              <div>
                <h3 className="contato__rotulo">Telefone e WhatsApp</h3>
                <p className="contato__valor">
                  <a href={`tel:${CONTATO.telefoneLink}`}>{CONTATO.telefoneExibicao}</a>
                </p>
              </div>
            </li>

            <li>
              <span className="contato__icone" aria-hidden="true">
                <Instagram size={18} />
              </span>
              <div>
                <h3 className="contato__rotulo">Instagram</h3>
                <p className="contato__valor">
                  <a href={CONTATO.instagramUrl} target="_blank" rel="noopener noreferrer">
                    {CONTATO.instagramUsuario}
                    <span className="apenas-leitor"> (abre em nova aba)</span>
                  </a>
                </p>
              </div>
            </li>
          </ul>

          <div className="contato__horarios">
            <h3 className="contato__rotulo contato__rotulo--horarios">
              <Clock size={17} aria-hidden="true" />
              Horários de funcionamento
            </h3>

            <ul className="horarios">
              {HORARIOS.map((dia, indice) => (
                <li
                  key={dia.dia}
                  className={`horarios__item ${indice === hoje ? 'horarios__item--hoje' : ''}`}
                >
                  <span className="horarios__dia">
                    {dia.dia}
                    {indice === hoje ? <em className="horarios__marca">hoje</em> : null}
                  </span>
                  <span
                    className={`horarios__faixa ${
                      dia.abertura === null ? 'horarios__faixa--fechado' : ''
                    }`}
                  >
                    {dia.rotulo}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Botao
            href={linkWhatsApp('geral')}
            externo
            variante="whatsapp"
            larguraTotal
            iconeEsquerda={<MessageCircle size={18} />}
            className="contato__whatsapp"
          >
            Conversar pelo WhatsApp
          </Botao>

          <Mapa />
        </div>

        <div className="contato__coluna contato__coluna--formulario">
          <div className="contato__cartao">
            <h3 className="contato__cartao-titulo">Prefere escrever?</h3>
            <p className="contato__cartao-texto">
              Preencha os campos abaixo. Ao final, o site monta a mensagem e abre o
              WhatsApp da clínica para você enviar.
            </p>
            <FormularioContato />
          </div>
        </div>
      </div>
    </Secao>
  );
}
