"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

import { SetaTeia } from "@/components/art";

/**
 * Botão de voltar ao topo.
 *
 * Some no começo da página e aparece depois da primeira tela e meia. Fica
 * abaixo da faixa de lugar (z-90) e do preloader (z-100) de propósito: nos
 * dois casos a página de trás não é o assunto.
 *
 * ------------------------------------------------------------------
 *  ⚠️ TERCEIRO DESENHO. A ordem importa para não repetir os dois primeiros:
 *
 *  1. Círculo `blood-400` maciço com uma ARANHA dentro. Caiu por dois motivos:
 *     vermelho cheio não existe em lugar nenhum do site (o vermelho é acento),
 *     e aranha não diz "subir".
 *  2. Pill com contorno e o rótulo "AO TOPO", igual ao do `Nav`. Resolvia a
 *     função, mas ele pediu algo mais discreto e padrão.
 *  3. **Este.** Círculo simples, sem texto, no VERMELHO DO FUNDO DO HERÓI com
 *     a seta em osso.
 *
 *  `bg-blood-800` é `#3a060f` — literalmente a cor em que o herói começa
 *  (`pageBg` interpola desse hex). Não é um vermelho novo escolhido no olho:
 *  é a cor que a página já abre, trazida para o canto. É escura o bastante
 *  para não brigar com o conteúdo, que era o defeito do desenho 1.
 *
 *  A seta é `bone`, não branco puro — branco puro não aparece no site.
 * ------------------------------------------------------------------
 *
 * ⚠️ Escondido não é só invisível. Opacidade zero continua clicável, focável
 * pelo Tab e anunciada pelo leitor de tela — um botão fantasma no meio da
 * navegação. Por isso `pointer-events-none`, `tabIndex={-1}` e `aria-hidden`
 * andam junto com a opacidade.
 */
export default function VoltarAoTopo() {
  const { scrollY } = useScroll();
  const [visivel, setVisivel] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    // uma tela e meia de desktop; no celular dá pouco mais de uma
    setVisivel(y > 800);
  });

  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visivel ? 1 : 0, y: visivel ? 0 : 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      /* `bottom` com `env()`: no iPhone a barra inferior do Safari come os
         últimos ~34px da viewport, e um `bottom-6` cravado deixava o botão
         debaixo dela. As cores saem dos tokens do site, não de hex solto.

         O anel de 1px não é enfeite: `blood-800` é bem escuro e o botão passa
         por cima de vídeo e de foto — sem uma borda clara, a silhueta some
         contra o preto do fecho. Mesmo motivo do `backdrop-blur` do `Nav`. */
      className={`group fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blood-800 text-bone shadow-xl shadow-black/50 ring-1 ring-bone/20 transition-colors hover:bg-blood-700 ${
        visivel ? "" : "pointer-events-none"
      }`}
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
      tabIndex={visivel ? 0 : -1}
      aria-hidden={!visivel}
      aria-label="Voltar ao topo"
    >
      <SetaTeia className="h-8 w-8 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </motion.button>
  );
}
