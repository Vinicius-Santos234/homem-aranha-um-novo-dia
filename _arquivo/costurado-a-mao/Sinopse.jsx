"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * A sinopse é escrita à mão num caderno, e a vida antiga vai sendo riscada.
 * `riscar` marca os trechos que ganham um traço de caneta na rolagem — é o
 * mesmo gesto de quem revisa a própria página.
 */
const TEXTO = [
  { t: "Sem " },
  { t: "Stark", riscar: 0.34 },
  { t: ", sem " },
  { t: "torre", riscar: 0.42 },
  { t: ", sem ninguém que lembre o seu " },
  { t: "nome", riscar: 0.5 },
  { t: ". Peter recomeça num apartamento de aluguel no Queens, com um traje costurado à mão e um rádio de polícia que não desliga. A cidade não sabe quem ele é — e é justamente por isso que ele pode, enfim, ser o Homem-Aranha." },
];

/**
 * Faixa de rolagem de cada trecho, proporcional ao tamanho dele — assim a
 * revelação anda no ritmo da leitura em vez de dar saltos entre trechos.
 * Calculado uma vez no módulo: TEXTO é constante e isso não depende de render.
 */
const TRECHOS = (() => {
  const total = TEXTO.reduce((s, p) => s + p.t.length, 0);
  let cursor = 0;
  return TEXTO.map((parte) => {
    const inicio = 0.06 + (cursor / total) * 0.5;
    cursor += parte.t.length;
    return { parte, inicio, fim: 0.06 + (cursor / total) * 0.5 };
  });
})();

function Palavra({ palavra, progress, de, ate }) {
  const opacity = useTransform(progress, [de, ate], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {palavra}{" "}
    </motion.span>
  );
}

function Trecho({ parte, progress, inicio, fim }) {
  const palavras = parte.t.split(" ").filter(Boolean);
  const passo = (fim - inicio) / Math.max(palavras.length, 1);
  const largura = passo * 2.4;

  const risco = useTransform(
    progress,
    [parte.riscar ?? 0, (parte.riscar ?? 0) + 0.07],
    [0, 1],
  );

  const conteudo = palavras.map((w, i) => (
    <Palavra
      key={i}
      palavra={w}
      progress={progress}
      de={inicio + i * passo}
      ate={inicio + i * passo + largura}
    />
  ));

  if (!parte.riscar) return <>{conteudo}</>;

  return (
    <span className="relative inline-block whitespace-pre">
      {conteudo}
      {/* o risco é um traço só, desenhado da esquerda para a direita */}
      <svg
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[0.5em] -translate-y-1/2 overflow-visible"
        aria-hidden
      >
        <motion.path
          d="M1 7C22 3 44 9 66 5C78 3 90 7 99 5"
          fill="none"
          stroke="var(--color-tecido)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: risco }}
        />
      </svg>
    </span>
  );
}

export default function Sinopse() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const notaOpacity = useTransform(p, [0.6, 0.72], [0, 1]);
  const notaY = useTransform(p, [0.6, 0.85], [14, 0]);

  return (
    <section ref={ref} className="relative h-[240vh] bg-papel-fundo">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-[84px]">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-14">
          {/* a folha */}
          <div className="caderno relative mx-auto max-w-[900px] px-8 py-12 shadow-[0_24px_60px_-30px_rgba(21,21,26,0.45)] lg:px-16 lg:py-16">
            {/* margem vermelha e furos, como caderno de verdade */}
            <span className="absolute inset-y-0 left-8 w-px bg-tecido/35 lg:left-12" />
            <span className="absolute left-3 top-16 h-3 w-3 rounded-full bg-papel-fundo lg:left-4" />
            <span className="absolute left-3 top-1/2 h-3 w-3 rounded-full bg-papel-fundo lg:left-4" />
            <span className="absolute bottom-16 left-3 h-3 w-3 rounded-full bg-papel-fundo lg:left-4" />

            <p className="eyebrow mb-8 flex items-center gap-4 text-tecido">
              <span className="h-px w-10 bg-tecido" />
              Sinopse
            </p>

            <p className="max-w-[46ch] text-[clamp(1.05rem,min(2.1vw,3.4vh),1.9rem)] font-light leading-[1.75] text-linha">
              {TRECHOS.map(({ parte, inicio, fim }, i) => (
                <Trecho key={i} parte={parte} progress={p} inicio={inicio} fim={fim} />
              ))}
            </p>

            {/* anotação na margem, escrita depois */}
            <motion.p
              style={{ opacity: notaOpacity, y: notaY }}
              className="mt-10 max-w-[30ch] border-l-2 border-tecido/40 pl-4 text-sm font-light italic leading-relaxed text-linha-fraca"
            >
              Ninguém para chamar. Nenhum lugar para voltar. Pela primeira vez, só o bairro
              e ele.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
