"use client";

import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import { assinarEntrada, lerEntrada, lerEntradaNoServidor } from "@/lib/entrada";
import {
  ACEITO,
  RECUSADO,
  assinarConsentimento,
  decidir,
  lerConsentimento,
  lerConsentimentoNoServidor,
} from "@/lib/consentimento";

/**
 * A faixa de consentimento — e o interruptor da medição.
 *
 * ⚠️ OS DOIS ANDAM JUNTOS DE PROPÓSITO. Este componente é o ÚNICO lugar que
 * monta o `<Analytics />`, e ele só monta com "aceito" gravado. Fosse o
 * `layout` a montar, a faixa viraria enfeite: perguntaria e a medição rodaria
 * do mesmo jeito. Juntando os dois num arquivo, é impossível mexer num sem ver
 * o outro.
 *
 * ⚠️ NÃO É MODAL, E ISSO É DECISÃO. Ela não tranca a rolagem, não prende o
 * foco e não cobre o conteúdo — dá para ignorar e usar o site. Quem precisa de
 * decisão antes de qualquer coisa é o aviso de entrada (spoiler, direitos);
 * medição de audiência não é disso. Duas caixas obrigatórias em sequência
 * seriam hostis.
 *
 * ⚠️ ESPERA A TELA FICAR LIVRE. Sem isso ela apareceria por baixo do aviso de
 * entrada, e a pessoa receberia duas perguntas empilhadas antes de ver o site.
 * Quem responde "a tela está livre?" é `lib/entrada.js`.
 */
export default function Consentimento() {
  const escolha = useSyncExternalStore(
    assinarConsentimento,
    lerConsentimento,
    lerConsentimentoNoServidor,
  );
  const telaLivre = useSyncExternalStore(assinarEntrada, lerEntrada, lerEntradaNoServidor);

  const perguntar = telaLivre && escolha !== ACEITO && escolha !== RECUSADO;

  return (
    <>
      {escolha === ACEITO && <Analytics />}

      {perguntar && (
        <div
          role="region"
          aria-label="Medição de audiência"
          /* Acima da faixa dos lugares (z-90) e abaixo da tela de carregamento
             (z-100) e do aviso (z-110). */
          className="surgir-aviso fixed inset-x-0 bottom-0 z-[95] p-3 sm:p-5"
        >
          <div className="mx-auto flex max-w-[46rem] flex-col gap-4 border border-bone/12 bg-carvao/95 p-5 shadow-2xl shadow-black/70 backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <p className="font-mono text-[0.78rem] leading-relaxed text-bone-dim/75 sm:text-[0.8rem]">
              <strong className="font-semibold text-bone">Este site não usa cookies.</strong> A
              hospedagem oferece uma medição de audiência sem cookies e sem identificar você —
              páginas vistas, país e tipo de aparelho. Ela só liga se você deixar.{" "}
              <Link
                href="/privacidade"
                className="text-bone underline decoration-bone/30 underline-offset-4 transition-colors hover:decoration-bone"
              >
                Como funciona
              </Link>
              .
            </p>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decidir(RECUSADO)}
                className="eyebrow whitespace-nowrap rounded-full border border-bone/25 px-5 py-3 text-bone-dim transition-colors hover:border-bone/60 hover:text-bone"
              >
                Não medir
              </button>
              <button
                type="button"
                onClick={() => decidir(ACEITO)}
                className="eyebrow whitespace-nowrap rounded-full bg-bone px-5 py-3 text-ink transition-colors hover:bg-white"
              >
                Pode medir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
