"use client";

import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

import SinalAranha from "@/components/SinalAranha";

/* ------------------------------------------------------------------ *
 *  Preloader
 *
 *  A versão anterior era uma contagem de 2.200ms que NÃO esperava nada:
 *  cronômetro com cara de carregamento. Esta espera o que de fato importa —
 *  as fontes e o primeiro quadro do clipe do herói — e sai assim que chega.
 *
 *  Por que a tela existe: o herói é vídeo comandado pela rolagem. Sem travar
 *  a página e voltar ao topo, um F5 no meio do site abre o herói já no meio
 *  da transformação, com o vídeo num quadro qualquer.
 *
 *  MIN evita o pisca-pisca de uma tela que aparece e some no mesmo quadro;
 *  MAX é rede de segurança — nada aqui pode prender a pessoa.
 * ------------------------------------------------------------------ */

const MIN = 420;
const MAX = 2400;

export default function Preloader() {
  const [aberto, setAberto] = useState(true);
  const [semSaida, setSemSaida] = useState(false);
  const progresso = useMotionValue(0);

  // inicializador preguiçoso: no servidor cai em false, então o HTML dos dois
  // lados é o mesmo e a hidratação não diverge
  const [semMovimento] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    // quem rola aqui é o <html>: travar só o <body> não segura nada
    const raiz = document.documentElement;
    const antes = { html: raiz.style.overflow, body: document.body.style.overflow };
    raiz.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // instant: o html tem scroll-behavior smooth, e sem isto a volta ao topo
    // vira uma animação acontecendo atrás da tela de carregamento
    window.scrollTo({ top: 0, behavior: "instant" });

    /* Com movimento reduzido a tela não some por um caminho separado: ela
       entra no mesmo laço com janela de 1ms e já pronta, e fecha no primeiro
       quadro. Um `setState` solto aqui no corpo do efeito seria mais curto,
       mas o React (e o ESLint) não aceitam — e o caminho único evita que os
       dois modos se comportem diferente por acidente. */
    const janela = semMovimento ? 1 : MAX;
    const espera = semMovimento ? 0 : MIN;

    const inicio = performance.now();
    let pronto = semMovimento;
    let quadro;
    let saida;

    /* A barra corre até 90% no tempo esperado e só fecha os 10% finais quando
       o conteúdo realmente chegou. É o oposto da versão antiga, onde os 100%
       não queriam dizer nada. */
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
      // aba oculta congela o rAF, e a animação de saída do Framer roda em rAF:
      // sem cortá-la o painel fica preso até a pessoa voltar para a aba
      if (semMovimento || document.hidden) setSemSaida(true);
      setAberto(false);
      /* Quem espera por isto é o `AvisoEntrada`, que não pode aparecer por
         cima da tela de carregamento. Evento e não prop porque os dois não se
         conhecem: o preloader vive na página e o aviso, no layout. Quem não
         encontra um preloader na página não espera evento nenhum. */
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

    /* O clipe do herói só é útil quando dá para buscar quadro nele
       (readyState >= 2). Se não houver vídeo na página, não se espera por ele. */
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
    // rede de segurança em tempo de relógio: em aba de segundo plano o rAF
    // nunca roda, a barra não anda e a tela ficaria para sempre
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

  // sem animação de saída o nó some direto. não basta zerar a duração: o
  // AnimatePresence ainda segura o elemento até o loop de quadro liberar, e em
  // aba oculta esse loop não roda
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
          {/* O sinal desenha-se conforme carrega — ele É a barra de progresso,
              e por isso a barra saiu. Duas coisas medindo a mesma coisa na
              mesma tela só dariam chance de discordarem. */}
          <SinalAranha
            progresso={progresso}
            className="h-auto w-[min(216px,52vw)] text-bone"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
