"use client";

import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

import SinalAranha from "@/components/SinalAranha";

/** Preloader */

const MIN = 420;
const MAX = 2400;

export default function Preloader() {
  const [aberto, setAberto] = useState(true);
  const [semSaida, setSemSaida] = useState(false);
  const progresso = useMotionValue(0);

  const [semMovimento] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const raiz = document.documentElement;
    const antes = { html: raiz.style.overflow, body: document.body.style.overflow };
    raiz.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" });

    const janela = semMovimento ? 1 : MAX;
    const espera = semMovimento ? 0 : MIN;

    const inicio = performance.now();
    let pronto = semMovimento;
    let quadro;
    let saida;

    const passear = (agora) => {
      const t = Math.min((agora - inicio) / janela, 1);
      const teto = pronto ? 1 : 0.9;
      const alvo = Math.min(1 - Math.pow(1 - t, 2.2), teto);
      progresso.set(Math.max(progresso.get(), alvo));

      if (progresso.get() >= 0.999) {
        saida = setTimeout(fechar, semMovimento ? 0 : 140);
        return;
      }
      quadro = requestAnimationFrame(passear);
    };

    const fechar = () => {
      if (semMovimento || document.hidden) setSemSaida(true);
      setAberto(false);
      window.dispatchEvent(new Event("preloader:fim"));
    };

    const marcarPronto = () => {
      const decorrido = performance.now() - inicio;
      if (decorrido < espera) {
        setTimeout(() => {
          pronto = true;
        }, espera - decorrido);
      } else {
        pronto = true;
      }
    };

    const esperarVideo = () =>
      new Promise((resolve) => {
        const video = document.querySelector("#hero video");
        if (!video) return resolve();
        if (video.readyState >= 2) return resolve();
        const ok = () => {
          video.removeEventListener("loadeddata", ok);
          resolve();
        };
        video.addEventListener("loadeddata", ok);
      });

    Promise.all([document.fonts?.ready ?? Promise.resolve(), esperarVideo()]).then(marcarPronto);

    quadro = requestAnimationFrame(passear);
    const guarda = setTimeout(fechar, janela + 700);

    return () => {
      cancelAnimationFrame(quadro);
      clearTimeout(saida);
      clearTimeout(guarda);
      raiz.style.overflow = antes.html;
      document.body.style.overflow = antes.body;
    };
  }, [progresso, semMovimento]);

  useEffect(() => {
    if (aberto) return;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }, [aberto]);

  if (semSaida && !aberto) return null;

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          key="preloader"
          data-preloader
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void"
        >
          <SinalAranha
            progresso={progresso}
            className="h-auto w-[min(216px,52vw)] text-bone"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
