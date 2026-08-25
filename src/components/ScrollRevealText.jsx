"use client";

import { motion, useTransform } from "framer-motion";
import { useMemo } from "react";

function Word({ word, progress, from, to, restColor, activeColor }) {
  const opacity = useTransform(progress, [from, to], [0.14, 1]);
  const color = useTransform(progress, [from, to], [restColor, activeColor]);
  const blur = useTransform(progress, [from, to], [3, 0]);
  const filter = useTransform(blur, (v) => `blur(${v.toFixed(2)}px)`);

  return (
    <motion.span style={{ opacity, color, filter }} className="inline-block whitespace-pre">
      {word}{" "}
    </motion.span>
  );
}

/**
 * Revelação palavra a palavra: cada palavra tem sua própria janela dentro de
 * [from, to], com sobreposição, então a frase acende como uma onda em vez de
 * piscar inteira de uma vez.
 */
export default function ScrollRevealText({
  text,
  progress,
  from = 0,
  to = 1,
  restColor = "#3a3a42",
  activeColor = "#f1ede6",
  overlap = 2.5,
  className = "",
  as: Tag = "p",
}) {
  const words = useMemo(() => text.split(" "), [text]);

  /* ⚠️ O passo divide por `n - 1 + overlap`, e não por `n`.
   *
   * Com `(to - from) / n`, a janela da ÚLTIMA palavra ia de
   * `from + (n-1)·passo` até `+ overlap·passo` — ou seja, terminava
   * `(overlap - 1)·passo` DEPOIS de `to`. Como o progresso satura em `to`, as
   * últimas palavras nunca chegavam ao fim da própria transição e ficavam
   * permanentemente meio apagadas e desfocadas, por mais que se rolasse.
   *
   * Com este divisor, a janela da última palavra fecha exatamente em `to`. */
  const step = (to - from) / (words.length - 1 + overlap);
  const width = step * overlap;

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          word={word}
          progress={progress}
          from={from + i * step}
          to={from + i * step + width}
          restColor={restColor}
          activeColor={activeColor}
        />
      ))}
    </Tag>
  );
}
