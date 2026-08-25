"use client";

import { useEffect, useRef } from "react";

/** Vídeo que toca UMA VEZ ao entrar em cena e para no último quadro. */

/** @param aoTerminar  callback do `ended`. ⚠️ PRECISA ser estável (`useCallback`): */
export function useVideoUmaVez({
  aoTerminar,
  margem = "1200px 0px",
  visivel = 0.35,
  ativo = true,
  pronto = true,
} = {}) {
  const videoRef = useRef(null);
  const terminouRef = useRef(false);
  const baixouRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ativo) return;

    const marcarFim = () => {
      terminouRef.current = true;
      aoTerminar?.();
    };
    video.addEventListener("ended", marcarFim);

    const baixar = () => {
      if (baixouRef.current) return;
      baixouRef.current = true;
      video.preload = "auto";
      video.load();
    };

    const download = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        download.disconnect();
        baixar();
      },
      { rootMargin: margem },
    );
    download.observe(video);

    const reproducao = new IntersectionObserver(
      ([entrada]) => {
        if (terminouRef.current) return;

        if (entrada.isIntersecting && pronto) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: visivel },
    );
    reproducao.observe(video);

    return () => {
      download.disconnect();
      reproducao.disconnect();
      video.removeEventListener("ended", marcarFim);
    };
  }, [aoTerminar, margem, visivel, ativo, pronto]);

  return videoRef;
}
