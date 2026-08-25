"use client";

/* ------------------------------------------------------------------ *
 *  Consentimento para a medição de audiência.
 *
 *  ⚠️ ISTO NÃO É UM BANNER DE COOKIES, E A DIFERENÇA NÃO É DE NOME. A medição
 *  da Vercel que este site usa é SEM COOKIES — ela não grava nada no navegador
 *  e não segue ninguém entre sites. Um aviso dizendo "usamos cookies" seria
 *  literalmente falso.
 *
 *  O que existe de verdade para consentir é o envio de dados de navegação
 *  (página vista, referência, país, tipo de aparelho) a um terceiro. É disso
 *  que a pessoa está sendo perguntada, e é por isso que a escolha VALE: sem
 *  "aceito" gravado aqui, o componente `<Analytics />` não é montado e nenhuma
 *  requisição sai. Pergunta que não muda o comportamento é teatro.
 *
 *  O único armazenamento que o site faz no aparelho é funcional e fica no
 *  `localStorage`: a decisão daqui e o "já li o aviso de entrada". Nenhum dos
 *  dois sai do navegador — ver a página `/privacidade`.
 * ------------------------------------------------------------------ */

const CHAVE = "consentimento-analise";

export const ACEITO = "aceito";
export const RECUSADO = "recusado";

/* `undefined` = ainda não fui ao disco; `null` = fui e não havia decisão.
   A distinção importa porque `getSnapshot` do `useSyncExternalStore` precisa
   devolver sempre o MESMO valor entre renderizações — ler o `localStorage` a
   cada chamada funcionaria, mas isto evita ir ao disco à toa. */
let valor;
const ouvintes = new Set();

export function lerConsentimento() {
  if (valor === undefined) {
    try {
      valor = window.localStorage.getItem(CHAVE);
    } catch {
      /* modo privado ou armazenamento bloqueado: fica sem decisão, o banner
         reaparece e a medição segue desligada. Errar para o lado de não medir
         é o lado certo de errar. */
      valor = null;
    }
  }
  return valor;
}

/* No servidor ninguém decidiu nada — assim o HTML dos dois lados bate e a
   hidratação não diverge. */
export const lerConsentimentoNoServidor = () => null;

/* O script de medição já está na página? Ele é injetado pelo `<Analytics />`
   e o caminho muda entre desenvolvimento e produção. */
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
    /* sem disco, a decisão vale para esta visita e ponto */
  }
  for (const ouvinte of ouvintes) ouvinte();

  /* ⚠️ DESMONTAR O `<Analytics />` NÃO DESFAZ O QUE ELE JÁ FEZ. O React tira o
     componente da árvore, mas a TAG `<script>` que ele injetou continua no
     documento e o código de terceiro segue carregado — medido em 25/08:
     depois de revogar, o script ainda estava lá.

     Isso transformaria a página de privacidade em promessa falsa. Recarregar é
     o único jeito honesto de garantir que nada daquilo continua rodando: no
     carregamento seguinte a decisão já é "recusado" e o componente nunca
     monta.

     Só recarrega quando há o que descarregar — quem nunca aceitou e clica em
     "não medir" não perde a página por nada. */
  if (novo === RECUSADO && medicaoJaCarregada()) window.location.reload();
}

export function assinarConsentimento(aoMudar) {
  ouvintes.add(aoMudar);
  return () => ouvintes.delete(aoMudar);
}
