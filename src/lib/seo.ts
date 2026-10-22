import { CLINICA, CONTATO, ENDERECO, HORARIOS, PROFISSIONAIS } from '@/config/clinica';

/**
 * Dados estruturados da clínica (schema.org/Dentist).
 *
 * Declaramos apenas informações verificáveis: identificação, endereço,
 * contato, canais oficiais e horários de funcionamento.
 *
 * A nota e o total de avaliações NÃO entram aqui de propósito. São dados
 * informados pela clínica, sem verificação independente, e `aggregateRating`
 * autodeclarado contraria as diretrizes de avaliações do Google. Os números
 * aparecem no conteúdo da página, sempre identificados como informados.
 */
export function dadosEstruturadosClinica(): string {
  const horariosSchema = HORARIOS.filter(
    (dia) => dia.abertura !== null && dia.fechamento !== null,
  ).map((dia) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${dia.diaSchema}`,
    opens: dia.abertura,
    closes: dia.fechamento,
  }));

  const dados = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${CLINICA.site}/#clinica`,
    name: `${CLINICA.nomeCompleto} ${CLINICA.cidade}`,
    alternateName: CLINICA.nome,
    description:
      `Clínica de implantes dentários em ${CLINICA.cidade}, ${CLINICA.uf}. ` +
      'Implantes, reabilitação oral, avaliação odontológica e harmonização facial.',
    url: CLINICA.site,
    telephone: CONTATO.telefoneLink,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ENDERECO.logradouro,
      addressLocality: ENDERECO.cidade,
      addressRegion: ENDERECO.uf,
      postalCode: ENDERECO.cep,
      addressCountry: 'BR',
    },
    areaServed: {
      '@type': 'City',
      name: `${ENDERECO.cidade}, ${ENDERECO.uf}`,
    },
    hasMap: CONTATO.mapsUrl,
    sameAs: [CONTATO.instagramUrl, CONTATO.mapsUrl],
    openingHoursSpecification: horariosSchema,
    employee: PROFISSIONAIS.map((profissional) => ({
      '@type': 'Person',
      name: profissional.nome,
      jobTitle: 'Cirurgião-dentista',
      knowsAbout: profissional.atuacao,
      identifier: profissional.cro,
    })),
    availableService: [
      { '@type': 'MedicalProcedure', name: 'Implantes dentários' },
      { '@type': 'MedicalProcedure', name: 'Reabilitação oral com implantes' },
      { '@type': 'MedicalProcedure', name: 'Avaliação odontológica' },
      { '@type': 'MedicalProcedure', name: 'Harmonização facial' },
    ],
  };

  return JSON.stringify(dados);
}

interface MetadadosPagina {
  readonly titulo: string;
  readonly descricao: string;
  /** Caminho da rota, usado para montar a URL canônica. */
  readonly caminho: string;
  /** Páginas auxiliares (404) ficam fora dos índices de busca. */
  readonly indexar?: boolean;
}

function definirMeta(seletor: string, atributo: string, valor: string): void {
  let elemento = document.head.querySelector<HTMLMetaElement>(seletor);

  if (!elemento) {
    elemento = document.createElement('meta');
    const [chave, conteudo] = seletor.replace(/^meta\[|\]$/g, '').split('=');
    if (chave && conteudo) {
      elemento.setAttribute(chave, conteudo.replace(/"/g, ''));
    }
    document.head.appendChild(elemento);
  }

  elemento.setAttribute(atributo, valor);
}

/** Aplica título, descrição, canônica e tags sociais da página atual. */
export function aplicarMetadados({
  titulo,
  descricao,
  caminho,
  indexar = true,
}: MetadadosPagina): void {
  const url = `${CLINICA.site}${caminho}`;

  document.title = titulo;

  definirMeta('meta[name="description"]', 'content', descricao);
  definirMeta('meta[name="robots"]', 'content', indexar ? 'index, follow' : 'noindex, follow');
  definirMeta('meta[property="og:title"]', 'content', titulo);
  definirMeta('meta[property="og:description"]', 'content', descricao);
  definirMeta('meta[property="og:url"]', 'content', url);
  definirMeta('meta[property="og:type"]', 'content', 'website');
  definirMeta('meta[property="og:locale"]', 'content', 'pt_BR');
  definirMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
  definirMeta('meta[name="twitter:title"]', 'content', titulo);
  definirMeta('meta[name="twitter:description"]', 'content', descricao);

  let canonica = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonica) {
    canonica = document.createElement('link');
    canonica.rel = 'canonical';
    document.head.appendChild(canonica);
  }
  canonica.href = url;
}
