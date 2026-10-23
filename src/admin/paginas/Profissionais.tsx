import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

import { buscarConteudoAdmin } from '@/api/conteudo';
import { CampoArea, CampoLista, CampoSelecao, CampoTexto } from '@/admin/componentes/Campo';
import { EditorLista } from '@/admin/componentes/EditorLista';
import {
  BarraSalvar, CabecalhoPagina, Carregando, Cartao, Grade, useEditorBloco,
} from '@/admin/componentes/Pagina';
import { SeletorImagem } from '@/admin/componentes/SeletorImagem';
import type { Profissional } from '@compartilhado/esquemas';

const CONTEXTOS = [
  { valor: 'agendamento', rotulo: 'Agendar avaliação' },
  { valor: 'implantes', rotulo: 'Implantes dentários' },
  { valor: 'reabilitacao', rotulo: 'Reabilitação oral' },
  { valor: 'avaliacao', rotulo: 'Avaliação odontológica' },
  { valor: 'harmonizacao', rotulo: 'Harmonização facial' },
  { valor: 'geral', rotulo: 'Informações gerais' },
] as const;

const novo = (): Profissional => ({
  id: `profissional-${Date.now()}`,
  nome: '',
  atuacao: '',
  cro: '',
  descricao: '',
  destaques: [],
  foto: null,
  iniciais: '',
  contexto: 'agendamento',
  rotuloBotao: 'Agendar avaliação',
});

export function Profissionais() {
  const [inicial, setInicial] = useState<Profissional[] | null>(null);
  const ed = useEditorBloco('profissionais', inicial);

  useEffect(() => {
    buscarConteudoAdmin()
      .then((c) => setInicial([...c.profissionais]))
      .catch(() => undefined);
  }, []);

  if (!ed.rascunho) return <Carregando texto="Carregando os profissionais…" />;

  return (
    <>
      <CabecalhoPagina
        titulo="Profissionais"
        descricao="Cada profissional ganha uma seção própria na página inicial, na ordem definida aqui."
      />

      <p className="aviso-adm aviso-adm--atencao">
        <Info size={15} aria-hidden="true" />
        <span>
          Publique apenas informações que a clínica possa comprovar. Não acrescente
          especializações, titulações, prêmios ou tempo de experiência sem confirmação —
          o Código de Ética Odontológica trata disso na publicidade da clínica.
        </span>
      </p>

      <Cartao>
        <EditorLista
          itens={ed.rascunho}
          aoMudar={(itens) => ed.atualizar(itens)}
          criarNovo={novo}
          titulo={(p, i) => p.nome || `Profissional ${i + 1}`}
          rotuloAdicionar="Adicionar profissional"
          maximo={12}
        >
          {(p, i, alterar) => (
            <>
              <Grade>
                <CampoTexto id={`pr-nome-${i}`} rotulo="Nome" valor={p.nome} obrigatorio
                  aoMudar={(v) => alterar({ nome: v })} erro={ed.errosCampo[`${i}.nome`]}
                  ajuda="Como aparece no site, com o título. Ex.: Dr. Carlos Adolfo Silva" />
                <CampoTexto id={`pr-atua-${i}`} rotulo="Atuação" valor={p.atuacao} obrigatorio
                  aoMudar={(v) => alterar({ atuacao: v })} erro={ed.errosCampo[`${i}.atuacao`]} />
                <CampoTexto id={`pr-cro-${i}`} rotulo="CRO" valor={p.cro}
                  aoMudar={(v) => alterar({ cro: v })} erro={ed.errosCampo[`${i}.cro`]}
                  ajuda="Ex.: CRO-MG 3917. Deixe vazio se ainda não foi confirmado." />
                <CampoTexto id={`pr-ini-${i}`} rotulo="Iniciais" valor={p.iniciais} maximo={3}
                  aoMudar={(v) => alterar({ iniciais: v.toUpperCase() })} erro={ed.errosCampo[`${i}.iniciais`]}
                  ajuda="Usadas no lugar da foto, quando não houver uma." />
              </Grade>

              <CampoArea id={`pr-desc-${i}`} rotulo="Descrição" valor={p.descricao} linhas={4}
                aoMudar={(v) => alterar({ descricao: v })} erro={ed.errosCampo[`${i}.descricao`]} maximo={1200} />

              <CampoLista id={`pr-dest-${i}`} rotulo="Destaques" valores={p.destaques}
                aoMudar={(v) => alterar({ destaques: v })} maximoItens={6}
                ajuda="Aparecem em caixa própria. Cada um deve ser verificável." />

              <SeletorImagem
                rotulo="Fotografia" valor={p.foto}
                aoEscolher={(caminho) => alterar({ foto: caminho })}
                ajuda="Proporção vertical (4:5) funciona melhor. Sem foto, o site mostra as iniciais."
              />

              <Grade>
                <CampoSelecao id={`pr-ctx-${i}`} rotulo="Assunto do WhatsApp" valor={p.contexto}
                  aoMudar={(v) => alterar({ contexto: v })} opcoes={CONTEXTOS}
                  ajuda="Define a mensagem que já vai preenchida na conversa." />
                <CampoTexto id={`pr-bot-${i}`} rotulo="Texto do botão" valor={p.rotuloBotao}
                  aoMudar={(v) => alterar({ rotuloBotao: v })} erro={ed.errosCampo[`${i}.rotuloBotao`]} />
              </Grade>
            </>
          )}
        </EditorLista>
      </Cartao>

      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}
