import { useRef, useState } from 'react';
import { AlertCircle, MessageCircle, Send } from 'lucide-react';

import { Botao } from '@/components/ui/Botao';
import { TRATAMENTOS } from '@/config/clinica';
import {
  type CampoFormulario,
  type ErrosFormulario,
  formatarTelefone,
  validarCampo,
  validarFormulario,
} from '@/lib/validacao';
import { type DadosFormulario, linkWhatsApp, mensagemDoFormulario } from '@/lib/whatsapp';

import './FormularioContato.css';

const ASSUNTOS: readonly string[] = [
  ...TRATAMENTOS.map((tratamento) => tratamento.nome),
  'Outro assunto',
];

const VAZIO: DadosFormulario = { nome: '', telefone: '', assunto: '', mensagem: '' };

/**
 * Formulário demonstrativo.
 *
 * Esta fase do projeto não tem backend, então nada é enviado nem armazenado:
 * o formulário valida os campos e monta a mensagem que o próprio visitante
 * envia pelo WhatsApp. O botão só revela o link depois da validação, e em
 * nenhum momento afirmamos que a mensagem foi recebida pela clínica.
 */
export function FormularioContato() {
  const [dados, setDados] = useState<DadosFormulario>(VAZIO);
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [tocados, setTocados] = useState<Partial<Record<CampoFormulario, boolean>>>({});
  const [pronto, setPronto] = useState(false);
  const resumoRef = useRef<HTMLDivElement>(null);

  function atualizar(campo: CampoFormulario, valor: string) {
    const tratado = campo === 'telefone' ? formatarTelefone(valor) : valor;

    setDados((anterior) => ({ ...anterior, [campo]: tratado }));
    setPronto(false);

    // Depois que o campo já foi visitado, o erro se corrige enquanto digita.
    if (tocados[campo]) {
      setErros((anterior) => ({ ...anterior, [campo]: validarCampo(campo, tratado) }));
    }
  }

  function aoSair(campo: CampoFormulario) {
    setTocados((anterior) => ({ ...anterior, [campo]: true }));
    setErros((anterior) => ({ ...anterior, [campo]: validarCampo(campo, dados[campo]) }));
  }

  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const novosErros = validarFormulario(dados);
    setErros(novosErros);
    setTocados({ nome: true, telefone: true, assunto: true, mensagem: true });

    const campoComErro = (Object.keys(novosErros) as CampoFormulario[])[0];

    if (campoComErro) {
      setPronto(false);
      document.getElementById(`campo-${campoComErro}`)?.focus();
      return;
    }

    setPronto(true);
    // Deixa o React pintar o bloco antes de mover o foco para ele.
    window.requestAnimationFrame(() => resumoRef.current?.focus());
  }

  function erroDe(campo: CampoFormulario): string | undefined {
    return tocados[campo] ? erros[campo] : undefined;
  }

  return (
    <form className="formulario" onSubmit={aoEnviar} noValidate>
      <div className="formulario__linha">
        <div className="campo">
          <label className="campo__rotulo" htmlFor="campo-nome">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input
            id="campo-nome"
            name="nome"
            type="text"
            autoComplete="name"
            className={`campo__entrada ${erroDe('nome') ? 'campo__entrada--erro' : ''}`}
            value={dados.nome}
            onChange={(evento) => atualizar('nome', evento.target.value)}
            onBlur={() => aoSair('nome')}
            aria-invalid={erroDe('nome') ? true : undefined}
            aria-describedby={erroDe('nome') ? 'erro-nome' : undefined}
            required
          />
          {erroDe('nome') ? (
            <p className="campo__erro" id="erro-nome">
              <AlertCircle size={14} aria-hidden="true" />
              {erroDe('nome')}
            </p>
          ) : null}
        </div>

        <div className="campo">
          <label className="campo__rotulo" htmlFor="campo-telefone">
            Telefone <span aria-hidden="true">*</span>
          </label>
          <input
            id="campo-telefone"
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(34) 99999-9999"
            className={`campo__entrada ${erroDe('telefone') ? 'campo__entrada--erro' : ''}`}
            value={dados.telefone}
            onChange={(evento) => atualizar('telefone', evento.target.value)}
            onBlur={() => aoSair('telefone')}
            aria-invalid={erroDe('telefone') ? true : undefined}
            aria-describedby={erroDe('telefone') ? 'erro-telefone' : undefined}
            required
          />
          {erroDe('telefone') ? (
            <p className="campo__erro" id="erro-telefone">
              <AlertCircle size={14} aria-hidden="true" />
              {erroDe('telefone')}
            </p>
          ) : null}
        </div>
      </div>

      <div className="campo">
        <label className="campo__rotulo" htmlFor="campo-assunto">
          Assunto <span aria-hidden="true">*</span>
        </label>
        <select
          id="campo-assunto"
          name="assunto"
          className={`campo__entrada campo__selecao ${
            erroDe('assunto') ? 'campo__entrada--erro' : ''
          }`}
          value={dados.assunto}
          onChange={(evento) => atualizar('assunto', evento.target.value)}
          onBlur={() => aoSair('assunto')}
          aria-invalid={erroDe('assunto') ? true : undefined}
          aria-describedby={erroDe('assunto') ? 'erro-assunto' : undefined}
          required
        >
          <option value="">Selecione um assunto</option>
          {ASSUNTOS.map((assunto) => (
            <option key={assunto} value={assunto}>
              {assunto}
            </option>
          ))}
        </select>
        {erroDe('assunto') ? (
          <p className="campo__erro" id="erro-assunto">
            <AlertCircle size={14} aria-hidden="true" />
            {erroDe('assunto')}
          </p>
        ) : null}
      </div>

      <div className="campo">
        <label className="campo__rotulo" htmlFor="campo-mensagem">
          Mensagem <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="campo-mensagem"
          name="mensagem"
          rows={4}
          className={`campo__entrada campo__area ${
            erroDe('mensagem') ? 'campo__entrada--erro' : ''
          }`}
          value={dados.mensagem}
          onChange={(evento) => atualizar('mensagem', evento.target.value)}
          onBlur={() => aoSair('mensagem')}
          aria-invalid={erroDe('mensagem') ? true : undefined}
          aria-describedby={erroDe('mensagem') ? 'erro-mensagem' : undefined}
          required
        />
        {erroDe('mensagem') ? (
          <p className="campo__erro" id="erro-mensagem">
            <AlertCircle size={14} aria-hidden="true" />
            {erroDe('mensagem')}
          </p>
        ) : null}
      </div>

      <Botao tipo="submit" variante="primario" iconeEsquerda={<Send size={17} />}>
        Revisar e continuar no WhatsApp
      </Botao>

      <p className="formulario__aviso">
        Este formulário não envia nem armazena dados. Ao continuar, suas informações
        são usadas apenas para montar a mensagem que você mesmo envia pelo WhatsApp.
      </p>

      {/* `aria-live` anuncia o resultado para quem usa leitor de tela. */}
      <div aria-live="polite">
        {pronto ? (
          <div className="formulario__resumo" ref={resumoRef} tabIndex={-1}>
            <h3 className="formulario__resumo-titulo">Tudo certo, {dados.nome.split(' ')[0]}!</h3>
            <p className="formulario__resumo-texto">
              Sua mensagem está pronta. Toque no botão abaixo para abrir o WhatsApp da
              clínica com o texto já preenchido — é você quem envia.
            </p>

            <Botao
              href={linkWhatsApp('formulario', mensagemDoFormulario(dados))}
              externo
              variante="whatsapp"
              larguraTotal
              iconeEsquerda={<MessageCircle size={18} />}
            >
              Abrir conversa no WhatsApp
            </Botao>
          </div>
        ) : null}
      </div>
    </form>
  );
}
