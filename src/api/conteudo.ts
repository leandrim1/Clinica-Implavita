import type { ChaveBloco, ConteudoSite, Midia, UsuarioPublico } from '@compartilhado/esquemas';
import type { ContatoRecebido, DadosContatoRecebido, DadosLogin } from '@compartilhado/esquemas';

import { pedir } from './cliente';

export const buscarConteudoPublico = (sinal?: AbortSignal) =>
  pedir<ConteudoSite>('/conteudo', { sinal });

export const buscarConteudoAdmin = () => pedir<ConteudoSite>('/conteudo/admin');

export interface RespostaBloco<K extends ChaveBloco> {
  readonly chave: K;
  readonly dados: ConteudoSite[K];
  readonly versao: number;
  readonly atualizadoEm: string | null;
}

export const salvarBloco = <K extends ChaveBloco>(chave: K, dados: ConteudoSite[K]) =>
  pedir<RespostaBloco<K>>(`/conteudo/${chave}`, { metodo: 'PUT', corpo: { dados } });

export interface VersaoBloco {
  readonly id: string;
  readonly versao: number;
  readonly criadoEm: string;
  readonly autor: string;
}

export const listarVersoes = (chave: ChaveBloco) =>
  pedir<{ versoes: VersaoBloco[] }>(`/conteudo/${chave}/versoes`);

export const restaurarVersao = (chave: ChaveBloco, id: string) =>
  pedir<{ chave: ChaveBloco }>(`/conteudo/${chave}/restaurar/${id}`, { metodo: 'POST' });

/* --- Autenticação --- */

export const entrar = (dados: DadosLogin) =>
  pedir<{ usuario: UsuarioPublico }>('/autenticacao/entrar', { metodo: 'POST', corpo: dados });

export const sair = () => pedir<{ ok: true }>('/autenticacao/sair', { metodo: 'POST' });

export const buscarSessao = () => pedir<{ usuario: UsuarioPublico }>('/autenticacao/eu');

export const trocarSenha = (senhaAtual: string, novaSenha: string) =>
  pedir<{ ok: true }>('/autenticacao/trocar-senha', {
    metodo: 'POST',
    corpo: { senhaAtual, novaSenha },
  });

/* --- Mídia --- */

export const listarMidias = () => pedir<{ midias: Midia[] }>('/midia');

export function enviarMidia(arquivo: File, alt: string) {
  const formulario = new FormData();
  formulario.append('arquivo', arquivo);
  formulario.append('alt', alt);
  return pedir<{ midia: Midia }>('/midia', { metodo: 'POST', formulario });
}

export const atualizarMidia = (id: string, alt: string) =>
  pedir<{ midia: Midia }>(`/midia/${id}`, { metodo: 'PATCH', corpo: { alt } });

export const excluirMidia = (id: string) =>
  pedir<{ ok: true }>(`/midia/${id}`, { metodo: 'DELETE' });

/* --- Contatos --- */

export const enviarContato = (dados: DadosContatoRecebido) =>
  pedir<{ id: string }>('/contatos', { metodo: 'POST', corpo: dados });

export const listarContatos = (arquivados = false) =>
  pedir<{ contatos: ContatoRecebido[]; naoLidos: number }>(
    `/contatos?arquivados=${arquivados}`,
  );

export const marcarContatoLido = (id: string) =>
  pedir<{ contato: ContatoRecebido }>(`/contatos/${id}/lido`, { metodo: 'POST' });

export const arquivarContato = (id: string) =>
  pedir<{ contato: ContatoRecebido }>(`/contatos/${id}/arquivar`, { metodo: 'POST' });

export const excluirContato = (id: string) =>
  pedir<{ ok: true }>(`/contatos/${id}`, { metodo: 'DELETE' });

/* --- Usuários --- */

export const listarUsuarios = () => pedir<{ usuarios: UsuarioPublico[] }>('/usuarios');

export const criarUsuario = (dados: {
  nome: string; email: string; senha: string; papel: 'administrador' | 'editor';
}) => pedir<{ usuario: UsuarioPublico }>('/usuarios', { metodo: 'POST', corpo: dados });

export const atualizarUsuario = (
  id: string,
  dados: { nome?: string; papel?: 'administrador' | 'editor'; ativo?: boolean },
) => pedir<{ usuario: UsuarioPublico }>(`/usuarios/${id}`, { metodo: 'PATCH', corpo: dados });

export const excluirUsuario = (id: string) =>
  pedir<{ ok: true }>(`/usuarios/${id}`, { metodo: 'DELETE' });

/* --- Integrações --- */

export interface AvaliacoesGoogle {
  readonly nota: number;
  readonly total: number;
  readonly obtidoEm: string;
}

export const buscarAvaliacoesGoogle = () =>
  pedir<{ avaliacoes: AvaliacoesGoogle | null }>('/avaliacoes');
