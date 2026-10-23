import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';

import { ErroApi } from '@/api/cliente';
import { enviarMidia, excluirMidia, listarMidias } from '@/api/conteudo';
import { GradeMidia } from '@/admin/componentes/SeletorImagem';
import { CabecalhoPagina, Carregando, Cartao } from '@/admin/componentes/Pagina';
import type { Midia } from '@compartilhado/esquemas';

export function Biblioteca() {
  const [midias, setMidias] = useState<Midia[] | null>(null);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const entradaRef = useRef<HTMLInputElement>(null);

  const carregar = useCallback(() => {
    listarMidias()
      .then(({ midias: m }) => setMidias(m))
      .catch(() => setErro('Não foi possível carregar a biblioteca.'));
  }, []);

  useEffect(carregar, [carregar]);

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

  async function aoExcluir(midia: Midia) {
    if (!window.confirm('Excluir esta imagem? Não é possível desfazer.')) return;

    setErro('');
    try {
      await excluirMidia(midia.id);
      setMidias((atual) => (atual ?? []).filter((m) => m.id !== midia.id));
    } catch (e) {
      // O servidor recusa excluir imagem em uso e diz onde ela está.
      setErro(e instanceof ErroApi ? e.message : 'Falha ao excluir.');
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Biblioteca de mídia"
        descricao="Todas as imagens enviadas pelo painel. Elas são convertidas para WebP e reduzidas a no máximo 2000px de largura no envio."
        acoes={
          <>
            <input
              ref={entradaRef} type="file" id="bib-enviar" className="apenas-leitor"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => {
                const arquivo = e.target.files?.[0];
                if (arquivo) void aoEnviar(arquivo);
                e.target.value = '';
              }}
            />
            <label htmlFor="bib-enviar" className="botao-adm botao-adm--primario" style={{ cursor: 'pointer' }}>
              <Upload size={15} aria-hidden="true" />
              {enviando ? 'Enviando…' : 'Enviar imagem'}
            </label>
          </>
        }
      />

      {erro ? <p className="aviso-adm aviso-adm--atencao">{erro}</p> : null}

      <Cartao>
        {midias === null ? (
          <Carregando />
        ) : midias.length === 0 ? (
          <p className="contatos__vazio">
            Nenhuma imagem enviada ainda. As fotos originais do site continuam no
            projeto e não aparecem aqui.
          </p>
        ) : (
          <GradeMidia midias={midias} aoExcluir={(m) => void aoExcluir(m)} />
        )}
      </Cartao>
    </>
  );
}
