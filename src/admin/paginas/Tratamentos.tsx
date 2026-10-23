import { useEffect, useState } from 'react';

import { buscarConteudoAdmin } from '@/api/conteudo';
import {
  CampoArea, CampoInterruptor, CampoLista, CampoSelecao, CampoTexto,
} from '@/admin/componentes/Campo';
import { EditorLista } from '@/admin/componentes/EditorLista';
import {
  BarraSalvar, CabecalhoPagina, Carregando, Cartao, Grade, useEditorBloco,
} from '@/admin/componentes/Pagina';
import { ICONES_DISPONIVEIS } from '@/config/icones';
import type { Profissional, Tratamento } from '@compartilhado/esquemas';

const CONTEXTOS = [
  { valor: 'agendamento', rotulo: 'Agendar avaliação' },
  { valor: 'implantes', rotulo: 'Implantes dentários' },
  { valor: 'reabilitacao', rotulo: 'Reabilitação oral' },
  { valor: 'avaliacao', rotulo: 'Avaliação odontológica' },
  { valor: 'harmonizacao', rotulo: 'Harmonização facial' },
  { valor: 'geral', rotulo: 'Informações gerais' },
] as const;

const OPCOES_ICONE = ICONES_DISPONIVEIS.map((i) => ({ valor: i, rotulo: i }));

const novo = (): Tratamento => ({
  id: `tratamento-${Date.now()}`,
  nome: '',
  resumo: '',
  descricao: '',
  topicos: [],
  icone: 'Sparkles',
  contexto: 'geral',
  profissionalId: null,
  destaque: false,
});

export function Tratamentos() {
  const [inicial, setInicial] = useState<Tratamento[] | null>(null);
  const [profissionais, setProfissionais] = useState<readonly Profissional[]>([]);
  const ed = useEditorBloco('tratamentos', inicial);

  useEffect(() => {
    buscarConteudoAdmin()
      .then((c) => {
        setInicial([...c.tratamentos]);
        setProfissionais(c.profissionais);
      })
      .catch(() => undefined);
  }, []);

  if (!ed.rascunho) return <Carregando texto="Carregando os tratamentos…" />;

  const opcoesProfissional = [
    { valor: '', rotulo: 'Nenhum' },
    ...profissionais.map((p) => ({ valor: p.id, rotulo: p.nome })),
  ];

  return (
    <>
      <CabecalhoPagina
        titulo="Tratamentos"
        descricao="Os cartões da seção de tratamentos, na ordem em que aparecem. O item em destaque ocupa a largura toda."
      />

      <Cartao>
        <EditorLista
          itens={ed.rascunho}
          aoMudar={(itens) => ed.atualizar(itens)}
          criarNovo={novo}
          titulo={(t, i) => t.nome || `Tratamento ${i + 1}`}
          rotuloAdicionar="Adicionar tratamento"
          maximo={16}
        >
          {(t, i, alterar) => (
            <>
              <Grade>
                <CampoTexto id={`tr-nome-${i}`} rotulo="Nome" valor={t.nome} obrigatorio
                  aoMudar={(v) => alterar({ nome: v })} erro={ed.errosCampo[`${i}.nome`]} />
                <CampoTexto id={`tr-res-${i}`} rotulo="Resumo" valor={t.resumo} obrigatorio
                  aoMudar={(v) => alterar({ resumo: v })} erro={ed.errosCampo[`${i}.resumo`]}
                  ajuda="Uma frase curta, exibida em destaque sob o nome." />
              </Grade>

              <CampoArea id={`tr-desc-${i}`} rotulo="Descrição" valor={t.descricao} linhas={3}
                aoMudar={(v) => alterar({ descricao: v })} erro={ed.errosCampo[`${i}.descricao`]} maximo={800} />

              <CampoLista id={`tr-top-${i}`} rotulo="Tópicos" valores={t.topicos}
                aoMudar={(v) => alterar({ topicos: v })} maximoItens={8}
                ajuda="Itens curtos, com marcador de confirmação." />

              <Grade colunas={3}>
                <CampoSelecao id={`tr-ico-${i}`} rotulo="Ícone" valor={t.icone}
                  aoMudar={(v) => alterar({ icone: v })} opcoes={OPCOES_ICONE} />
                <CampoSelecao id={`tr-ctx-${i}`} rotulo="Assunto do WhatsApp" valor={t.contexto}
                  aoMudar={(v) => alterar({ contexto: v })} opcoes={CONTEXTOS} />
                <CampoSelecao id={`tr-pro-${i}`} rotulo="Profissional responsável"
                  valor={t.profissionalId ?? ''}
                  aoMudar={(v) => alterar({ profissionalId: v || null })}
                  opcoes={opcoesProfissional} />
              </Grade>

              <CampoInterruptor id={`tr-dest-${i}`} rotulo="Exibir em destaque" valor={t.destaque}
                aoMudar={(v) => alterar({ destaque: v })}
                ajuda="O cartão em destaque ganha fundo escuro e ocupa a largura toda." />
            </>
          )}
        </EditorLista>
      </Cartao>

      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}
