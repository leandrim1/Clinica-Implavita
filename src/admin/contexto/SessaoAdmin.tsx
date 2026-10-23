import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { buscarSessao, entrar as entrarApi, sair as sairApi } from '@/api/conteudo';
import { ErroApi } from '@/api/cliente';
import type { UsuarioPublico } from '@compartilhado/esquemas';

interface ValorSessao {
  readonly usuario: UsuarioPublico | null;
  readonly carregando: boolean;
  entrar(email: string, senha: string): Promise<void>;
  sair(): Promise<void>;
  /** Chamado quando a API responde 401: derruba a sessão local. */
  expirar(): void;
}

const Contexto = createContext<ValorSessao | null>(null);

export function ProvedorSessao({ children }: { readonly children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioPublico | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Restaura a sessão a partir do cookie ao abrir o painel.
  useEffect(() => {
    let ativo = true;

    buscarSessao()
      .then(({ usuario: u }) => ativo && setUsuario(u))
      .catch(() => ativo && setUsuario(null))
      .finally(() => ativo && setCarregando(false));

    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const { usuario: u } = await entrarApi({ email, senha });
    setUsuario(u);
  }, []);

  const sair = useCallback(async () => {
    try {
      await sairApi();
    } catch (erro) {
      // Sessão já vencida no servidor: seguimos limpando do lado do cliente.
      if (!(erro instanceof ErroApi)) throw erro;
    }
    setUsuario(null);
  }, []);

  const expirar = useCallback(() => setUsuario(null), []);

  const valor = useMemo<ValorSessao>(
    () => ({ usuario, carregando, entrar, sair, expirar }),
    [usuario, carregando, entrar, sair, expirar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSessao(): ValorSessao {
  const valor = useContext(Contexto);
  if (!valor) throw new Error('useSessao precisa estar dentro de ProvedorSessao.');
  return valor;
}
