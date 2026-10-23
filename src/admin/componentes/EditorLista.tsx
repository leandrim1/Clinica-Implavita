import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

import './EditorLista.css';

interface Props<T> {
  readonly itens: readonly T[];
  readonly aoMudar: (itens: T[]) => void;
  readonly criarNovo: () => T;
  readonly titulo: (item: T, indice: number) => string;
  readonly children: (item: T, indice: number, alterar: (mudanca: Partial<T>) => void) => ReactNode;
  readonly rotuloAdicionar?: string;
  readonly maximo?: number;
  readonly minimo?: number;
}

/**
 * Lista editável com ordem controlada.
 *
 * A ordem dos itens é a ordem em que aparecem no site, por isso subir e
 * descer são operações de primeira classe aqui.
 */
export function EditorLista<T>({
  itens, aoMudar, criarNovo, titulo, children,
  rotuloAdicionar = 'Adicionar item', maximo = 20, minimo = 0,
}: Props<T>) {
  const alterarItem = (indice: number) => (mudanca: Partial<T>) => {
    aoMudar(itens.map((item, i) => (i === indice ? { ...item, ...mudanca } : item)));
  };

  const mover = (de: number, para: number) => {
    if (para < 0 || para >= itens.length) return;
    const copia = [...itens];
    const [item] = copia.splice(de, 1);
    if (item !== undefined) copia.splice(para, 0, item);
    aoMudar(copia);
  };

  return (
    <div className="lista-ed">
      {itens.map((item, indice) => (
        <article className="lista-ed__item" key={indice}>
          <header className="lista-ed__cabecalho">
            <h3 className="lista-ed__titulo">{titulo(item, indice)}</h3>

            <div className="lista-ed__controles">
              <button
                type="button" className="lista-ed__botao" onClick={() => mover(indice, indice - 1)}
                disabled={indice === 0} aria-label={`Mover "${titulo(item, indice)}" para cima`}
              >
                <ChevronUp size={16} aria-hidden="true" />
              </button>
              <button
                type="button" className="lista-ed__botao" onClick={() => mover(indice, indice + 1)}
                disabled={indice === itens.length - 1}
                aria-label={`Mover "${titulo(item, indice)}" para baixo`}
              >
                <ChevronDown size={16} aria-hidden="true" />
              </button>
              <button
                type="button" className="lista-ed__botao lista-ed__botao--perigo"
                onClick={() => {
                  if (window.confirm(`Remover "${titulo(item, indice)}"? Esta alteração só vale depois de salvar.`)) {
                    aoMudar(itens.filter((_, i) => i !== indice));
                  }
                }}
                disabled={itens.length <= minimo}
                aria-label={`Remover "${titulo(item, indice)}"`}
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="lista-ed__corpo">{children(item, indice, alterarItem(indice))}</div>
        </article>
      ))}

      {itens.length < maximo ? (
        <button
          type="button" className="botao-adm lista-ed__adicionar"
          onClick={() => aoMudar([...itens, criarNovo()])}
        >
          <Plus size={16} aria-hidden="true" />
          {rotuloAdicionar}
        </button>
      ) : null}
    </div>
  );
}
