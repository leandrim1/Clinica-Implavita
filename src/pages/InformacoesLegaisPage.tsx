import { useEffect } from 'react';

import { PaginaTexto } from '@/pages/PaginaTexto';
import { CLINICA, CONTATO, ENDERECO, PROFISSIONAIS, REPUTACAO } from '@/config/clinica';
import { aplicarMetadados } from '@/lib/seo';

export function InformacoesLegaisPage() {
  useEffect(() => {
    aplicarMetadados({
      titulo: `Informações legais | ${CLINICA.nomeCompleto}`,
      descricao: `Informações legais e avisos sobre o conteúdo do site da ${CLINICA.nome}.`,
      caminho: '/informacoes-legais',
    });
  }, []);

  return (
    <PaginaTexto
      titulo="Informações legais"
      introducao="Avisos sobre o conteúdo deste site e sobre a comunicação em odontologia."
    >
      <h2>Identificação</h2>
      <ul>
        <li>Nome: {CLINICA.nomeCompleto}</li>
        <li>Endereço: {ENDERECO.linhaUnica}</li>
        <li>Telefone e WhatsApp: {CONTATO.telefoneExibicao}</li>
      </ul>
      <h2>Equipe e registros profissionais</h2>
      <ul>
        {PROFISSIONAIS.map((profissional) => (
          <li key={profissional.id}>
            {profissional.nome} — {profissional.atuacao} — {profissional.cro}
          </li>
        ))}
      </ul>
      <p>
        <strong>Pendente de preenchimento pela clínica:</strong> razão social, CNPJ,
        número de inscrição da pessoa jurídica no Conselho Regional de Odontologia
        (CRO-MG) e indicação de qual profissional responde como responsável técnico.
        Esses dados são exigidos pelo Código de Ética Odontológica na comunicação da
        clínica e foram deixados em branco por não terem sido fornecidos.
      </p>

      <h2>Natureza do conteúdo</h2>
      <p>
        As informações publicadas aqui têm finalidade informativa e não constituem
        consulta, diagnóstico ou prescrição. Nenhum tratamento é adequado a todos os
        pacientes: a indicação depende sempre de avaliação clínica individual.
      </p>

      <h2>Resultados de tratamentos</h2>
      <p>
        Os registros clínicos exibidos neste site correspondem a casos atendidos na
        clínica e são publicados com autorização de uso de imagem. Eles não representam
        promessa ou garantia de resultado, uma vez que a resposta ao tratamento varia
        conforme as condições de cada paciente.
      </p>

      <h2>Informações fornecidas pela clínica</h2>
      <p>
        Dados quantitativos citados no site — como o número de implantes realizados, a
        nota de {REPUTACAO.nota} estrelas e o total de {REPUTACAO.totalAvaliacoes}{' '}
        avaliações — foram informados pela clínica e não são atualizados
        automaticamente por este site. As avaliações podem ser consultadas, em tempo
        real, diretamente no Google.
      </p>

      <h2>Agendamentos</h2>
      <p>
        Este site não realiza agendamento automático e não confirma consultas. Todo
        agendamento é combinado diretamente com a equipe da clínica, por WhatsApp ou
        telefone.
      </p>

      <h2>Propriedade do conteúdo</h2>
      <p>
        Textos, imagens e elementos visuais deste site pertencem à {CLINICA.nomeCompleto}{' '}
        e não podem ser reproduzidos sem autorização.
      </p>

      <p className="pagina-texto__atualizacao">
        Conteúdo preparado para revisão da clínica e de sua assessoria jurídica antes
        da publicação definitiva.
      </p>
    </PaginaTexto>
  );
}
