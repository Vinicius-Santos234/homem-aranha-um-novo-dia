"use client";

/** Consentimento para a medição de audiência. */

const CHAVE = "consentimento-analise";

export const ACEITO = "aceito";
export const RECUSADO = "recusado";

let valor;
const ouvintes = new Set();

export function lerConsentimento() {
  if (valor === undefined) {
    try {
      valor = window.localStorage.getItem(CHAVE);
    } catch {
      valor = null;
    }
  }
  return valor;
}

export const lerConsentimentoNoServidor = () => null;

function medicaoJaCarregada() {
  return [...document.querySelectorAll("script[src]")].some((s) =>
    /vercel-scripts|_vercel\/insights/.test(s.src),
  );
}

export function decidir(novo) {
  if (novo !== ACEITO && novo !== RECUSADO) return;
  valor = novo;
  try {
    window.localStorage.setItem(CHAVE, novo);
  } catch {
  }
  for (const ouvinte of ouvintes) ouvinte();

  if (novo === RECUSADO && medicaoJaCarregada()) window.location.reload();
}

export function assinarConsentimento(aoMudar) {
  ouvintes.add(aoMudar);
  return () => ouvintes.delete(aoMudar);
}
