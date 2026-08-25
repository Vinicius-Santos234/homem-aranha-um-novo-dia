"use client";

import { useSyncExternalStore } from "react";

import {
  ACEITO,
  RECUSADO,
  assinarConsentimento,
  decidir,
  lerConsentimento,
  lerConsentimentoNoServidor,
} from "@/lib/consentimento";

/**
 * O controle de "mudar de ideia", na página de privacidade.
 *
 * ⚠️ ELE EXISTE PORQUE UMA POLÍTICA QUE SÓ EXPLICA NÃO É UMA ESCOLHA. Sem um
 * jeito de voltar atrás, a faixa de consentimento é decisão de uma vez só:
 * quem clicou errado, ou mudou de ideia, teria que saber limpar o
 * `localStorage` à mão. O texto conta o que acontece; este botão é onde a
 * pessoa manda.
 *
 * Muda o estado na hora — o `<Analytics />` mora num `useSyncExternalStore` da
 * mesma loja, então desligar aqui desmonta a medição sem recarregar a página.
 */
export default function EscolhaDeMedicao() {
  const escolha = useSyncExternalStore(
    assinarConsentimento,
    lerConsentimento,
    lerConsentimentoNoServidor,
  );

  const rotulo = {
    [ACEITO]: "Hoje você deixa medir.",
    [RECUSADO]: "Hoje você não deixa medir.",
  }[escolha] ?? "Você ainda não escolheu — enquanto isso, nada é medido.";

  return (
    <div className="mt-6 border border-bone/12 bg-carvao p-5 sm:p-6">
      <p className="font-mono text-[0.82rem] leading-relaxed text-bone">{rotulo}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => decidir(RECUSADO)}
          aria-pressed={escolha === RECUSADO}
          className={`eyebrow rounded-full border px-5 py-3 transition-colors ${
            escolha === RECUSADO
              ? "border-bone bg-bone text-ink"
              : "border-bone/25 text-bone-dim hover:border-bone/60 hover:text-bone"
          }`}
        >
          Não medir
        </button>
        <button
          type="button"
          onClick={() => decidir(ACEITO)}
          aria-pressed={escolha === ACEITO}
          className={`eyebrow rounded-full border px-5 py-3 transition-colors ${
            escolha === ACEITO
              ? "border-bone bg-bone text-ink"
              : "border-bone/25 text-bone-dim hover:border-bone/60 hover:text-bone"
          }`}
        >
          Pode medir
        </button>
      </div>

      <p className="mt-4 font-mono text-[0.72rem] leading-relaxed text-bone-dim/55">
        A escolha vale neste navegador e neste aparelho, porque é onde ela fica guardada. Ao
        desligar, a página recarrega — é o que garante que o código de medição saia do ar
        agora, e não só na próxima visita.
      </p>
    </div>
  );
}
