import { useEffect } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';

import { Botao } from '@/components/ui/Botao';
import { CLINICA } from '@/config/clinica';
import { aplicarMetadados } from '@/lib/seo';
import { linkWhatsApp } from '@/lib/whatsapp';

import './NaoEncontradaPage.css';

export function NaoEncontradaPage() {
  useEffect(() => {
    aplicarMetadados({
      titulo: `Página não encontrada | ${CLINICA.nomeCompleto}`,
      descricao: 'A página que você procura não existe ou foi movida.',
      caminho: '/404',
      indexar: false,
    });
  }, []);

  return (
    <section className="nao-encontrada">
      <div className="container container-estreito">
        <p className="sobretitulo">Erro 404</p>
        <h1 className="nao-encontrada__titulo">Não encontramos esta página</h1>
        <p className="nao-encontrada__texto">
          O endereço acessado não existe ou foi movido. Volte à página inicial ou fale
          diretamente com a equipe da {CLINICA.nome}.
        </p>

        <div className="nao-encontrada__acoes">
          <Botao para="/" variante="primario" iconeEsquerda={<ArrowLeft size={17} />}>
            Voltar ao início
          </Botao>
          <Botao
            href={linkWhatsApp('geral')}
            externo
            variante="contorno"
            iconeEsquerda={<MessageCircle size={17} />}
          >
            Falar pelo WhatsApp
          </Botao>
        </div>
      </div>
    </section>
  );
}
