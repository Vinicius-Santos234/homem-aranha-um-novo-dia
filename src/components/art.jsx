import Image from "next/image";

/** Seta para cima, desenhada como fio de teia. */
export function SetaTeia({ className = "", ...rest }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      <path d="M26 46 L50 22 L74 46" />
      <path d="M50 22 V84" />
      <path d="M33 60 Q50 69 67 60" strokeWidth="4.5" />
      <path d="M37 74 Q50 82 63 74" strokeWidth="4.5" />
    </svg>
  );
}

/** ---- teia ---- */

function buildWeb({ spokes = 16, rings = 9, radius = 500, sag = 0.16 }) {
  const step = (Math.PI * 2) / spokes;
  const spokePaths = [];
  const ringPaths = [];

  for (let s = 0; s < spokes; s++) {
    const a = s * step;
    spokePaths.push(`M0 0L${(Math.cos(a) * radius).toFixed(1)} ${(Math.sin(a) * radius).toFixed(1)}`);
  }

  for (let r = 1; r <= rings; r++) {
    const rad = radius * Math.pow(r / rings, 1.55);
    let d = "";
    for (let s = 0; s < spokes; s++) {
      const a = s * step;
      const b = a + step;
      const x1 = Math.cos(a) * rad;
      const y1 = Math.sin(a) * rad;
      const x2 = Math.cos(b) * rad;
      const y2 = Math.sin(b) * rad;
      const mid = a + step / 2;
      const cx = Math.cos(mid) * rad * (1 - sag);
      const cy = Math.sin(mid) * rad * (1 - sag);
      if (s === 0) d += `M${x1.toFixed(1)} ${y1.toFixed(1)}`;
      d += `Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }
    ringPaths.push(d);
  }

  return { spokePaths, ringPaths };
}

const WEB = buildWeb({});

export function SpiderWeb({ className = "", strokeWidth = 2 }) {
  return (
    <svg viewBox="-520 -520 1040 1040" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        {WEB.spokePaths.map((d, i) => (
          <path key={`s${i}`} d={d} />
        ))}
        {WEB.ringPaths.map((d, i) => (
          <path key={`r${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** ---- logotipo ---- */

/** O logotipo do filme. */
export function Logo({ className = "h-10 w-auto sm:h-11 md:h-12" }) {
  return (
    <Image
      src="/logo-um-novo-dia.png"
      alt=""
      width={815}
      height={238}
      priority
      className={className}
    />
  );
}
