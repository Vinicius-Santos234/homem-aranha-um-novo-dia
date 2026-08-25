/**
 * Geometria da máscara costurada.
 *
 * Tudo calculado no módulo, sem aleatoriedade: servidor e cliente produzem os
 * mesmos paths e a hidratação nunca diverge.
 */

export const VB = { w: 600, h: 780 };

/** Contorno da máscara — um ovo assimétrico, mais largo no crânio. */
export const CONTORNO =
  "M300 45C440 45 532 165 532 335C532 505 424 668 300 706C176 668 68 505 68 335C68 165 160 45 300 45Z";

/**
 * Uma lente. A outra é esta espelhada no eixo vertical do viewBox.
 * Gota, não elipse: canto externo alto e arredondado, canto interno descendo
 * até quase uma ponta. É o que faz ler como Homem-Aranha e não como óculos.
 */
export const LENTE =
  "M135 288C182 275 240 312 272 352C232 378 178 388 135 374C96 368 96 294 135 288Z";

/* ---- a teia ---- */

// centro alto, como numa teia ancorada no topo da cabeça
const CX = 300;
const CY = 118;
const RAIO_MAX = 900;
const N_RAIOS = 13;
const N_ARCOS = 7;
const CEDENCIA = 0.14; // o quanto o fio afunda entre dois raios

const passo = (Math.PI * 2) / N_RAIOS;
const ponto = (ang, r) => [CX + Math.cos(ang) * r, CY + Math.sin(ang) * r];
const fmt = (n) => n.toFixed(1);

/**
 * Raios saindo do centro. Começam a uma distância do centro de propósito:
 * 18 linhas convergindo no mesmo ponto viram um borrão preto.
 * O recorte da máscara corta o que sobra para fora.
 */
const RAIO_MIN = 58;

export const RAIOS = Array.from({ length: N_RAIOS }, (_, i) => {
  const [x0, y0] = ponto(i * passo, RAIO_MIN);
  const [x1, y1] = ponto(i * passo, RAIO_MAX);
  return `M${fmt(x0)} ${fmt(y0)}L${fmt(x1)} ${fmt(y1)}`;
});

/**
 * Anéis concêntricos. Cada trecho entre dois raios é uma quadrática cujo
 * controle é puxado para o centro — é o fio cedendo, como numa teia de verdade.
 * Um anel por path para poder escalonar a entrada de fora para dentro.
 */
export const ARCOS = Array.from({ length: N_ARCOS }, (_, k) => {
  // espaçamento crescente: perto do centro os anéis se acumulam
  const r = 90 + Math.pow((k + 1) / N_ARCOS, 1.35) * 620;
  let d = "";
  for (let s = 0; s < N_RAIOS; s++) {
    const a = s * passo;
    const b = a + passo;
    const [x1, y1] = ponto(a, r);
    const [x2, y2] = ponto(b, r);
    const [cx, cy] = ponto(a + passo / 2, r * (1 - CEDENCIA));
    if (s === 0) d += `M${fmt(x1)} ${fmt(y1)}`;
    d += `Q${fmt(cx)} ${fmt(cy)} ${fmt(x2)} ${fmt(y2)}`;
  }
  return d;
});

/** Etapas da montagem — o texto da lista da esquerda e as faixas de rolagem. */
export const ETAPAS = [
  { nome: "Tecido", detalhe: "moletom vermelho, dois metros", de: 0.04, ate: 0.2 },
  { nome: "Contorno", detalhe: "ponto corrido, linha preta", de: 0.14, ate: 0.34 },
  { nome: "Teia", detalhe: "treze raios, sete voltas", de: 0.3, ate: 0.68 },
  { nome: "Lentes", detalhe: "óculos de natação, lixados", de: 0.66, ate: 0.84 },
];
