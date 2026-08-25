"use client";

import Image from "next/image";

import Chapa from "@/components/Chapa";

/** Fundo ambiente de um capítulo: uma mídia grande, desfocada, presa atrás de */
export default function FundoCapitulo({ personagem }) {
  const midia = personagem.fundoMidia;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
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
              sizes="45vw"
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
