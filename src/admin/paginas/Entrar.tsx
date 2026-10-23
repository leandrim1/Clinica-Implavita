import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AlertCircle, LogIn } from 'lucide-react';

import { ErroApi } from '@/api/cliente';
import { useSessao } from '@/admin/contexto/SessaoAdmin';
import { CampoTexto } from '@/admin/componentes/Campo';

import './Entrar.css';

export function Entrar() {
  const { usuario, carregando, entrar } = useSessao();
  const { state } = useLocation() as { state?: { de?: string } };

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (carregando) {
    return (
      <div className="entrar">
        <p className="entrar__carregando">Carregando…</p>
      </div>
    );
  }

  if (usuario) return <Navigate to={state?.de ?? '/admin'} replace />;

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    setErro('');

    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    setEnviando(true);
    try {
      await entrar(email.trim(), senha);
    } catch (e) {
      setErro(
        e instanceof ErroApi ? e.message : 'Não foi possível entrar. Tente novamente.',
      );
      setSenha('');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="entrar">
      <div className="entrar__cartao">
        <div className="entrar__marca">
          <span className="entrar__marca-nome">Clínica Implavita</span>
          <span className="entrar__marca-sub">Painel administrativo</span>
        </div>

        <form className="entrar__form" onSubmit={aoEnviar} noValidate>
          <CampoTexto
            id="email"
            rotulo="E-mail"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            obrigatorio
          />

          <CampoTexto
            id="senha"
            rotulo="Senha"
            tipo="password"
            valor={senha}
            aoMudar={setSenha}
            obrigatorio
          />

          {/* `aria-live` faz o leitor de tela anunciar a falha de login. */}
          <div aria-live="polite">
            {erro ? (
              <p className="entrar__erro">
                <AlertCircle size={15} aria-hidden="true" />
                {erro}
              </p>
            ) : null}
          </div>

          <button type="submit" className="entrar__botao" disabled={enviando}>
            <LogIn size={17} aria-hidden="true" />
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <a className="entrar__voltar" href="/">
          Voltar ao site
        </a>
      </div>
    </div>
  );
}
