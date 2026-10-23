import { useState, type FormEvent } from 'react';
import { KeyRound } from 'lucide-react';

import { ErroApi } from '@/api/cliente';
import { trocarSenha } from '@/api/conteudo';
import { CampoTexto } from '@/admin/componentes/Campo';
import { CabecalhoPagina, Cartao, Grade } from '@/admin/componentes/Pagina';
import { useSessao } from '@/admin/contexto/SessaoAdmin';

const formatador = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });

export function Conta() {
  const { usuario } = useSessao();

  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    setErro('');
    setAviso('');

    if (nova !== confirmacao) {
      setErro('A confirmação não confere com a nova senha.');
      return;
    }

    setEnviando(true);
    try {
      await trocarSenha(atual, nova);
      setAtual(''); setNova(''); setConfirmacao('');
      setAviso(
        'Senha alterada. Suas outras sessões abertas em outros navegadores foram encerradas.',
      );
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : 'Não foi possível trocar a senha.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <CabecalhoPagina titulo="Minha conta" descricao="Seus dados de acesso ao painel." />

      <Cartao titulo="Dados">
        <dl className="dados-conta">
          <div><dt>Nome</dt><dd>{usuario?.nome}</dd></div>
          <div><dt>E-mail</dt><dd>{usuario?.email}</dd></div>
          <div>
            <dt>Papel</dt>
            <dd>{usuario?.papel === 'administrador' ? 'Administrador' : 'Editor'}</dd>
          </div>
          <div>
            <dt>Conta criada em</dt>
            <dd>{usuario ? formatador.format(new Date(usuario.criadoEm)) : '—'}</dd>
          </div>
        </dl>
      </Cartao>

      <Cartao
        titulo="Trocar senha"
        descricao="Ao trocar a senha, as sessões abertas em outros navegadores são encerradas. Esta continua ativa."
      >
        <form onSubmit={aoEnviar}>
          <Grade>
            <CampoTexto id="s-atual" rotulo="Senha atual" tipo="password" valor={atual}
              aoMudar={setAtual} obrigatorio />
            <div />
            <CampoTexto id="s-nova" rotulo="Nova senha" tipo="password" valor={nova}
              aoMudar={setNova} obrigatorio
              ajuda="Mínimo de 12 caracteres, com maiúscula, minúscula e número." />
            <CampoTexto id="s-conf" rotulo="Confirme a nova senha" tipo="password"
              valor={confirmacao} aoMudar={setConfirmacao} obrigatorio
              erro={confirmacao && nova !== confirmacao ? 'As senhas não conferem.' : undefined} />
          </Grade>

          <div aria-live="polite">
            {erro ? <p className="aviso-adm aviso-adm--atencao" style={{ marginTop: 'var(--esp-sm)' }}>{erro}</p> : null}
            {aviso ? <p className="aviso-adm aviso-adm--info" style={{ marginTop: 'var(--esp-sm)' }}>{aviso}</p> : null}
          </div>

          <button type="submit" className="botao-adm botao-adm--primario" disabled={enviando}
            style={{ marginTop: 'var(--esp-sm)' }}>
            <KeyRound size={15} aria-hidden="true" />
            {enviando ? 'Salvando…' : 'Trocar senha'}
          </button>
        </form>
      </Cartao>
    </>
  );
}
