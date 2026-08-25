"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

import { SpiderIcon, SpiderWeb } from "@/components/art";

const ELENCO = [
  {
    ator: "Tom Holland",
    papel: "Peter Parker · Homem-Aranha",
    nota: "De volta ao Queens, sem patrocinador e sem plano B.",
    tom: "#9c2b34",
  },
  {
    ator: "Zendaya",
    papel: "Michelle “MJ” Jones",
    nota: "Ela não lembra dele. Ele lembra de tudo.",
    tom: "#2f4257",
  },
  {
    ator: "Jacob Batalon",
    papel: "Ned Leeds",
    nota: "O melhor amigo que virou um estranho no corredor.",
    tom: "#7a6a3d",
  },
  {
    ator: "Mark Ruffalo",
    papel: "Bruce Banner · Hulk",
    nota: "O único adulto na sala que ainda atende o telefone.",
    tom: "#3d5c4a",
  },
  {
    ator: "Jon Bernthal",
    papel: "Frank Castle · Justiceiro",
    nota: "Mesma cidade, régua moral completamente diferente.",
    tom: "#43434c",
  },
  {
    ator: "Michael Mando",
    papel: "Mac Gargan · Escorpião",
    nota: "Saiu da cadeia com um ferrão novo e uma lista de nomes.",
    tom: "#8a6a2c",
  },
];

const STEP = 1 / ELENCO.length;

/* Uma única janela por integrante, usada pelo nome grande e pelo trilho.
   A saída de um coincide com a entrada do seguinte, então o cruzamento é
   contínuo — sem buraco nem dois nomes acesos ao mesmo tempo. */
function janela(index) {
  return [
    (index - 0.45) * STEP,
    (index - 0.05) * STEP,
    (index + 0.55) * STEP,
    (index + 0.95) * STEP,
  ];
}

/** nome que reacende letra a letra quando o card entra */
function StaggerName({ name, progress, from, to, className }) {
  const chars = [...name];
  return (
    <span aria-label={name} className={className}>
      {chars.map((char, i) => (
        <Letter
          key={i}
          char={char}
          progress={progress}
          from={from + ((to - from) * i) / (chars.length * 2.2)}
          to={to}
        />
      ))}
    </span>
  );
}

function Letter({ char, progress, from, to }) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }} className="whitespace-pre">
      {char}
    </motion.span>
  );
}

function Card({ pessoa, index, progress }) {
  // cada card sobe por cima do anterior; o primeiro já começa no lugar
  const enterFrom = (index - 0.9) * STEP;
  const enterTo = (index - 0.1) * STEP;

  const y = useTransform(progress, [enterFrom, enterTo], ["104%", "0%"]);
  const scale = useTransform(
    progress,
    [enterTo, enterTo + STEP],
    [1, index === ELENCO.length - 1 ? 1 : 0.94],
  );

  return (
    <motion.article
      style={{ y, scale, zIndex: index + 1 }}
      className="absolute inset-0 origin-top overflow-hidden rounded-[1.25rem] bg-bone"
    >
      {/* amostra de tecido de cada um, esmaecendo para o papel */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(115deg, ${pessoa.tom} 0%, ${pessoa.tom}cc 38%, transparent 78%)`,
        }}
      />
      {/* trama do tecido */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(21,21,26,0.5) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(21,21,26,0.5) 0 1px, transparent 1px 6px)",
          maskImage: "linear-gradient(115deg, #000 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(115deg, #000 0%, transparent 70%)",
        }}
      />

      {/* a costura da etiqueta, correndo por dentro da borda */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <rect
          x="1.6"
          y="1.6"
          width="96.8"
          height="96.8"
          rx="2"
          className="ponto"
          strokeWidth="1.6"
          strokeDasharray="3 2.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <SpiderWeb
        className="absolute -right-[14%] -top-[38%] h-[150%] w-auto text-linha opacity-[0.06]"
        strokeWidth={1.6}
      />

      {/* iniciais gigantes como marca d'água */}
      <span
        aria-hidden
        className="display pointer-events-none absolute -bottom-[14%] right-6 select-none text-[26vw] leading-none text-linha/[0.07] lg:text-[18vw]"
      >
        {pessoa.ator
          .split(" ")
          .map((w) => w[0])
          .join("")}
      </span>

      <div className="relative flex h-full flex-col justify-between gap-6 p-6 lg:p-10">
        <div className="flex items-start justify-between">
          <span className="eyebrow text-linha-fraca">
            {String(index + 1).padStart(2, "0")} / {String(ELENCO.length).padStart(2, "0")}
          </span>
          <SpiderIcon className="h-6 w-6 text-linha-fraca" />
        </div>

        <div className="min-h-0">
          <p className="eyebrow mb-3 text-tecido">{pessoa.papel}</p>
          <h3 className="display text-[clamp(1.65rem,4.4vw,3.75rem)] text-linha">{pessoa.ator}</h3>
          <p className="mt-4 max-w-[42ch] text-[0.95rem] font-light leading-relaxed text-linha-fraca">
            {pessoa.nota}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Elenco() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 34,
    mass: 0.3,
    restDelta: 0.0005,
  });

  // o progresso marca o início da janela de cada integrante; meio passo a mais
  // põe a aranha na altura do nome que está aceso, não do anterior
  const spiderY = useTransform(p, (v) =>
    `${Math.min(Math.max(v * 100 + (0.5 / ELENCO.length) * 100, 0), 100).toFixed(2)}%`,
  );

  return (
    <section
      id="elenco"
      ref={ref}
      className="relative bg-papel-fundo"
      style={{ height: `${(ELENCO.length + 0.8) * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-[84px]">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-center gap-8 px-6 lg:px-14">
          {/* coluna fixa da esquerda */}
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow mb-10 flex items-center gap-4 text-tecido">
              <span className="h-px w-14 bg-tecido" />
              Elenco
            </p>

            {/* nomes empilhados: só o do card no topo fica aceso */}
            <div className="relative hidden h-28 lg:block">
              {ELENCO.map((pessoa, i) => (
                <NameSlot key={pessoa.ator} pessoa={pessoa} index={i} progress={p} />
              ))}
            </div>

            {/* trilho com a aranha andando conforme o scroll */}
            <div className="mt-14 hidden lg:block">
              <div className="relative pl-10">
                <span className="absolute left-[7px] top-2 bottom-2 w-px bg-margem" />
                <motion.span
                  style={{ top: spiderY }}
                  className="absolute left-0 -translate-y-1/2 text-linha"
                >
                  <SpiderIcon className="h-4 w-4" />
                </motion.span>

                <ul className="flex flex-col gap-4">
                  {ELENCO.map((pessoa, i) => (
                    <RailItem key={pessoa.ator} pessoa={pessoa} index={i} progress={p} />
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* pilha de cards */}
          <div className="col-span-12 lg:col-span-8">
            {/* recorta os cards que ainda não entraram — sem isso o último fica
                espiando por baixo da pilha desde o começo */}
            <div className="relative h-[68vh] max-h-[560px] min-h-[300px] overflow-hidden rounded-[2rem]">
              {ELENCO.map((pessoa, i) => (
                <Card key={pessoa.ator} pessoa={pessoa} index={i} progress={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NameSlot({ pessoa, index, progress }) {
  const [a, b, c, d] = janela(index);
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);

  // o nome pode se sobrepor no cruzamento (é o efeito), mas a linha do papel
  // fica ilegível com dois textos por cima — ela troca numa janela mais curta
  const papelOpacity = useTransform(
    progress,
    [b - (b - a) * 0.25, b, c, c + (d - c) * 0.25],
    [0, 1, 1, 0],
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-x-0 top-0">
      <StaggerName
        name={pessoa.ator}
        progress={progress}
        from={a}
        to={b}
        className="display block text-[clamp(1.75rem,2.6vw,2.75rem)] text-linha"
      />
      <motion.p style={{ opacity: papelOpacity }} className="eyebrow mt-3 text-linha-fraca">
        {pessoa.papel}
      </motion.p>
    </motion.div>
  );
}

function RailItem({ pessoa, index, progress }) {
  const [a, b, c, d] = janela(index);
  const opacity = useTransform(progress, [a, b, c, d], [0.28, 1, 1, 0.28]);

  return (
    <motion.li style={{ opacity }} className="eyebrow text-linha">
      {pessoa.ator}
    </motion.li>
  );
}
