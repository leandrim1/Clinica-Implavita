import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink, FileText, Image, Inbox, ShieldAlert, Stethoscope,
} from 'lucide-react';

import { buscarConteudoAdmin, listarContatos, listarMidias } from '@/api/conteudo';
import { CabecalhoPagina, Carregando, Cartao } from '@/admin/componentes/Pagina';
import { useSessao } from '@/admin/contexto/SessaoAdmin';

import './Visao.css';

interface Resumo {
  readonly profissionais: number;
  readonly tratamentos: number;
  readonly fotos: number;
  readonly casosNoAr: number;
  readonly casosTravados: number;
  readonly contatosNaoLidos: number;
  readonly midias: number;
}

export function Visao() {
  const { usuario } = useSessao();
  const [resumo, setResumo] = useState<Resumo | null>(null);

  useEffect(() => {
    Promise.all([buscarConteudoAdmin(), listarContatos(), listarMidias()])
      .then(([conteudo, contatos, midias]) =>
        setResumo({
          profissionais: conteudo.profissionais.length,
          tratamentos: conteudo.tratamentos.length,
          fotos: conteudo.fotosClinica.length,
          casosNoAr: conteudo.casosClinicos.filter((c) => !c.identificavel || c.autorizado).length,
          casosTravados: conteudo.casosClinicos.filter((c) => c.identificavel && !c.autorizado).length,
          contatosNaoLidos: contatos.naoLidos,
          midias: midias.midias.length,
        }),
      )
      .catch(() => undefined);
  }, []);

  const primeiroNome = usuario?.nome.split(' ')[0] ?? '';

  return (
    <>
      <CabecalhoPagina
        titulo={`Olá, ${primeiroNome}`}
        descricao="Tudo que está publicado no site da clínica, em um lugar só."
        acoes={
          <a className="botao-adm" href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} aria-hidden="true" />
            Ver o site
          </a>
        }
      />

      {!resumo ? (
        <Carregando />
      ) : (
        <>
          {resumo.casosTravados > 0 ? (
            <p className="aviso-adm aviso-adm--atencao visao__alerta">
              <ShieldAlert size={16} aria-hidden="true" />
              <span>
                <strong>
                  {resumo.casosTravados} caso(s) clínico(s) aguardando autorização.
                </strong>{' '}
                São imagens em que o paciente pode ser reconhecido. Elas ficam fora do ar
                até a clínica registrar a autorização de uso de imagem assinada.{' '}
                <Link to="/admin/imagens">Ver os casos</Link>
              </span>
            </p>
          ) : null}

          <div className="visao__cartoes">
            <Atalho
              para="/admin/contatos" icone={Inbox} rotulo="Contatos novos"
              valor={String(resumo.contatosNaoLidos)}
              destaque={resumo.contatosNaoLidos > 0}
            />
            <Atalho para="/admin/profissionais" icone={Stethoscope} rotulo="Profissionais"
              valor={String(resumo.profissionais)} />
            <Atalho para="/admin/tratamentos" icone={FileText} rotulo="Tratamentos"
              valor={String(resumo.tratamentos)} />
            <Atalho para="/admin/imagens" icone={Image} rotulo="Casos no ar"
              valor={String(resumo.casosNoAr)} />
          </div>

          <Cartao titulo="Por onde começar">
            <ul className="visao__lista">
              <li>
                <Link to="/admin/textos">Textos do site</Link> — títulos e textos de cada seção.
              </li>
              <li>
                <Link to="/admin/profissionais">Profissionais</Link> — nomes, CRO, fotos e descrições.
              </li>
              <li>
                <Link to="/admin/imagens">Imagens do site</Link> — logotipo, fachada, ambientes e
                casos clínicos.
              </li>
              <li>
                <Link to="/admin/clinica">Dados da clínica</Link> — endereço, telefone, horários e
                reputação.
              </li>
              <li>
                <Link to="/admin/biblioteca">Biblioteca de mídia</Link> — {resumo.midias} imagem(ns)
                enviada(s).
              </li>
            </ul>
          </Cartao>
        </>
      )}
    </>
  );
}

function Atalho({
  para, icone: Icone, rotulo, valor, destaque = false,
}: {
  readonly para: string;
  readonly icone: typeof Inbox;
  readonly rotulo: string;
  readonly valor: string;
  readonly destaque?: boolean;
}) {
  return (
    <Link to={para} className={`visao__cartao ${destaque ? 'visao__cartao--destaque' : ''}`}>
      <Icone size={18} aria-hidden="true" className="visao__icone" />
      <span className="visao__valor">{valor}</span>
      <span className="visao__rotulo">{rotulo}</span>
    </Link>
  );
}
