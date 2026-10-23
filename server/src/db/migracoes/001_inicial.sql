-- Extensões usadas pelo esquema.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- ---------------------------------------------------------------- usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome             TEXT        NOT NULL,
  email            CITEXT      NOT NULL UNIQUE,
  senha_hash       TEXT        NOT NULL,
  papel            TEXT        NOT NULL DEFAULT 'editor'
                     CHECK (papel IN ('administrador', 'editor')),
  ativo            BOOLEAN     NOT NULL DEFAULT TRUE,
  criado_em        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ultimo_acesso_em TIMESTAMPTZ
);

-- Sessões opacas: o cookie carrega um token aleatório; o banco guarda só o hash.
CREATE TABLE IF NOT EXISTS sessoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  expira_em   TIMESTAMPTZ NOT NULL,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
  revogada_em TIMESTAMPTZ,
  ip          TEXT,
  agente      TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes (usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_expira  ON sessoes (expira_em);

-- Tentativas de login, usadas para travar força bruta.
CREATE TABLE IF NOT EXISTS tentativas_login (
  id             BIGSERIAL PRIMARY KEY,
  identificador  TEXT        NOT NULL,
  sucesso        BOOLEAN     NOT NULL,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tentativas_busca
  ON tentativas_login (identificador, criado_em DESC);

-- ---------------------------------------------------------------- conteúdo
-- O conteúdo do site é um documento, não um conjunto relacional: cada bloco
-- guarda o JSON validado pelo esquema correspondente em shared/esquemas.ts.
CREATE TABLE IF NOT EXISTS blocos_conteudo (
  chave          TEXT PRIMARY KEY,
  dados          JSONB       NOT NULL,
  versao         INTEGER     NOT NULL DEFAULT 1,
  atualizado_em  TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Histórico de cada bloco, para desfazer uma alteração indevida.
CREATE TABLE IF NOT EXISTS versoes_conteudo (
  id         BIGSERIAL PRIMARY KEY,
  chave      TEXT        NOT NULL,
  dados      JSONB       NOT NULL,
  versao     INTEGER     NOT NULL,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now(),
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_versoes_chave
  ON versoes_conteudo (chave, versao DESC);

-- ------------------------------------------------------------------- mídia
CREATE TABLE IF NOT EXISTS midias (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arquivo       TEXT        NOT NULL UNIQUE,
  nome_original TEXT        NOT NULL,
  mime          TEXT        NOT NULL,
  bytes         INTEGER     NOT NULL,
  largura       INTEGER     NOT NULL,
  altura        INTEGER     NOT NULL,
  alt           TEXT        NOT NULL DEFAULT '',
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  criado_por    UUID REFERENCES usuarios(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_midias_criado ON midias (criado_em DESC);

-- ---------------------------------------------------------------- contatos
CREATE TABLE IF NOT EXISTS contatos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome         TEXT        NOT NULL,
  telefone     TEXT        NOT NULL,
  assunto      TEXT        NOT NULL,
  mensagem     TEXT        NOT NULL,
  origem       TEXT        NOT NULL DEFAULT 'site',
  ip           TEXT,
  criado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
  lido_em      TIMESTAMPTZ,
  arquivado_em TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_contatos_criado ON contatos (criado_em DESC);

-- --------------------------------------------------------------- auditoria
CREATE TABLE IF NOT EXISTS registros_auditoria (
  id          BIGSERIAL PRIMARY KEY,
  usuario_id  UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  acao        TEXT        NOT NULL,
  entidade    TEXT        NOT NULL,
  entidade_id TEXT,
  detalhe     JSONB,
  ip          TEXT,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auditoria_criado ON registros_auditoria (criado_em DESC);

-- --------------------------------------------- cache de integrações externas
CREATE TABLE IF NOT EXISTS cache_integracoes (
  chave     TEXT PRIMARY KEY,
  dados     JSONB       NOT NULL,
  expira_em TIMESTAMPTZ NOT NULL
);
