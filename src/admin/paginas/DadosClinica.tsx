import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

import { buscarConteudoAdmin } from '@/api/conteudo';
import { CampoNumero, CampoTexto } from '@/admin/componentes/Campo';
import {
  BarraSalvar, CabecalhoPagina, Carregando, Cartao, Grade, useEditorBloco,
} from '@/admin/componentes/Pagina';
import type { ConteudoSite } from '@compartilhado/esquemas';

type Blocos = Pick<ConteudoSite, 'identidade' | 'endereco' | 'contato' | 'reputacao' | 'horarios'>;

export function DadosClinica() {
  const [dados, setDados] = useState<Blocos | null>(null);

  useEffect(() => {
    buscarConteudoAdmin()
      .then((c) =>
        setDados({
          identidade: c.identidade,
          endereco: c.endereco,
          contato: c.contato,
          reputacao: c.reputacao,
          horarios: c.horarios,
        }),
      )
      .catch(() => undefined);
  }, []);

  if (!dados) return <Carregando texto="Carregando os dados da clínica…" />;

  return (
    <>
      <CabecalhoPagina
        titulo="Dados da clínica"
        descricao="Identificação, endereço, contatos, horários e reputação. Estes dados alimentam o site inteiro, inclusive os links de WhatsApp e os dados estruturados para o Google."
      />
      <Identidade inicial={dados.identidade} />
      <EnderecoBloco inicial={dados.endereco} />
      <ContatoBloco inicial={dados.contato} />
      <Horarios inicial={dados.horarios} />
      <Reputacao inicial={dados.reputacao} />
    </>
  );
}

function Identidade({ inicial }: { readonly inicial: ConteudoSite['identidade'] }) {
  const ed = useEditorBloco('identidade', inicial);
  if (!ed.rascunho) return null;

  return (
    <>
      <Cartao titulo="Identificação">
        <Grade>
          <CampoTexto id="id-nome" rotulo="Nome curto" valor={ed.rascunho.nome}
            aoMudar={(v) => ed.atualizar({ nome: v })} erro={ed.errosCampo['nome']}
            ajuda="Usado no corpo do site e nas mensagens de WhatsApp." />
          <CampoTexto id="id-completo" rotulo="Nome completo" valor={ed.rascunho.nomeCompleto}
            aoMudar={(v) => ed.atualizar({ nomeCompleto: v })} erro={ed.errosCampo['nomeCompleto']}
            ajuda="Usado no rodapé e no título da página." />
          <CampoTexto id="id-assinatura" rotulo="Assinatura" valor={ed.rascunho.assinatura}
            aoMudar={(v) => ed.atualizar({ assinatura: v })} erro={ed.errosCampo['assinatura']} />
          <CampoTexto id="id-cidade" rotulo="Cidade" valor={ed.rascunho.cidade}
            aoMudar={(v) => ed.atualizar({ cidade: v })} erro={ed.errosCampo['cidade']} />
          <CampoTexto id="id-uf" rotulo="UF" valor={ed.rascunho.uf} maximo={2}
            aoMudar={(v) => ed.atualizar({ uf: v.toUpperCase() })} erro={ed.errosCampo['uf']} />
          <CampoTexto id="id-site" rotulo="Endereço do site" tipo="url" valor={ed.rascunho.site}
            aoMudar={(v) => ed.atualizar({ site: v })} erro={ed.errosCampo['site']}
            ajuda="Usado nas URLs canônicas e no sitemap." />
        </Grade>
      </Cartao>
      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}

function EnderecoBloco({ inicial }: { readonly inicial: ConteudoSite['endereco'] }) {
  const ed = useEditorBloco('endereco', inicial);
  if (!ed.rascunho) return null;

  return (
    <>
      <Cartao titulo="Endereço">
        <Grade>
          <CampoTexto id="en-log" rotulo="Logradouro e número" valor={ed.rascunho.logradouro}
            aoMudar={(v) => ed.atualizar({ logradouro: v })} erro={ed.errosCampo['logradouro']} />
          <CampoTexto id="en-bairro" rotulo="Bairro" valor={ed.rascunho.bairro}
            aoMudar={(v) => ed.atualizar({ bairro: v })} erro={ed.errosCampo['bairro']} />
          <CampoTexto id="en-cidade" rotulo="Cidade" valor={ed.rascunho.cidade}
            aoMudar={(v) => ed.atualizar({ cidade: v })} erro={ed.errosCampo['cidade']} />
          <CampoTexto id="en-estado" rotulo="Estado" valor={ed.rascunho.estado}
            aoMudar={(v) => ed.atualizar({ estado: v })} erro={ed.errosCampo['estado']} />
          <CampoTexto id="en-uf" rotulo="UF" valor={ed.rascunho.uf} maximo={2}
            aoMudar={(v) => ed.atualizar({ uf: v.toUpperCase() })} erro={ed.errosCampo['uf']} />
          <CampoTexto id="en-cep" rotulo="CEP" valor={ed.rascunho.cep}
            aoMudar={(v) => ed.atualizar({ cep: v })} erro={ed.errosCampo['cep']}
            ajuda="Formato 00000-000." />
        </Grade>
      </Cartao>
      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}

function ContatoBloco({ inicial }: { readonly inicial: ConteudoSite['contato'] }) {
  const ed = useEditorBloco('contato', inicial);
  if (!ed.rascunho) return null;

  return (
    <>
      <Cartao titulo="Contato e canais">
        <Grade>
          <CampoTexto id="ct-exib" rotulo="Telefone (como aparece)" valor={ed.rascunho.telefoneExibicao}
            aoMudar={(v) => ed.atualizar({ telefoneExibicao: v })} erro={ed.errosCampo['telefoneExibicao']}
            ajuda="Ex.: (34) 99797-9728" />
          <CampoTexto id="ct-intl" rotulo="Telefone para WhatsApp" valor={ed.rascunho.telefoneInternacional}
            aoMudar={(v) => ed.atualizar({ telefoneInternacional: v.replace(/\D/g, '') })}
            erro={ed.errosCampo['telefoneInternacional']}
            ajuda="Somente números, com 55 na frente. Ex.: 5534997979728" />
          <CampoTexto id="ct-insta-user" rotulo="Perfil no Instagram" valor={ed.rascunho.instagramUsuario}
            aoMudar={(v) => ed.atualizar({ instagramUsuario: v })} erro={ed.errosCampo['instagramUsuario']} />
          <CampoTexto id="ct-insta-url" rotulo="Link do Instagram" tipo="url" valor={ed.rascunho.instagramUrl}
            aoMudar={(v) => ed.atualizar({ instagramUrl: v })} erro={ed.errosCampo['instagramUrl']} />
          <CampoTexto id="ct-maps" rotulo="Link do Google Maps" tipo="url" valor={ed.rascunho.mapsUrl}
            aoMudar={(v) => ed.atualizar({ mapsUrl: v })} erro={ed.errosCampo['mapsUrl']} />
          <CampoTexto id="ct-aval" rotulo="Link das avaliações no Google" tipo="url" valor={ed.rascunho.avaliacoesUrl}
            aoMudar={(v) => ed.atualizar({ avaliacoesUrl: v })} erro={ed.errosCampo['avaliacoesUrl']} />
          <CampoTexto id="ct-place" rotulo="Place ID do Google" valor={ed.rascunho.placeId}
            aoMudar={(v) => ed.atualizar({ placeId: v })} erro={ed.errosCampo['placeId']}
            ajuda="Identificador da clínica no Google Maps." />
        </Grade>
      </Cartao>
      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}

function Horarios({ inicial }: { readonly inicial: ConteudoSite['horarios'] }) {
  const ed = useEditorBloco('horarios', inicial);
  if (!ed.rascunho) return null;

  const mudar = (indice: number, campo: 'abertura' | 'fechamento' | 'rotulo', valor: string) => {
    const copia = ed.rascunho!.map((d, i) =>
      i === indice ? { ...d, [campo]: campo === 'rotulo' ? valor : valor || null } : d,
    );
    ed.atualizar(copia);
  };

  return (
    <>
      <Cartao
        titulo="Horários de funcionamento"
        descricao="A abertura e o fechamento alimentam os dados estruturados do Google. O rótulo é o texto que aparece na página."
      >
        <div className="horarios-adm">
          {ed.rascunho.map((dia, i) => (
            <div className="horarios-adm__linha" key={dia.diaSchema}>
              <span className="horarios-adm__dia">{dia.dia}</span>
              <CampoTexto id={`h-ab-${i}`} rotulo="Abre" valor={dia.abertura ?? ''}
                aoMudar={(v) => mudar(i, 'abertura', v)} ajuda="Vazio = fechado" />
              <CampoTexto id={`h-fe-${i}`} rotulo="Fecha" valor={dia.fechamento ?? ''}
                aoMudar={(v) => mudar(i, 'fechamento', v)} />
              <CampoTexto id={`h-ro-${i}`} rotulo="Como aparece" valor={dia.rotulo}
                aoMudar={(v) => mudar(i, 'rotulo', v)} />
            </div>
          ))}
        </div>
      </Cartao>
      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}

function Reputacao({ inicial }: { readonly inicial: ConteudoSite['reputacao'] }) {
  const ed = useEditorBloco('reputacao', inicial);
  if (!ed.rascunho) return null;

  return (
    <>
      <Cartao titulo="Reputação informada">
        <p className="aviso-adm aviso-adm--atencao">
          <Info size={15} aria-hidden="true" />
          <span>
            Estes números são informados pela clínica e aparecem no site sempre
            identificados como tal. Eles <strong>não</strong> entram nos dados
            estruturados do Google: avaliação autodeclarada contraria as diretrizes
            da plataforma. Mantenha-os coerentes com o que o Google mostra.
          </span>
        </p>
        <Grade>
          <CampoTexto id="rep-nota" rotulo="Nota (como aparece)" valor={ed.rascunho.nota}
            aoMudar={(v) => ed.atualizar({ nota: v })} erro={ed.errosCampo['nota']} ajuda="Ex.: 5,0" />
          <CampoNumero id="rep-num" rotulo="Nota (número)" valor={ed.rascunho.notaNumerica}
            aoMudar={(v) => ed.atualizar({ notaNumerica: v })} minimo={0} maximo={5} passo={0.1}
            erro={ed.errosCampo['notaNumerica']} />
          <CampoNumero id="rep-total" rotulo="Total de avaliações" valor={ed.rascunho.totalAvaliacoes}
            aoMudar={(v) => ed.atualizar({ totalAvaliacoes: v })} minimo={0}
            erro={ed.errosCampo['totalAvaliacoes']} />
          <CampoTexto id="rep-ref" rotulo="Origem do dado" valor={ed.rascunho.referencia}
            aoMudar={(v) => ed.atualizar({ referencia: v })} erro={ed.errosCampo['referencia']} />
        </Grade>
      </Cartao>
      <BarraSalvar estado={ed.estado} erro={ed.erro} alterado={ed.alterado} aoSalvar={() => void ed.salvar()} />
    </>
  );
}
