"use client";

import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import ScrollGlitchText from "@/components/ScrollGlitchText";
import { SpiderWeb } from "@/components/art";
import { useVideoRaspado } from "@/lib/video-raspado";

const PARAGRAFO =
  "Quatro anos desde que o mundo esqueceu o nome dele. Ele atravessa a multidão sem ser reconhecido, vê de longe as duas pessoas que mais ama — e o próprio corpo começa a mudar, como se o tempo sozinho também tivesse virado poder.";

/* A vida de antes à esquerda, a de agora à direita. Cada linha vira sozinha
   conforme a rolagem avança. */
const ANTES_E_AGORA = [
  { antes: "Traje Tecnológico", agora: "Costurado no sótão" },
  { antes: "Lançador no pulso", agora: "Teia saindo da pele" },
  { antes: "O mundo sabia seu nome", agora: "Ninguém mais sabe" },
];

/* Trecho da rolagem que comanda o vídeo. Sobra um respiro no fim para o card
   terminar de abrir depois que o clipe já chegou ao último quadro. */
const SCRUB_DE = 0.02;
const SCRUB_ATE = 0.9;

/* ---- o selo "role a página" ---------------------------------------- *
 *
 *  ⚠️ O TEXTO NÃO CABIA NA VOLTA E SE ATROPELAVA. Medido em 24/08 na página:
 *  530px de texto para 452px de circunferência — 77px de sobra, e o fim
 *  passava por cima do começo. Na tela lia-se "PÁGROLE A PÁGINA".
 *
 *  O conserto NÃO é achar um `letterSpacing` que feche a conta: o valor certo
 *  muda com a fonte, e a Poppins entra por `next/font` com um fallback que tem
 *  métrica diferente — ou seja, o primeiro quadro e o quadro depois da fonte
 *  carregar têm larguras distintas. Quem fecha a volta é o `textLength` no
 *  `<textPath>` com `lengthAdjust="spacing"`: o navegador distribui a sobra
 *  entre as letras, qualquer que seja a fonte que apareça.
 *
 *  ⚠️ SÓ QUE `textLength` NÃO PODE SER A VOLTA INTEIRA. O `lengthAdjust`
 *  reparte a folga pelos vãos ENTRE caracteres — são `n-1`, e não sobra vão
 *  nenhum DEPOIS do último. Com a volta cheia, o texto encosta o fim no começo
 *  e a emenda fica um vão mais apertada que o resto: medido em 24/08, 8,23px
 *  contra os 13,59px de todas as outras.
 *
 *  A conta que fecha, com `W` = largura natural do texto e `n` = nº de
 *  caracteres:
 *
 *      vão      = (VOLTA - W) / n     ← reparte por n, não por n-1
 *      textLength = VOLTA - vão       ← abre espaço para o vão da emenda
 *
 *  `W` depende da fonte, então isso é medido na página (`getComputedTextLength`
 *  ignora o `textLength`, que é justamente o que precisamos) e refeito quando a
 *  Poppins termina de carregar. Ver `useVoltaDoSelo` abaixo.
 *
 *  Consequência boa: a emenda some e a volta pode girar para sempre sem mostrar
 *  onde começa.
 * -------------------------------------------------------------------- */
const SELO_RAIO = 72;
const SELO_VOLTA = 2 * Math.PI * SELO_RAIO;
/* ⚠️ A UNIDADE TERMINA COM O SEPARADOR INTEIRO, ESPAÇO INCLUÍDO — e o espaço é
   ` `, não " ".

   O `textLength` faz o texto ter exatamente o comprimento do arco, o que
   significa que o ÚLTIMO caractere encosta no PRIMEIRO. Se a string acabar no
   `·` sem nada depois, a emenda fica sem o vão que todas as outras têm: medido
   em 24/08, o `·` final invadia o `R` inicial em 0,87px enquanto os vãos
   internos eram de ~4,9px. Era o "atropela um pouquinho no final".

   E não adianta pôr um espaço comum no fim: o SVG descarta espaço no começo e
   no fim do conteúdo do `<text>`. ` ` não é descartado nem colapsado.

   Os dois lados do `·` usam ` ` para o vão da emenda ser idêntico ao vão
   interno, e não só parecido. Mantenha um número PAR de repetições, senão a
   emenda cai no meio de uma palavra. */
const SELO_UNIDADE = "ROLE A PÁGINA\u00A0·\u00A0";
const SELO_TEXTO = SELO_UNIDADE.repeat(2);

/**
 * Mede o texto do selo e devolve o `textLength` que faz a volta fechar.
 *
 * O primeiro quadro sai com a volta cheia — erra por um vão, ninguém vê, e é o
 * que o servidor manda. Assim que a fonte real chega, mede e corrige.
 *
 * ⚠️ `getComputedTextLength()` devolve a largura NATURAL, ignorando o
 * `textLength` que já está aplicado. É por isso que dá para usar o resultado
 * dele para calcular o próprio `textLength` sem entrar em laço.
 */
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
    // a Poppins entra por `next/font`; até ela chegar, a métrica é do fallback
    document.fonts?.ready.then(ajustar).catch(() => {});
  }, [textoRef]);

  return comprimento;
}

function MorphLine({ progress, from, to, antes, agora, colorBefore, colorAfter, delay }) {
  const mid = from + (to - from) * 0.45 + delay;
  const beforeOpacity = useTransform(progress, [from + delay, mid], [1, 0]);
  const afterOpacity = useTransform(progress, [mid, to + delay], [0, 1]);

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

export default function Hero() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // amortece o scroll para as transições decorativas ganharem inércia.
  // o vídeo NÃO usa isto: mola no scrub deixa a imagem borrachuda, atrasada
  // em relação ao dedo. lá vale o progresso cru.
  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const videoRef = useVideoRaspado({ progresso: scrollYProgress, de: SCRUB_DE, ate: SCRUB_ATE });

  /* ---- o resto da coreografia ---- */

  const pageBg = useTransform(p, [0, 0.5, 0.86], ["#3a060f", "#1e040a", "#050506"]);
  const webOpacity = useTransform(p, [0, 0.6], [0.14, 0.03]);

  // correção de cor entrando: começa lavado e frio, fecha com o contraste do filme
  const sat = useTransform(p, [0.05, 0.6], [0.5, 1.05]);
  const bri = useTransform(p, [0.05, 0.6], [0.72, 1]);
  const con = useTransform(p, [0.05, 0.6], [1.14, 1.04]);
  const videoFilter = useMotionTemplate`saturate(${sat}) brightness(${bri}) contrast(${con})`;
  const videoScale = useTransform(p, [0, 1], [1.08, 1]);

  /* colunas se afastam e saem enquanto o clipe toma conta */
  const colunaOpacity = useTransform(p, [0.5, 0.72], [1, 0]);
  const esquerdaX = useTransform(p, [0.35, 0.8], ["0%", "-12%"]);
  const direitaX = useTransform(p, [0.35, 0.8], ["0%", "12%"]);

  // véu que abre: o texto precisa de fundo no começo e some junto com ele
  const scrimOpacity = useTransform(p, [0.5, 0.78], [1, 0.25]);

  /* expansão final: o card perde as margens e vira a tela inteira */
  const padTop = useTransform(p, [0.84, 1], [84, 0]);
  const padSide = useTransform(p, [0.84, 1], [16, 0]);
  const cardPadding = useMotionTemplate`${padTop}px ${padSide}px ${padSide}px`;
  const cardRadius = useTransform(p, [0.84, 1], [40, 0]);

  /* selo "role a página" — a rolagem só comanda o SUMIÇO dele. Girar virou
     trabalho do CSS (`.girar-selo`, `.descer-conta` no `globals.css`).

     Antes a volta girava por `scrollYProgress`, e isso era o defeito: ela só se
     mexia quando a pessoa já estava rolando — que é exatamente quando o convite
     não serve mais para nada. Parada, era um carimbo. */
  const hintOpacity = useTransform(p, [0, 0.1], [1, 0]);

  const textoSeloRef = useRef(null);
  const seloComprimento = useVoltaDoSelo(textoSeloRef);

  const dim = "#9b9ba5";
  const accent = "#e01b2c";

  return (
    <section id="hero" ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* fundo: vermelho profundo com teia, visível só na moldura do card */}
        <motion.div style={{ backgroundColor: pageBg }} className="absolute inset-0">
          <motion.div style={{ opacity: webOpacity }} className="absolute inset-0 text-bone">
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

        {/* card */}
        <motion.div style={{ padding: cardPadding }} className="absolute inset-0">
          <motion.div
            style={{ borderRadius: cardRadius }}
            className="grain relative h-full w-full overflow-hidden bg-[#07070a]"
          >
            {/* --- o clipe, cobrindo o herói inteiro --- */}
            <motion.video
              ref={videoRef}
              style={{ scale: videoScale, filter: videoFilter }}
              className="absolute inset-0 h-full w-full object-cover"
              src="/corte.mp4"
              /* o clipe é pesado de propósito (4K, todo quadro é chave);
                 o pôster segura o primeiro quadro enquanto ele carrega, senão
                 o herói abre preto */
              poster="/corte-poster.jpg"
              muted
              playsInline
              preload="auto"
              aria-label="Peter Parker atrás das grades, levantando o olhar"
            />

            {/* --- véus de leitura: sem eles o texto some sobre a imagem --- */}
            <motion.div
              style={{ opacity: scrimOpacity }}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(3,3,4,0.86),rgba(3,3,4,0.45)_34%,rgba(3,3,4,0.2)_50%,rgba(3,3,4,0.6))]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(3,3,4,0.85),transparent)]" />

            {/* --- conteúdo --- */}
            {/* `pb-28` no celular NÃO é gosto: `h-screen` é 100vh, e em iOS/Android
                100vh é a viewport GRANDE — a de barra escondida. Com a barra à
                mostra sobram ~90px a menos, e o selo "role a página" (que o
                `content-between` joga para o rodapé) ficava embaixo dela.
                Medido: o selo terminava a 48px do fim de uma tela de 844px. */}
            <div className="relative z-10 grid h-full grid-cols-12 content-between items-center gap-6 px-6 pb-28 pt-8 lg:content-center lg:px-14 lg:py-10">
              <motion.div style={{ x: esquerdaX }} className="col-span-12 lg:col-span-4">
                <motion.p style={{ opacity: colunaOpacity, color: dim }} className="eyebrow">
                  Nova York — quatro anos depois do feitiço
                </motion.p>

                <h1 className="display mt-5 text-[clamp(2.75rem,7.2vw,6.75rem)] text-bone">
                  Um novo
                  <br />
                  dia
                </h1>

                <motion.div
                  style={{ opacity: colunaOpacity }}
                  className="mt-6 h-[6px] w-24 bg-blood-500"
                />

                <motion.ul style={{ opacity: colunaOpacity }} className="mt-9 flex flex-col gap-4">
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
                    />
                  ))}
                </motion.ul>
              </motion.div>

              <motion.div
                style={{ x: direitaX, opacity: colunaOpacity }}
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
                />

                <div className="mt-8 flex lg:mt-10 lg:justify-end">
                  <motion.div
                    style={{ opacity: hintOpacity }}
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
                      {/* Sem `letterSpacing`: quem espaça é o `lengthAdjust`.
                          Os dois juntos brigam e o texto volta a não fechar. */}
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

                    {/* O centro: uma conta descendo um fio.
                        Não é desenho — são duas caixas. O fio é um `w-px` com
                        gradiente (nasce e morre no nada, para não virar um
                        risco com começo e fim), e a conta é um ponto que desce
                        e reaparece em cima. Diz "para baixo", que é o que o
                        selo pede, e é a aranha descendo na teia sem precisar
                        desenhar nenhuma das duas. */}
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
