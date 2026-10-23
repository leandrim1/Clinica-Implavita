import { useEffect } from 'react';

import { PaginaTexto } from '@/pages/PaginaTexto';
import { CLINICA, CONTATO, ENDERECO } from '@/config/clinica';
import { aplicarMetadados } from '@/lib/seo';

export function PrivacidadePage() {
  useEffect(() => {
    aplicarMetadados({
      titulo: `Política de Privacidade | ${CLINICA.nomeCompleto}`,
      descricao:
        `Como a ${CLINICA.nome} trata as informações de quem utiliza este site.`,
      caminho: '/politica-de-privacidade',
    });
  }, []);

  return (
    <PaginaTexto
      titulo="Política de Privacidade"
      introducao={`Como a ${CLINICA.nome} trata as informações de quem utiliza este site.`}
    >
      <h2>Quais dados este site coleta</h2>
      <ul>
        <li>
          <strong>Formulário de contato:</strong> ao enviar o formulário, o nome, o
          telefone, o assunto e a mensagem são registrados em um banco de dados da
          clínica, junto do endereço IP de onde partiu o envio. Esses dados são usados
          exclusivamente para a equipe retornar o contato. Em seguida, o site abre o
          WhatsApp com a mensagem pronta — o envio por lá é decisão sua.
        </li>
        <li>
          <strong>Base legal e prazo:</strong> o tratamento se apoia no legítimo
          interesse de responder a quem procura a clínica (art. 7º, IX, da LGPD). As
          mensagens ficam disponíveis à equipe até que sejam arquivadas ou excluídas.
          Você pode pedir a exclusão a qualquer momento pelos canais abaixo.
        </li>
        <li>
          <strong>Cookies:</strong> o site não usa cookies de rastreamento nem de
          publicidade. Cookies são gravados apenas para quem acessa o painel
          administrativo da clínica, e servem somente para manter a sessão de quem
          fez login.
        </li>
      </ul>

      <h2>Serviços de terceiros</h2>
      <p>
        Alguns recursos levam você para serviços externos, que possuem políticas
        próprias de privacidade:
      </p>
      <ul>
        <li>
          <strong>WhatsApp:</strong> ao tocar nos botões de contato, você é levado ao
          WhatsApp e a conversa passa a ser regida pelas políticas da Meta.
        </li>
        <li>
          <strong>Google Maps:</strong> o mapa só é carregado se você solicitar. A
          partir daí, o Google pode registrar informações de acesso conforme suas
          próprias políticas.
        </li>
        <li>
          <strong>Instagram:</strong> o link do perfil leva a uma plataforma da Meta.
        </li>
      </ul>

      <h2>Dados tratados fora do site</h2>
      <p>
        O atendimento, o agendamento e o prontuário acontecem fora deste site, pelos
        canais da clínica. O tratamento dessas informações segue a Lei Geral de
        Proteção de Dados (Lei nº 13.709/2018) e as normas do Conselho Federal de
        Odontologia sobre sigilo profissional.
      </p>

      <h2>Seus direitos</h2>
      <p>
        A LGPD assegura a você, entre outros, o direito de confirmar a existência de
        tratamento dos seus dados, acessá-los, corrigi-los, solicitar a sua eliminação
        e revogar consentimentos. Para exercer esses direitos, fale com a clínica
        pelos canais abaixo.
      </p>

      <h2>Imagens de pacientes</h2>
      <p>
        Registros clínicos só são publicados mediante autorização de uso de imagem
        assinada pelo paciente. Caso você identifique alguma imagem publicada sem a
        devida autorização, entre em contato: a remoção é imediata.
      </p>

      <h2>Como falar com a clínica</h2>
      <ul>
        <li>Telefone e WhatsApp: {CONTATO.telefoneExibicao}</li>
        <li>Endereço: {ENDERECO.linhaUnica}</li>
      </ul>

      <p className="pagina-texto__atualizacao">
        Conteúdo preparado para revisão da clínica. A data de vigência deve ser
        definida no momento da publicação oficial.
      </p>
    </PaginaTexto>
  );
}
