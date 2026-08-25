"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useId, useRef } from "react";

import { SpiderIcon, WebShooterHand } from "@/components/art";

export default function Estreia() {
  const ref = useRef(null);
  const uid = useId().replace(/:/g, "");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.3,
    restDelta: 0.0005,
  });

  // a data é bordada da esquerda para a direita: uma máscara que abre
  const bordado = useTransform(p, [0.18, 0.72], [0, 1]);
  // o fio de teia atravessa a seção
  const fio = useTransform(p, [0.08, 0.6], [0, 1]);
  const preenchimento = useTransform(p, [0.62, 0.85], [0, 1]);
  const botoesOpacity = useTransform(p, [0.7, 0.88], [0, 1]);
  const botoesY = useTransform(p, [0.7, 0.88], [18, 0]);

  return (
    <section id="estreia" ref={ref} className="relative overflow-hidden bg-papel-fundo pb-16 pt-40">
      {/* fio de teia desenhado pela rolagem */}
      <svg
        viewBox="0 0 1600 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-[16%] h-[200px] w-full"
        aria-hidden
      >
        <motion.path
          d="M0 96C260 60 420 150 700 118C980 86 1180 30 1600 74"
          fill="none"
          stroke="var(--color-linha)"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeDasharray="9 7"
          strokeLinecap="round"
          style={{ pathLength: fio }}
        />
      </svg>

      <div className="relative mx-auto max-w-[1400px] px-6 text-center lg:px-14">
        <p className="eyebrow mb-10 text-tecido">Seu sentido aranha está avisando</p>

        {/* 30.07 bordado: contorno em ponto de costura, preenchido no fim */}
        <svg
          viewBox="0 0 900 260"
          className="mx-auto h-auto w-full max-w-[900px]"
          aria-label="Estreia em 30 de julho"
        >
          <defs>
            <mask id={`bordar-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="260">
              <motion.rect
                x="0"
                y="0"
                width="900"
                height="260"
                fill="#fff"
                style={{ scaleX: bordado, transformOrigin: "left center" }}
              />
            </mask>
          </defs>

          <motion.text
            x="450"
            y="196"
            textAnchor="middle"
            className="display"
            fontSize="240"
            fill="var(--color-linha)"
            style={{ opacity: preenchimento }}
          >
            30.07
          </motion.text>

          <text
            x="450"
            y="196"
            textAnchor="middle"
            className="display ponto"
            fontSize="240"
            strokeWidth="3"
            strokeDasharray="10 8"
            mask={`url(#bordar-${uid})`}
          >
            30.07
          </text>
        </svg>

        <p className="eyebrow mt-6 text-linha-fraca">Somente nos cinemas · 2026</p>

        <motion.div
          style={{ opacity: botoesOpacity, y: botoesY }}
          className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#estreia"
            className="eyebrow group flex items-center gap-3 rounded-full bg-tecido px-8 py-4 text-bone transition-transform hover:scale-[1.03]"
          >
            Comprar ingressos
            <span className="transition-transform group-hover:translate-x-1">↗</span>
          </a>

          {/* botão costurado: a borda é linha, não traço sólido */}
          <a
            href="#topo"
            className="eyebrow relative flex items-center gap-3 px-8 py-4 text-linha-fraca transition-colors hover:text-linha"
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            >
              <rect
                x="2"
                y="3"
                width="96"
                height="94"
                rx="48"
                className="ponto"
                strokeWidth="2"
                strokeDasharray="6 5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <WebShooterHand className="relative h-4 w-4 text-tecido" />
            <span className="relative">Ver o trailer</span>
          </a>
        </motion.div>
      </div>

      <footer className="relative mx-auto mt-40 max-w-[1400px] px-6 lg:px-14">
        <div className="flex flex-col gap-6 border-t border-margem pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-linha-fraca">
            <SpiderIcon className="h-5 w-5" />
            <span className="eyebrow">Homem-Aranha · Um Novo Dia</span>
          </div>
          <p className="eyebrow text-margem">
            Projeto fictício de estudo — animações guiadas por scroll
          </p>
        </div>
      </footer>
    </section>
  );
}
