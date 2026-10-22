import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

import './PaginaTexto.css';

interface PropsPaginaTexto {
  readonly titulo: string;
  readonly introducao: string;
  readonly children: ReactNode;
  /** Aviso de conteúdo pendente de revisão pela clínica. */
  readonly revisaoPendente?: boolean;
}

export function PaginaTexto({
  titulo,
  introducao,
  children,
  revisaoPendente = true,
}: PropsPaginaTexto) {
  return (
    <article className="pagina-texto">
      <div className="container container-estreito">
        <Link to="/" className="pagina-texto__voltar">
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar para a página inicial
        </Link>

        <h1 className="pagina-texto__titulo">{titulo}</h1>
        <p className="pagina-texto__introducao">{introducao}</p>

        {revisaoPendente ? (
          <aside className="pagina-texto__revisao" role="note">
            <FileText size={17} aria-hidden="true" />
            <p>
              <strong>Conteúdo inicial, pendente de revisão.</strong> Este texto foi
              preparado como ponto de partida e deve ser revisado e aprovado pela
              clínica — e, quando necessário, por assessoria jurídica — antes da
              publicação definitiva.
            </p>
          </aside>
        ) : null}

        <div className="pagina-texto__corpo">{children}</div>
      </div>
    </article>
  );
}
