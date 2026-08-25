"use client";

import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import ScrollGlitchText from "@/components/ScrollGlitchText";
import { SpiderWeb } from "@/components/art";
import { assinarEntrada, lerEntrada, lerEntradaNoServidor } from "@/lib/entrada";
import { useVideoRaspado } from "@/lib/video-raspado";
import { useVideoUmaVez } from "@/lib/video-uma-vez";

const PARAGRAFO =
  "Quatro anos desde que o mundo esqueceu o nome dele. Ele atravessa a multidão sem ser reconhecido, vê de longe as duas pessoas que mais ama — e o próprio corpo começa a mudar, como se o tempo sozinho também tivesse virado poder.";

const ANTES_E_AGORA = [
  { antes: "Traje Tecnológico", agora: "Costurado no sótão" },
  { antes: "Lançador no pulso", agora: "Teia saindo da pele" },
  { antes: "O mundo sabia seu nome", agora: "Ninguém mais sabe" },
];

const SCRUB_DE = 0.02;
const SCRUB_ATE = 0.9;

/** ---- o selo "role a página" ---- */
const SELO_RAIO = 72;
const SELO_VOLTA = 2 * Math.PI * SELO_RAIO;
const SELO_UNIDADE = "ROLE A PÁGINA\u00A0·\u00A0";
const SELO_TEXTO = SELO_UNIDADE.repeat(2);

/** Mede o texto do selo e devolve o `textLength` que faz a volta fechar. */
function useVoltaDoSelo(textoRef) {
  const [comprimento, setComprimento] = useState(SELO_VOLTA);

  useEffect(() => {
    const el = textoRef.current;
    if (!el) return;

    const ajustar = () => {
      const largura = el.getComputedTextLength();
      const n = el.getNumberOfChars();
      if (!largura || !n) return;
      setComprimento(SELO_VOLTA - (SELO_VOLTA - largura) / n);
    };

    ajustar();
    document.fonts?.ready.then(ajustar).catch(() => {});
  }, [textoRef]);

  return comprimento;
}

function MorphLine({
  progress,
  from,
  to,
  antes,
  agora,
  colorBefore,
  colorAfter,
  delay,
  estatico = false,
}) {
  const mid = from + (to - from) * 0.45 + delay;
  const beforeOpacity = useTransform(progress, [from + delay, mid], [1, 0]);
  const afterOpacity = useTransform(progress, [mid, to + delay], [0, 1]);

  if (estatico) {
    return (
      <li className="grid">
        <span className="eyebrow col-start-1 row-start-1" style={{ color: colorAfter }}>
          {agora}
        </span>
      </li>
    );
  }

  return (
    <li className="grid">
      <motion.span
        style={{ opacity: beforeOpacity, color: colorBefore }}
        className="eyebrow col-start-1 row-start-1"
      >
        {antes}
      </motion.span>
      <motion.span
        style={{ opacity: afterOpacity, color: colorAfter }}
        className="eyebrow col-start-1 row-start-1"
      >
        {agora}
      </motion.span>
    </li>
  );
}

const TELA_PEQUENA = "(max-width: 767px)";
const assinarTelaPequena = (aoMudar) => {
  const mq = window.matchMedia(TELA_PEQUENA);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
};
const lerTelaPequena = () => window.matchMedia(TELA_PEQUENA).matches;

export default function Hero() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const telaPequena = useSyncExternalStore(assinarTelaPequena, lerTelaPequena, () => false);

  /** ---- o clipe: raspado no desktop, tocado no celular ---- */
  const raspadoRef = useVideoRaspado({
    progresso: scrollYProgress,
    de: SCRUB_DE,
    ate: SCRUB_ATE,
    ativo: !telaPequena,
  });

  const telaLivre = useSyncExternalStore(assinarEntrada, lerEntrada, lerEntradaNoServidor);
  const umaVezRef = useVideoUmaVez({
    ativo: telaPequena,
    pronto: telaLivre,
    margem: "0px",
    visivel: 0.2,
  });

  const videoRef = useCallback(
    (el) => {
      raspadoRef.current = el;
      umaVezRef.current = el;
    },
    [raspadoRef, umaVezRef],
  );

  /** ---- o resto da coreografia ---- */

  const pageBg = useTransform(p, [0, 0.5, 0.86], ["#3a060f", "#1e040a", "#050506"]);
  const webOpacity = useTransform(p, [0, 0.6], [0.14, 0.03]);

  const sat = useTransform(p, [0.05, 0.6], [0.5, 1.05]);
  const con = useTransform(p, [0.05, 0.6], [1.14, 1.04]);
  const videoFilter = useMotionTemplate`saturate(${sat}) contrast(${con})`;
  const veuDoClipe = useTransform(p, [0.05, 0.6], [0.28, 0]);
  const videoScale = useTransform(p, [0, 1], [1.08, 1]);

  const colunaOpacity = useTransform(p, [0.5, 0.72], [1, 0]);
  const esquerdaX = useTransform(p, [0.35, 0.8], ["0%", "-12%"]);
  const direitaX = useTransform(p, [0.35, 0.8], ["0%", "12%"]);

  const scrimOpacity = useTransform(p, [0.5, 0.78], [1, 0.25]);

  const padTop = useTransform(p, [0.84, 1], [84, 0]);
  const padSide = useTransform(p, [0.84, 1], [16, 0]);
  const cardPadding = useMotionTemplate`${padTop}px ${padSide}px ${padSide}px`;
  const cardRadius = useTransform(p, [0.84, 1], [40, 0]);

  const hintOpacity = useTransform(p, [0, 0.1], [1, 0]);

  const textoSeloRef = useRef(null);
  const seloComprimento = useVoltaDoSelo(textoSeloRef);

  const dim = "#9b9ba5";

  /** ---- o herói no celular não tem coreografia ---- */
  const parado = (movel, valor) => (telaPequena ? valor : movel);
  const accent = "#e01b2c";

  return (
    <section id="hero" ref={ref} className="relative h-screen md:h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ backgroundColor: parado(pageBg, "#3a060f") }} className="absolute inset-0">
          <motion.div style={{ opacity: parado(webOpacity, 0.14) }} className="absolute inset-0 text-bone">
            <SpiderWeb
              className="absolute -left-[22vw] top-[-18vh] h-[110vh] w-[110vh]"
              strokeWidth={1.4}
            />
            <SpiderWeb
              className="absolute -right-[26vw] bottom-[-24vh] h-[95vh] w-[95vh]"
              strokeWidth={1.4}
            />
          </motion.div>
        </motion.div>

        <motion.div style={{ padding: parado(cardPadding, "84px 16px 16px") }} className="absolute inset-0">
          <motion.div
            style={{ borderRadius: parado(cardRadius, 40) }}
            className="grain relative h-full w-full overflow-hidden bg-[#07070a]"
          >
            {/* ---- o clipe, cobrindo o herói inteiro ---- */}
            <motion.video
              ref={videoRef}
              style={{ scale: parado(videoScale, 1), filter: telaPequena ? "none" : videoFilter }}
              className="absolute inset-0 h-full w-full object-cover"
              src="/corte.mp4"
              poster="/corte-poster.jpg"
              muted
              playsInline
              preload="auto"
              aria-label="Peter Parker atrás das grades, levantando o olhar"
            />

            <motion.div
              aria-hidden
              style={{ opacity: parado(veuDoClipe, 0) }}
              className="pointer-events-none absolute inset-0 bg-black"
            />

            {/* ---- véus de leitura: sem eles o texto some sobre a imagem ---- */}
            <motion.div
              style={{ opacity: parado(scrimOpacity, 1) }}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(3,3,4,0.86),rgba(3,3,4,0.45)_34%,rgba(3,3,4,0.2)_50%,rgba(3,3,4,0.6))]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(3,3,4,0.85),transparent)]" />

            {/* ---- conteúdo ---- */}
            <div className="relative z-10 grid h-full grid-cols-12 content-between items-center gap-6 px-6 pb-28 pt-8 lg:content-center lg:px-14 lg:py-10">
              <motion.div style={{ x: parado(esquerdaX, 0) }} className="col-span-12 lg:col-span-4">
                <motion.p style={{ opacity: parado(colunaOpacity, 1), color: dim }} className="eyebrow">
                  Nova York — quatro anos depois do feitiço
                </motion.p>

                <h1 className="display mt-5 text-[clamp(2.75rem,7.2vw,6.75rem)] text-bone">
                  Um novo
                  <br />
                  dia
                </h1>

                <motion.div
                  style={{ opacity: parado(colunaOpacity, 1) }}
                  className="mt-6 h-[6px] w-24 bg-blood-500"
                />

                <motion.ul style={{ opacity: parado(colunaOpacity, 1) }} className="mt-9 flex flex-col gap-4">
                  {ANTES_E_AGORA.map((linha, i) => (
                    <MorphLine
                      key={linha.antes}
                      progress={p}
                      from={0.2}
                      to={0.5}
                      delay={i * 0.03}
                      antes={linha.antes}
                      agora={linha.agora}
                      colorBefore={dim}
                      colorAfter={accent}
                      estatico={telaPequena}
                    />
                  ))}
                </motion.ul>
              </motion.div>

              <motion.div
                style={{ x: parado(direitaX, 0), opacity: parado(colunaOpacity, 1) }}
                className="col-span-12 lg:col-span-4 lg:col-start-9"
              >
                <ScrollGlitchText
                  text={PARAGRAFO}
                  progress={p}
                  from={0.16}
                  to={0.46}
                  colorFrom="#84848f"
                  colorTo="#f1ede6"
                  className="max-w-[34ch] text-[clamp(0.95rem,1.35vw,1.35rem)] font-light leading-relaxed lg:ml-auto lg:text-right"
                  salt={3}
                  estatico={telaPequena}
                />

                <div className="mt-8 flex lg:mt-10 lg:justify-end">
                  <motion.div
                    style={{ opacity: parado(hintOpacity, 1) }}
                    className="relative h-24 w-24 lg:h-32 lg:w-32"
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 200 200"
                      className="girar-selo absolute inset-0 h-full w-full"
                    >
                      <defs>
                        <path
                          id="badge-arc"
                          d={`M100,100 m-${SELO_RAIO},0 a${SELO_RAIO},${SELO_RAIO} 0 1,1 ${
                            SELO_RAIO * 2
                          },0 a${SELO_RAIO},${SELO_RAIO} 0 1,1 -${SELO_RAIO * 2},0`}
                          fill="none"
                        />
                      </defs>
                      <text ref={textoSeloRef} fill={dim} fontSize="19" fontWeight="600">
                        <textPath
                          href="#badge-arc"
                          startOffset="0"
                          textLength={seloComprimento}
                          lengthAdjust="spacing"
                        >
                          {SELO_TEXTO}
                        </textPath>
                      </text>
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-12 w-px bg-gradient-to-b from-transparent via-bone/25 to-transparent">
                        <span className="descer-conta absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full bg-blood-400" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
