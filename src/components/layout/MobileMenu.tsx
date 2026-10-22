import { useEffect, useRef } from 'react';
import { CalendarCheck, Instagram, MapPin, Phone, X } from 'lucide-react';

import { Botao } from '@/components/ui/Botao';
import { Marca } from '@/components/ui/Marca';
import { CONTATO, ENDERECO, NAVEGACAO } from '@/config/clinica';
import { useTravarRolagem } from '@/hooks/useTravarRolagem';
import { linkWhatsApp } from '@/lib/whatsapp';
import type { SecaoId } from '@/types';

import './MobileMenu.css';

interface PropsMobileMenu {
  readonly aberto: boolean;
  readonly aoFechar: () => void;
  readonly destino: (id: string) => string;
  readonly secaoAtiva: SecaoId | null;
}

export function MobileMenu({ aberto, aoFechar, destino, secaoAtiva }: PropsMobileMenu) {
  const painelRef = useRef<HTMLDivElement>(null);
  const botaoFecharRef = useRef<HTMLButtonElement>(null);

  useTravarRolagem(aberto);

  // Esc fecha o painel e o foco começa no botão de fechar.
  useEffect(() => {
    if (!aberto) return;

    botaoFecharRef.current?.focus();

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        aoFechar();
        return;
      }

      // Mantém o foco dentro do painel enquanto ele estiver aberto.
      if (evento.key !== 'Tab') return;

      const painel = painelRef.current;
      if (!painel) return;

      const focaveis = painel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (!primeiro || !ultimo) return;

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberto, aoFechar]);

  return (
    <div
      className={`menu-mobile ${aberto ? 'menu-mobile--aberto' : ''}`}
      aria-hidden={!aberto}
    >
      <button
        type="button"
        className="menu-mobile__fundo"
        onClick={aoFechar}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div
        ref={painelRef}
        id="menu-mobile"
        className="menu-mobile__painel"
        role="dialog"
        aria-modal={aberto}
        aria-label="Menu de navegação"
      >
        <div className="menu-mobile__topo">
          <Marca compacta />
          <button
            ref={botaoFecharRef}
            type="button"
            className="menu-mobile__fechar"
            onClick={aoFechar}
            aria-label="Fechar menu"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegação principal (celular)">
          <ul className="menu-mobile__lista">
            {NAVEGACAO.map((item) => (
              <li key={item.id}>
                <a
                  href={destino(item.id)}
                  className="menu-mobile__link"
                  onClick={aoFechar}
                  aria-current={secaoAtiva === item.id ? 'true' : undefined}
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-mobile__rodape">
          <Botao
            href={linkWhatsApp('agendamento')}
            externo
            variante="primario"
            tamanho="lg"
            larguraTotal
            iconeEsquerda={<CalendarCheck size={18} />}
          >
            Agendar avaliação
          </Botao>

          <ul className="menu-mobile__contatos">
            <li>
              <a href={`tel:${CONTATO.telefoneLink}`}>
                <Phone size={16} aria-hidden="true" />
                <span>{CONTATO.telefoneExibicao}</span>
              </a>
            </li>
            <li>
              <a href={CONTATO.mapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={16} aria-hidden="true" />
                <span>
                  {ENDERECO.logradouro} — {ENDERECO.bairro}
                </span>
              </a>
            </li>
            <li>
              <a href={CONTATO.instagramUrl} target="_blank" rel="noopener noreferrer">
                <Instagram size={16} aria-hidden="true" />
                <span>Instagram da clínica</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
