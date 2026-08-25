"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useId, useRef } from "react";

import { ARCOS, CONTORNO, ETAPAS, LENTE, RAIOS, VB } from "@/lib/traje";

/**
 * Distribui n elementos dentro de [de, ate] com sobreposição: cada um leva
 * `largura` da janela total e os inícios se espalham pelo resto. Sem isso a
 * costura sai toda de uma vez ou fica lenta demais no fim.
 */
function faixa(i, n, de, ate, largura = 0.4) {
  const total = ate - de;
  const passo = (total * (1 - largura)) / Math.max(n - 1, 1);
  const inicio = de + i * passo;
  return [inicio, inicio + total * largura];
}

/**
 * Traço branco que cresce dentro de uma <mask>. Ele não aparece: o que aparece
 * é o ponto tracejado por baixo, revelado à medida que a máscara abre.
 *
 * É o jeito de ter as duas coisas ao mesmo tempo — aparência de ponto de
 * costura (`stroke-dasharray`) E desenho progressivo. Aplicar `pathLength`
 * direto no tracejado não dá: os dois disputam o mesmo `stroke-dasharray`.
 */
function Revelador({ d, progress, de, ate }) {
  const pathLength = useTransform(progress, [de, ate], [0, 1]);
  return (
    <motion.path
      d={d}
      stroke="#fff"
      strokeWidth={18}
      strokeLinecap="round"
      fill="none"
      style={{ pathLength }}
    />
  );
}

function Etapa({ etapa, index, progress }) {
  const { de, ate } = etapa;
  const acesa = useTransform(progress, [de, de + (ate - de) * 0.3], [0.3, 1]);
  const risco = useTransform(progress, [ate - (ate - de) * 0.25, ate], [0, 1]);

  return (
    <motion.li style={{ opacity: acesa }} className="flex items-start gap-4">
      {/* caixinha que ganha um X bordado quando a etapa fecha */}
      <svg viewBox="0 0 24 24" className="mt-[2px] h-5 w-5 shrink-0" aria-hidden>
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="3"
          className="ponto"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <motion.path
          d="M6 6L18 18"
          className="ponto"
          strokeWidth="2.4"
          strokeDasharray="4 3"
          style={{ pathLength: risco }}
        />
        <motion.path
          d="M18 6L6 18"
          className="ponto"
          strokeWidth="2.4"
          strokeDasharray="4 3"
          style={{ pathLength: risco }}
        />
      </svg>

      <span>
        <span className="eyebrow block text-linha">{etapa.nome}</span>
        <span className="mt-1 block text-sm font-light text-linha-fraca">{etapa.detalhe}</span>
      </span>
      <span className="eyebrow ml-auto text-[0.6rem] text-margem">
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.li>
  );
}

/**
 * A máscara em si, comandada por um progresso de 0 a 1. Fica separada do
 * componente de rolagem para poder ser renderizada em estados fixos — e porque
 * cada instância precisa dos próprios ids de <mask> e <clipPath>: dois deles
 * na mesma página com o mesmo id fazem um sobrescrever o outro.
 */
export function MascaraCosturada({ progress, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const id = (nome) => `${nome}-${uid}`;

  const [tecido, contorno, , lentes] = ETAPAS;

  const tecidoOpacity = useTransform(progress, [tecido.de, tecido.ate], [0, 1]);
  const lenteOpacity = useTransform(progress, [lentes.de, lentes.de + 0.06], [0, 1]);
  const lenteScale = useTransform(progress, [lentes.de, lentes.ate], [0.72, 1]);

  // a máscara inteira respira: entra levemente girada e assenta no fim
  const giro = useTransform(progress, [0, 1], [-4, 2]);
  const escala = useTransform(progress, [0, 0.9], [0.94, 1]);

  const spokes = RAIOS.map((_, i) => faixa(i, RAIOS.length, 0.3, 0.52));
  const rings = ARCOS.map((_, i) => faixa(i, ARCOS.length, 0.46, 0.68));

  const areaMascara = {
    maskUnits: "userSpaceOnUse",
    x: -60,
    y: -60,
    width: VB.w + 120,
    height: VB.h + 120,
  };

  return (
    <motion.svg
      style={{ rotate: giro, scale: escala }}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className={className}
      aria-label="Máscara do Homem-Aranha sendo costurada à mão"
    >
      <defs>
        {/* trama do moletom */}
        <pattern id={id("trama")} width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="var(--color-tecido)" />
          <path
            d="M0 3.5h7M3.5 0v7"
            stroke="var(--color-tecido-escuro)"
            strokeWidth="1"
            opacity="0.45"
          />
        </pattern>

        <clipPath id={id("recorte")}>
          <path d={CONTORNO} />
        </clipPath>

        <mask id={id("rev-contorno")} {...areaMascara}>
          <Revelador d={CONTORNO} progress={progress} de={contorno.de} ate={contorno.ate} />
        </mask>

        <mask id={id("rev-raios")} {...areaMascara}>
          {RAIOS.map((d, i) => (
            <Revelador key={i} d={d} progress={progress} de={spokes[i][0]} ate={spokes[i][1]} />
          ))}
        </mask>

        <mask id={id("rev-arcos")} {...areaMascara}>
          {ARCOS.map((d, i) => (
            <Revelador key={i} d={d} progress={progress} de={rings[i][0]} ate={rings[i][1]} />
          ))}
        </mask>
      </defs>

      {/* 1. o tecido */}
      <motion.path d={CONTORNO} fill={`url(#${id("trama")})`} style={{ opacity: tecidoOpacity }} />

      {/* 2. a teia, recortada pelo tecido */}
      <g clipPath={`url(#${id("recorte")})`}>
        <g mask={`url(#${id("rev-raios")})`}>
          {RAIOS.map((d, i) => (
            <path key={i} d={d} className="ponto ponto-fino" />
          ))}
        </g>
        <g mask={`url(#${id("rev-arcos")})`}>
          {ARCOS.map((d, i) => (
            <path key={i} d={d} className="ponto ponto-fino" />
          ))}
        </g>
      </g>

      {/* 3. o contorno, por cima de tudo */}
      <path d={CONTORNO} className="ponto ponto-grosso" mask={`url(#${id("rev-contorno")})`} />

      {/* 4. as lentes, pregadas por último.
          O espelhamento fica num <g> externo de propósito: o Framer escreve o
          transform dele via `style`, que sobrescreve o atributo `transform` do
          mesmo elemento — as duas lentes acabariam empilhadas no mesmo lugar. */}
      {[false, true].map((espelhada) => (
        <g
          key={String(espelhada)}
          transform={espelhada ? `translate(${VB.w} 0) scale(-1 1)` : undefined}
        >
          <motion.g
            style={{
              opacity: lenteOpacity,
              scale: lenteScale,
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            <path d={LENTE} fill="var(--color-bone)" />
            <path d={LENTE} className="ponto ponto-fino" />
          </motion.g>
        </g>
      ))}
    </motion.svg>
  );
}

export default function Traje() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.32,
    restDelta: 0.0005,
  });

  const etiquetaOpacity = useTransform(p, [0.88, 0.97], [0, 1]);

  return (
    <section ref={ref} className="relative h-[420vh] bg-papel">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-[84px]">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-center gap-10 px-6 lg:px-14">
          {/* ---- coluna da esquerda: a ficha da oficina ---- */}
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow mb-4 flex items-center gap-4 text-tecido">
              <span className="h-px w-14 bg-tecido" />
              A oficina
            </p>

            <h2 className="display text-[clamp(1.9rem,min(4.4vw,7vh),4rem)] text-linha">
              Costurado
              <br />à mão
            </h2>

            <p className="mt-5 max-w-[38ch] text-[clamp(0.9rem,1.5vh,1.05rem)] font-light leading-relaxed text-linha-fraca">
              Sem laboratório, sem nanotecnologia, sem alguém para fazer por ele. Um moletom
              velho, linha preta e três noites acordado.
            </p>

            <ul className="mt-7 flex max-w-[38ch] flex-col gap-4 border-t border-margem/60 pt-6">
              {ETAPAS.map((etapa, i) => (
                <Etapa key={etapa.nome} etapa={etapa} index={i} progress={p} />
              ))}
            </ul>

            {/* etiqueta costurada, como a de dentro da gola */}
            <motion.div
              style={{ opacity: etiquetaOpacity }}
              className="relative mt-7 inline-block bg-bone px-5 py-3"
            >
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden
              >
                <rect x="3" y="4" width="94" height="92" className="ponto" strokeWidth="2" />
              </svg>
              <span className="eyebrow relative text-[0.6rem] text-linha-fraca">
                Traje caseiro · versão 1 · Queens
              </span>
            </motion.div>
          </div>

          {/* ---- a máscara ---- */}
          <div className="col-span-12 flex justify-center lg:col-span-7">
            <MascaraCosturada progress={p} className="h-[46vh] w-auto lg:h-[74vh]" />
          </div>
        </div>
      </div>
    </section>
  );
}
