import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, Menu, Phone } from 'lucide-react';

import { Botao } from '@/components/ui/Botao';
import { Marca } from '@/components/ui/Marca';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { CONTATO, NAVEGACAO } from '@/config/clinica';
import { useCabecalhoCompacto } from '@/hooks/useCabecalhoCompacto';
import { useSecaoAtiva } from '@/hooks/useSecaoAtiva';
import { linkWhatsApp } from '@/lib/whatsapp';

import './Header.css';

const IDS_SECOES = NAVEGACAO.map((item) => item.id);

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const compacto = useCabecalhoCompacto();
  const { pathname } = useLocation();
  const naHome = pathname === '/';
  const secaoAtiva = useSecaoAtiva(naHome ? IDS_SECOES : []);

  // Trocar de rota fecha o menu — evita o painel aberto sobre a nova página.
  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  /** Fora da home, as âncoras voltam para a página inicial. */
  const destino = (id: string) => (naHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header className={`cabecalho ${compacto ? 'cabecalho--compacto' : ''}`}>
        <div className="container cabecalho__interno">
          <Link to="/" className="cabecalho__marca" aria-label="Clínica Implavita — página inicial">
            <Marca compacta={compacto} />
          </Link>

          <nav className="cabecalho__nav" aria-label="Navegação principal">
            <ul className="cabecalho__lista">
              {NAVEGACAO.map((item) => (
                <li key={item.id}>
                  <a
                    href={destino(item.id)}
                    className="cabecalho__link"
                    aria-current={naHome && secaoAtiva === item.id ? 'true' : undefined}
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="cabecalho__acoes">
            <a
              className="cabecalho__telefone"
              href={`tel:${CONTATO.telefoneLink}`}
              aria-label={`Ligar para ${CONTATO.telefoneExibicao}`}
            >
              <Phone size={16} aria-hidden="true" />
              <span>{CONTATO.telefoneExibicao}</span>
            </a>

            <Botao
              href={linkWhatsApp('agendamento')}
              externo
              variante="primario"
              iconeEsquerda={<CalendarCheck size={17} />}
              className="cabecalho__cta"
            >
              Agendar avaliação
            </Botao>

            <button
              type="button"
              className="cabecalho__menu-botao"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu de navegação"
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        aberto={menuAberto}
        aoFechar={() => setMenuAberto(false)}
        destino={destino}
        secaoAtiva={naHome ? secaoAtiva : null}
      />
    </>
  );
}
