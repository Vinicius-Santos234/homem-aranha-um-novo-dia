"use client";

import { useEffect, useRef } from "react";

import Chapa from "@/components/Chapa";
import Polaroide from "@/components/Polaroide";

/** A faixa horizontal de um lugar. */
export default function FaixaLugar({ lugar, aoFechar }) {
  const scrollerRef = useRef(null);
  const voltarRef = useRef(null);

  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const aoTeclar = (e) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", aoTeclar);

    voltarRef.current?.focus();

    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aoFechar]);

  /** Roda do mouse para baixo = faixa para o lado. */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const semInercia = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let alvo = el.scrollLeft;
    let quadro = null;

    const passear = () => {
      const falta = alvo - el.scrollLeft;
      if (Math.abs(falta) < 0.5) {
        el.scrollLeft = alvo;
        quadro = null;
        return;
      }
      el.scrollLeft += falta * 0.16;
      quadro = requestAnimationFrame(passear);
    };

    const aoRolar = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;

      e.preventDefault();
      const passo =
        e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * el.clientWidth : e.deltaY;

      if (semInercia || document.hidden) {
        el.scrollLeft += passo;
        alvo = el.scrollLeft;
        return;
      }

      const limite = el.scrollWidth - el.clientWidth;
      alvo = Math.min(Math.max(alvo + passo, 0), limite);
      if (quadro === null) quadro = requestAnimationFrame(passear);
    };

    const aoMudar = () => {
      if (quadro === null) alvo = el.scrollLeft;
    };

    el.addEventListener("wheel", aoRolar, { passive: false });
    el.addEventListener("scroll", aoMudar, { passive: true });
    return () => {
      el.removeEventListener("wheel", aoRolar);
      el.removeEventListener("scroll", aoMudar);
      if (quadro !== null) cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${lugar.nome} — galeria`}
      className="fixed inset-0 z-[90]"
      style={{ backgroundColor: lugar.fundo, color: lugar.tinta }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            `radial-gradient(120% 90% at 12% 100%, ${lugar.acento}35 0%, transparent 62%)`,
            "repeating-linear-gradient(168deg, rgba(255,255,255,0.02) 0px, transparent 1px, transparent 15px)",
            "repeating-linear-gradient(174deg, rgba(255,255,255,0.01) 0px, transparent 1px, transparent 9px)",
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 4px)",
          ].join(", "),
        }}
      />

      <button
        ref={voltarRef}
        type="button"
        onClick={aoFechar}
        className="eyebrow fixed left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full px-5 py-3 text-ink transition-transform duration-200 hover:-translate-x-1 md:left-9 md:top-9"
        style={{ backgroundColor: lugar.acento }}
      >
        <span aria-hidden>←</span> Voltar
      </button>

      <div
        ref={scrollerRef}
        tabIndex={0}
        style={{ "--acento-faixa": lugar.acento }}
        className="faixa-h relative flex h-full w-full items-end gap-8 overflow-x-auto overflow-y-hidden overscroll-none px-6 pb-10 pt-28 md:gap-14 md:px-14 md:pt-32"
      >
        {/* ---- painel de abertura ---- */}
        <div className="flex flex-none flex-col justify-center gap-7 self-stretch md:flex-row md:items-center md:gap-16">
          <figure className="w-[62vw] max-w-[300px] flex-none rotate-[-2.5deg] bg-bone p-3 shadow-2xl shadow-black/50 md:w-[520px] md:max-w-[560px]">
            <Chapa
              legenda={`${lugar.nome} — cartão-postal`}
              src={lugar.foto}
              acento={lugar.acento}
              sizes="(min-width: 768px) 560px, 62vw"
              className="w-full"
              style={{ aspectRatio: "4 / 3" }}
              mostrarLegenda={false}
              borda="nua"
            />
            <figcaption className="display mt-3 text-center text-[1.5rem] text-ink">
              {lugar.logotipo}
            </figcaption>
          </figure>

          <div className="w-[82vw] max-w-[430px] flex-none">
            <h2
              className="display text-[clamp(2rem,4vw,3.4rem)]"
              style={{ color: lugar.acento, lineHeight: 1.04 }}
            >
              {lugar.titulo}
            </h2>
            <p className="eyebrow mt-5 leading-relaxed opacity-90">{lugar.destaque}</p>
            <p className="mt-5 text-[0.95rem] font-light leading-relaxed opacity-75">
              {lugar.corpo}
            </p>
          </div>
        </div>

        {/* ---- a colagem ---- */}
        {lugar.galeria.map((item) => (
          <figure
            key={item.legenda}
            className="flex-none"
            style={{
              width: `min(${item.w}px, 78vw)`,
              height: `${item.h * 100}%`,
              transform: `translateY(-${((item.sobe * (1 - item.h)) / item.h) * 100}%) rotate(${item.rot}deg)`,
            }}
          >
            <Polaroide
              legenda={item.legenda}
              src={item.foto}
              acento={lugar.acento}
              sizes="(min-width: 768px) 1040px, 78vw"
              className="h-full w-full"
            />
          </figure>
        ))}

        <div aria-hidden className="h-px w-2 flex-none md:w-8" />
      </div>
    </div>
  );
}
