"use client";

import { motion } from "framer-motion";

/** A ficha do Controle de Danos — o documento que preenche a capa de cada */

const CONTAINER = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};

const LINHA = {
  oculto: { opacity: 0, y: 10 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/** Uma barra de censura de `n` caracteres. */
function Tarja({ n }) {
  return (
    <>
      <span
        aria-hidden
        className="mx-[1px] inline-block translate-y-[0.15em] rounded-[1px] bg-bone/20"
        style={{ width: `${n}ch`, height: "0.95em" }}
      />
      <span className="sr-only">[trecho removido]</span>
    </>
  );
}

function Valor({ partes }) {
  return (
    <span className="text-bone/85">
      {partes.map((parte, i) =>
        typeof parte === "string" ? (
          <span key={i}>{parte}</span>
        ) : (
          <Tarja key={i} n={parte.tarja} />
        ),
      )}
    </span>
  );
}

export default function FichaControleDanos({ ficha, corDe, corPara, total }) {
  const regua = `linear-gradient(90deg, ${corDe}, ${corPara})`;

  return (
    <motion.section
      aria-label={`Controle de Danos — registro ${ficha.numero}`}
      variants={CONTAINER}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, amount: 0.35 }}
      className="mx-auto w-full max-w-[46rem]"
    >
      <motion.div
        variants={LINHA}
        className="flex items-baseline justify-between gap-4 text-bone-dim/70"
      >
        <p className="eyebrow">Controle de Danos</p>
        <p className="eyebrow shrink-0" style={{ color: corPara }}>
          Registro {ficha.numero} / {String(total).padStart(2, "0")}
        </p>
      </motion.div>

      <motion.div variants={LINHA} className="mt-4 h-px w-full" style={{ background: regua }} />

      <dl className="mt-7 flex flex-col gap-3 font-mono text-[0.8rem] leading-relaxed md:text-[0.875rem]">
        {ficha.campos.map((campo) => (
          <motion.div
            key={campo.rotulo}
            variants={LINHA}
            className="flex flex-col gap-x-6 gap-y-1 sm:flex-row"
          >
            <dt className="eyebrow shrink-0 pt-[0.2em] text-bone-dim/50 sm:w-[11rem]">
              {campo.rotulo}
            </dt>
            <dd className="min-w-0">
              <Valor partes={campo.valor} />
            </dd>
          </motion.div>
        ))}
      </dl>

      <motion.div variants={LINHA} className="mt-7 h-px w-full" style={{ background: regua }} />

      <motion.p
        variants={LINHA}
        className="mt-5 font-mono text-[0.8rem] leading-relaxed text-bone-dim/65 md:text-[0.875rem]"
      >
        {ficha.nota}
      </motion.p>
    </motion.section>
  );
}
