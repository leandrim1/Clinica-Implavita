import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ambiente } from '../lib/ambiente.js';

/**
 * Onde as imagens enviadas pelo painel ficam guardadas.
 *
 * `local` grava em public/midia/enviados — serve para desenvolvimento e para
 * hospedagens com disco persistente. `blob` usa o Vercel Blob, necessário em
 * plataformas serverless, onde o disco é efêmero.
 */
export interface Armazenamento {
  readonly nome: string;
  salvar(nome: string, conteudo: Buffer, mime: string): Promise<string>;
  remover(caminho: string): Promise<void>;
}

const PASTA_LOCAL = join(process.cwd(), 'public', 'midia', 'enviados');
const PREFIXO_PUBLICO = '/midia/enviados';

const armazenamentoLocal: Armazenamento = {
  nome: 'local',

  async salvar(nome, conteudo) {
    await mkdir(PASTA_LOCAL, { recursive: true });
    await writeFile(join(PASTA_LOCAL, nome), conteudo);
    return `${PREFIXO_PUBLICO}/${nome}`;
  },

  async remover(caminho) {
    if (!caminho.startsWith(`${PREFIXO_PUBLICO}/`)) return;

    const nome = caminho.slice(PREFIXO_PUBLICO.length + 1);
    // Impede que um caminho manipulado saia da pasta de envios.
    if (nome.includes('/') || nome.includes('..')) return;

    await unlink(join(PASTA_LOCAL, nome)).catch(() => undefined);
  },
};

const armazenamentoBlob: Armazenamento = {
  nome: 'blob',

  async salvar(nome, conteudo, mime) {
    const token = ambiente.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('BLOB_READ_WRITE_TOKEN não configurado para ARMAZENAMENTO=blob.');
    }

    const resposta = await fetch(`https://blob.vercel-storage.com/${encodeURIComponent(nome)}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'x-api-version': '7',
        'x-content-type': mime,
        'x-add-random-suffix': '0',
        'cache-control': 'public, max-age=31536000, immutable',
      },
      body: new Uint8Array(conteudo),
    });

    if (!resposta.ok) {
      throw new Error(`Falha ao enviar para o Vercel Blob: ${resposta.status}`);
    }

    const dados = (await resposta.json()) as { url?: string };
    if (!dados.url) throw new Error('O Vercel Blob não devolveu a URL do arquivo.');
    return dados.url;
  },

  async remover(caminho) {
    const token = ambiente.BLOB_READ_WRITE_TOKEN;
    if (!token || !caminho.startsWith('https://')) return;

    await fetch('https://blob.vercel-storage.com/delete', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-api-version': '7' },
      body: JSON.stringify({ urls: [caminho] }),
    }).catch(() => undefined);
  },
};

export const armazenamento: Armazenamento =
  ambiente.ARMAZENAMENTO === 'blob' ? armazenamentoBlob : armazenamentoLocal;
