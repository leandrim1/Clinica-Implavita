import { CalendarCheck } from 'lucide-react';

import { Botao } from '@/components/ui/Botao';
import { Secao, TituloSecao } from '@/components/ui/Secao';
import { ETAPAS_AGENDAMENTO } from '@/config/clinica';
import { linkWhatsApp } from '@/lib/whatsapp';

import './AppointmentSection.css';

export function AppointmentSection() {
  return (
    <Secao fundo="petroleo" rotuladaPor="agendar-titulo">
      <div className="agendar">
        <TituloSecao
          sobretitulo="Como agendar"
          titulo="Três passos até a sua avaliação"
          descricao="O agendamento é feito diretamente com a equipe da clínica, pelo WhatsApp ou por telefone."
          id="agendar-titulo"
        />

        <ol className="agendar__etapas">
          {ETAPAS_AGENDAMENTO.map(({ numero, titulo, descricao, icone: Icone }) => (
            <li key={numero} className="agendar__etapa">
              <div className="agendar__etapa-topo">
                <span className="agendar__numero">{numero}</span>
                <Icone size={20} className="agendar__icone" aria-hidden="true" />
              </div>
              <h3 className="agendar__etapa-titulo">{titulo}</h3>
              <p className="agendar__etapa-texto">{descricao}</p>
            </li>
          ))}
        </ol>

        <div className="agendar__rodape">
          <Botao
            href={linkWhatsApp('agendamento')}
            externo
            variante="secundario"
            tamanho="lg"
            iconeEsquerda={<CalendarCheck size={18} />}
          >
            Agendar avaliação pelo WhatsApp
          </Botao>

          <p className="agendar__observacao">
            O site não confirma consultas automaticamente: a data é combinada com a
            equipe durante a conversa.
          </p>
        </div>
      </div>
    </Secao>
  );
}
