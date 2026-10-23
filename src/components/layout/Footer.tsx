import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone } from 'lucide-react';

import { Marca } from '@/components/ui/Marca';
import { CLINICA, CONTATO, ENDERECO, HORARIOS, NAVEGACAO, TEXTOS } from '@/config/clinica';

import './Footer.css';

const ANO = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="rodape sobre-escuro">
      <div className="container">
        <div className="rodape__topo">
          <div className="rodape__marca">
            <Marca tom="claro" />
            <p className="rodape__sobre">
              Clínica de implantes dentários em {CLINICA.cidade}, {CLINICA.uf}.
              Implantes, reabilitação oral, avaliação odontológica e harmonização facial.
            </p>
          </div>

          <nav className="rodape__bloco" aria-label="Navegação do rodapé">
            <h2 className="rodape__titulo">Navegação</h2>
            <ul className="rodape__lista">
              {NAVEGACAO.map((item) => (
                <li key={item.id}>
                  <a href={`/#${item.id}`}>{item.rotulo}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rodape__bloco">
            <h2 className="rodape__titulo">Contato</h2>
            <ul className="rodape__lista rodape__lista--contato">
              <li>
                <a href={`tel:${CONTATO.telefoneLink}`}>
                  <Phone size={15} aria-hidden="true" />
                  {CONTATO.telefoneExibicao}
                </a>
              </li>
              <li>
                <a href={CONTATO.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <Instagram size={15} aria-hidden="true" />
                  {CONTATO.instagramUsuario}
                  <span className="apenas-leitor"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={CONTATO.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin size={15} aria-hidden="true" />
                  Ver no Google Maps
                  <span className="apenas-leitor"> (abre em nova aba)</span>
                </a>
              </li>
            </ul>

            <address className="rodape__endereco">
              {ENDERECO.logradouro}
              <br />
              {ENDERECO.bairro} — {ENDERECO.cidade}/{ENDERECO.uf}
              <br />
              CEP {ENDERECO.cep}
            </address>
          </div>

          <div className="rodape__bloco">
            <h2 className="rodape__titulo">Horários</h2>
            <ul className="rodape__horarios">
              {HORARIOS.map((dia) => (
                <li key={dia.dia}>
                  <span>{dia.dia.replace('-feira', '')}</span>
                  <span className={dia.abertura === null ? 'rodape__fechado' : undefined}>
                    {dia.rotulo}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rodape__base">
          <p className="rodape__direitos">
            © {ANO} {CLINICA.nomeCompleto} — {CLINICA.cidade}/{CLINICA.uf}.
          </p>

          <ul className="rodape__legais">
            <li>
              <Link to="/politica-de-privacidade">Política de Privacidade</Link>
            </li>
            <li>
              <Link to="/informacoes-legais">Informações legais</Link>
            </li>
          </ul>
        </div>

        <p className="rodape__disclaimer">{TEXTOS.avisoRodape}</p>
      </div>
    </footer>
  );
}
