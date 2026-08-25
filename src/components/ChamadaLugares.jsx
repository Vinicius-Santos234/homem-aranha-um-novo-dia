"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Chapa from "@/components/Chapa";
import { LUGARES } from "@/lib/lugares";

/** A porta dos lugares. */

const LEQUE = [
  { rot: -13, x: -300, y: 26, z: 1 },
  { rot: -6, x: -152, y: 6, z: 2 },
  { rot: 1, x: 0, y: -6, z: 3 },
  { rot: 7, x: 152, y: 8, z: 2 },
  { rot: 14, x: 300, y: 30, z: 1 },
];

const ABERTURA_INICIAL = 0.45;

const ESCALAS = [
  ["(min-width: 1024px)", 1],
  ["(min-width: 768px)", 0.72],
  ["(min-width: 640px)", 0.6],
];
const ESCALA_CELULAR = 0.35;

/** ⚠️ Por que medir em JS e não resolver por breakpoint no CSS: o `x` do framer */
function useFatorLeque() {
  const [fator, setFator] = useState(1);

  useEffect(() => {
    const listas = ESCALAS.map(([consulta, valor]) => [window.matchMedia(consulta), valor]);
    const medir = () => setFator(listas.find(([mq]) => mq.matches)?.[1] ?? ESCALA_CELULAR);

    medir();
    listas.forEach(([mq]) => mq.addEventListener("change", medir));
    return () => listas.forEach(([mq]) => mq.removeEventListener("change", medir));
  }, []);

  return fator;
}

function Carta({ lugar, alvo, progresso, fator }) {
  const largura = alvo.x * fator;
  const rot = useTransform(progresso, [0, 1], [alvo.rot * ABERTURA_INICIAL, alvo.rot]);
  const x = useTransform(progresso, [0, 1], [largura * ABERTURA_INICIAL, largura]);
  const y = useTransform(progresso, [0, 1], [40, alvo.y]);

  return (
    <motion.div
      style={{ rotate: rot, x, y, zIndex: alvo.z }}
      className="absolute h-[168px] w-[248px] shadow-2xl shadow-black/60 md:h-[214px] md:w-[318px]"
    >
      <div className="h-full w-full bg-bone p-[7px]">
        <Chapa
          legenda={lugar.chamada}
          src={lugar.foto}
          acento={lugar.acento}
          sizes="320px"
          className="h-full w-full"
          mostrarLegenda={false}
          borda="nua"
        />
      </div>
      <span
        className="eyebrow absolute inset-x-0 bottom-3 text-center text-[0.55rem] text-ink"
        aria-hidden
      >
        {lugar.logotipo}
      </span>
    </motion.div>
  );
}

export default function ChamadaLugares() {
  const ref = useRef(null);
  const fator = useFatorLeque();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  });

  const fundoY = useTransform(p, [0, 1], ["-5%", "5%"]);

  return (
    <section
      id="lugares"
      ref={ref}
      className="relative isolate overflow-hidden bg-carvao px-6 py-28 md:py-40"
    >
      {/* ---- a cidade, ao fundo ---- */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div style={{ y: fundoY }} className="absolute inset-x-0 -inset-y-[12%]">
          <Image
            src="/telhado-por-do-sol.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/45" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, var(--color-carvao) 0%, rgba(16,16,20,0.55) 22%, rgba(16,16,20,0.35) 52%, rgba(16,16,20,0.72) 82%, var(--color-carvao) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="eyebrow text-blood-400">Nova York</p>
        <h2 className="display mt-4 text-[clamp(2.4rem,6.5vw,5rem)] text-bone">
          Os lugares
        </h2>
        <p className="mt-6 max-w-[42ch] text-[0.98rem] font-light leading-relaxed text-bone-dim/80">
          Cinco endereços que a história atravessa: onde ele dorme, por onde ele
          anda e os dois lugares que o Controle de Danos preferia manter fora do
          mapa.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-16 flex h-[240px] items-center justify-center md:mt-24 md:h-[300px]">
        {LUGARES.slice(0, LEQUE.length).map((lugar, i) => (
          <Carta key={lugar.slug} lugar={lugar} alvo={LEQUE[i]} progresso={p} fator={fator} />
        ))}
      </div>

      <div className="relative z-10 mt-14 flex justify-center md:mt-20">
        <Link
          href="/lugares"
          className="group inline-flex items-center gap-3 rounded-full bg-bone px-8 py-4 text-ink transition-colors duration-200 hover:bg-blood-500 hover:text-bone"
        >
          <span className="eyebrow">Ver os lugares</span>
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
