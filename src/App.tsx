import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { HomePage } from '@/pages/HomePage';
import { InformacoesLegaisPage } from '@/pages/InformacoesLegaisPage';
import { NaoEncontradaPage } from '@/pages/NaoEncontradaPage';
import { PrivacidadePage } from '@/pages/PrivacidadePage';

/**
 * O painel só é baixado por quem entra em /admin. Mantê-lo fora do pacote
 * principal preserva o tempo de carregamento do site público, que é o que
 * importa para quem chega procurando a clínica.
 */
const AdminApp = lazy(() =>
  import('@/admin/AdminApp').then((m) => ({ default: m.AdminApp })),
);

/**
 * Ao trocar de rota, leva a página ao topo. Quando a URL traz uma âncora,
 * rola até a seção correspondente — é o que faz `/#tratamentos` funcionar
 * vindo de outra página.
 */
function GerenciadorDeRolagem() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const alvo = document.getElementById(hash.slice(1));
      if (alvo) {
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

/** O site público: cabeçalho, conteúdo e rodapé. */
function SitePublico() {
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>

      <GerenciadorDeRolagem />
      <Header />

      <main id="conteudo">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/politica-de-privacidade" element={<PrivacidadePage />} />
          <Route path="/informacoes-legais" element={<InformacoesLegaisPage />} />
          <Route path="*" element={<NaoEncontradaPage />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}

export function App() {
  return (
    <Routes>
      {/* O painel tem layout próprio: nada do site público entra aqui. */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="carregando-painel">Carregando o painel…</div>}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<SitePublico />} />
    </Routes>
  );
}
