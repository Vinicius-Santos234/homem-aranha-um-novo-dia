"use client";

import { useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  Vídeo comandado pela rolagem, quadro a quadro.
 *
 *  HOJE SÓ O `Hero` USA ISTO. Nasceu extraído porque o `SecaoVideo` fazia o
 *  mesmo com o código copiado; o fecho voltou a tocar normal em 2026-08-24 (o
 *  porquê está escrito lá). O arquivo fica: as armadilhas abaixo custaram caro
 *  para achar e a do herói continua de pé.
 *
 *  ⚠️ O ARQUIVO NÃO PODE SER UM MP4 QUALQUER. Raspagem exige **todo quadro ser
 *  chave** (`-g 1 -keyint_min 1 -sc_threshold 0`): sem isso, cada busca precisa
 *  decodificar desde o keyframe anterior e a imagem descola do dedo.
 *
 *  ⚠️ Nada de AV1 nem VP9: no Safari sem decodificação por hardware a seção
 *  fica no pôster. H.264 nos dois clipes.
 *
 *  ⚠️ A MOLA DA ROLAGEM NÃO ENTRA AQUI. Quem raspa é o progresso cru: mola no
 *  scrub deixa a imagem borrachuda, sempre atrasada em relação ao dedo. A mola
 *  serve para o que é decorativo, e fica na seção.
 * ------------------------------------------------------------------ */

/**
 * @param progresso  MotionValue cru do `useScroll` (NÃO o amortecido)
 * @param de/ate     trecho do progresso que comanda o clipe; fora dele o vídeo
 *                   fica preso no primeiro/último quadro
 * @param sobDemanda quando `true`, o clipe só é baixado quando a seção se
 *                   aproxima (ver `margem`). Para seção que fica muitas telas
 *                   abaixo do topo — baixar megabytes de saída é banda à toa
 *                   para quem talvez nem chegue lá.
 * @param margem     antecedência do observador, em `rootMargin`
 * @returns ref para pendurar no `<video>`
 */
export function useVideoRaspado({ progresso, de, ate, sobDemanda = false, margem = "2500px 0px" }) {
  const videoRef = useRef(null);
  const alvoRef = useRef(0);
  const pendenteRef = useRef(false);
  const pedidoRef = useRef(null);

  const aplicarQuadro = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const duracao = video.duration;
    if (!duracao || Number.isNaN(duracao)) return;

    /* Pedir uma busca nova com outra em andamento enfileira trabalho e engasga
       em rolagem rápida. Marca como pendente e reaplica quando a anterior
       terminar — o alvo já estará atualizado, então nada se perde. */
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
    // Rede de segurança do carregamento sob demanda: se a seção já está sendo
    // raspada, o clipe precisa existir — não importa se o observador disparou.
    if (v > 0) pedidoRef.current?.();

    const bruto = (v - de) / (ate - de);
    alvoRef.current = Math.min(Math.max(bruto, 0), 1);
    aplicarQuadro();
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const aoTerminarBusca = () => {
      if (!pendenteRef.current) return;
      pendenteRef.current = false;
      aplicarQuadro();
    };
    video.addEventListener("seeked", aoTerminarBusca);

    /* O clipe nunca toca sozinho — mas um play/pause mudo destrava o
       decodificador, sem o que o iOS ignora busca em vídeo que nunca rodou. */
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

    /* Idempotente e chamável de fora: a rolagem também dispara isto assim que
       a seção começa a ser raspada, como segundo caminho caso o observador não
       tenha chegado a rodar.

       ⚠️ O que esse segundo caminho NÃO resolve: em aba oculta o navegador não
       roda o pipeline de renderização, então **nem o observador nem o
       progresso disparam** — medido. Não é problema real: aba oculta não está
       mostrando nada a ninguém. Mas não confunda os dois casos. */
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
  }, [aplicarQuadro, sobDemanda, margem]);

  return videoRef;
}
