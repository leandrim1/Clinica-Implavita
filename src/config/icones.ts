import {
  Activity,
  Armchair,
  CalendarCheck,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  Microscope,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

import type { Icone } from '@compartilhado/esquemas';

/**
 * O conteúdo guarda o ícone como texto (é o que vai para o banco e para o
 * painel). Aqui ele vira o componente correspondente.
 */
const MAPA: Record<Icone, LucideIcon> = {
  Activity,
  Armchair,
  CalendarCheck,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  Microscope,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
};

export function iconeDe(nome: Icone | string): LucideIcon {
  return MAPA[nome as Icone] ?? Sparkles;
}

export const ICONES_DISPONIVEIS = Object.keys(MAPA) as Icone[];
