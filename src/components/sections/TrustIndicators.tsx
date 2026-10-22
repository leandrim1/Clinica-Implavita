import { INDICADORES } from '@/config/clinica';

import './TrustIndicators.css';

/**
 * Faixa compacta de indicadores.
 *
 * São números informados pela clínica, exibidos de forma estática. Não há
 * contadores animados nem sugestão de atualização em tempo real — cada item
 * carrega a origem do dado.
 */
export function TrustIndicators() {
  return (
    <section className="indicadores" aria-label="Informações sobre a clínica">
      <div className="container">
        <ul className="indicadores__lista">
          {INDICADORES.map(({ id, valor, rotulo, observacao, icone: Icone }) => (
            <li key={id} className="indicadores__item">
              <Icone className="indicadores__icone" size={19} aria-hidden="true" />
              <p className="indicadores__valor">{valor}</p>
              <p className="indicadores__rotulo">{rotulo}</p>
              <p className="indicadores__obs">{observacao}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
