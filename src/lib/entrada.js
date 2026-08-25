"use client";

/* ------------------------------------------------------------------ *
 *  "A tela está livre?"
 *
 *  Duas coisas cobrem o site inteiro ao entrar: a tela de carregamento e o
 *  aviso. Enquanto uma delas está no ar, ninguém vê nada da página — e isso
 *  importa para quem TOCA sozinho.
 *
 *  ⚠️ O CASO QUE FEZ ISTO EXISTIR: no celular o clipe do herói deixou de ser
 *  raspado pela rolagem e passou a tocar uma vez, como o do fecho. Só que o
 *  herói já está em cena no instante em que a página nasce — o clipe começaria
 *  debaixo da tela de carregamento, correria enquanto o aviso espera um toque,
 *  e quem finalmente entrasse encontraria um quadro congelado. O clipe do
 *  fecho não tem esse problema porque a seção dele está oito telas abaixo.
 *
 *  Loja minúscula em vez de evento solto porque a ORDEM não é garantida: o
 *  herói pode assinar depois de o aviso já ter liberado. Com um valor guardado,
 *  quem chega atrasado lê o estado em vez de esperar um evento que já passou.
 * ------------------------------------------------------------------ */

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
/* No servidor a tela nunca está livre: assim o HTML dos dois lados bate e a
   hidratação não diverge. */
export const lerEntradaNoServidor = () => false;
