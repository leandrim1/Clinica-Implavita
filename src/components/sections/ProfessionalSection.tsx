import { ArrowUpRight, MessageCircle } from 'lucide-react';

import { Botao } from '@/components/ui/Botao';
import { linkWhatsApp } from '@/lib/whatsapp';
import type { Profissional } from '@/types';

import './ProfessionalSection.css';

interface PropsProfessionalSection {
  readonly profissional: Profissional;
  /** `inverso` troca o lado da foto, evitando duas seções com o mesmo ritmo. */
  readonly disposicao?: 'padrao' | 'inverso';
  readonly fundoEscuro?: boolean;
  readonly sobretitulo: string;
}

/**
 * Retrato do profissional.
 *
 * Enquanto a clínica não enviar a fotografia oficial, o lugar dela é ocupado
 * por um medalhão tipográfico com as iniciais — um espaço reservado, não uma
 * foto de banco de imagens no lugar de uma pessoa real.
 */
function Retrato({ profissional }: { readonly profissional: Profissional }) {
  if (profissional.foto) {
    return (
      <img
        src={profissional.foto}
        alt={`${profissional.nome}, ${profissional.atuacao.toLowerCase()} na Clínica Implavita`}
        width={880}
        height={1100}
        className="profissional__foto"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div className="profissional__medalhao" role="img" aria-label={`Foto de ${profissional.nome} em breve`}>
      <span className="profissional__iniciais" aria-hidden="true">
        {profissional.iniciais}
      </span>
      <span className="profissional__medalhao-nota" aria-hidden="true">
        Fotografia oficial em breve
      </span>
    </div>
  );
}

export function ProfessionalSection({
  profissional,
  disposicao = 'padrao',
  fundoEscuro = false,
  sobretitulo,
}: PropsProfessionalSection) {
  const tituloId = `profissional-${profissional.id}`;

  return (
    <section
      className={[
        'profissional',
        `profissional--${disposicao}`,
        fundoEscuro ? 'profissional--escuro sobre-escuro' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={tituloId}
    >
      <div className="container profissional__interno">
        <div className="profissional__visual">
          <figure className="profissional__moldura">
            <Retrato profissional={profissional} />
          </figure>
        </div>

        <div className="profissional__conteudo">
          <p className="sobretitulo">{sobretitulo}</p>

          <h2 id={tituloId} className="profissional__nome">
            {profissional.nome}
          </h2>

          <p className="profissional__atuacao">{profissional.atuacao}</p>

          <p className="profissional__descricao">{profissional.descricao}</p>

          {profissional.destaques.length > 0 ? (
            <ul className="profissional__destaques">
              {profissional.destaques.map((destaque) => (
                <li key={destaque}>
                  <strong>{destaque}</strong>
                  <small>Informação fornecida pela clínica</small>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="profissional__acoes">
            <Botao
              href={linkWhatsApp(profissional.contexto)}
              externo
              variante={fundoEscuro ? 'secundario' : 'primario'}
              iconeEsquerda={<MessageCircle size={17} />}
            >
              {profissional.rotuloBotao}
            </Botao>

            <Botao href="#contato" variante="texto" iconeDireita={<ArrowUpRight size={16} />}>
              Ver horários e endereço
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}
