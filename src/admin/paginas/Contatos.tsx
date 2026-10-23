import { useCallback, useEffect, useState } from 'react';
import { Archive, ArchiveRestore, MessageCircle, Phone, Trash2 } from 'lucide-react';

import { ErroApi } from '@/api/cliente';
import {
  arquivarContato, excluirContato, listarContatos, marcarContatoLido,
} from '@/api/conteudo';
import { CabecalhoPagina, Carregando, Cartao } from '@/admin/componentes/Pagina';
import type { ContatoRecebido } from '@compartilhado/esquemas';

import './Contatos.css';

const formatador = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

/** Link de WhatsApp para responder, com o número que o visitante informou. */
function linkResposta(contato: ContatoRecebido): string {
  const digitos = contato.telefone.replace(/\D/g, '');
  const numero = digitos.startsWith('55') ? digitos : `55${digitos}`;
  const texto = `Olá, ${contato.nome.split(' ')[0]}! Recebemos sua mensagem pelo site da Clínica Implavita.`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function Contatos() {
  const [contatos, setContatos] = useState<ContatoRecebido[] | null>(null);
  const [arquivados, setArquivados] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(
    (verArquivados: boolean) => {
      setContatos(null);
      listarContatos(verArquivados)
        .then(({ contatos: c }) => setContatos(c))
        .catch((e) => setErro(e instanceof ErroApi ? e.message : 'Falha ao carregar.'));
    },
    [],
  );

  useEffect(() => carregar(arquivados), [arquivados, carregar]);

  async function acao(fn: () => Promise<unknown>) {
    try {
      await fn();
      carregar(arquivados);
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : 'Não foi possível concluir.');
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Contatos"
        descricao="Mensagens enviadas pelo formulário do site. Quem preenche é levado ao WhatsApp, mas a mensagem fica registrada aqui mesmo que a pessoa desista no meio."
        acoes={
          <div className="contatos__abas" role="tablist">
            <button
              type="button" role="tab" aria-selected={!arquivados}
              className={`contatos__aba ${!arquivados ? 'contatos__aba--ativa' : ''}`}
              onClick={() => setArquivados(false)}
            >
              Caixa de entrada
            </button>
            <button
              type="button" role="tab" aria-selected={arquivados}
              className={`contatos__aba ${arquivados ? 'contatos__aba--ativa' : ''}`}
              onClick={() => setArquivados(true)}
            >
              Arquivados
            </button>
          </div>
        }
      />

      {erro ? <p className="aviso-adm aviso-adm--atencao">{erro}</p> : null}

      {contatos === null ? (
        <Carregando texto="Carregando mensagens…" />
      ) : contatos.length === 0 ? (
        <Cartao>
          <p className="contatos__vazio">
            {arquivados ? 'Nenhuma mensagem arquivada.' : 'Nenhuma mensagem nova por aqui.'}
          </p>
        </Cartao>
      ) : (
        <ul className="contatos">
          {contatos.map((c) => (
            <li key={c.id}>
              <article className={`contato ${c.lidoEm ? '' : 'contato--novo'}`}>
                <header className="contato__cabecalho">
                  <div>
                    <h2 className="contato__nome">
                      {c.nome}
                      {!c.lidoEm ? <span className="contato__selo">novo</span> : null}
                    </h2>
                    <p className="contato__meta">
                      {c.assunto} · {formatador.format(new Date(c.criadoEm))}
                    </p>
                  </div>

                  <div className="contato__acoes">
                    <a className="botao-adm" href={linkResposta(c)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={15} aria-hidden="true" />
                      Responder
                    </a>
                    <a className="botao-adm" href={`tel:${c.telefone.replace(/\D/g, '')}`}>
                      <Phone size={15} aria-hidden="true" />
                      <span className="apenas-leitor">Ligar para </span>
                      {c.telefone}
                    </a>
                  </div>
                </header>

                <p className="contato__mensagem">{c.mensagem}</p>

                <footer className="contato__rodape">
                  {!c.lidoEm ? (
                    <button type="button" className="botao-adm"
                      onClick={() => void acao(() => marcarContatoLido(c.id))}>
                      Marcar como lido
                    </button>
                  ) : null}
                  <button type="button" className="botao-adm"
                    onClick={() => void acao(() => arquivarContato(c.id))}>
                    {c.arquivadoEm ? <ArchiveRestore size={15} aria-hidden="true" /> : <Archive size={15} aria-hidden="true" />}
                    {c.arquivadoEm ? 'Desarquivar' : 'Arquivar'}
                  </button>
                  <button
                    type="button" className="botao-adm botao-adm--perigo"
                    onClick={() => {
                      if (window.confirm(`Excluir a mensagem de ${c.nome}? Não é possível desfazer.`)) {
                        void acao(() => excluirContato(c.id));
                      }
                    }}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Excluir
                  </button>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
