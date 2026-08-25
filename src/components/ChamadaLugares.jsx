"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Chapa from "@/components/Chapa";
import { LUGARES } from "@/lib/lugares";

/**
 * A porta dos lugares.
 *
 * Não mostra os lugares — mostra que existem, e manda clicar. As chapas entram
 * empilhadas em leque e abrem com a rolagem; quem abre de verdade é `/lugares`.
 */

/* Ângulo e deslocamento finais de cada carta do leque, em px de DESKTOP.
   Fixos de propósito: nada aqui pode ser sorteado, senão o servidor pinta um
   leque e o cliente pinta outro. */
const LEQUE = [
  { rot: -13, x: -300, y: 26, z: 1 },
  { rot: -6, x: -152, y: 6, z: 2 },
  { rot: 1, x: 0, y: -6, z: 3 },
  { rot: 7, x: 152, y: 8, z: 2 },
  { rot: 14, x: 300, y: 30, z: 1 },
];

/* O leque NÃO parte de zero. Com todas as cartas em x=0 e rot=0 elas ficam
   exatamente uma sobre a outra, e quem chega no topo da seção vê UMA carta —
   lê como seção quebrada, não como leque fechado. Começa em 45% da abertura:
   já dá para contar as cartas, e ainda sobra movimento para a rolagem. */
const ABERTURA_INICIAL = 0.45;

/* Quanto da abertura de desktop cabe em cada tamanho de tela.
   ⚠️ Sem isto, num celular de 390px as duas cartas das pontas ficavam com 11%
   de largura visível — medido — e o leque lia como seção quebrada. Os valores
   saem da conta "meia tela − meia carta": abaixo deles a ponta sai do
   `overflow-hidden` da seção. */
const ESCALAS = [
  ["(min-width: 1024px)", 1],
  ["(min-width: 768px)", 0.72],
  ["(min-width: 640px)", 0.6],
];
const ESCALA_CELULAR = 0.35;

/**
 * ⚠️ Por que medir em JS e não resolver por breakpoint no CSS: o `x` do framer
 * precisa de NÚMERO para interpolar.
 *
 * Cheguei a montar a conta em CSS — `calc(var(--x) * var(--leque) * var(--t))`
 * com `useMotionTemplate` — e desisti por um motivo VERIFICADO: com
 * `alvo.x === 0` (a carta do meio) o template **come o zero** e emite
 * `calc(px * ...)`, que é sintaxe inválida e derruba o transform inteiro.
 *
 * Não é motivo o que eu achei na hora ("a string congela"): aquilo foi medido
 * numa aba sem `requestAnimationFrame`, onde o `x` nativo do framer estava
 * igualmente parado. Comparação inválida. O atalho nativo é a escolha por ser
 * o caminho batido, não por o outro ter falhado.
 *
 * O primeiro quadro (e o servidor) valem desktop. A seção fica ~17 telas
 * abaixo do topo: o ajuste da hidratação acontece muito antes de alguém
 * chegar aqui.
 */
function useFatorLeque() {
  const [fator, setFator] = useState(1);

  useEffect(() => {
    const listas = ESCALAS.map(([consulta, valor]) => [window.matchMedia(consulta), valor]);
    const medir = () => setFator(listas.find(([mq]) => mq.matches)?.[1] ?? ESCALA_CELULAR);

    medir();
    listas.forEach(([mq]) => mq.addEventListener("change", medir));
    return () => listas.forEach(([mq]) => mq.removeEventListener("change", medir));
  }, []);

  return fator;
}

function Carta({ lugar, alvo, progresso, fator }) {
  const largura = alvo.x * fator;
  const rot = useTransform(progresso, [0, 1], [alvo.rot * ABERTURA_INICIAL, alvo.rot]);
  const x = useTransform(progresso, [0, 1], [largura * ABERTURA_INICIAL, largura]);
  const y = useTransform(progresso, [0, 1], [40, alvo.y]);

  return (
    <motion.div
      style={{ rotate: rot, x, y, zIndex: alvo.z }}
      className="absolute h-[168px] w-[248px] shadow-2xl shadow-black/60 md:h-[214px] md:w-[318px]"
    >
      {/* moldura branca: a carta é um objeto do mundo, não um card do site */}
      <div className="h-full w-full bg-bone p-[7px]">
        <Chapa
          legenda={lugar.chamada}
          src={lugar.foto}
          acento={lugar.acento}
          sizes="320px"
          className="h-full w-full"
          mostrarLegenda={false}
          borda="nua"
        />
      </div>
      <span
        className="eyebrow absolute inset-x-0 bottom-3 text-center text-[0.55rem] text-ink"
        aria-hidden
      >
        {lugar.logotipo}
      </span>
    </motion.div>
  );
}

export default function ChamadaLugares() {
  const ref = useRef(null);
  const fator = useFatorLeque();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  });

  // a foto anda menos que a página: só o suficiente para dar profundidade
  const fundoY = useTransform(p, [0, 1], ["-5%", "5%"]);

  return (
    <section
      id="lugares"
      ref={ref}
      className="relative isolate overflow-hidden bg-carvao px-6 py-28 md:py-40"
    >
      {/* ---- a cidade, ao fundo ----
          A moldura vertical é maior que a seção (-inset-y-[12%]) porque a foto
          desliza um pouco com a rolagem: sem essa sobra, o parallax mostraria a
          borda de cima e a de baixo.
          O deslocamento é `y` — transformação, que o compositor resolve sem
          repintar. Filtro animado aqui sairia caro, e já custou uma travada
          antes (ver `Chapa.jsx`). */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div style={{ y: fundoY }} className="absolute inset-x-0 -inset-y-[12%]">
          <Image
            src="/telhado-por-do-sol.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Escurecimento geral + as pontas fechando no fundo da seção, para o
            bloco emendar no capítulo anterior e no fecho sem costura visível.
            O miolo fica mais aberto: é onde a foto tem que aparecer. */}
        <div className="absolute inset-0 bg-black/45" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, var(--color-carvao) 0%, rgba(16,16,20,0.55) 22%, rgba(16,16,20,0.35) 52%, rgba(16,16,20,0.72) 82%, var(--color-carvao) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="eyebrow text-blood-400">Nova York</p>
        <h2 className="display mt-4 text-[clamp(2.4rem,6.5vw,5rem)] text-bone">
          Os lugares
        </h2>
        <p className="mt-6 max-w-[42ch] text-[0.98rem] font-light leading-relaxed text-bone-dim/80">
          Cinco endereços que a história atravessa: onde ele dorme, por onde ele
          anda e os dois lugares que o Controle de Danos preferia manter fora do
          mapa.
        </p>
      </div>

      {/* leque */}
      <div className="relative z-10 mx-auto mt-16 flex h-[240px] items-center justify-center md:mt-24 md:h-[300px]">
        {LUGARES.slice(0, LEQUE.length).map((lugar, i) => (
          <Carta key={lugar.slug} lugar={lugar} alvo={LEQUE[i]} progresso={p} fator={fator} />
        ))}
      </div>

      <div className="relative z-10 mt-14 flex justify-center md:mt-20">
        <Link
          href="/lugares"
          className="group inline-flex items-center gap-3 rounded-full bg-bone px-8 py-4 text-ink transition-colors duration-200 hover:bg-blood-500 hover:text-bone"
        >
          <span className="eyebrow">Ver os lugares</span>
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
