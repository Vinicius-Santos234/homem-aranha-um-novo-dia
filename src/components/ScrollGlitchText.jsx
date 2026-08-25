"use client";

import { motion, useTransform } from "framer-motion";
import { useMemo } from "react";

/** hash determinístico 0..1 — cada caractere "vira" num ponto próprio do scroll */
function hash(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Char({ char, progress, from, to, colorFrom, colorTo, index, salt }) {
  const span = Math.max((to - from) * 0.14, 0.01);
  // o ponto de virada fica a um `span` de cada ponta: sorteado no intervalo
  // inteiro, um caractere com hash perto de 1 teria a janela terminando em
  // `to + span` e nunca voltaria à cor final — ficava apagado para sempre
  const miolo = Math.max(to - from - span * 2, 0);
  const flip = from + span + miolo * hash(index, salt);

  // some e volta: é isso que dá a leitura de "estática" varrendo o texto
  const opacity = useTransform(
    progress,
    [flip - span, flip - span * 0.3, flip + span * 0.3, flip + span],
    [1, 0.03, 0.03, 1],
  );
  const color = useTransform(progress, [flip - span, flip + span], [colorFrom, colorTo]);

  return (
    <motion.span style={{ opacity, color }} className="will-change-[opacity]">
      {char}
    </motion.span>
  );
}

/**
 * Texto que se dissolve caractere a caractere conforme o scroll avança e volta
 * já na cor nova. As palavras ficam em inline-block pra quebra de linha
 * continuar acontecendo só entre palavras.
 */
export default function ScrollGlitchText({
  text,
  progress,
  from,
  to,
  colorFrom = "#0a0a0b",
  colorTo = "#f1ede6",
  className = "",
  salt = 1,
  as: Tag = "p",
}) {
  const words = useMemo(() => {
    const out = [];
    let cursor = 0;
    for (const word of text.split(" ")) {
      out.push({ word, offset: cursor });
      cursor += word.length + 1;
    }
    return out;
  }, [text]);

  const shared = { progress, from, to, colorFrom, colorTo, salt };

  return (
    <Tag className={className} aria-label={text}>
      {words.map(({ word, offset }, wi) => (
        <span key={`${word}-${wi}`} aria-hidden className="inline-block whitespace-pre">
          {[...word].map((char, ci) => (
            <Char key={ci} char={char} index={offset + ci} {...shared} />
          ))}
          {wi < words.length - 1 && (
            <Char char={"\u00A0"} index={offset + word.length} {...shared} />
          )}
        </span>
      ))}
    </Tag>
  );
}
