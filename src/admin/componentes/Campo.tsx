import type { ReactNode } from 'react';

import './Campo.css';

interface Base {
  readonly rotulo: string;
  readonly id: string;
  readonly erro?: string | undefined;
  readonly ajuda?: string;
  readonly obrigatorio?: boolean;
}

function Envoltorio({
  rotulo, id, erro, ajuda, obrigatorio, children,
}: Base & { readonly children: ReactNode }) {
  return (
    <div className={`campo-adm ${erro ? 'campo-adm--erro' : ''}`}>
      <label className="campo-adm__rotulo" htmlFor={id}>
        {rotulo}
        {obrigatorio ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {ajuda && !erro ? <p className="campo-adm__ajuda">{ajuda}</p> : null}
      {erro ? (
        <p className="campo-adm__erro" id={`${id}-erro`} role="alert">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

interface PropsTexto extends Base {
  readonly valor: string;
  readonly aoMudar: (v: string) => void;
  readonly tipo?: 'text' | 'email' | 'password' | 'url' | 'tel';
  readonly placeholder?: string;
  readonly maximo?: number;
}

export function CampoTexto({ valor, aoMudar, tipo = 'text', placeholder, maximo, ...base }: PropsTexto) {
  return (
    <Envoltorio {...base}>
      <input
        id={base.id}
        type={tipo}
        className="campo-adm__entrada"
        value={valor}
        placeholder={placeholder}
        maxLength={maximo}
        onChange={(e) => aoMudar(e.target.value)}
        aria-invalid={base.erro ? true : undefined}
        aria-describedby={base.erro ? `${base.id}-erro` : undefined}
      />
    </Envoltorio>
  );
}

interface PropsArea extends Base {
  readonly valor: string;
  readonly aoMudar: (v: string) => void;
  readonly linhas?: number;
  readonly maximo?: number;
}

export function CampoArea({ valor, aoMudar, linhas = 4, maximo, ...base }: PropsArea) {
  return (
    <Envoltorio {...base}>
      <textarea
        id={base.id}
        className="campo-adm__entrada campo-adm__area"
        rows={linhas}
        value={valor}
        maxLength={maximo}
        onChange={(e) => aoMudar(e.target.value)}
        aria-invalid={base.erro ? true : undefined}
        aria-describedby={base.erro ? `${base.id}-erro` : undefined}
      />
      {maximo ? (
        <p className="campo-adm__contador">
          {valor.length} / {maximo}
        </p>
      ) : null}
    </Envoltorio>
  );
}

interface PropsNumero extends Base {
  readonly valor: number;
  readonly aoMudar: (v: number) => void;
  readonly minimo?: number;
  readonly maximo?: number;
  readonly passo?: number;
}

export function CampoNumero({ valor, aoMudar, minimo, maximo, passo = 1, ...base }: PropsNumero) {
  return (
    <Envoltorio {...base}>
      <input
        id={base.id}
        type="number"
        className="campo-adm__entrada"
        value={Number.isFinite(valor) ? valor : ''}
        min={minimo}
        max={maximo}
        step={passo}
        onChange={(e) => aoMudar(e.target.value === '' ? 0 : Number(e.target.value))}
        aria-invalid={base.erro ? true : undefined}
      />
    </Envoltorio>
  );
}

interface PropsSelecao<T extends string> extends Base {
  readonly valor: T;
  readonly aoMudar: (v: T) => void;
  readonly opcoes: ReadonlyArray<{ readonly valor: T; readonly rotulo: string }>;
}

export function CampoSelecao<T extends string>({ valor, aoMudar, opcoes, ...base }: PropsSelecao<T>) {
  return (
    <Envoltorio {...base}>
      <select
        id={base.id}
        className="campo-adm__entrada campo-adm__selecao"
        value={valor}
        onChange={(e) => aoMudar(e.target.value as T)}
      >
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </Envoltorio>
  );
}

interface PropsInterruptor {
  readonly rotulo: string;
  readonly id: string;
  readonly valor: boolean;
  readonly aoMudar: (v: boolean) => void;
  readonly ajuda?: string;
}

export function CampoInterruptor({ rotulo, id, valor, aoMudar, ajuda }: PropsInterruptor) {
  return (
    <div className="campo-adm campo-adm--interruptor">
      <label className="interruptor" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={valor}
          onChange={(e) => aoMudar(e.target.checked)}
          className="interruptor__entrada"
        />
        <span className="interruptor__trilho" aria-hidden="true">
          <span className="interruptor__bola" />
        </span>
        <span className="interruptor__texto">{rotulo}</span>
      </label>
      {ajuda ? <p className="campo-adm__ajuda">{ajuda}</p> : null}
    </div>
  );
}

/** Lista de textos curtos, usada em tópicos e destaques. */
export function CampoLista({
  rotulo, id, valores, aoMudar, ajuda, maximoItens = 8,
}: {
  readonly rotulo: string;
  readonly id: string;
  readonly valores: readonly string[];
  readonly aoMudar: (v: string[]) => void;
  readonly ajuda?: string;
  readonly maximoItens?: number;
}) {
  return (
    <div className="campo-adm">
      <span className="campo-adm__rotulo">{rotulo}</span>
      <div className="campo-lista">
        {valores.map((item, indice) => (
          <div className="campo-lista__linha" key={indice}>
            <input
              className="campo-adm__entrada"
              id={`${id}-${indice}`}
              value={item}
              onChange={(e) => {
                const copia = [...valores];
                copia[indice] = e.target.value;
                aoMudar(copia);
              }}
              aria-label={`${rotulo} ${indice + 1}`}
            />
            <button
              type="button"
              className="campo-lista__remover"
              onClick={() => aoMudar(valores.filter((_, i) => i !== indice))}
              aria-label={`Remover item ${indice + 1}`}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
      {valores.length < maximoItens ? (
        <button type="button" className="campo-lista__adicionar" onClick={() => aoMudar([...valores, ''])}>
          Adicionar item
        </button>
      ) : null}
      {ajuda ? <p className="campo-adm__ajuda">{ajuda}</p> : null}
    </div>
  );
}
