"use client";

/** "A tela está livre?" */

let livre = false;
const ouvintes = new Set();

/** Chamado pelo `AvisoEntrada` quando nada mais cobre a página. */
export function liberarEntrada() {
  if (livre) return;
  livre = true;
  for (const ouvinte of ouvintes) ouvinte();
}

export function assinarEntrada(aoMudar) {
  ouvintes.add(aoMudar);
  return () => ouvintes.delete(aoMudar);
}

export const lerEntrada = () => livre;
export const lerEntradaNoServidor = () => false;
