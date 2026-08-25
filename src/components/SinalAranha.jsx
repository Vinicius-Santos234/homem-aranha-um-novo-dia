"use client";

import { motion, useTransform } from "framer-motion";

import { SINAL_ARANHA } from "@/lib/sinal-aranha";

/** O sinal do Homem-Aranha desenhando-se conforme a página carrega. */

const ESPALHA = 0.6;

const TOTAL = SINAL_ARANHA.tracos.length;
const JANELA = 1 - ESPALHA;

function Traco({ d, indice, progresso }) {
  const inicio = (indice / (TOTAL - 1)) * ESPALHA;
  const recuo = useTransform(progresso, [inicio, inicio + JANELA], [1, 0]);

  return <motion.path d={d} pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: recuo }} />;
}

export default function SinalAranha({ progresso, className = "" }) {
  return (
    <svg
      viewBox={SINAL_ARANHA.viewBox}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Carregando"
    >
      <g opacity={0.12}>
        {SINAL_ARANHA.tracos.map((d, i) => (
          <path key={`f${i}`} d={d} />
        ))}
      </g>

      <g>
        {SINAL_ARANHA.tracos.map((d, i) => (
          <Traco key={`l${i}`} d={d} indice={i} progresso={progresso} />
        ))}
      </g>
    </svg>
  );
}
