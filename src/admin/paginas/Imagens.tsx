import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

import { buscarConteudoAdmin } from '@/api/conteudo';
import {
  CampoArea, CampoInterruptor, CampoSelecao, CampoTexto,
} from '@/admin/componentes/Campo';
import { EditorLista } from '@/admin/componentes/EditorLista';
import {
  BarraSalvar, CabecalhoPagina, Carregando, Cartao, Grade, useEditorBloco,
} from '@/admin/componentes/Pagina';
import { SeletorImagem } from '@/admin/componentes/SeletorImagem';
import { ICONES_DISPONIVEIS } from '@/config/icones';
import type {
  Ambiente, CasoClinico, ConteudoSite, FotoClinica,
} from '@compartilhado/esquemas';

const OPCOES_ICONE = ICONES_DISPONIVEIS.map((i) => ({ valor: i, rotulo: i }));

export function Imagens() {
  const [dados, setDados] = useState<ConteudoSite | null>(null);

  useEffect(() => {
    buscarConteudoAdmin().then(setDados).catch(() => undefined);
  }, []);

  if (!dados) return <Carregando texto="Carregando as imagens…" />;

  return (
    <>
      <CabecalhoPagina
        titulo="Imagens do site"
        descricao="Logotipo, primeira dobra, fachada, ambientes e registros clínicos. Para enviar arquivos novos, use a biblioteca de mídia."
      />
      <Marca logo={dados.logo} hero={dados.heroImagem} fachada={dados.fachada} />
      <Ambientes inicial={[...dados.ambientes]} />
      <Galeria inicial={[...dados.fotosClinica]} />
      <Casos inicial={[...dados.casosClinicos]} />
    </>
  );
}

function Marca({
  logo, hero, fachada,
}: {
  readonly logo: ConteudoSite['logo'];
  readonly hero: ConteudoSite['heroImagem'];
  readonly fachada: ConteudoSite['fachada'];
}) {
  const edLogo = useEditorBloco('logo', logo);
  const edHero = useEditorBloco('heroImagem', hero);
  const edFachada = useEditorBloco('fachada', fachada);

  if (!edLogo.rascunho || !edHero.rascunho || !edFachada.rascunho) return null;

  const alterado = edLogo.alterado || edHero.alterado || edFachada.alterado;
  const erro = edLogo.erro || edHero.erro || edFachada.erro;
  const estado =
    [edLogo, edHero, edFachada].find((e) => e.estado === 'salvando')?.estado ??
    [edLogo, edHero, edFachada].find((e) => e.estado === 'erro')?.estado ??
    (edLogo.estado === 'salvo' || edHero.estado === 'salvo' || edFachada.estado === 'salvo'
      ? 'salvo'
      : 'parado');

  const salvarTodos = async () => {
    if (edLogo.alterado) await edLogo.salvar();
    if (edHero.alterado) await edHero.salvar();
    if (edFachada.alterado) await edFachada.salvar();
  };

  return (
    <>
      <Cartao titulo="Logotipo" descricao="Sem arquivo, o site mostra o letreiro tipográfico com o nome da clínica.">
        <SeletorImagem
          rotulo="Arquivo do logotipo" valor={edLogo.rascunho.arquivo}
          aoEscolher={(arquivo, dim) =>
            edLogo.atualizar({ arquivo, ...(dim ? { largura: dim.largura, altura: dim.altura } : {}) })
          }
          ajuda="Prefira fundo transparente (PNG ou SVG convertido)."
        />
        <CampoTexto id="logo-alt" rotulo="Texto alternativo" valor={edLogo.rascunho.alt}
          aoMudar={(v) => edLogo.atualizar({ alt: v })} ajuda="Descreve a imagem para leitores de tela." />
      </Cartao>

      <Cartao titulo="Imagem da primeira dobra" descricao="Sem imagem, o site exibe a composição gráfica da marca.">
        <SeletorImagem
          rotulo="Imagem principal" valor={edHero.rascunho.arquivo}
          aoEscolher={(arquivo, dim) =>
            edHero.atualizar({ arquivo, ...(dim ? { largura: dim.largura, altura: dim.altura } : {}) })
          }
          ajuda="Proporção vertical (4:5) é a que melhor preenche o espaço."
        />
        <CampoTexto id="hero-alt" rotulo="Texto alternativo" valor={edHero.rascunho.alt}
          aoMudar={(v) => edHero.atualizar({ alt: v })} />
      </Cartao>

      <Cartao titulo="Fachada" descricao="Aparece junto ao endereço, para ajudar quem vai à clínica pela primeira vez.">
        <SeletorImagem
          rotulo="Foto da fachada" valor={edFachada.rascunho.arquivo}
          aoEscolher={(arquivo, dim) =>
            edFachada.atualizar({ arquivo, ...(dim ? { largura: dim.largura, altura: dim.altura } : {}) })
          }
        />
        <Grade>
          <CampoTexto id="fach-alt" rotulo="Texto alternativo" valor={edFachada.rascunho.alt}
            aoMudar={(v) => edFachada.atualizar({ alt: v })} />
          <CampoTexto id="fach-leg" rotulo="Legenda" valor={edFachada.rascunho.legenda}
            aoMudar={(v) => edFachada.atualizar({ legenda: v })} />
        </Grade>
      </Cartao>

      <BarraSalvar estado={estado} erro={erro} alterado={alterado} aoSalvar={() => void salvarTodos()} />
    </>
  );
}

function Ambientes({ inicial }: { readonly inicial: Ambiente[] }) {
  const ed = useEditorBloco('ambientes', inicial);
  if (!ed.rascunho) return null;

  const novo = (): Ambiente => ({
    id: `ambiente-${Date.now()}`, titulo: '', descricao: '',
    icone: 'Armchair', foto: null, largura: 1400, altura: 1050,
  });

  return (
    <>
      <Cartao titulo="Ambientes em destaque" descricao="Os cartões com título e descrição na seção A Clínica.">
        <EditorLista
          itens={ed.rascunho} aoMudar={(i) => ed.atualizar(i)} criarNovo={novo}
          titulo={(a, i) => a.titulo || `Ambiente ${i + 1}`}
          rotuloAdicionar="Adicionar ambiente" maximo={9}
        >
          {(a, i, alterar) => (
            <>
              <Grade>
                <CampoTexto id={`am-tit-${i}`} rotulo="Título" valor={a.titulo} obrigatorio
                  aoMudar={(v) => alterar({ titulo: v })} erro={ed.errosCampo[`${i}.titulo`]} />
                <CampoSelecao id={`am-ico-${i}`} rotulo="Ícone (sem foto)" valor={a.icone}
                  aoMudar={(v) => alterar({ icone: v })} opcoes={OPCOES_ICONE} />
              </Grade>
              <CampoArea id={`am-desc-${i}`} rotulo="Descrição" valor={a.descricao} linhas={2}
                aoMudar={(v) => alterar({ descricao: v })} erro={ed.errosCampo[`${i}.descricao`]} maximo={400} />
              <SeletorImagem
                rotulo="Foto do ambiente" valor={a.foto}
                aoEscolher={(foto, dim) =>
                  alterar({ foto, ...(dim ? { largura: dim.largura, altura: dim.altura } : {}) })
                }
                ajuda="Sem foto, o site mostra um painel identificado como ilustrativo."
              />
            </>
          )}
        </EditorLista>
      </Cartao>
      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}

function Galeria({ inicial }: { readonly inicial: FotoClinica[] }) {
  const ed = useEditorBloco('fotosClinica', inicial);
  if (!ed.rascunho) return null;

  const novo = (): FotoClinica => ({
    id: `foto-${Date.now()}`, arquivo: '', largura: 1400, altura: 1050,
    descricao: '', larga: false,
  });

  const largas = ed.rascunho.filter((f) => f.larga).length;
  const unidades = ed.rascunho.length + largas;

  return (
    <>
      <Cartao
        titulo="Galeria de ambientes"
        descricao="A grade tem 4 colunas. Uma foto larga ocupa 2. Para as fileiras fecharem sem vão, o total de colunas precisa ser múltiplo de 4."
      >
        <p className={`aviso-adm ${unidades % 4 === 0 ? 'aviso-adm--info' : 'aviso-adm--atencao'}`}>
          <span>
            {ed.rascunho.length} foto(s), {largas} larga(s) → <strong>{unidades} colunas</strong>.{' '}
            {unidades % 4 === 0
              ? 'As fileiras fecham certinho.'
              : `Faltam ${4 - (unidades % 4)} coluna(s) para a última fileira fechar.`}
          </span>
        </p>

        <EditorLista
          itens={ed.rascunho} aoMudar={(i) => ed.atualizar(i)} criarNovo={novo}
          titulo={(f, i) => f.descricao.slice(0, 48) || `Foto ${i + 1}`}
          rotuloAdicionar="Adicionar foto" maximo={40}
        >
          {(f, i, alterar) => (
            <>
              <SeletorImagem
                rotulo="Imagem" valor={f.arquivo || null} permiteVazio={false}
                erro={ed.errosCampo[`${i}.arquivo`]}
                aoEscolher={(arquivo, dim) =>
                  alterar({ arquivo: arquivo ?? '', ...(dim ? { largura: dim.largura, altura: dim.altura } : {}) })
                }
              />
              <CampoArea id={`fo-desc-${i}`} rotulo="Descrição" valor={f.descricao} linhas={2}
                aoMudar={(v) => alterar({ descricao: v })} erro={ed.errosCampo[`${i}.descricao`]}
                ajuda="Vira o texto alternativo da imagem. Descreva o que aparece." maximo={300} />
              <CampoInterruptor id={`fo-larga-${i}`} rotulo="Ocupar duas colunas" valor={f.larga}
                aoMudar={(v) => alterar({ larga: v })} />
            </>
          )}
        </EditorLista>
      </Cartao>
      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}

function Casos({ inicial }: { readonly inicial: CasoClinico[] }) {
  const ed = useEditorBloco('casosClinicos', inicial);
  if (!ed.rascunho) return null;

  const novo = (): CasoClinico => ({
    id: `caso-${Date.now()}`, arquivo: '', largura: 1100, altura: 1100,
    descricao: '', categoria: 'implantes', identificavel: false, autorizado: false,
  });

  const noAr = ed.rascunho.filter((c) => !c.identificavel || c.autorizado).length;
  const travados = ed.rascunho.filter((c) => c.identificavel && !c.autorizado).length;

  return (
    <>
      <Cartao
        titulo="Casos clínicos"
        descricao={`${noAr} no ar · ${travados} aguardando autorização`}
      >
        <p className="aviso-adm aviso-adm--atencao">
          <ShieldAlert size={15} aria-hidden="true" />
          <span>
            Marque <strong>“o paciente pode ser reconhecido”</strong> sempre que o rosto
            aparecer. Essas imagens só vão ao ar depois que a clínica tiver em mãos a{' '}
            <strong>autorização de uso de imagem assinada pelo paciente</strong> e marcar
            a segunda chave. Publicar sem autorização contraria o Código de Ética
            Odontológica e a LGPD, e o risco é da clínica.
          </span>
        </p>

        <EditorLista
          itens={ed.rascunho} aoMudar={(i) => ed.atualizar(i)} criarNovo={novo}
          titulo={(c, i) => c.descricao.slice(0, 44) || `Caso ${i + 1}`}
          rotuloAdicionar="Adicionar caso" maximo={80}
        >
          {(c, i, alterar) => (
            <>
              <SeletorImagem
                rotulo="Imagem" valor={c.arquivo || null} permiteVazio={false}
                erro={ed.errosCampo[`${i}.arquivo`]}
                aoEscolher={(arquivo, dim) =>
                  alterar({ arquivo: arquivo ?? '', ...(dim ? { largura: dim.largura, altura: dim.altura } : {}) })
                }
              />
              <CampoArea id={`ca-desc-${i}`} rotulo="Descrição" valor={c.descricao} linhas={2}
                aoMudar={(v) => alterar({ descricao: v })} erro={ed.errosCampo[`${i}.descricao`]} maximo={300} />
              <CampoSelecao id={`ca-cat-${i}`} rotulo="Categoria" valor={c.categoria}
                aoMudar={(v) => alterar({ categoria: v })}
                opcoes={[
                  { valor: 'implantes', rotulo: 'Implantes' },
                  { valor: 'reabilitacao', rotulo: 'Reabilitação' },
                  { valor: 'harmonizacao', rotulo: 'Harmonização facial' },
                ]} />

              <div className={`trava ${c.identificavel && !c.autorizado ? 'trava--ativa' : ''}`}>
                <CampoInterruptor
                  id={`ca-ident-${i}`} rotulo="O paciente pode ser reconhecido"
                  valor={c.identificavel}
                  aoMudar={(v) => alterar({ identificavel: v })}
                  ajuda="Marque se o rosto aparece, mesmo que parcialmente."
                />
                {c.identificavel ? (
                  <CampoInterruptor
                    id={`ca-aut-${i}`} rotulo="Autorização de uso de imagem assinada"
                    valor={c.autorizado}
                    aoMudar={(v) => alterar({ autorizado: v })}
                    ajuda="Só marque com o documento assinado em mãos. Sem isso, a imagem não vai ao ar."
                  />
                ) : null}
                {c.identificavel && !c.autorizado ? (
                  <p className="trava__aviso">Esta imagem está fora do ar.</p>
                ) : null}
              </div>
            </>
          )}
        </EditorLista>
      </Cartao>
      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}
