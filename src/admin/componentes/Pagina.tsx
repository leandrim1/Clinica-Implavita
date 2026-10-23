import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AlertCircle, Check, Loader2, Save } from 'lucide-react';

import { ErroApi } from '@/api/cliente';
import { salvarBloco } from '@/api/conteudo';
import type { ChaveBloco, ConteudoSite } from '@compartilhado/esquemas';

import './Pagina.css';

export function CabecalhoPagina({
  titulo, descricao, acoes,
}: {
  readonly titulo: string;
  readonly descricao?: string;
  readonly acoes?: ReactNode;
}) {
  return (
    <header className="pag__cabecalho">
      <div>
        <h1 className="pag__titulo">{titulo}</h1>
        {descricao ? <p className="pag__descricao">{descricao}</p> : null}
      </div>
      {acoes ? <div className="pag__acoes">{acoes}</div> : null}
    </header>
  );
}

export function Cartao({
  titulo, descricao, children,
}: {
  readonly titulo?: string;
  readonly descricao?: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="cartao">
      {titulo ? (
        <header className="cartao__cabecalho">
          <h2 className="cartao__titulo">{titulo}</h2>
          {descricao ? <p className="cartao__descricao">{descricao}</p> : null}
        </header>
      ) : null}
      <div className="cartao__corpo">{children}</div>
    </section>
  );
}

export function Grade({ children, colunas = 2 }: { readonly children: ReactNode; readonly colunas?: 1 | 2 | 3 }) {
  return <div className={`grade grade--${colunas}`}>{children}</div>;
}

type Estado = 'parado' | 'salvando' | 'salvo' | 'erro';

/**
 * Edição de um bloco de conteúdo.
 *
 * Mantém um rascunho local, avisa quando há alteração pendente e envia ao
 * servidor — que valida de novo. Erros de validação voltam por campo.
 */
export function useEditorBloco<K extends ChaveBloco>(
  chave: K,
  inicial: ConteudoSite[K] | null,
) {
  const [rascunho, setRascunho] = useState<ConteudoSite[K] | null>(inicial);
  const [salvo, setSalvo] = useState<string>(() => JSON.stringify(inicial));
  const [estado, setEstado] = useState<Estado>('parado');
  const [erro, setErro] = useState('');
  const [errosCampo, setErrosCampo] = useState<Record<string, string>>({});
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (inicial !== null && rascunho === null) {
      setRascunho(inicial);
      setSalvo(JSON.stringify(inicial));
    }
    // Só sincroniza na primeira chegada dos dados.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inicial]);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  const alterado = rascunho !== null && JSON.stringify(rascunho) !== salvo;

  /** Avisa antes de sair da página com alteração não salva. */
  useEffect(() => {
    if (!alterado) return;

    const aviso = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', aviso);
    return () => window.removeEventListener('beforeunload', aviso);
  }, [alterado]);

  const atualizar = useCallback((mudanca: Partial<ConteudoSite[K]> | ConteudoSite[K]) => {
    setRascunho((atual) => {
      if (atual === null) return atual;
      return Array.isArray(mudanca)
        ? (mudanca as ConteudoSite[K])
        : ({ ...atual, ...mudanca } as ConteudoSite[K]);
    });
    setEstado('parado');
    setErro('');
    setErrosCampo({});
  }, []);

  const salvar = useCallback(async () => {
    if (rascunho === null) return;

    setEstado('salvando');
    setErro('');
    setErrosCampo({});

    try {
      const resposta = await salvarBloco(chave, rascunho);
      setSalvo(JSON.stringify(resposta.dados));
      setRascunho(resposta.dados);
      setEstado('salvo');

      window.clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(() => setEstado('parado'), 2600);
    } catch (e) {
      setEstado('erro');

      if (e instanceof ErroApi) {
        setErro(e.message);

        // O servidor devolve os problemas por campo; mostramos junto de cada um.
        if (Array.isArray(e.detalhes)) {
          const mapa: Record<string, string> = {};
          for (const d of e.detalhes as Array<{ campo?: string; mensagem?: string }>) {
            if (d.campo && d.mensagem) mapa[d.campo] = d.mensagem;
          }
          setErrosCampo(mapa);
        }
      } else {
        setErro('Não foi possível salvar. Tente novamente.');
      }
    }
  }, [chave, rascunho]);

  return { rascunho, atualizar, salvar, estado, erro, errosCampo, alterado };
}

export function BarraSalvar({
  estado, erro, alterado, aoSalvar,
}: {
  readonly estado: Estado;
  readonly erro: string;
  readonly alterado: boolean;
  readonly aoSalvar: () => void;
}) {
  return (
    <div className={`barra-salvar ${alterado ? 'barra-salvar--ativa' : ''}`}>
      <div className="barra-salvar__estado" aria-live="polite">
        {estado === 'salvo' ? (
          <span className="barra-salvar__ok">
            <Check size={16} aria-hidden="true" />
            Alterações publicadas no site.
          </span>
        ) : null}
        {estado === 'erro' && erro ? (
          <span className="barra-salvar__erro">
            <AlertCircle size={16} aria-hidden="true" />
            {erro}
          </span>
        ) : null}
        {estado !== 'salvo' && estado !== 'erro' && alterado ? (
          <span className="barra-salvar__pendente">Há alterações não salvas.</span>
        ) : null}
      </div>

      <button
        type="button"
        className="barra-salvar__botao"
        onClick={aoSalvar}
        disabled={!alterado || estado === 'salvando'}
      >
        {estado === 'salvando' ? (
          <Loader2 size={16} className="girando" aria-hidden="true" />
        ) : (
          <Save size={16} aria-hidden="true" />
        )}
        {estado === 'salvando' ? 'Salvando…' : 'Salvar alterações'}
      </button>
    </div>
  );
}

export function Carregando({ texto = 'Carregando…' }: { readonly texto?: string }) {
  return (
    <p className="carregando">
      <Loader2 size={18} className="girando" aria-hidden="true" />
      {texto}
    </p>
  );
}
