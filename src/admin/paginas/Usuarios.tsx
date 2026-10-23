import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { UserPlus } from 'lucide-react';

import { ErroApi } from '@/api/cliente';
import {
  atualizarUsuario, criarUsuario, excluirUsuario, listarUsuarios,
} from '@/api/conteudo';
import { CampoSelecao, CampoTexto } from '@/admin/componentes/Campo';
import { CabecalhoPagina, Carregando, Cartao, Grade } from '@/admin/componentes/Pagina';
import { useSessao } from '@/admin/contexto/SessaoAdmin';
import type { UsuarioPublico } from '@compartilhado/esquemas';

const formatador = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export function Usuarios() {
  const { usuario: eu } = useSessao();
  const [usuarios, setUsuarios] = useState<UsuarioPublico[] | null>(null);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState<'administrador' | 'editor'>('editor');
  const [criando, setCriando] = useState(false);

  const carregar = useCallback(() => {
    listarUsuarios()
      .then(({ usuarios: u }) => setUsuarios(u))
      .catch((e) => setErro(e instanceof ErroApi ? e.message : 'Falha ao carregar.'));
  }, []);

  useEffect(carregar, [carregar]);

  async function aoCriar(evento: FormEvent) {
    evento.preventDefault();
    setErro('');
    setAviso('');
    setCriando(true);

    try {
      await criarUsuario({ nome: nome.trim(), email: email.trim(), senha, papel });
      setNome(''); setEmail(''); setSenha(''); setPapel('editor');
      setAviso('Usuário criado. Avise a pessoa para trocar a senha no primeiro acesso.');
      carregar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : 'Não foi possível criar o usuário.');
    } finally {
      setCriando(false);
    }
  }

  async function mudar(id: string, dados: Parameters<typeof atualizarUsuario>[1]) {
    setErro('');
    try {
      await atualizarUsuario(id, dados);
      carregar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : 'Não foi possível atualizar.');
    }
  }

  async function remover(u: UsuarioPublico) {
    if (!window.confirm(`Excluir a conta de ${u.nome}? Não é possível desfazer.`)) return;
    setErro('');
    try {
      await excluirUsuario(u.id);
      carregar();
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : 'Não foi possível excluir.');
    }
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Usuários"
        descricao="Quem pode entrar no painel. Editores alteram o conteúdo; administradores também gerenciam contas."
      />

      {erro ? <p className="aviso-adm aviso-adm--atencao">{erro}</p> : null}
      {aviso ? <p className="aviso-adm aviso-adm--info">{aviso}</p> : null}

      <Cartao titulo="Nova conta">
        <form onSubmit={aoCriar}>
          <Grade>
            <CampoTexto id="u-nome" rotulo="Nome" valor={nome} aoMudar={setNome} obrigatorio />
            <CampoTexto id="u-email" rotulo="E-mail" tipo="email" valor={email} aoMudar={setEmail} obrigatorio />
            <CampoTexto id="u-senha" rotulo="Senha provisória" tipo="password" valor={senha} aoMudar={setSenha}
              obrigatorio ajuda="Mínimo de 12 caracteres, com maiúscula, minúscula e número." />
            <CampoSelecao id="u-papel" rotulo="Papel" valor={papel} aoMudar={setPapel}
              opcoes={[
                { valor: 'editor', rotulo: 'Editor' },
                { valor: 'administrador', rotulo: 'Administrador' },
              ]} />
          </Grade>
          <button type="submit" className="botao-adm botao-adm--primario" disabled={criando}
            style={{ marginTop: 'var(--esp-sm)' }}>
            <UserPlus size={15} aria-hidden="true" />
            {criando ? 'Criando…' : 'Criar conta'}
          </button>
        </form>
      </Cartao>

      <Cartao titulo="Contas existentes">
        {usuarios === null ? (
          <Carregando />
        ) : (
          <div className="tabela-rolagem">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th><th>E-mail</th><th>Papel</th><th>Último acesso</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className={u.ativo ? '' : 'tabela__inativo'}>
                    <td>
                      {u.nome}
                      {u.id === eu?.id ? <span className="tabela__voce"> (você)</span> : null}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.papel === 'administrador' ? 'Administrador' : 'Editor'}</td>
                    <td>{u.ultimoAcessoEm ? formatador.format(new Date(u.ultimoAcessoEm)) : 'nunca'}</td>
                    <td>
                      <div className="tabela__acoes">
                        <button type="button" className="botao-adm"
                          onClick={() => void mudar(u.id, {
                            papel: u.papel === 'administrador' ? 'editor' : 'administrador',
                          })}
                          disabled={u.id === eu?.id}
                        >
                          {u.papel === 'administrador' ? 'Tornar editor' : 'Tornar admin'}
                        </button>
                        <button type="button" className="botao-adm"
                          onClick={() => void mudar(u.id, { ativo: !u.ativo })}
                          disabled={u.id === eu?.id}
                        >
                          {u.ativo ? 'Desativar' : 'Reativar'}
                        </button>
                        <button type="button" className="botao-adm botao-adm--perigo"
                          onClick={() => void remover(u)} disabled={u.id === eu?.id}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Cartao>
    </>
  );
}
