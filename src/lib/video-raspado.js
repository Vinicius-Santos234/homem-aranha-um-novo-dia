"use client";

import { useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

/** Vídeo comandado pela rolagem, quadro a quadro. */

/** @param progresso  MotionValue cru do `useScroll` (NÃO o amortecido) */
export function useVideoRaspado({
  progresso,
  de,
  ate,
  sobDemanda = false,
  margem = "2500px 0px",
  ativo = true,
}) {
  const videoRef = useRef(null);
  const alvoRef = useRef(0);
  const pendenteRef = useRef(false);
  const pedidoRef = useRef(null);

  const aplicarQuadro = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const duracao = video.duration;
    if (!duracao || Number.isNaN(duracao)) return;

    if (video.seeking) {
      pendenteRef.current = true;
      return;
    }

    const alvo = alvoRef.current * duracao;
    if (Math.abs(video.currentTime - alvo) > 1 / 240) {
      video.currentTime = alvo;
    }
  }, []);

  useMotionValueEvent(progresso, "change", (v) => {
    if (!ativo) return;
    if (v > 0) pedidoRef.current?.();

    const bruto = (v - de) / (ate - de);
    alvoRef.current = Math.min(Math.max(bruto, 0), 1);
    aplicarQuadro();
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ativo) return;

    const aoTerminarBusca = () => {
      if (!pendenteRef.current) return;
      pendenteRef.current = false;
      aplicarQuadro();
    };
    video.addEventListener("seeked", aoTerminarBusca);

    const destravar = () => {
      video
        .play()
        .then(() => {
          video.pause();
          aplicarQuadro();
        })
        .catch(() => {});
    };

    if (!sobDemanda) {
      if (video.readyState >= 1) destravar();
      video.addEventListener("loadedmetadata", destravar);

      return () => {
        video.removeEventListener("loadedmetadata", destravar);
        video.removeEventListener("seeked", aoTerminarBusca);
      };
    }

    let pedido = false;
    const garantirCarregado = () => {
      if (pedido) return;
      pedido = true;
      observador.disconnect();
      video.preload = "auto";
      video.load();
      if (video.readyState >= 1) destravar();
      video.addEventListener("loadedmetadata", destravar, { once: true });
    };
    pedidoRef.current = garantirCarregado;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) garantirCarregado();
      },
      { rootMargin: margem },
    );
    observador.observe(video);

    return () => {
      pedidoRef.current = null;
      observador.disconnect();
      video.removeEventListener("loadedmetadata", destravar);
      video.removeEventListener("seeked", aoTerminarBusca);
    };
  }, [aplicarQuadro, sobDemanda, margem, ativo]);

  return videoRef;
}
