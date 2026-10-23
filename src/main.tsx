import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@/App';
import { hidratarConteudo } from '@/config/conteudo';
import { dadosEstruturadosClinica } from '@/lib/seo';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/utilitarios.css';

const raiz = document.getElementById('root');

if (!raiz) {
  throw new Error('Elemento #root não encontrado no documento.');
}

/** Publica os dados estruturados já com o conteúdo vigente. */
function injetarDadosEstruturados(): void {
  if (document.getElementById('dados-estruturados')) return;

  const script = document.createElement('script');
  script.id = 'dados-estruturados';
  script.type = 'application/ld+json';
  script.textContent = dadosEstruturadosClinica();
  document.head.appendChild(script);
}

/**
 * Busca o conteúdo antes de montar a aplicação.
 *
 * A camada de configuração lê o conteúdo sob demanda, então os imports acima
 * podem ser estáticos — o que mantém o site num bundle só. Se a API não
 * responder a tempo, seguimos com o conteúdo empacotado e a página abre
 * normalmente.
 */
hidratarConteudo()
  .catch(() => 'padrao' as const)
  .then((origem) => {
    if (origem === 'padrao' && import.meta.env.DEV) {
      console.warn('[conteúdo] API indisponível; usando o conteúdo padrão.');
    }

    injetarDadosEstruturados();

    createRoot(raiz).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
  });
