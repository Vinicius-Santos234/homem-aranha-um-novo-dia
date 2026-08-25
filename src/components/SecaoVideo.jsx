"use client";

import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import Chapa from "@/components/Chapa";
import { useVideoUmaVez } from "@/lib/video-uma-vez";

/** O fecho — o clipe toca sozinho, uma vez, quando a seção chega. */

const VIDEO = "/fecho.mp4";
const POSTER = "/fecho-poster.jpg";
const ACENTO = "#e01b2c";

const RETRANCA = "O dia seguinte";
const TITULO = "A cidade nunca vai saber quem foi";
const LINHA = "Sem nome, sem crédito, sem ninguém esperando quando ele voltar. Quatro anos assim — e ele continua subindo todo dia.";

const BRILHO_NO_FIM = 0.28;

const VISIVEL_PARA_TOCAR = 0.6;

const MARGEM_DOWNLOAD = "2000px 0px";

/** Toca o clipe uma vez, quando a seção aparece, e só. */

export default function SecaoVideo() {
  const ref = useRef(null);

  const apagar = useMotionValue(1);
  const aoTerminarClipe = useCallback(() => {
    animate(apagar, BRILHO_NO_FIM, { duration: 1.8, ease: [0.4, 0, 0.2, 1] });
  }, [apagar]);

  const videoRef = useVideoUmaVez({
    aoTerminar: aoTerminarClipe,
    margem: MARGEM_DOWNLOAD,
    visivel: VISIVEL_PARA_TOCAR,
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const brilhoDeEntrada = useTransform(p, [0, 0.75], [0.18, 1]);
  const escala = useTransform(p, [0, 1], [1.1, 1]);

  const brilho = useTransform(
    [brilhoDeEntrada, apagar],
    ([entrada, fim]) => entrada * fim,
  );
  const veu = useTransform(brilho, (b) => 1 - b);

  return (
    <section id="fecho" ref={ref} aria-label={TITULO} className="relative h-screen bg-void">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ scale: escala }} className="absolute inset-0">
          {VIDEO ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={VIDEO}
              poster={POSTER ?? undefined}
              muted
              playsInline
              preload="none"
              aria-label="O Homem-Aranha mergulhando sobre a cidade"
            />
          ) : (
            <Chapa
              legenda="Clipe do fecho — o plano que encerra a página"
              acento={ACENTO}
              className="h-full w-full"
              mostrarLegenda={false}
            />
          )}

          <motion.div
            aria-hidden
            style={{ opacity: veu }}
            className="pointer-events-none absolute inset-0 bg-black"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,3,4,0.9),transparent_55%)]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 bottom-0 px-6 pb-28 md:px-14 md:pb-24"
        >
          <p className="eyebrow" style={{ color: ACENTO }}>
            {VIDEO ? RETRANCA : "Template — falta o clipe"}
          </p>
          <h2
            className="display mt-4 max-w-[18ch] text-[clamp(2.2rem,6vw,5rem)] text-bone"
            style={{ lineHeight: 1.02 }}
          >
            {TITULO}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[0.98rem] font-light leading-relaxed text-bone-dim/80">
            {LINHA}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
