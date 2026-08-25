"use client";

import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

import Chapa from "@/components/Chapa";
import FichaControleDanos from "@/components/FichaControleDanos";
import Fixadores from "@/components/Fixadores";
import Polaroide from "@/components/Polaroide";
import FundoCapitulo from "@/components/FundoCapitulo";
import ScrollRevealText from "@/components/ScrollRevealText";

/**
 * Um capítulo de personagem.
 *
 * A ordem é a que a referência usa e que aguenta se repetir sem cansar:
 *   1. capa de tela cheia, entrando escura e clareando com a rolagem
 *   2. o nome gigante preso no topo enquanto o texto passa por baixo
 *   3. lead na cor do capítulo + corpo em coluna estreita, com a mídia
 *      sangrando pela borda oposta da VIEWPORT (não do container)
 *   4. galeria de alturas desencontradas
 *   5. citação de tela cheia
 *
 * A assimetria sai de uma grade de 12 colunas sem largura máxima: quem começa
 * na coluna 1 vai para a esquerda de tudo, quem termina na 12 vai para a
 * direita. Sem margem negativa, sem `100vw` — some junto com a barra de
 * rolagem.
 *
 * ⚠️ A GALERIA NÃO ENCOSTA MAIS NA BORDA DA TELA (25/08, a pedido). Ela tem
 * `md:px-14` só dela, e o bloco de texto acima continua sem padding — a
 * assimetria não veio do encosto, veio das colunas, então afastar 56px não
 * custa nada dela. O que o afastamento COMPRA é espaço para os fixadores: fita
 * e clipe montam na aresta e sobram uns 27px para fora do papel, e a rampa de
 * rolagem ainda cresce a chapa em até 6%. Encostada na borda, a peça do lado
 * de fora era cortada pelo `overflow-x: hidden` do `body`.
 */

/** Rampa de brilho: a mídia entra quase apagada e acende ao atravessar a tela. */
function useRampa(ref) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const suave = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  });
  const brilho = useTransform(suave, [0, 1], [0.28, 1]);
  const escala = useTransform(suave, [0, 1], [1.06, 1]);
  return { filter: useMotionTemplate`brightness(${brilho})`, scale: escala };
}

/**
 * A capa do capítulo — e, por cima dela, a ficha do Controle de Danos.
 *
 * ⚠️ `min-h` E NÃO `h`. Com altura travada, a ficha estourava a capa numa tela
 * baixa e o `overflow-hidden` cortava sem avisar: a 62vh de uma viewport de
 * 640px sobram 397px para um documento que ocupa ~424px no celular. Com
 * `min-h` a capa cresce quando precisa e fica nos 86vh quando sobra espaço.
 *
 * ⚠️ O VÉU DE 45% NÃO É PARA AGORA. Hoje a capa é uma chapa desenhada, escura,
 * e o texto leria sem ele. Ele existe para quando entrar FOTO DE VERDADE nestes
 * vãos — é o mesmo número que a `Citacao` já usa pelo mesmo motivo. Tirar
 * porque "está escuro demais" é trocar um problema de hoje por um de depois.
 */
function Capa({ personagem, ficha, corAnterior, total }) {
  const ref = useRef(null);
  const rampa = useRampa(ref);

  return (
    <div
      ref={ref}
      className="relative z-10 flex min-h-[62vh] items-center overflow-hidden px-6 py-24 md:min-h-[86vh] md:py-28"
    >
      <motion.div style={rampa} className="absolute inset-0">
        <Chapa
          legenda={personagem.capa.legenda}
          src={personagem.capa.foto}
          acento={personagem.acento}
          className="h-full w-full"
          mostrarLegenda={false}
          borda="sangra"
        />
      </motion.div>

      {/* véu de leitura — ver o aviso acima */}
      <div className="pointer-events-none absolute inset-0 bg-black/45" />

      {/* o rodapé escurece para o nome que vem embaixo não brigar com a imagem */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{ backgroundImage: `linear-gradient(to top, ${personagem.fundo}, transparent)` }}
      />

      <div className="relative z-10 w-full">
        <FichaControleDanos
          ficha={ficha}
          corDe={corAnterior}
          corPara={personagem.acento}
          total={total}
        />
      </div>
    </div>
  );
}

function ItemGaleria({ item, acento, index }) {
  const ref = useRef(null);
  const rampa = useRampa(ref);

  // as duas primeiras encostam em bordas opostas; a terceira fica solta no meio
  const posicao = [
    "col-span-12 md:col-span-7 md:col-start-1",
    "col-span-12 md:col-span-5 md:col-start-8",
    "col-span-12 md:col-span-6 md:col-start-4",
  ][index % 3];

  // desencontro vertical: sem isto a galeria vira uma fileira
  const empurra = ["md:mt-0", "md:mt-28", "md:mt-10"][index % 3];

  // ⚠️ o `ref` de medição e a transformação NÃO podem ser o mesmo elemento:
  // `scale` muda a caixa que o `useScroll` está medindo, e o progresso passa a
  // se alimentar do próprio resultado. Mede-se a figure, anima-se o miolo.
  return (
    <figure ref={ref} className={`${posicao} ${empurra}`}>
      {/* `maxHeight` junto com o `aspectRatio`: numa grade de 12 colunas sem
          largura máxima, sete colunas dão ~900px e um 3/4 viraria 1.200px de
          altura — a chapa passava de uma tela e meia sozinha. Aqui a proporção
          vale até o teto e depois a caixa só encurta. */}
      {/* ⚠️ SEM `overflow-hidden` AQUI, E AGORA POR DOIS MOTIVOS. O primeiro é
          de 25/08: ele não recortava nada — a `Chapa` lá dentro já recorta a
          própria foto — e engolia a sombra que assenta a chapa na página,
          porque `overflow` corta o box-shadow dos filhos. O segundo são os
          fixadores: clipe e fita precisam passar da borda para prender alguma
          coisa. Recortar aqui devolve os dois defeitos de uma vez.

          ⚠️ A INCLINAÇÃO ENTRA NO `motion.div`, NUNCA NA `figure`. A `figure`
          é o que o `useScroll` mede — girar a caixa medida muda o retângulo de
          onde sai o progresso, e a rampa passa a se alimentar do próprio
          resultado. Mesmo motivo pelo qual a `scale` já morava aqui. */}
      <motion.div
        className="relative"
        style={{ ...rampa, rotate: item.inclinacao ?? 0, aspectRatio: item.ratio, maxHeight: "72vh" }}
      >
        <Polaroide
          legenda={item.legenda}
          src={item.foto}
          acento={acento}
          /* a galeria ocupa 5 a 7 colunas de 12; metade da tela cobre */
          sizes="(min-width: 768px) 60vw, 100vw"
          className="h-full w-full"
        />
        {/* ⚠️ IRMÃOS DA POLAROIDE, NÃO FILHOS. O que os fixadores prendem é o
            PAPEL, não a imagem: o clipe monta na borda da moldura, a fita
            segura o canto do papel. Ancorados dentro da foto, eles ficariam
            presos a uma coisa que já está presa. */}
        <Fixadores fixadores={item.fixadores} acento={acento} />
      </motion.div>
    </figure>
  );
}

/**
 * A citação de tela cheia.
 *
 * ⚠️ `min-h` E NÃO `h`, pelo mesmo motivo da `Capa` — e aqui o defeito já tinha
 * aparecido em uso. A citação do Justiceiro é a mais longa (118 caracteres
 * contra 72 da Jean) e ocupa 7 linhas; com altura travada e `overflow-hidden`,
 * ela era CORTADA:
 *
 *   | tela | corte |
 *   |---|---|
 *   | 1400×620 | Justiceiro, 39px |
 *   | 1400×560 | Justiceiro, 90px · Peter, 15px |
 *
 * A armadilha é a combinação: o TAMANHO da fonte sai de `vw`
 * (`clamp(2rem, 5.4vw, 4.6rem)`) e a ALTURA da caixa sai de `vh`. São duas
 * variáveis independentes que nunca se falam, então janela larga e baixa dá
 * fonte no teto dentro de caixa curta. Acima de 1363px de largura a fonte nem
 * cresce mais — fica nos 4,6rem — e só a altura muda.
 *
 * Com `min-h` a caixa cresce quando a citação não cabe. A do Justiceiro passa
 * dos 85vh em tela baixa e exige um empurrãozinho de rolagem para ser lida
 * inteira; é preço barato perto de perder 90px de texto sem avisar.
 */
function Citacao({ personagem }) {
  const ref = useRef(null);
  const rampa = useRampa(ref);

  return (
    <div
      ref={ref}
      /* `py` modesto de propósito: ele entra no `min-h` (box-sizing é
         border-box), então padding grande empurraria as citações CURTAS para
         além de uma tela sem necessidade. Com 48/64px, as três curtas
         continuam nos 85vh exatos e só a do Justiceiro cresce. */
      className="relative z-10 flex min-h-[70vh] items-center overflow-hidden py-12 md:min-h-[85vh] md:py-16"
    >
      <motion.div style={rampa} className="absolute inset-0">
        <Chapa
          legenda={`${personagem.nome} — plano da citação`}
          src={personagem.fotoCitacao}
          acento={personagem.acento}
          className="h-full w-full"
          mostrarLegenda={false}
          borda="sangra"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/45" />
      <blockquote className="relative z-10 px-6 md:px-14 lg:px-20">
        <p
          className="display max-w-[16ch] text-[clamp(2rem,5.4vw,4.6rem)] text-bone"
          style={{ lineHeight: 1.02 }}
        >
          “{personagem.citacao}”
        </p>
        <footer className="eyebrow mt-6" style={{ color: personagem.acento }}>
          {personagem.nome}
        </footer>
      </blockquote>
    </div>
  );
}

export default function CapituloPersonagem({ personagem, ficha, corAnterior, indice, total }) {
  const textoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: textoRef,
    offset: ["start 0.85", "center center"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.35,
    restDelta: 0.001,
  });

  const numero = String(indice + 1).padStart(2, "0");

  return (
    <section
      id={personagem.slug}
      aria-labelledby={`${personagem.slug}-nome`}
      className="relative isolate"
      style={{ backgroundColor: personagem.fundo }}
    >
      <FundoCapitulo personagem={personagem} />

      <Capa personagem={personagem} ficha={ficha} corAnterior={corAnterior} total={total} />

      <div className="relative z-10 grid grid-cols-12 gap-4 px-6 pb-16 pt-14 md:gap-6 md:px-0 md:pb-24 md:pt-20">
        {/* --- nome preso no topo --- */}
        <header className="col-span-12 md:col-span-4 md:col-start-2 md:self-start md:sticky md:top-[104px]">
          <p className="eyebrow" style={{ color: personagem.acento }}>
            {numero} / {String(total).padStart(2, "0")} · {personagem.alcunha}
          </p>
          <h2
            id={`${personagem.slug}-nome`}
            className="display mt-4 text-[clamp(2.6rem,7vw,5.4rem)] text-bone"
            style={{ lineHeight: 0.98 }}
          >
            {personagem.nome}
          </h2>
          <div className="mt-6 h-[5px] w-20" style={{ backgroundColor: personagem.acento }} />
        </header>

        {/* --- lead + corpo --- */}
        <div ref={textoRef} className="col-span-12 md:col-span-5 md:col-start-7 md:pt-2">
          <ScrollRevealText
            text={personagem.lead}
            progress={p}
            from={0}
            to={0.55}
            restColor="#3a3a42"
            activeColor={personagem.acento}
            className="text-[clamp(1.35rem,2.6vw,2.1rem)] font-medium leading-tight"
          />
          <ScrollRevealText
            text={personagem.corpo}
            progress={p}
            from={0.3}
            to={1}
            restColor="#2a2a30"
            activeColor="#cfcbc2"
            className="mt-6 max-w-[46ch] text-[0.95rem] font-light leading-relaxed md:text-[1.02rem]"
          />
        </div>

      </div>

      {/* --- galeria desencontrada ---
          Grade PRÓPRIA, e não uma linha da grade de cima. O `sticky` do nome
          se prende ao bloco que o contém: enquanto a galeria morava na mesma
          grade, o nome seguia grudado enquanto as chapas das colunas 1–7
          desciam por cima dele. Separando os blocos, o nome solta quando o
          texto acaba — que é onde ele tem que soltar. */}
      <div className="relative z-10 grid grid-cols-12 gap-4 px-6 pb-24 md:gap-6 md:px-14 md:pb-40">
        {personagem.galeria.map((item, i) => (
          <ItemGaleria key={item.legenda} item={item} acento={personagem.acento} index={i} />
        ))}
      </div>

      <Citacao personagem={personagem} />
    </section>
  );
}
