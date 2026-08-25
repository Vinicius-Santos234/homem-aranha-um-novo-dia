"use client";

import { motion } from "framer-motion";

/**
 * A ficha do Controle de Danos — o documento que preenche a capa de cada
 * capítulo. O conteúdo e o porquê do dispositivo estão em `src/lib/fichas.js`.
 *
 * ⚠️ ELA NÃO SE POSICIONA. Nasceu como seção própria, com fundo e respiro
 * próprios, e em 24/08 virou camada de dentro da `Capa` — o que resolveu duas
 * coisas de uma vez: a chapa da capa parou de ser um retângulo escuro sem nada
 * e a página parou de crescer 2.332px para dizer a mesma coisa. Quem manda no
 * tamanho e no lugar é quem chama.
 *
 * ⚠️ Ela é o ÚNICO bloco do site que não é cinema. Tudo o mais é plano cheio,
 * tipografia grande e imagem sangrando pela borda; aqui é papel de repartição,
 * numa coluna estreita e centrada, em fonte monoespaçada. O contraste é o
 * ponto: por meia tela a página troca de registro e volta. Se isto começar a
 * parecer com o resto, perdeu a graça.
 *
 * ⚠️ A COR NÃO É DECORATIVA. As duas réguas vão do acento do capítulo que
 * ACABOU para o do que VEM — é a passagem de bastão desenhada. Por isso a
 * ficha precisa das duas cores e não só da sua.
 *
 * `font-mono` sai do tema padrão do Tailwind, não de `@theme`: o site carrega
 * só Anton e Poppins por `next/font`, e uma terceira família por causa de meia
 * tela seria peso à toa. A pilha monoespaçada do sistema resolve — e "fonte do
 * sistema" é exatamente o que um terminal de repartição usaria.
 */

/* Escalonamento das linhas: a ficha "imprime" de cima para baixo em vez de
   aparecer pronta. É o que dá movimento a um bloco que é só texto parado. */
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
      {/* sem isto o leitor de tela pula a tarja e lê a frase sem o buraco —
          que é justamente a informação que a ficha está dando */}
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
            /* rótulo em coluna fixa para os valores alinharem como formulário.
               No celular a coluna some e o rótulo vira linha própria: com
               `Registro anterior` (16 caracteres) a coluna comia metade de uma
               tela de 390px e o valor quebrava em quatro linhas. */
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
