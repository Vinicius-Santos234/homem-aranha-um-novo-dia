/* ------------------------------------------------------------------ *
 *  `acharLugar` — arquivada em 2026-08-24.
 *
 *  Vivia no fim de `src/lib/lugares.js` e NUNCA foi chamada por ninguém.
 *  Nasceu supondo uma rota por lugar (`/lugares/[slug]`) que não existe: a
 *  faixa de cada lugar é sobreposição dentro de `/lugares`, aberta por estado
 *  no `GradeLugares`, sem navegação e sem slug na URL.
 *
 *  ⚠️ Ela volta a fazer sentido no dia em que cada lugar virar rota própria —
 *  e nesse dia é bom lembrar que a decisão de NÃO ser rota foi deliberada: o
 *  clique não perde a posição da grade e fechar não recarrega nada.
 * ------------------------------------------------------------------ */

import { LUGARES } from "@/lib/lugares";

export function acharLugar(slug) {
  return LUGARES.find((lugar) => lugar.slug === slug) ?? null;
}
