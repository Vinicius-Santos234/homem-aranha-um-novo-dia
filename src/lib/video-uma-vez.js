"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  Vídeo que toca UMA VEZ ao entrar em cena e para no último quadro.
 *
 *  O oposto de `video-raspado.js`, e os dois existem de propósito: ali quem
 *  manda no tempo é o dedo, aqui é o clipe. Quando usar cada um está escrito
 *  no cabeçalho do `SecaoVideo` — resumindo: plano com ritmo próprio (um
 *  mergulho, uma virada de cabeça) quer tocar; imagem que o texto acompanha
 *  quer ser raspada.
 *
 *  TOCA UMA VEZ SÓ. Sem `loop`. Terminou, fica congelado no último quadro para
 *  sempre — descer, subir e voltar não recomeça nada. Só a página recarregar
 *  faz o componente nascer de novo e o `terminou` voltar a ser `false`.
 *
 *  Extraído do `SecaoVideo` em 25/08, quando o herói passou a usar o mesmo
 *  padrão no celular.
 * ------------------------------------------------------------------ */

/**
 * @param aoTerminar  callback do `ended`. ⚠️ PRECISA ser estável (`useCallback`):
 *                    recriada a cada render, derruba e remonta os observadores.
 * @param margem      antecedência do download, em `rootMargin`
 * @param visivel     fração da seção na tela para o clipe começar
 * @param ativo       `false` desliga o hook inteiro — para quem escolhe entre
 *                    tocar e raspar em tempo de execução
 * @param pronto      `false` segura o play sem impedir o download. Serve para
 *                    não começar o plano atrás de uma tela que cobre o site
 *                    (ver `lib/entrada.js`)
 * @returns ref para pendurar no `<video>`
 */
export function useVideoUmaVez({
  aoTerminar,
  margem = "1200px 0px",
  visivel = 0.35,
  ativo = true,
  pronto = true,
} = {}) {
  const videoRef = useRef(null);
  /* Em ref, não em state: nada na tela depende disto, e um re-render aqui
     remontaria a coreografia à toa. */
  const terminouRef = useRef(false);
  /* ⚠️ Guarda o download para acontecer UMA VEZ. Sem isto, qualquer coisa que
     refaça o efeito (o `pronto` virando true, por exemplo) chamaria `load()` de
     novo — e `load()` zera o vídeo. */
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
        /* Terminou é terminou: não toca de novo nem mexe no quadro parado. */
        if (terminouRef.current) return;

        /* Sair da tela no meio do plano PAUSA, não reinicia — voltar continua
           de onde parou. `play()` num vídeo que já acabou recomeçaria do zero,
           e é exatamente isso que o `terminou` acima barra. */
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
