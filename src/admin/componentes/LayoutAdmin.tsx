import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  CalendarCheck, FileText, Image, Inbox, LayoutDashboard, LogOut, Menu,
  Settings, Stethoscope, UserCircle, Users, X,
} from 'lucide-react';

import { listarContatos } from '@/api/conteudo';
import { useSessao } from '@/admin/contexto/SessaoAdmin';
import { useTravarRolagem } from '@/hooks/useTravarRolagem';

import './LayoutAdmin.css';

const SECOES = [
  {
    titulo: 'Conteúdo',
    itens: [
      { para: '/admin', rotulo: 'Visão geral', icone: LayoutDashboard, exato: true },
      { para: '/admin/textos', rotulo: 'Textos do site', icone: FileText },
      { para: '/admin/profissionais', rotulo: 'Profissionais', icone: Stethoscope },
      { para: '/admin/tratamentos', rotulo: 'Tratamentos', icone: CalendarCheck },
      { para: '/admin/imagens', rotulo: 'Imagens do site', icone: Image },
      { para: '/admin/clinica', rotulo: 'Dados da clínica', icone: Settings },
    ],
  },
  {
    titulo: 'Operação',
    itens: [
      { para: '/admin/contatos', rotulo: 'Contatos', icone: Inbox, contador: true },
      { para: '/admin/biblioteca', rotulo: 'Biblioteca de mídia', icone: Image },
      { para: '/admin/usuarios', rotulo: 'Usuários', icone: Users, somenteAdmin: true },
      { para: '/admin/conta', rotulo: 'Minha conta', icone: UserCircle },
    ],
  },
] as const;

export function LayoutAdmin() {
  const { usuario, sair } = useSessao();
  const [menuAberto, setMenuAberto] = useState(false);
  const [naoLidos, setNaoLidos] = useState(0);
  const { pathname } = useLocation();

  useTravarRolagem(menuAberto);

  useEffect(() => setMenuAberto(false), [pathname]);

  // Contador de contatos novos, atualizado ao trocar de página.
  useEffect(() => {
    let ativo = true;
    listarContatos()
      .then(({ naoLidos: n }) => ativo && setNaoLidos(n))
      .catch(() => undefined);
    return () => {
      ativo = false;
    };
  }, [pathname]);

  return (
    <div className="adm">
      <button
        type="button"
        className="adm__abrir-menu"
        onClick={() => setMenuAberto(true)}
        aria-label="Abrir menu do painel"
        aria-expanded={menuAberto}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {menuAberto ? (
        <button
          type="button"
          className="adm__fundo"
          onClick={() => setMenuAberto(false)}
          aria-hidden="true"
          tabIndex={-1}
        />
      ) : null}

      <aside className={`adm__lateral ${menuAberto ? 'adm__lateral--aberta' : ''}`}>
        <div className="adm__marca">
          <span className="adm__marca-nome">Implavita</span>
          <span className="adm__marca-sub">Painel</span>
          <button
            type="button"
            className="adm__fechar-menu"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="adm__nav" aria-label="Seções do painel">
          {SECOES.map((secao) => (
            <div className="adm__grupo" key={secao.titulo}>
              <p className="adm__grupo-titulo">{secao.titulo}</p>
              <ul>
                {secao.itens
                  .filter((i) => !('somenteAdmin' in i && i.somenteAdmin) || usuario?.papel === 'administrador')
                  .map((item) => (
                    <li key={item.para}>
                      <NavLink
                        to={item.para}
                        end={'exato' in item ? item.exato : false}
                        className={({ isActive }) =>
                          `adm__link ${isActive ? 'adm__link--ativo' : ''}`
                        }
                      >
                        <item.icone size={17} aria-hidden="true" />
                        <span>{item.rotulo}</span>
                        {'contador' in item && item.contador && naoLidos > 0 ? (
                          <span className="adm__contador" aria-label={`${naoLidos} não lidos`}>
                            {naoLidos}
                          </span>
                        ) : null}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="adm__rodape">
          <div className="adm__usuario">
            <span className="adm__usuario-nome">{usuario?.nome}</span>
            <span className="adm__usuario-papel">
              {usuario?.papel === 'administrador' ? 'Administrador' : 'Editor'}
            </span>
          </div>
          <button type="button" className="adm__sair" onClick={() => void sair()}>
            <LogOut size={16} aria-hidden="true" />
            Sair
          </button>
        </div>
      </aside>

      <main className="adm__conteudo">
        <Outlet />
      </main>
    </div>
  );
}
