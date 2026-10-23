/**
 * Cria uma "vista" de um valor que só é lido quando alguém o acessa.
 *
 * Serve para que os módulos de configuração possam ser importados
 * normalmente (import estático, sem divisão de bundle) e ainda assim
 * enxerguem o conteúdo que chega da API depois da avaliação do módulo.
 * Na prática: `CLINICA.nome` consulta o conteúdo vigente no momento da
 * renderização, não no momento do import.
 */
export function vista<T extends object>(ler: () => T): T {
  return new Proxy({} as T, {
    get: (_alvo, propriedade, receptor) => Reflect.get(ler(), propriedade, receptor),
    has: (_alvo, propriedade) => Reflect.has(ler(), propriedade),
    ownKeys: () => Reflect.ownKeys(ler()),
    getOwnPropertyDescriptor: (_alvo, propriedade) => {
      const descritor = Reflect.getOwnPropertyDescriptor(ler(), propriedade);
      // O Proxy exige que propriedades reportadas sejam configuráveis.
      return descritor ? { ...descritor, configurable: true } : undefined;
    },
  });
}
