"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

import Chapa from "@/components/Chapa";
import FichaControleDanos from "@/components/FichaControleDanos";
import Fixadores from "@/components/Fixadores";
import Polaroide from "@/components/Polaroide";
import FundoCapitulo from "@/components/FundoCapitulo";
import ScrollRevealText from "@/components/ScrollRevealText";

/** Um capítulo de personagem. */

/** Rampa de brilho: a mídia entra quase apagada e acende ao atravessar a tela. */
function useRampa(ref) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const suave = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  });
  const veu = useTransform(suave, [0, 1], [0.72, 0]);
  const escala = useTransform(suave, [0, 1], [1.06, 1]);
  return { escala, veu };
}

/** O véu da rampa. */
function VeuDaRampa({ opacidade }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 bg-black"
      style={{ opacity: opacidade }}
    />
  );
}

/** A capa do capítulo — e, por cima dela, a ficha do Controle de Danos. */
function Capa({ personagem, ficha, corAnterior, total }) {
  const ref = useRef(null);
  const rampa = useRampa(ref);

  return (
    <div
      ref={ref}
      className="relative z-10 flex min-h-[62vh] items-center overflow-hidden px-6 py-24 md:min-h-[86vh] md:py-28"
    >
      <motion.div style={{ scale: rampa.escala }} className="absolute inset-0">
        <Chapa
          legenda={personagem.capa.legenda}
          src={personagem.capa.foto}
          acento={personagem.acento}
          className="h-full w-full"
          mostrarLegenda={false}
          borda="sangra"
        />
        <VeuDaRampa opacidade={rampa.veu} />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-black/45" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{ backgroundImage: `linear-gradient(to top, ${personagem.fundo}, transparent)` }}
      />

      <div className="relative z-10 w-full">
        <FichaControleDanos
          ficha={ficha}
          corDe={corAnterior}
          corPara={personagem.acento}
          total={total}
        />
      </div>
    </div>
  );
}

function ItemGaleria({ item, acento, index }) {
  const ref = useRef(null);
  const rampa = useRampa(ref);

  const posicao = [
    "col-span-12 md:col-span-7 md:col-start-1",
    "col-span-12 md:col-span-5 md:col-start-8",
    "col-span-12 md:col-span-6 md:col-start-4",
  ][index % 3];

  const empurra = ["md:mt-0", "md:mt-28", "md:mt-10"][index % 3];

  return (
    <figure ref={ref} className={`${posicao} ${empurra}`}>
      <motion.div
        className="relative"
        style={{
          scale: rampa.escala,
          rotate: item.inclinacao ?? 0,
          aspectRatio: item.ratio,
          maxHeight: "72vh",
        }}
      >
        <Polaroide
          legenda={item.legenda}
          src={item.foto}
          acento={acento}
          sizes="(min-width: 768px) 60vw, 100vw"
          className="h-full w-full"
        />
        <Fixadores fixadores={item.fixadores} acento={acento} />
        <VeuDaRampa opacidade={rampa.veu} />
      </motion.div>
    </figure>
  );
}

/** A citação de tela cheia. */
function Citacao({ personagem }) {
  const ref = useRef(null);
  const rampa = useRampa(ref);

  return (
    <div
      ref={ref}
      className="relative z-10 flex min-h-[70vh] items-center overflow-hidden py-12 md:min-h-[85vh] md:py-16"
    >
      <motion.div style={{ scale: rampa.escala }} className="absolute inset-0">
        <Chapa
          legenda={`${personagem.nome} — plano da citação`}
          src={personagem.fotoCitacao}
          acento={personagem.acento}
          className="h-full w-full"
          mostrarLegenda={false}
          borda="sangra"
        />
        <VeuDaRampa opacidade={rampa.veu} />
      </motion.div>
      <div className="absolute inset-0 bg-black/45" />
      <blockquote className="relative z-10 px-6 md:px-14 lg:px-20">
        <p
          className="display max-w-[16ch] text-[clamp(2rem,5.4vw,4.6rem)] text-bone"
          style={{ lineHeight: 1.02 }}
        >
          “{personagem.citacao}”
        </p>
        <footer className="eyebrow mt-6" style={{ color: personagem.acento }}>
          {personagem.nome}
        </footer>
      </blockquote>
    </div>
  );
}

export default function CapituloPersonagem({ personagem, ficha, corAnterior, indice, total }) {
  const textoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: textoRef,
    offset: ["start 0.85", "center center"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.35,
    restDelta: 0.001,
  });

  const numero = String(indice + 1).padStart(2, "0");

  return (
    <section
      id={personagem.slug}
      aria-labelledby={`${personagem.slug}-nome`}
      className="relative isolate"
      style={{ backgroundColor: personagem.fundo }}
    >
      <FundoCapitulo personagem={personagem} />

      <Capa personagem={personagem} ficha={ficha} corAnterior={corAnterior} total={total} />

      <div className="relative z-10 grid grid-cols-12 gap-4 px-6 pb-16 pt-14 md:gap-6 md:px-0 md:pb-24 md:pt-20">
        {/* ---- nome preso no topo ---- */}
        <header className="col-span-12 md:col-span-4 md:col-start-2 md:self-start md:sticky md:top-[104px]">
          <p className="eyebrow" style={{ color: personagem.acento }}>
            {numero} / {String(total).padStart(2, "0")} · {personagem.alcunha}
          </p>
          <h2
            id={`${personagem.slug}-nome`}
            className="display mt-4 text-[clamp(2.6rem,7vw,5.4rem)] text-bone"
            style={{ lineHeight: 0.98 }}
          >
            {personagem.nome}
          </h2>
          <div className="mt-6 h-[5px] w-20" style={{ backgroundColor: personagem.acento }} />
        </header>

        {/* ---- lead + corpo ---- */}
        <div ref={textoRef} className="col-span-12 md:col-span-5 md:col-start-7 md:pt-2">
          <ScrollRevealText
            text={personagem.lead}
            progress={p}
            from={0}
            to={0.55}
            restColor="#3a3a42"
            activeColor={personagem.acento}
            className="text-[clamp(1.35rem,2.6vw,2.1rem)] font-medium leading-tight"
          />
          <ScrollRevealText
            text={personagem.corpo}
            progress={p}
            from={0.3}
            to={1}
            restColor="#2a2a30"
            activeColor="#cfcbc2"
            className="mt-6 max-w-[46ch] text-[0.95rem] font-light leading-relaxed md:text-[1.02rem]"
          />
        </div>

      </div>

      {/* ---- galeria desencontrada ---- */}
      <div className="relative z-10 grid grid-cols-12 gap-4 px-10 pb-24 md:gap-6 md:px-14 md:pb-40">
        {personagem.galeria.map((item, i) => (
          <ItemGaleria key={item.legenda} item={item} acento={personagem.acento} index={i} />
        ))}
      </div>

      <Citacao personagem={personagem} />
    </section>
  );
}
