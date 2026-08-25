/** Fixadores — o que prende a foto na página. */

const NA_BORDA = {
  "topo-esquerda": "left-[9%] top-0",
  topo: "left-1/2 top-0",
  "topo-direita": "right-[9%] top-0",
  esquerda: "left-0 top-[38%]",
  direita: "right-0 top-[38%]",
};

const DENTRO = {
  "topo-esquerda": "left-5 top-5 md:left-6 md:top-6",
  topo: "left-1/2 top-5 md:top-6",
  "topo-direita": "right-5 top-5 md:right-6 md:top-6",
  esquerda: "left-5 top-[38%] md:left-6",
  direita: "right-5 top-[38%] md:right-6",
};

const CANTO = {
  "topo-esquerda": "left-0 top-0",
  "topo-direita": "right-0 top-0",
};

const ATRAVESSA = ["alfinete", "percevejo", "grampo"];

const GIRO = {
  fita: { "topo-esquerda": -38, topo: -2.5, "topo-direita": 38, esquerda: 84, direita: -84 },
  clipe: { "topo-esquerda": -18, topo: 4, "topo-direita": 16, esquerda: -90, direita: 90 },
  alfinete: { "topo-esquerda": 42, topo: 62, "topo-direita": 138, esquerda: 34, direita: 146 },
  percevejo: { "topo-esquerda": 0, topo: 0, "topo-direita": 0, esquerda: 0, direita: 0 },
  grampo: { "topo-esquerda": -26, topo: 3, "topo-direita": 24, esquerda: -88, direita: 88 },
};

function Fita({ giro }) {
  return (
    <div
      className="h-[24px] w-[86px] md:h-[28px] md:w-[104px]"
      style={{
        transform: `rotate(${giro}deg)`,
        backgroundColor: "rgba(216,206,183,0.42)",
        backgroundImage: [
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 2px, transparent 2px 5px)",
          "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.16))",
        ].join(", "),
        clipPath:
          "polygon(3% 0, 97% 0, 100% 28%, 96% 55%, 99% 100%, 4% 100%, 0 70%, 3% 36%)",
        boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
      }}
    />
  );
}

function Clipe({ giro }) {
  return (
    <svg
      width="24"
      height="54"
      viewBox="0 0 24 54"
      fill="none"
      style={{ transform: `rotate(${giro}deg)`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))" }}
    >
      <path
        d="M17.5 7v33a5.9 5.9 0 0 1-11.8 0V9.5a3.7 3.7 0 0 1 7.4 0v28.8a1.7 1.7 0 0 1-3.4 0V13"
        stroke="#c6cad0"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Alfinete({ giro, acento }) {
  return (
    <div className="relative h-4 w-4">
      <div
        className="absolute left-1/2 top-1/2 h-[2px] w-[28px] origin-left"
        style={{
          background: "linear-gradient(90deg, #aeb4ba, #eef1f4)",
          transform: `rotate(${giro}deg)`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.55)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.92) 0 13%, ${acento} 42%, rgba(0,0,0,0.55) 100%)`,
          boxShadow: "0 3px 7px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}

function Percevejo() {
  return (
    <div
      className="h-[17px] w-[17px] rounded-full"
      style={{
        background:
          "radial-gradient(circle at 34% 30%, #f4f6f8 0 13%, #bfc5cb 44%, #767d84 76%, #33383d 100%)",
        boxShadow: "0 3px 7px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(0,0,0,0.4)",
      }}
    />
  );
}

function Grampo({ giro }) {
  return (
    <svg
      width="28"
      height="13"
      viewBox="0 0 28 13"
      fill="none"
      style={{ transform: `rotate(${giro}deg)`, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }}
    >
      <path
        d="M2.6 11.4V3.4h22.8v8"
        stroke="#d0d5da"
        strokeWidth="2.5"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}

function Cantoneira({ lado }) {
  const esquerda = lado === "topo-esquerda";
  const paradas =
    "#332e29 0%, #1b1714 74%, #14110e 88%, rgba(241,237,230,0.30) 96%, rgba(241,237,230,0.42) 100%";
  return (
    <div
      className="h-10 w-10 md:h-12 md:w-12"
      style={{
        clipPath: esquerda ? "polygon(0 0, 100% 0, 0 100%)" : "polygon(100% 0, 100% 100%, 0 0)",
        background: `linear-gradient(${esquerda ? 135 : 225}deg, ${paradas})`,
      }}
    />
  );
}

function Peca({ tipo, em, giro, acento }) {
  if (tipo === "cantoneira") return <Cantoneira lado={em} />;
  if (tipo === "percevejo") return <Percevejo />;
  const g = giro ?? GIRO[tipo]?.[em] ?? 0;
  if (tipo === "fita") return <Fita giro={g} />;
  if (tipo === "clipe") return <Clipe giro={g} />;
  if (tipo === "alfinete") return <Alfinete giro={g} acento={acento} />;
  if (tipo === "grampo") return <Grampo giro={g} />;
  return null;
}

export default function Fixadores({ fixadores, acento }) {
  if (!fixadores?.length) return null;

  return (
    <>
      {fixadores.map(({ tipo, em, giro }) => {
        const mapa = tipo === "cantoneira" ? CANTO : ATRAVESSA.includes(tipo) ? DENTRO : NA_BORDA;
        const posicao = mapa[em];
        if (!posicao) return null;
        return (
          <div
            key={`${tipo}-${em}`}
            aria-hidden
            className={`pointer-events-none absolute z-20 flex h-0 w-0 items-center justify-center ${posicao}`}
          >
            <Peca tipo={tipo} em={em} giro={giro} acento={acento} />
          </div>
        );
      })}
    </>
  );
}
