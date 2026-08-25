/* Peças gráficas do site.

   O logotipo virou imagem; o resto continua SVG desenhado aqui.
   Quem usa o quê: `SetaTeia` no botão de voltar ao topo, `SpiderWeb` no fundo
   do herói, `Logo` na barra e na página de lugares.

   Duas peças SAÍRAM daqui em 24/08, as duas para `_arquivo/`, as duas por
   decisão de direção e não por defeito:

     · `WebShooterHand` → `_arquivo/mao-lanca-teias.jsx`
       vivia no centro do selo "role a página"; o selo perdeu o vetor.
     · `SpiderIcon` → `_arquivo/spider-icon.jsx`
       era o botão de voltar ao topo, que virou seta. ⚠️ Ela é a ORIGEM do
       desenho de `src/app/icon.svg` (o favicon): mexeu num, olhe o outro.

   Nenhuma das duas foi apagada — o `.git` do projeto só tem o commit do
   `create-next-app`, então apagar é perder a única cópia. */

import Image from "next/image";

/**
 * Seta para cima, desenhada como fio de teia.
 *
 * A função vem primeiro: cabeça e haste formam uma seta comum, que qualquer
 * pessoa lê como "subir" sem precisar decifrar nada. A temática entra na
 * TEXTURA, não na forma — os dois fios atravessados na haste cedem no meio,
 * o mesmo `sag` dos anéis de `SpiderWeb`, e é isso que faz a seta parecer
 * feita de teia em vez de vinda de uma biblioteca de ícones.
 *
 * ⚠️ Não trocar por uma aranha de novo. A aranha era o que estava aqui antes e
 * o problema dela era exatamente este: bonita, temática e muda quanto ao que o
 * botão faz.
 */
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
      {/* a seta */}
      <path d="M26 46 L50 22 L74 46" />
      <path d="M50 22 V84" />
      {/* Os fios atravessados, cedendo para baixo como numa teia real.
          ⚠️ O primeiro fio começa em y=60 e não em y=52 (onde estava quando
          desenhei). A 8px mais alto, as pontas dele quase encostavam nas
          pontas da cabeça e o conjunto fechava num triângulo — a seta sumia
          dentro da própria textura. Medido na tela, ampliado. */}
      <path d="M33 60 Q50 69 67 60" strokeWidth="4.5" />
      <path d="M37 74 Q50 82 63 74" strokeWidth="4.5" />
    </svg>
  );
}

/* ---- teia ---------------------------------------------------------- */

function buildWeb({ spokes = 16, rings = 9, radius = 500, sag = 0.16 }) {
  const step = (Math.PI * 2) / spokes;
  const spokePaths = [];
  const ringPaths = [];

  for (let s = 0; s < spokes; s++) {
    const a = s * step;
    spokePaths.push(`M0 0L${(Math.cos(a) * radius).toFixed(1)} ${(Math.sin(a) * radius).toFixed(1)}`);
  }

  for (let r = 1; r <= rings; r++) {
    // anéis mais espaçados conforme afastam do centro, como numa teia real
    const rad = radius * Math.pow(r / rings, 1.55);
    let d = "";
    for (let s = 0; s < spokes; s++) {
      const a = s * step;
      const b = a + step;
      const x1 = Math.cos(a) * rad;
      const y1 = Math.sin(a) * rad;
      const x2 = Math.cos(b) * rad;
      const y2 = Math.sin(b) * rad;
      // controle puxado pro centro = fio "cedendo" entre dois raios
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

/* ---- logotipo ------------------------------------------------------ */

/**
 * O logotipo do filme.
 *
 * O arquivo em `public/` já vem RECORTADO pelo alpha: o original tinha 823×564
 * com o desenho ocupando só a faixa do meio — ~125px de vazio em cima e ~200px
 * embaixo. Usado inteiro, o logo carregaria um bloco de ar invisível e nada
 * alinharia com ele na barra.
 *
 * `width`/`height` são os do arquivo, não os de exibição: servem para o
 * navegador reservar o espaço na proporção certa e não haver salto de layout.
 * Quem manda no tamanho é a altura no `className`, com `w-auto`.
 *
 * `alt` vazio de propósito — os dois lugares que usam isto envolvem o logo num
 * link que já tem `aria-label`, e sem isso o leitor de tela anuncia duas vezes.
 */
/* ⚠️ A ALTURA DO LOGO É O QUE DECIDE SE O CABEÇALHO CABE. Ele tem proporção
   815/238 — cada pixel de altura vira 3,4 de largura —, e divide a barra com a
   pílula "Os lugares", que é `eyebrow` e portanto larga (0,22em de espaçamento
   entre letras). Medido em 25/08 num viewport de 320px: 272px úteis para 149
   de logo + 124 de pílula = 273. Passava 1px, e como a pílula podia quebrar,
   ela quebrava em duas linhas em vez de vazar — 59px de altura numa barra
   de 84.

   Em `h-10` o logo cai para ~137px. Junto com o rótulo curto da pílula
   ("LUGARES" em vez de "OS LUGARES" abaixo de `sm`), sobram ~39px em 320px —
   folga suficiente para aguentar também quem usa o sistema com fonte
   aumentada, que é o caso que eu NÃO consegui reproduzir aqui e que
   provavelmente é o que ele viu. Ao mexer nesta altura, refazer a conta com a
   pílula. */
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
