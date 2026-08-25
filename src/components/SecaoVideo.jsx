"use client";

import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import Chapa from "@/components/Chapa";
import { useVideoUmaVez } from "@/lib/video-uma-vez";

/* ------------------------------------------------------------------ *
 *  O fecho — o clipe toca sozinho, uma vez, quando a seção chega.
 *
 *  ⚠️ ISTO JÁ FOI RASPAGEM POR ROLAGEM (o mesmo `useVideoRaspado` do herói) e
 *  VOLTOU para reprodução normal em 2026-08-24. O motivo é de direção, não
 *  defeito — a raspagem funcionava:
 *
 *    · com a seção alta o bastante para o plano respirar (1000vh), chegar ao
 *      fim custava umas 8 telas de rolagem, e quem parava de girar via o filme
 *      parar junto — o mergulho nunca terminava sozinho;
 *    · encurtando a seção para acelerar, cada pixel rolado avançava filme
 *      demais e o plano passava rápido demais para ler.
 *
 *  Não existe altura que resolva as duas coisas ao mesmo tempo: o fecho é um
 *  plano de 8s que precisa correr no tempo dele. Aqui quem manda no tempo é o
 *  vídeo, não o dedo.
 *
 *  TOCA UMA VEZ SÓ. Sem `loop`. Terminou, fica congelado no último quadro para
 *  sempre — descer, subir e voltar não recomeça nada. O clipe só roda de novo
 *  quando a página recarrega, que é quando o componente nasce outra vez e o
 *  `terminou` volta a ser `false`.
 *
 *  O APAGAR DO FIM sobreviveu à volta: o brilho cai para `BRILHO_NO_FIM` quando
 *  o plano acaba, que é o mesmo recolhimento que a raspagem fazia no rabo da
 *  rolagem. Só que agora quem dá a deixa é o evento `ended` do vídeo, não a
 *  posição do dedo.
 *
 *  ⚠️ O ARQUIVO AINDA É O ENCODE DE RASPAGEM: 15fps, todo quadro chave, 3,7 MB
 *  para 8 segundos. Ele TOCA, mas 15fps em reprodução normal treme um pouco, e
 *  o "todo quadro chave" virou peso morto — só existia para a busca ser
 *  instantânea. Reencodando da fonte (24fps, GOP normal) o arquivo cai para
 *  uma fração disso e o movimento fica liso. A fonte do fecho não está em
 *  `_arquivo/originais/` — lá só tem a do herói.
 *
 *  Para trocar o clipe, mexa só aqui em cima. Zerando VIDEO, a seção volta a
 *  desenhar uma chapa e o resto continua igual.
 * ------------------------------------------------------------------ */

const VIDEO = "/fecho.mp4";
const POSTER = "/fecho-poster.jpg";
const ACENTO = "#e01b2c";

const RETRANCA = "O dia seguinte";
/* Fecho da página. Segue a regra do site: nada de estreia nem ingresso, e
   nada do terceiro ato — quem chega aqui ainda não viu o filme. */
const TITULO = "A cidade nunca vai saber quem foi";
const LINHA = "Sem nome, sem crédito, sem ninguém esperando quando ele voltar. Quatro anos assim — e ele continua subindo todo dia.";

/* Para onde o brilho cai quando o plano acaba. É o mesmo 0,28 que a raspagem
   usava no rabo da rolagem — escuro o bastante para o plano recolher e o texto
   ficar sozinho, claro o bastante para ainda se ver o que está acontecendo.
   Zerando, a seção termina em preto puro e o fecho perde a imagem. */
const BRILHO_NO_FIM = 0.28;

/* Quanto da seção precisa estar à mostra para o clipe começar. Alto de
   propósito: com um quarto à mostra o mergulho começava com a seção ainda
   entrando pela quina de baixo, e a primeira metade do plano se perdia. */
const VISIVEL_PARA_TOCAR = 0.6;

/* Antecedência do download. A seção fica a ~17 telas do topo — baixar os
   megabytes de saída já no primeiro quadro seria banda à toa para quem talvez
   nem chegue aqui. Duas telas dão tempo de bufferizar antes de tocar. */
const MARGEM_DOWNLOAD = "2000px 0px";

/**
 * Toca o clipe uma vez, quando a seção aparece, e só.
 *
 * ⚠️ Dois observadores, não um. O que baixa precisa de antecedência (margem
 * larga); o que toca precisa do contrário — só disparar com a seção de fato na
 * tela. Um observador não faz as duas coisas, e resolver tudo no de margem
 * larga fazia o plano começar a correr duas telas antes de alguém ver.
 *
 * ⚠️ A ORDEM IMPORTA: `load()` no meio de uma reprodução volta o vídeo a zero.
 * Por isso o observador do download se desconecta assim que dispara — ele roda
 * uma vez, e sempre antes do outro (margem maior = cruza antes).
 */

export default function SecaoVideo() {
  const ref = useRef(null);

  /* O apagar do fim. Antes isto era o rabo da raspagem — o brilho caía para
     0,28 nos últimos 18% da rolagem, e o plano morria no preto do site junto
     com a seção. Sem rolagem comandando nada, quem dá o fim é o próprio clipe:
     acabou o plano, a imagem baixa e o texto fica sozinho na tela. */
  const apagar = useMotionValue(1);
  const aoTerminarClipe = useCallback(() => {
    animate(apagar, BRILHO_NO_FIM, { duration: 1.8, ease: [0.4, 0, 0.2, 1] });
  }, [apagar]);

  const videoRef = useVideoUmaVez({
    aoTerminar: aoTerminarClipe,
    margem: MARGEM_DOWNLOAD,
    visivel: VISIVEL_PARA_TOCAR,
  });

  /* A rolagem não comanda mais o clipe — comanda só a chegada. O trecho vai de
     "a seção encosta na quina de baixo" até "a seção tomou a tela": é nele que
     o preto do site abre no plano. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  });

  /* Correção de cor na entrada: a seção nasce do preto do site, para emendar
     na seção de lugares sem costura visível. */
  const brilhoDeEntrada = useTransform(p, [0, 0.75], [0.18, 1]);
  const escala = useTransform(p, [0, 1], [1.1, 1]);

  /* Os dois brilhos MULTIPLICAM, não se sobrescrevem: um é a chegada, o outro
     é o fim, e eles chegam a se encavalar (dá para o clipe acabar com a seção
     ainda subindo). Multiplicando, quem estiver mais escuro manda, e a entrada
     nunca reacende um plano que já apagou. */
  const brilho = useTransform(
    [brilhoDeEntrada, apagar],
    ([entrada, fim]) => entrada * fim,
  );
  /* ⚠️ Véu preto e não `filter: brightness()`. Mesmo motivo do herói e dos
     capítulos: filtro que muda de valor rasteriza a subárvore de novo a cada
     quadro, e aqui a subárvore é um vídeo. Preto a `1 - brilho` por cima dá
     exatamente o mesmo resultado que multiplicar os canais por `brilho`, e a
     opacidade o compositor resolve sozinho. */
  const veu = useTransform(brilho, (b) => 1 - b);

  return (
    <section id="fecho" ref={ref} aria-label={TITULO} className="relative h-screen bg-void">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ scale: escala }} className="absolute inset-0">
          {VIDEO ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={VIDEO}
              poster={POSTER ?? undefined}
              muted
              playsInline
              /* nada de `loop`: o plano acaba e fica parado no último quadro */
              preload="none"
              aria-label="O Homem-Aranha mergulhando sobre a cidade"
            />
          ) : (
            <Chapa
              legenda="Clipe do fecho — o plano que encerra a página"
              acento={ACENTO}
              className="h-full w-full"
              mostrarLegenda={false}
            />
          )}

          <motion.div
            aria-hidden
            style={{ opacity: veu }}
            className="pointer-events-none absolute inset-0 bg-black"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,3,4,0.9),transparent_55%)]" />

        {/* O texto sobe depois que o plano já está correndo. O atraso é do
            framer e não do vídeo de propósito: se o clipe falhar em carregar,
            o fecho ainda precisa ter palavra. */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 bottom-0 px-6 pb-28 md:px-14 md:pb-24"
        >
          <p className="eyebrow" style={{ color: ACENTO }}>
            {VIDEO ? RETRANCA : "Template — falta o clipe"}
          </p>
          <h2
            className="display mt-4 max-w-[18ch] text-[clamp(2.2rem,6vw,5rem)] text-bone"
            style={{ lineHeight: 1.02 }}
          >
            {TITULO}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[0.98rem] font-light leading-relaxed text-bone-dim/80">
            {LINHA}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
