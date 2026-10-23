import type { ConteudoSite } from './esquemas.js';

/* =========================================================================
 * CONTEÚDO PADRÃO
 *
 * Gerado a partir do conteúdo original do site. Cumpre dois papéis:
 *
 *  1. Semente do banco na primeira execução de `npm run db:semear`.
 *  2. Rede de segurança do site público: se a API estiver fora do ar, a
 *     página renderiza com estes valores em vez de quebrar.
 *
 * Depois que a clínica começar a editar pelo painel, o banco passa a ser a
 * fonte de verdade — este arquivo continua apenas como ponto de partida.
 * ====================================================================== */

export const CONTEUDO_PADRAO: ConteudoSite = {
    "identidade": {
      "nome": "Clínica Implavita",
      "nomeCompleto": "Clínica Implavita Implantes",
      "assinatura": "Odontologia e Harmonização Facial",
      "cidade": "Patos de Minas",
      "uf": "MG",
      "site": "https://www.clinicaimplavita.com.br"
    },
    "endereco": {
      "logradouro": "Rua Três Marias, 101",
      "bairro": "Aurélio Caixeta",
      "cidade": "Patos de Minas",
      "estado": "Minas Gerais",
      "uf": "MG",
      "cep": "38702-050"
    },
    "contato": {
      "telefoneExibicao": "(34) 99797-9728",
      "telefoneInternacional": "5534997979728",
      "instagramUsuario": "@clinicaimplavita",
      "instagramUrl": "https://www.instagram.com/invites/contact/?i=iuywd8jfh2bd&utm_content=kv3xe7q",
      "mapsUrl": "https://www.google.com/maps/place/?q=place_id:ChIJswQVCSmLrpQRgtx3q7MRGNU",
      "avaliacoesUrl": "https://search.google.com/local/reviews?placeid=ChIJswQVCSmLrpQRgtx3q7MRGNU&q=clinicas&authuser=0&hl=pt&gl=BR",
      "placeId": "ChIJswQVCSmLrpQRgtx3q7MRGNU"
    },
    "reputacao": {
      "nota": "5,0",
      "notaNumerica": 5,
      "totalAvaliacoes": 112,
      "referencia": "dados informados pela clínica"
    },
    "horarios": [
      {
        "dia": "Segunda-feira",
        "diaSchema": "Monday",
        "abertura": "08:00",
        "fechamento": "19:00",
        "rotulo": "08h às 19h"
      },
      {
        "dia": "Terça-feira",
        "diaSchema": "Tuesday",
        "abertura": "08:00",
        "fechamento": "19:00",
        "rotulo": "08h às 19h"
      },
      {
        "dia": "Quarta-feira",
        "diaSchema": "Wednesday",
        "abertura": "08:00",
        "fechamento": "19:00",
        "rotulo": "08h às 19h"
      },
      {
        "dia": "Quinta-feira",
        "diaSchema": "Thursday",
        "abertura": "08:00",
        "fechamento": "19:00",
        "rotulo": "08h às 19h"
      },
      {
        "dia": "Sexta-feira",
        "diaSchema": "Friday",
        "abertura": "08:00",
        "fechamento": "19:00",
        "rotulo": "08h às 19h"
      },
      {
        "dia": "Sábado",
        "diaSchema": "Saturday",
        "abertura": "08:00",
        "fechamento": "13:00",
        "rotulo": "08h às 13h"
      },
      {
        "dia": "Domingo",
        "diaSchema": "Sunday",
        "abertura": null,
        "fechamento": null,
        "rotulo": "Fechado"
      }
    ],
    "textos": {
      "hero": {
        "etiqueta": "Implantes dentários em Patos de Minas",
        "titulo": "Seu sorriso merece cuidado e confiança.",
        "texto": "Conheça nossos tratamentos odontológicos e agende uma avaliação com a equipe Implavita."
      },
      "tratamentos": {
        "titulo": "Tratamentos para cuidar do seu sorriso",
        "subtitulo": "O que a Implavita atende hoje. Cada caso é definido durante a avaliação, conforme as condições clínicas do paciente."
      },
      "clinica": {
        "titulo": "Um espaço pensado para o seu atendimento",
        "descricao": "A Clínica Implavita atende em Aurélio Caixeta, Patos de Minas. Da recepção ao consultório, o percurso é organizado para que cada etapa do tratamento aconteça com calma e atenção."
      },
      "avaliacoes": {
        "titulo": "O que dizem sobre a Implavita",
        "texto": "A clínica informa reputação de 5,0 estrelas no Google, com 112 avaliações recebidas. Em vez de reproduzir depoimentos aqui, preferimos levar você direto à fonte: leia as avaliações completas, com os nomes de quem escreveu, na própria página do Google."
      },
      "agendamento": {
        "titulo": "Três passos até a sua avaliação",
        "descricao": "O agendamento é feito diretamente com a equipe da clínica, pelo WhatsApp ou por telefone.",
        "observacao": "O site não confirma consultas automaticamente: a data é combinada com a equipe durante a conversa."
      },
      "contato": {
        "titulo": "Fale com a Implavita",
        "descricao": "Atendemos em Aurélio Caixeta, Patos de Minas. Fale pelo WhatsApp, ligue ou venha conhecer a clínica."
      },
      "avisoCasos": "Registros de casos atendidos na Implavita, cedidos pela clínica. Resultados variam conforme as condições clínicas de cada paciente e não representam garantia de resultado.",
      "avisoTratamentos": "As informações desta página são de caráter informativo e não substituem uma consulta. A indicação de qualquer tratamento depende de avaliação clínica individual, e os resultados variam de paciente para paciente.",
      "avisoRodape": "O conteúdo deste site tem caráter informativo e não substitui consulta, diagnóstico ou tratamento odontológico. Resultados variam conforme as condições clínicas de cada paciente."
    },
    "logo": {
      "arquivo": null,
      "largura": 190,
      "altura": 52,
      "alt": "Clínica Implavita — Odontologia e Harmonização Facial"
    },
    "heroImagem": {
      "arquivo": "/midia/equipe/equipe-implavita.jpg",
      "largura": 1040,
      "altura": 1300,
      "alt": "Dra. Thaílha Pinheiro e Dr. Carlos Adolfo Silva na Clínica Implavita"
    },
    "fachada": {
      "arquivo": "/midia/clinica/fachada.jpg",
      "largura": 1200,
      "altura": 1200,
      "alt": "Fachada da Clínica Implavita, com o letreiro iluminado sobre painel de madeira",
      "legenda": "Procure por esta fachada em Aurélio Caixeta."
    },
    "navegacao": [
      {
        "id": "inicio",
        "rotulo": "Início"
      },
      {
        "id": "tratamentos",
        "rotulo": "Tratamentos"
      },
      {
        "id": "profissionais",
        "rotulo": "Profissionais"
      },
      {
        "id": "clinica",
        "rotulo": "A Clínica"
      },
      {
        "id": "contato",
        "rotulo": "Contato"
      }
    ],
    "profissionais": [
      {
        "id": "carlos-adolfo-silva",
        "nome": "Dr. Carlos Adolfo Silva",
        "atuacao": "Implantes dentários",
        "cro": "CRO-MG 3917",
        "descricao": "Referência em implantes dentários na Implavita, o Dr. Carlos Adolfo Silva conduz os atendimentos da clínica voltados à reposição de dentes ausentes, do planejamento inicial ao acompanhamento de cada etapa do tratamento.",
        "destaques": [
          "Mais de 30 mil implantes realizados"
        ],
        "foto": "/midia/equipe/dr-carlos-adolfo-silva.jpg",
        "iniciais": "CA",
        "contexto": "implantes",
        "rotuloBotao": "Agendar avaliação"
      },
      {
        "id": "thailha-pinheiro",
        "nome": "Dra. Thaílha Pinheiro",
        "atuacao": "Harmonização facial",
        "cro": "CRO-MG 88553",
        "descricao": "A Dra. Thaílha Pinheiro é responsável pela área de harmonização facial da Implavita, com atendimentos conduzidos a partir de uma avaliação individual de cada paciente.",
        "destaques": [],
        "foto": "/midia/equipe/dra-thailha-pinheiro.jpg",
        "iniciais": "TP",
        "contexto": "harmonizacao",
        "rotuloBotao": "Falar sobre harmonização facial"
      }
    ],
    "tratamentos": [
      {
        "id": "implantes",
        "nome": "Implantes dentários",
        "resumo": "A principal área de atuação da Implavita.",
        "descricao": "Reposição de dentes ausentes com implantes, conduzida pelo Dr. Carlos Adolfo Silva. O planejamento é definido após avaliação clínica, considerando as condições de cada paciente.",
        "topicos": [
          "Avaliação clínica prévia",
          "Planejamento individual",
          "Acompanhamento das etapas"
        ],
        "icone": "Stethoscope",
        "contexto": "implantes",
        "profissionalId": "carlos-adolfo-silva",
        "destaque": true
      },
      {
        "id": "reabilitacao",
        "nome": "Reabilitação oral com implantes",
        "resumo": "Devolver função e estética ao sorriso.",
        "descricao": "Área de interesse da clínica voltada à reabilitação do sorriso em casos que envolvem implantes. As possibilidades de tratamento são apresentadas durante a avaliação.",
        "topicos": [
          "Casos com múltiplos dentes ausentes",
          "Conversa sobre alternativas"
        ],
        "icone": "Smile",
        "contexto": "reabilitacao",
        "profissionalId": "carlos-adolfo-silva",
        "destaque": false
      },
      {
        "id": "avaliacao",
        "nome": "Avaliação odontológica",
        "resumo": "O ponto de partida de qualquer tratamento.",
        "descricao": "Consulta em que a equipe examina sua situação, esclarece dúvidas e explica os caminhos possíveis antes de qualquer decisão sobre tratamento.",
        "topicos": [
          "Exame clínico",
          "Espaço para dúvidas",
          "Orientação sobre próximos passos"
        ],
        "icone": "ClipboardCheck",
        "contexto": "avaliacao",
        "profissionalId": null,
        "destaque": false
      },
      {
        "id": "harmonizacao",
        "nome": "Harmonização facial",
        "resumo": "Com a Dra. Thaílha Pinheiro.",
        "descricao": "Atendimentos de harmonização facial conduzidos pela Dra. Thaílha Pinheiro, definidos a partir de avaliação individual.",
        "topicos": [
          "Avaliação individual",
          "Conversa sobre expectativas"
        ],
        "icone": "Sparkles",
        "contexto": "harmonizacao",
        "profissionalId": "thailha-pinheiro",
        "destaque": false
      }
    ],
    "indicadores": [
      {
        "id": "implantes-realizados",
        "valor": "+30 mil",
        "rotulo": "implantes realizados",
        "observacao": "Informação fornecida pela clínica",
        "icone": "Activity"
      },
      {
        "id": "nota",
        "valor": "5,0",
        "rotulo": "de avaliação no Google",
        "observacao": "Nota informada, não atualizada em tempo real",
        "icone": "Star"
      },
      {
        "id": "avaliacoes",
        "valor": "112",
        "rotulo": "avaliações recebidas",
        "observacao": "Total informado pela clínica",
        "icone": "MessageCircle"
      },
      {
        "id": "localizacao",
        "valor": "Patos de Minas",
        "rotulo": "atendimento presencial",
        "observacao": "Bairro Aurélio Caixeta",
        "icone": "MapPin"
      }
    ],
    "etapas": [
      {
        "numero": "01",
        "titulo": "Entre em contato pelo WhatsApp",
        "descricao": "Toque no botão de agendamento e inicie a conversa. A mensagem já vai preenchida — basta enviar.",
        "icone": "MessageCircle"
      },
      {
        "numero": "02",
        "titulo": "Converse com a equipe",
        "descricao": "Conte o que procura e tire suas dúvidas. A equipe verifica os horários disponíveis para a sua avaliação.",
        "icone": "Stethoscope"
      },
      {
        "numero": "03",
        "titulo": "Agende sua avaliação",
        "descricao": "A data é confirmada diretamente com a equipe da clínica, por WhatsApp ou telefone.",
        "icone": "CalendarCheck"
      }
    ],
    "ambientes": [
      {
        "id": "recepcao",
        "titulo": "Recepção",
        "descricao": "O espaço de acolhida de quem chega para a avaliação.",
        "icone": "Armchair",
        "foto": "/midia/clinica/recepcao.jpg",
        "largura": 1400,
        "altura": 1050
      },
      {
        "id": "consultorios",
        "titulo": "Consultórios",
        "descricao": "Salas de atendimento onde os tratamentos são realizados.",
        "icone": "Stethoscope",
        "foto": "/midia/clinica/consultorio.jpg",
        "largura": 1400,
        "altura": 1050
      },
      {
        "id": "espera",
        "titulo": "Sala de espera",
        "descricao": "Ambiente reservado para a espera antes do atendimento.",
        "icone": "Microscope",
        "foto": "/midia/clinica/sala-de-espera.jpg",
        "largura": 1400,
        "altura": 1050
      }
    ],
    "fotosClinica": [
      {
        "id": "recepcao-balcao",
        "arquivo": "/midia/clinica/recepcao-balcao.jpg",
        "largura": 1400,
        "altura": 1050,
        "descricao": "Balcão da recepção da Clínica Implavita, com a marca aplicada na madeira.",
        "larga": true
      },
      {
        "id": "espera-conforto",
        "arquivo": "/midia/clinica/espera-conforto.jpg",
        "largura": 1400,
        "altura": 1050,
        "descricao": "Área de espera da clínica, com televisão e ponto de água.",
        "larga": false
      },
      {
        "id": "corredor-marca",
        "arquivo": "/midia/clinica/corredor-marca.jpg",
        "largura": 1400,
        "altura": 1050,
        "descricao": "Circulação interna com a marca da Implavita aplicada na parede.",
        "larga": false
      },
      {
        "id": "consultorio-arcada",
        "arquivo": "/midia/clinica/consultorio-arcada.jpg",
        "largura": 1400,
        "altura": 1050,
        "descricao": "Consultório da Implavita visto a partir da circulação interna.",
        "larga": false
      },
      {
        "id": "circulacao",
        "arquivo": "/midia/clinica/circulacao.jpg",
        "largura": 1400,
        "altura": 1050,
        "descricao": "Circulação da clínica, com o quadro da marca Implavita.",
        "larga": false
      },
      {
        "id": "lavabo",
        "arquivo": "/midia/clinica/lavabo.jpg",
        "largura": 1400,
        "altura": 1050,
        "descricao": "Lavabo disponível aos pacientes.",
        "larga": false
      },
      {
        "id": "sala-atendimento",
        "arquivo": "/midia/clinica/sala-atendimento.jpg",
        "largura": 1400,
        "altura": 1050,
        "descricao": "Sala de atendimento utilizada nas conversas e no planejamento dos tratamentos.",
        "larga": false
      }
    ],
    "casosClinicos": [
      {
        "id": "reabilitacao-total",
        "arquivo": "/midia/casos/caso-reabilitacao-total.jpg",
        "largura": 1100,
        "altura": 1100,
        "descricao": "Registro de reabilitação oral: situação inicial acima e resultado do tratamento abaixo.",
        "categoria": "reabilitacao",
        "identificavel": false,
        "autorizado": false
      },
      {
        "id": "reabilitacao-anterior",
        "arquivo": "/midia/casos/caso-reabilitacao-anterior.jpg",
        "largura": 1100,
        "altura": 1100,
        "descricao": "Reabilitação da região anterior: situação inicial acima e resultado do tratamento abaixo.",
        "categoria": "reabilitacao",
        "identificavel": false,
        "autorizado": false
      },
      {
        "id": "reabilitacao-protese",
        "arquivo": "/midia/casos/caso-reabilitacao-protese.jpg",
        "largura": 1100,
        "altura": 1100,
        "descricao": "Reabilitação sobre implantes: situação inicial acima e resultado do tratamento abaixo.",
        "categoria": "reabilitacao",
        "identificavel": false,
        "autorizado": false
      },
      {
        "id": "sorriso-detalhe",
        "arquivo": "/midia/casos/caso-sorriso-detalhe.jpg",
        "largura": 1100,
        "altura": 1372,
        "descricao": "Detalhe de um sorriso após a conclusão do tratamento reabilitador.",
        "categoria": "reabilitacao",
        "identificavel": false,
        "autorizado": false
      },
      {
        "id": "implantes-superior",
        "arquivo": "/midia/casos/caso-implantes-superior.jpg",
        "largura": 1100,
        "altura": 1372,
        "descricao": "Implantes instalados na arcada superior e inferior, registrados durante o tratamento.",
        "categoria": "implantes",
        "identificavel": false,
        "autorizado": false
      },
      {
        "id": "implantes-multiplos",
        "arquivo": "/midia/casos/caso-implantes-multiplos.jpg",
        "largura": 1100,
        "altura": 1372,
        "descricao": "Etapa intermediária de um caso com múltiplos implantes na arcada superior.",
        "categoria": "implantes",
        "identificavel": false,
        "autorizado": false
      },
      {
        "id": "retrato-01",
        "arquivo": "/midia/casos/retrato-caso-01.jpg",
        "largura": 1100,
        "altura": 1375,
        "descricao": "Paciente após tratamento com implantes.",
        "categoria": "implantes",
        "identificavel": true,
        "autorizado": false
      },
      {
        "id": "retrato-02",
        "arquivo": "/midia/casos/retrato-caso-02.jpg",
        "largura": 1100,
        "altura": 1372,
        "descricao": "Paciente após tratamento reabilitador.",
        "categoria": "reabilitacao",
        "identificavel": true,
        "autorizado": false
      },
      {
        "id": "retrato-03",
        "arquivo": "/midia/casos/retrato-caso-03.jpg",
        "largura": 1100,
        "altura": 1375,
        "descricao": "Paciente após tratamento com implantes.",
        "categoria": "implantes",
        "identificavel": true,
        "autorizado": false
      },
      {
        "id": "retrato-04",
        "arquivo": "/midia/casos/retrato-caso-04.jpg",
        "largura": 1100,
        "altura": 1375,
        "descricao": "Paciente após tratamento reabilitador.",
        "categoria": "reabilitacao",
        "identificavel": true,
        "autorizado": false
      },
      {
        "id": "retrato-05",
        "arquivo": "/midia/casos/retrato-caso-05.jpg",
        "largura": 1100,
        "altura": 1375,
        "descricao": "Paciente após conclusão do tratamento.",
        "categoria": "reabilitacao",
        "identificavel": true,
        "autorizado": false
      },
      {
        "id": "retrato-06",
        "arquivo": "/midia/casos/retrato-caso-06.jpg",
        "largura": 1100,
        "altura": 1375,
        "descricao": "Paciente durante etapa do tratamento com implantes.",
        "categoria": "implantes",
        "identificavel": true,
        "autorizado": false
      },
      {
        "id": "retrato-07",
        "arquivo": "/midia/casos/retrato-caso-07.jpg",
        "largura": 1100,
        "altura": 1375,
        "descricao": "Paciente após tratamento reabilitador.",
        "categoria": "reabilitacao",
        "identificavel": true,
        "autorizado": false
      },
      {
        "id": "harmonizacao-frontal",
        "arquivo": "/midia/casos/retrato-harmonizacao-frontal.jpg",
        "largura": 1100,
        "altura": 1100,
        "descricao": "Registro frontal de atendimento de harmonização facial.",
        "categoria": "harmonizacao",
        "identificavel": true,
        "autorizado": false
      },
      {
        "id": "harmonizacao-perfil",
        "arquivo": "/midia/casos/retrato-harmonizacao-perfil.jpg",
        "largura": 1100,
        "altura": 1100,
        "descricao": "Registro de perfil de atendimento de harmonização facial.",
        "categoria": "harmonizacao",
        "identificavel": true,
        "autorizado": false
      }
    ]
  };
