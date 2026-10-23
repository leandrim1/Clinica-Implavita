import { useEffect, useState } from 'react';

import { buscarConteudoAdmin } from '@/api/conteudo';
import { CampoArea, CampoTexto } from '@/admin/componentes/Campo';
import {
  BarraSalvar, CabecalhoPagina, Carregando, Cartao, Grade, useEditorBloco,
} from '@/admin/componentes/Pagina';
import type { Textos as TipoTextos } from '@compartilhado/esquemas';

export function Textos() {
  const [inicial, setInicial] = useState<TipoTextos | null>(null);
  const { rascunho, atualizar, salvar, estado, erro, errosCampo, alterado } =
    useEditorBloco('textos', inicial);

  useEffect(() => {
    buscarConteudoAdmin()
      .then((c) => setInicial(c.textos))
      .catch(() => undefined);
  }, []);

  if (!rascunho) return <Carregando texto="Carregando os textos do site…" />;

  /** Altera um grupo aninhado sem perder os demais campos dele. */
  const mudarGrupo = <K extends keyof TipoTextos>(
    grupo: K,
    campo: keyof TipoTextos[K],
    valor: string,
  ) => atualizar({ [grupo]: { ...(rascunho[grupo] as object), [campo]: valor } } as Partial<TipoTextos>);

  return (
    <>
      <CabecalhoPagina
        titulo="Textos do site"
        descricao="Títulos e textos de cada seção da página inicial. As alterações vão ao ar assim que você salvar."
      />

      <Cartao titulo="Primeira dobra" descricao="O primeiro bloco que o visitante vê.">
        <Grade colunas={1}>
          <CampoTexto
            id="hero-etiqueta" rotulo="Etiqueta" valor={rascunho.hero.etiqueta}
            aoMudar={(v) => mudarGrupo('hero', 'etiqueta', v)}
            erro={errosCampo['hero.etiqueta']} maximo={220}
            ajuda="Texto pequeno acima do título."
          />
          <CampoTexto
            id="hero-titulo" rotulo="Título" valor={rascunho.hero.titulo}
            aoMudar={(v) => mudarGrupo('hero', 'titulo', v)}
            erro={errosCampo['hero.titulo']} maximo={220}
          />
          <CampoArea
            id="hero-texto" rotulo="Texto de apoio" valor={rascunho.hero.texto}
            aoMudar={(v) => mudarGrupo('hero', 'texto', v)}
            erro={errosCampo['hero.texto']} maximo={400} linhas={3}
          />
        </Grade>
      </Cartao>

      <Cartao titulo="Tratamentos">
        <Grade colunas={1}>
          <CampoTexto
            id="trat-titulo" rotulo="Título da seção" valor={rascunho.tratamentos.titulo}
            aoMudar={(v) => mudarGrupo('tratamentos', 'titulo', v)}
            erro={errosCampo['tratamentos.titulo']} maximo={220}
          />
          <CampoArea
            id="trat-sub" rotulo="Subtítulo" valor={rascunho.tratamentos.subtitulo}
            aoMudar={(v) => mudarGrupo('tratamentos', 'subtitulo', v)}
            erro={errosCampo['tratamentos.subtitulo']} maximo={500} linhas={3}
          />
        </Grade>
      </Cartao>

      <Cartao titulo="A Clínica">
        <Grade colunas={1}>
          <CampoTexto
            id="cli-titulo" rotulo="Título da seção" valor={rascunho.clinica.titulo}
            aoMudar={(v) => mudarGrupo('clinica', 'titulo', v)}
            erro={errosCampo['clinica.titulo']} maximo={220}
          />
          <CampoArea
            id="cli-desc" rotulo="Descrição" valor={rascunho.clinica.descricao}
            aoMudar={(v) => mudarGrupo('clinica', 'descricao', v)}
            erro={errosCampo['clinica.descricao']} maximo={600} linhas={3}
          />
        </Grade>
      </Cartao>

      <Cartao titulo="Como agendar">
        <Grade colunas={1}>
          <CampoTexto
            id="ag-titulo" rotulo="Título da seção" valor={rascunho.agendamento.titulo}
            aoMudar={(v) => mudarGrupo('agendamento', 'titulo', v)}
            erro={errosCampo['agendamento.titulo']} maximo={220}
          />
          <CampoArea
            id="ag-desc" rotulo="Descrição" valor={rascunho.agendamento.descricao}
            aoMudar={(v) => mudarGrupo('agendamento', 'descricao', v)}
            erro={errosCampo['agendamento.descricao']} maximo={500} linhas={2}
          />
          <CampoArea
            id="ag-obs" rotulo="Observação" valor={rascunho.agendamento.observacao}
            aoMudar={(v) => mudarGrupo('agendamento', 'observacao', v)}
            erro={errosCampo['agendamento.observacao']} maximo={500} linhas={2}
            ajuda="Deixa claro que o site não confirma consultas sozinho."
          />
        </Grade>
      </Cartao>

      <Cartao titulo="Avaliações">
        <Grade colunas={1}>
          <CampoTexto
            id="av-titulo" rotulo="Título da seção" valor={rascunho.avaliacoes.titulo}
            aoMudar={(v) => mudarGrupo('avaliacoes', 'titulo', v)}
            erro={errosCampo['avaliacoes.titulo']} maximo={220}
          />
          <CampoArea
            id="av-texto" rotulo="Texto" valor={rascunho.avaliacoes.texto}
            aoMudar={(v) => mudarGrupo('avaliacoes', 'texto', v)}
            erro={errosCampo['avaliacoes.texto']} maximo={800} linhas={4}
          />
        </Grade>
      </Cartao>

      <Cartao titulo="Contato">
        <Grade colunas={1}>
          <CampoTexto
            id="ct-titulo" rotulo="Título da seção" valor={rascunho.contato.titulo}
            aoMudar={(v) => mudarGrupo('contato', 'titulo', v)}
            erro={errosCampo['contato.titulo']} maximo={220}
          />
          <CampoArea
            id="ct-desc" rotulo="Descrição" valor={rascunho.contato.descricao}
            aoMudar={(v) => mudarGrupo('contato', 'descricao', v)}
            erro={errosCampo['contato.descricao']} maximo={500} linhas={2}
          />
        </Grade>
      </Cartao>

      <Cartao
        titulo="Avisos legais"
        descricao="Textos exigidos pela comunicação em odontologia. Altere com cuidado e, em caso de dúvida, consulte a assessoria da clínica."
      >
        <Grade colunas={1}>
          <CampoArea
            id="av-casos" rotulo="Aviso dos casos clínicos" valor={rascunho.avisoCasos}
            aoMudar={(v) => atualizar({ avisoCasos: v })}
            erro={errosCampo['avisoCasos']} maximo={600} linhas={3}
          />
          <CampoArea
            id="av-trat" rotulo="Aviso da seção de tratamentos" valor={rascunho.avisoTratamentos}
            aoMudar={(v) => atualizar({ avisoTratamentos: v })}
            erro={errosCampo['avisoTratamentos']} maximo={600} linhas={3}
          />
          <CampoArea
            id="av-rod" rotulo="Aviso do rodapé" valor={rascunho.avisoRodape}
            aoMudar={(v) => atualizar({ avisoRodape: v })}
            erro={errosCampo['avisoRodape']} maximo={600} linhas={3}
          />
        </Grade>
      </Cartao>

      <BarraSalvar estado={estado} erro={erro} alterado={alterado} aoSalvar={() => void salvar()} />
    </>
  );
}
