"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import Chapa from "@/components/Chapa";
import Fixadores from "@/components/Fixadores";
import FaixaLugar from "@/components/lugares/FaixaLugar";
import { LUGARES } from "@/lib/lugares";

/**
 * A grade da página de lugares.
 *
 * Cada lugar é um cartão-postal com moldura branca e logotipo próprio — objeto
 * do mundo, não card do site. Clicar abre a faixa horizontal daquele lugar.
 *
 * Os cinco ficam espetados num mural de cortiça (a textura `.cortica`, montada
 * na página). Cada um leva UM fixador, e os cinco são de tipos diferentes: eles
 * se veem todos de uma vez, e peça repetida a dois cartões de distância lê como
 * padrão de interface em vez de objeto largado ali. A escolha é dado, em
 * `lib/lugares.js`.
 *
 * A faixa é sobreposição e não rota: o clique não perde a posição da grade, e
 * fechar não recarrega nada.
 */
export default function GradeLugares() {
  const [aberto, setAberto] = useState(null);

  return (
    <>
      <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {LUGARES.map((lugar, i) => (
          <li key={lugar.slug} className={i % 3 === 1 ? "lg:mt-16" : ""}>
            <button
              type="button"
              onClick={() => setAberto(lugar)}
              className="group block w-full text-left"
              aria-haspopup="dialog"
            >
              {/* ⚠️ `relative` porque os fixadores se ancoram nele, e o
                  `Fixadores` vai DENTRO do elemento que levanta no hover: a
                  peça está presa ao cartão, então sobe junto. Deixar de fora
                  faria o cartão descolar do próprio alfinete. */}
              <div
                className="relative bg-bone p-[10px] shadow-xl shadow-black/40 transition-transform duration-300 group-hover:-translate-y-2"
                style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
              >
                <Chapa
                  legenda={lugar.chamada}
                  src={lugar.foto}
                  acento={lugar.acento}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full"
                  style={{ aspectRatio: "4 / 3" }}
                  mostrarLegenda={false}
                  borda="nua"
                />
                <p className="display mt-3 text-center text-[1.35rem] text-ink">
                  {lugar.logotipo}
                </p>

                <Fixadores fixadores={lugar.fixadores} acento={lugar.acento} />
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="display text-[1.5rem] text-bone">{lugar.nome}</h2>
                  <p className="mt-2 text-[0.86rem] font-light text-bone-dim/70">
                    {lugar.chamada}
                  </p>
                </div>
                <span
                  className="eyebrow shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: lugar.acento }}
                >
                  Explorar →
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {aberto && (
          <motion.div
            key={aberto.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <FaixaLugar lugar={aberto} aoFechar={() => setAberto(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
