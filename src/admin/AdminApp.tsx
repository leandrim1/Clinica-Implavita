import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { LayoutAdmin } from '@/admin/componentes/LayoutAdmin';
import { Carregando } from '@/admin/componentes/Pagina';
import { ProvedorSessao, useSessao } from '@/admin/contexto/SessaoAdmin';
import { Biblioteca } from '@/admin/paginas/Biblioteca';
import { Conta } from '@/admin/paginas/Conta';
import { Contatos } from '@/admin/paginas/Contatos';
import { DadosClinica } from '@/admin/paginas/DadosClinica';
import { Entrar } from '@/admin/paginas/Entrar';
import { Imagens } from '@/admin/paginas/Imagens';
import { Profissionais } from '@/admin/paginas/Profissionais';
import { Textos } from '@/admin/paginas/Textos';
import { Tratamentos } from '@/admin/paginas/Tratamentos';
import { Usuarios } from '@/admin/paginas/Usuarios';
import { Visao } from '@/admin/paginas/Visao';

/** Barra a entrada de quem não tem sessão, guardando o destino pretendido. */
function Protegida({ children }: { readonly children: React.ReactNode }) {
  const { usuario, carregando } = useSessao();
  const { pathname } = useLocation();

  if (carregando) return <Carregando texto="Verificando acesso…" />;
  if (!usuario) return <Navigate to="/admin/entrar" state={{ de: pathname }} replace />;

  return <>{children}</>;
}

/** Páginas restritas a administradores. */
function SomenteAdmin({ children }: { readonly children: React.ReactNode }) {
  const { usuario } = useSessao();
  if (usuario?.papel !== 'administrador') return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

export function AdminApp() {
  return (
    <ProvedorSessao>
      <Routes>
        <Route path="entrar" element={<Entrar />} />

        <Route
          element={
            <Protegida>
              <LayoutAdmin />
            </Protegida>
          }
        >
          <Route index element={<Visao />} />
          <Route path="textos" element={<Textos />} />
          <Route path="profissionais" element={<Profissionais />} />
          <Route path="tratamentos" element={<Tratamentos />} />
          <Route path="imagens" element={<Imagens />} />
          <Route path="clinica" element={<DadosClinica />} />
          <Route path="contatos" element={<Contatos />} />
          <Route path="biblioteca" element={<Biblioteca />} />
          <Route path="conta" element={<Conta />} />
          <Route
            path="usuarios"
            element={
              <SomenteAdmin>
                <Usuarios />
              </SomenteAdmin>
            }
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </ProvedorSessao>
  );
}
