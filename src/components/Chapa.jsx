import Image from "next/image";

/** Chapa — o lugar de uma imagem que ainda não existe. */

/** Soma dos códigos da legenda — determinística, só para variar o desenho. */
function semente(texto) {
  let n = 0;
  for (let i = 0; i < texto.length; i++) n = (n * 31 + texto.charCodeAt(i)) % 997;
  return n;
}

export default function Chapa({
  legenda,
  acento,
  src = null,
  sizes = "100vw",
  className = "",
  style = {},
  mostrarLegenda = true,
  borda = "nua",
}) {
  if (src) {
    const sangra = borda === "sangra";

    return (
      <div className={`grao-foto relative overflow-hidden ${className}`} style={style}>
        <Image
          src={src}
          alt={legenda}
          fill
          sizes={sizes}
          className={`object-cover ${sangra ? "foto-sangra" : ""}`}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 100% at 50% 50%, transparent 42%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>
    );
  }

  const s = semente(legenda);
  const cx = 18 + (s % 64);

  return (
    <div
      className={`relative overflow-hidden bg-carvao ${className}`}
      style={style}
      role="img"
      aria-label={legenda}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `radial-gradient(ellipse at ${cx}% 90%, ${acento}75 0%, ${acento}25 40%, transparent 75%)`,
            "repeating-linear-gradient(168deg, rgba(255,255,255,0.06) 0px, transparent 1px, transparent 11px)",
            "repeating-linear-gradient(174deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 7px)",
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0 1px, transparent 1px 4px)",
          ].join(", "),
        }}
      />

      <div className="absolute inset-0 border border-white/10" />

      {mostrarLegenda && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
          <p className="max-w-[26ch] text-[0.7rem] leading-snug text-bone/45">{legenda}</p>
          <span
            className="eyebrow shrink-0 text-[0.5rem] opacity-70"
            style={{ color: acento }}
            aria-hidden
          >
            sem imagem
          </span>
        </div>
      )}
    </div>
  );
}
