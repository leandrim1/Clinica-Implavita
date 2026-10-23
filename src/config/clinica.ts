import { obterConteudo } from '@/config/conteudo';
import { iconeDe } from '@/config/icones';
import { vista } from '@/config/vista';
import type { ConteudoSite } from '@compartilhado/esquemas';
import type {
  AmbienteClinica,
  CasoClinico,
  DiaDeFuncionamento,
  Endereco,
  EtapaAgendamento,
  FotoClinica,
  Indicador,
  ItemNavegacao,
  Profissional,
  Tratamento,
} from '@/types';

/* -------------------------------------------------------------------------
 * VISÃO DO CONTEÚDO PARA O SITE PÚBLICO
 *
 * A fonte de verdade passou a ser o banco, editável pelo painel. Aqui o
 * conteúdo vigente é apresentado no formato que os componentes esperam —
 * com os campos derivados e com os ícones, que no banco são só texto.
 *
 * Tudo é lido sob demanda: a leitura acontece na renderização, nunca na
 * avaliação do módulo. É isso que permite hidratar o conteúdo pela API
 * depois dos imports, sem precisar dividir o bundle.
 *
 * Regra de conteúdo (vale também para quem editar pelo painel): não publicar
 * CRO, especializações, certificações, prêmios ou depoimentos que a clínica
 * não tenha confirmado.
 * ---------------------------------------------------------------------- */

interface Derivado {
  endereco: Endereco;
  contato: ConteudoSite['contato'] & { telefoneLink: string };
  tratamentos: Tratamento[];
  indicadores: Indicador[];
  etapas: EtapaAgendamento[];
  ambientes: AmbienteClinica[];
  casosVisiveis: CasoClinico[];
}

let fonte: ConteudoSite | null = null;
let cache: Derivado | null = null;

/** Recalcula os campos derivados apenas quando o conteúdo muda. */
function derivado(): Derivado {
  const atual = obterConteudo();
  if (fonte === atual && cache) return cache;

  cache = {
    endereco: {
      ...atual.endereco,
      linhaUnica:
        `${atual.endereco.logradouro} — ${atual.endereco.bairro}, ` +
        `${atual.endereco.cidade} — ${atual.endereco.uf}, CEP ${atual.endereco.cep}`,
    },
    contato: {
      ...atual.contato,
      /** Formato aceito por `tel:`, derivado do número internacional. */
      telefoneLink: `+${atual.contato.telefoneInternacional}`,
    },
    tratamentos: atual.tratamentos.map((t) => ({
      ...t,
      icone: iconeDe(t.icone),
      profissionalId: t.profissionalId ?? undefined,
    })),
    indicadores: atual.indicadores.map((i) => ({ ...i, icone: iconeDe(i.icone) })),
    etapas: atual.etapas.map((e) => ({ ...e, icone: iconeDe(e.icone) })),
    ambientes: atual.ambientes.map((a) => ({ ...a, icone: iconeDe(a.icone) })),
    // A trava de consentimento, repetida no cliente: vale mesmo sem API.
    casosVisiveis: atual.casosClinicos.filter((c) => !c.identificavel || c.autorizado),
  };
  fonte = atual;
  return cache;
}

export const CLINICA = vista(() => obterConteudo().identidade);
export const LOGO = vista(() => obterConteudo().logo);
export const HERO_IMAGEM = vista(() => obterConteudo().heroImagem);
export const FACHADA = vista(() => obterConteudo().fachada);
export const REPUTACAO = vista(() => obterConteudo().reputacao);
export const TEXTOS = vista(() => obterConteudo().textos);

export const ENDERECO: Endereco = vista(() => derivado().endereco);
export const CONTATO = vista(() => derivado().contato);

export const HORARIOS: readonly DiaDeFuncionamento[] = vista(() => obterConteudo().horarios);
export const NAVEGACAO: readonly ItemNavegacao[] = vista(() => obterConteudo().navegacao);
export const PROFISSIONAIS: readonly Profissional[] = vista(() => obterConteudo().profissionais);
export const FOTOS_CLINICA: readonly FotoClinica[] = vista(() => obterConteudo().fotosClinica);
export const CASOS_CLINICOS: readonly CasoClinico[] = vista(() => obterConteudo().casosClinicos);

export const TRATAMENTOS: readonly Tratamento[] = vista(() => derivado().tratamentos);
export const INDICADORES: readonly Indicador[] = vista(() => derivado().indicadores);
export const ETAPAS_AGENDAMENTO: readonly EtapaAgendamento[] = vista(() => derivado().etapas);
export const AMBIENTES: readonly AmbienteClinica[] = vista(() => derivado().ambientes);

/**
 * Casos liberados para exibição.
 *
 * Uma imagem em que o paciente é identificável só aparece quando a clínica
 * registra a autorização de uso de imagem dele no painel. O servidor já
 * filtra antes de enviar; o filtro é repetido aqui para a regra valer também
 * quando o site roda com o conteúdo padrão, sem API.
 */
export const CASOS_VISIVEIS: readonly CasoClinico[] = vista(() => derivado().casosVisiveis);
