"use client";

import { motion, useTransform } from "framer-motion";

import { SINAL_ARANHA } from "@/lib/sinal-aranha";

/**
 * O sinal do Homem-Aranha desenhando-se conforme a página carrega.
 *
 * Vazado e em linha clara, com os traços acendendo em varredura — a referência
 * é o logotipo da Rockstar no carregamento do site do GTA VI.
 *
 * ------------------------------------------------------------------
 *  SÃO DUAS CAMADAS DO MESMO DESENHO, e é isso que faz o efeito:
 *
 *    · o FANTASMA, embaixo, com os 44 traços inteiros a 12% — o ícone lê desde
 *      o primeiro quadro, senão a tela começa vazia e a pessoa não sabe o que
 *      está se formando;
 *    · a LUZ, em cima, com os mesmos traços em osso cheio, desenhando-se.
 *
 *  Sem o fantasma o efeito vira "aparecendo"; com ele vira "acendendo", que é
 *  o que foi pedido.
 * ------------------------------------------------------------------
 *
 * ⚠️ O DESENHO SEGUE O CARREGAMENTO DE VERDADE, não um cronômetro. O
 * `progresso` que entra aqui é o mesmo MotionValue do `Preloader`, que só passa
 * de 90% quando as fontes e o primeiro quadro do clipe chegaram. Um laço de
 * tempo fixo aqui seria a mesma mentira que a tela de 2.200ms que o preloader
 * já foi um dia.
 *
 * ⚠️ SEM FILTRO DE BRILHO. `drop-shadow` nos traços venderia melhor o "aceso",
 * e é justamente o tipo de coisa que já travou o compositor neste projeto (ver
 * o aviso em `Chapa.jsx`: teia em SVG com traço, esticada, derrubou a captura).
 * Aqui seria no PIOR momento possível — a primeira tela, com o clipe do herói
 * baixando atrás. Contraste de cor resolve sem custo de rasterização.
 */

/* Quanto o acendimento se espalha ao longo do carregamento. Em 0,6 o primeiro
   traço desenha entre 0 e 40% e o último entre 60 e 100%: todos levam o mesmo
   tempo e ninguém termina antes da hora. Aumentar aproxima de "um traço por
   vez"; zerar acende os 44 juntos e perde a varredura. */
const ESPALHA = 0.6;

const TOTAL = SINAL_ARANHA.tracos.length;
const JANELA = 1 - ESPALHA;

function Traco({ d, indice, progresso }) {
  const inicio = (indice / (TOTAL - 1)) * ESPALHA;
  /* `useTransform` já trava nas pontas: antes da janela o traço fica em 1
     (invisível) e depois dela em 0 (inteiro). */
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
      {/* o fantasma: o desenho inteiro, apagado */}
      <g opacity={0.12}>
        {SINAL_ARANHA.tracos.map((d, i) => (
          <path key={`f${i}`} d={d} />
        ))}
      </g>

      {/* a luz: os mesmos traços, acendendo em varredura */}
      <g>
        {SINAL_ARANHA.tracos.map((d, i) => (
          <Traco key={`l${i}`} d={d} indice={i} progresso={progresso} />
        ))}
      </g>
    </svg>
  );
}
