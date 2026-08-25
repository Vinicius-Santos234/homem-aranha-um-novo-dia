"use client";

import Image from "next/image";

import Chapa from "@/components/Chapa";

/**
 * Fundo ambiente de um capítulo: uma mídia grande, desfocada, presa atrás de
 * tudo enquanto o capítulo inteiro passa.
 *
 * Aceita vídeo, foto, ou nada — sem mídia cai na chapa desenhada, então o
 * efeito existe mesmo antes de haver material. Ligar de verdade é preencher
 * `fundoMidia` em `src/lib/personagens.js`.
 *
 * ⚠️ DOIS CUIDADOS QUE NÃO SÃO ÓBVIOS:
 *
 * 1. O `overflow-hidden` fica no elemento GRUDADO, nunca no de fora. Um
 *    ancestral com `overflow: hidden` vira o contêiner de rolagem do
 *    `sticky` — e aí o grudado deixa de se prender à viewport e o fundo anda
 *    junto com a página, que é exatamente o que não se quer.
 *
 * 2. O desfoque NÃO é animado pela rolagem. Filtro que muda a cada quadro
 *    obriga o navegador a rasterizar de novo o tempo todo; parado, ele
 *    rasteriza uma vez e só reaproveita. Foi esse tipo de custo que travou o
 *    compositor na primeira versão das chapas.
 */
export default function FundoCapitulo({ personagem }) {
  const midia = personagem.fundoMidia;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Escala maior que 1 esconde a borda lavada que o desfoque cria. Ela
            precisa cobrir o sangramento do `blur`, então mexer num pede olhar o
            outro — 1,18 sobra para 16px e sobrava menos para os 24px de antes.

            ⚠️ O DESFOQUE TEM TETO, E O TETO É O CONTRASTE DO TEXTO. Ele caiu de
            24px para 16px em 24/08, a pedido; menos desfoque é mais detalhe
            atrás do corpo do texto (#cfcbc2), que é justamente o que o véu
            abaixo passa a vida segurando. Hoje só o capítulo do Peter tem foto
            de verdade — quando os outros três tiverem, é aqui que se olha
            primeiro se a leitura começar a sofrer. */}
        <div className="absolute inset-0 scale-[1.18] opacity-55 blur-[16px]">
          {midia?.video ? (
            <video
              className="h-full w-full object-cover"
              src={midia.video}
              poster={midia.poster}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
            />
          ) : midia?.imagem ? (
            <Image
              src={midia.imagem}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <Chapa
              legenda={`${personagem.nome} — fundo`}
              acento={personagem.acento}
              className="h-full w-full"
              mostrarLegenda={false}
            />
          )}
        </div>

        {/* Véu. As paradas são um equilíbrio, não um número bonito: as pontas
            ficam opacas para o capítulo emendar no anterior e no seguinte sem
            costura visível, e o miolo abre para a mídia aparecer.
            ⚠️ Se abrir mais que isto, o corpo do texto (#cfcbc2) começa a
            disputar com a foto — o contraste é o teto deste efeito. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${personagem.fundo} 0%, ${personagem.fundo}a8 20%, ${personagem.fundo}8c 50%, ${personagem.fundo}bd 78%, ${personagem.fundo} 100%)`,
          }}
        />
      </div>
    </div>
  );
}
