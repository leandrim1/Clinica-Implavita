import { ArrowUpRight, Check } from 'lucide-react';

import { Secao, TituloSecao } from '@/components/ui/Secao';
import { PROFISSIONAIS, TEXTOS, TRATAMENTOS } from '@/config/clinica';
import { linkWhatsApp } from '@/lib/whatsapp';
import type { Tratamento } from '@/types';

import './TreatmentsSection.css';

function nomeDoProfissional(id: string | undefined): string | null {
  if (!id) return null;
  return PROFISSIONAIS.find((profissional) => profissional.id === id)?.nome ?? null;
}

function CartaoTratamento({ tratamento }: { readonly tratamento: Tratamento }) {
  const { nome, resumo, descricao, topicos, icone: Icone, contexto, destaque } = tratamento;
  const responsavel = nomeDoProfissional(tratamento.profissionalId);

  return (
    <article className={`tratamento ${destaque ? 'tratamento--destaque' : ''}`}>
      <div className="tratamento__topo">
        <span className="tratamento__icone" aria-hidden="true">
          <Icone size={destaque ? 26 : 22} />
        </span>
        {responsavel ? <p className="tratamento__responsavel">{responsavel}</p> : null}
      </div>

      <h3 className="tratamento__nome">{nome}</h3>
      <p className="tratamento__resumo">{resumo}</p>
      <p className="tratamento__descricao">{descricao}</p>

      {topicos.length > 0 ? (
        <ul className="tratamento__topicos">
          {topicos.map((topico) => (
            <li key={topico}>
              <Check size={15} aria-hidden="true" />
              <span>{topico}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <a
        className="tratamento__acao"
        href={linkWhatsApp(contexto)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Saber mais pelo WhatsApp</span>
        <ArrowUpRight size={16} aria-hidden="true" />
        <span className="apenas-leitor">sobre {nome} (abre o WhatsApp em nova aba)</span>
      </a>
    </article>
  );
}

export function TreatmentsSection() {
  return (
    <Secao id="tratamentos" fundo="alternado" rotuladaPor="tratamentos-titulo">
      <TituloSecao
        sobretitulo="Tratamentos"
        titulo={TEXTOS.tratamentos.titulo}
        descricao={TEXTOS.tratamentos.subtitulo}
        id="tratamentos-titulo"
      />

      <div className="tratamentos__grade">
        {TRATAMENTOS.map((tratamento) => (
          <CartaoTratamento key={tratamento.id} tratamento={tratamento} />
        ))}
      </div>

      <p className="tratamentos__aviso">
        As informações desta página são de caráter informativo e não substituem uma
        consulta. A indicação de qualquer tratamento depende de avaliação clínica
        individual, e os resultados variam de paciente para paciente.
      </p>
    </Secao>
  );
}
