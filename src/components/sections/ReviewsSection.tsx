import { ArrowUpRight, Star } from 'lucide-react';

import { Secao } from '@/components/ui/Secao';
import { CONTATO, REPUTACAO } from '@/config/clinica';

import './ReviewsSection.css';

export function ReviewsSection() {
  return (
    <Secao id="avaliacoes" fundo="alternado" rotuladaPor="avaliacoes-titulo">
      <div className="avaliacoes">
        <div className="avaliacoes__conteudo">
          <p className="sobretitulo">Avaliações</p>

          <h2 id="avaliacoes-titulo" className="avaliacoes__titulo">
            O que dizem sobre a Implavita
          </h2>

          <p className="avaliacoes__texto">
            A clínica informa reputação de {REPUTACAO.nota} estrelas no Google, com{' '}
            {REPUTACAO.totalAvaliacoes} avaliações recebidas. Em vez de reproduzir
            depoimentos aqui, preferimos levar você direto à fonte: leia as avaliações
            completas, com os nomes de quem escreveu, na própria página do Google.
          </p>

          <a
            className="avaliacoes__link"
            href={CONTATO.avaliacoesUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Ler as avaliações no Google</span>
            <ArrowUpRight size={17} aria-hidden="true" />
            <span className="apenas-leitor">(abre em nova aba)</span>
          </a>
        </div>

        <aside className="avaliacoes__painel" aria-label="Resumo das avaliações informadas">
          <p className="avaliacoes__nota">{REPUTACAO.nota}</p>

          <p className="avaliacoes__estrelas" aria-hidden="true">
            {Array.from({ length: 5 }, (_, indice) => (
              <Star key={indice} size={19} />
            ))}
          </p>

          <p className="avaliacoes__contagem">
            {REPUTACAO.totalAvaliacoes} avaliações no Google
          </p>

          <p className="avaliacoes__origem">
            Números informados pela clínica. Não são atualizados em tempo real por este
            site — consulte o Google para os dados do momento.
          </p>
        </aside>
      </div>
    </Secao>
  );
}
