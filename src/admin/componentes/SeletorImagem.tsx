import { useEffect, useRef, useState } from 'react';
import { ImageOff, Trash2, Upload, X } from 'lucide-react';

import { ErroApi } from '@/api/cliente';
import { enviarMidia, listarMidias } from '@/api/conteudo';
import type { Midia } from '@compartilhado/esquemas';
import { useTravarRolagem } from '@/hooks/useTravarRolagem';

import './SeletorImagem.css';

interface Props {
  readonly rotulo: string;
  readonly valor: string | null;
  readonly aoEscolher: (caminho: string | null, dimensoes?: { largura: number; altura: number }) => void;
  readonly ajuda?: string;
  /** `false` quando a imagem é obrigatória naquele lugar. */
  readonly permiteVazio?: boolean;
  readonly erro?: string | undefined;
}

export function SeletorImagem({
  rotulo, valor, aoEscolher, ajuda, permiteVazio = true, erro,
}: Props) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="seletor">
      <span className="campo-adm__rotulo">{rotulo}</span>

      <div className="seletor__previa">
        {valor ? (
          <img src={valor} alt="" className="seletor__imagem" loading="lazy" />
        ) : (
          <div className="seletor__vazio">
            <ImageOff size={22} aria-hidden="true" />
            <span>Nenhuma imagem</span>
          </div>
        )}

        <div className="seletor__acoes">
          <button type="button" className="botao-adm" onClick={() => setAberto(true)}>
            {valor ? 'Trocar imagem' : 'Escolher imagem'}
          </button>
          {valor && permiteVazio ? (
            <button
              type="button"
              className="botao-adm botao-adm--perigo"
              onClick={() => aoEscolher(null)}
            >
              Remover
            </button>
          ) : null}
        </div>
      </div>

      {ajuda && !erro ? <p className="campo-adm__ajuda">{ajuda}</p> : null}
      {erro ? <p className="campo-adm__erro">{erro}</p> : null}

      {aberto ? (
        <Biblioteca
          aoFechar={() => setAberto(false)}
          aoEscolher={(midia) => {
            aoEscolher(midia.arquivo, { largura: midia.largura, altura: midia.altura });
            setAberto(false);
          }}
        />
      ) : null}
    </div>
  );
}

/** Janela de seleção: lista o que já foi enviado e permite enviar na hora. */
function Biblioteca({
  aoFechar, aoEscolher,
}: {
  readonly aoFechar: () => void;
  readonly aoEscolher: (m: Midia) => void;
}) {
  const [midias, setMidias] = useState<Midia[] | null>(null);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const entradaRef = useRef<HTMLInputElement>(null);
  const fecharRef = useRef<HTMLButtonElement>(null);

  useTravarRolagem(true);

  useEffect(() => {
    fecharRef.current?.focus();

    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aoFechar]);

  useEffect(() => {
    listarMidias()
      .then(({ midias: m }) => setMidias(m))
      .catch(() => setErro('Não foi possível carregar a biblioteca.'));
  }, []);

  async function aoEnviar(arquivo: File) {
    setEnviando(true);
    setErro('');
    try {
      const { midia } = await enviarMidia(arquivo, '');
      setMidias((atual) => [midia, ...(atual ?? [])]);
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : 'Falha ao enviar a imagem.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Biblioteca de imagens">
      <button type="button" className="modal__fundo" onClick={aoFechar} aria-hidden="true" tabIndex={-1} />

      <div className="modal__painel">
        <header className="modal__cabecalho">
          <h2 className="modal__titulo">Biblioteca de imagens</h2>
          <button ref={fecharRef} type="button" className="modal__fechar" onClick={aoFechar} aria-label="Fechar">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="modal__barra">
          <input
            ref={entradaRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="apenas-leitor"
            id="enviar-imagem"
            onChange={(e) => {
              const arquivo = e.target.files?.[0];
              if (arquivo) void aoEnviar(arquivo);
              e.target.value = '';
            }}
          />
          <label htmlFor="enviar-imagem" className="botao-adm botao-adm--primario modal__enviar">
            <Upload size={16} aria-hidden="true" />
            {enviando ? 'Enviando…' : 'Enviar nova imagem'}
          </label>
          <p className="modal__dica">
            JPG, PNG, WebP ou AVIF, até 12 MB. As imagens são convertidas para WebP e
            reduzidas para no máximo 2000px de largura.
          </p>
        </div>

        {erro ? <p className="modal__erro" role="alert">{erro}</p> : null}

        <div className="modal__corpo">
          {midias === null ? (
            <p className="carregando">Carregando imagens…</p>
          ) : midias.length === 0 ? (
            <p className="modal__vazio">
              Nenhuma imagem enviada ainda. Use o botão acima para enviar a primeira.
            </p>
          ) : (
            <ul className="modal__grade">
              {midias.map((m) => (
                <li key={m.id}>
                  <button type="button" className="modal__item" onClick={() => aoEscolher(m)}>
                    <img src={m.arquivo} alt={m.alt} loading="lazy" />
                    <span className="modal__item-info">
                      {m.largura}×{m.altura} · {Math.round(m.bytes / 1024)} KB
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/** Versão com exclusão, usada na página dedicada da biblioteca. */
export function GradeMidia({
  midias, aoExcluir,
}: {
  readonly midias: readonly Midia[];
  readonly aoExcluir: (m: Midia) => void;
}) {
  return (
    <ul className="modal__grade">
      {midias.map((m) => (
        <li key={m.id} className="midia-item">
          <img src={m.arquivo} alt={m.alt} loading="lazy" />
          <div className="midia-item__rodape">
            <span className="modal__item-info">
              {m.largura}×{m.altura} · {Math.round(m.bytes / 1024)} KB
            </span>
            <button
              type="button"
              className="midia-item__excluir"
              onClick={() => aoExcluir(m)}
              aria-label={`Excluir imagem ${m.nomeOriginal}`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
