import Chapa from "@/components/Chapa";

/** Polaroide — a foto revelada, com moldura de papel e legenda no rodapé. */
export default function Polaroide({
  legenda,
  src = null,
  acento,
  sizes = "100vw",
  className = "",
  style = {},
}) {
  return (
    <div
      className={`flex flex-col bg-bone p-2.5 pb-2 shadow-2xl shadow-black/50 md:p-3 md:pb-2.5 ${className}`}
      style={style}
    >
      <Chapa
        legenda={legenda}
        src={src}
        acento={acento}
        sizes={sizes}
        className="min-h-0 flex-1"
        mostrarLegenda={false}
      />

      <p className="mt-2.5 px-2 text-center font-mono text-[0.72rem] leading-snug text-ink/70 md:mt-3 md:px-3 md:text-[0.75rem]">
        {legenda}
      </p>
    </div>
  );
}
