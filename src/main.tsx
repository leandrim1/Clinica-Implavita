import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@/App';
import { dadosEstruturadosClinica } from '@/lib/seo';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/utilitarios.css';

/** Publica os dados estruturados da clínica no <head>. */
function injetarDadosEstruturados() {
  const existente = document.getElementById('dados-estruturados');
  if (existente) return;

  const script = document.createElement('script');
  script.id = 'dados-estruturados';
  script.type = 'application/ld+json';
  script.textContent = dadosEstruturadosClinica();
  document.head.appendChild(script);
}

injetarDadosEstruturados();

const raiz = document.getElementById('root');

if (!raiz) {
  throw new Error('Elemento #root não encontrado no documento.');
}

createRoot(raiz).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
