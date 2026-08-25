/* ------------------------------------------------------------------ *
 *  `WebShooterHand` — arquivada em 2026-08-24.
 *
 *  Vivia no centro do selo "role a página" do herói, em `art.jsx`. Saiu por
 *  decisão de direção, palavras dele: *"essa mão de vetores no meio está muito
 *  feia"* — e ele tem razão no tamanho em que ela aparecia. O selo tem 128px e
 *  a mão ocupava 44 deles: nesse tamanho os cinco retângulos arredondados
 *  perdem a leitura de "mão" e viram um borrão vermelho.
 *
 *  O centro do selo virou uma conta descendo um fio, feita de duas caixas com
 *  CSS — sem desenho vetorial nenhum, que era o pedido.
 *
 *  ⚠️ Está aqui e não no lixo pelo motivo de sempre neste projeto: o `.git` só
 *  tem o commit do `create-next-app`. Esta é a única cópia.
 *
 *  Para voltar: recolar a função em `src/components/art.jsx` e reimportar.
 *  Se for reusar, use GRANDE — ela foi desenhada num viewBox de 100 e só fecha
 *  a leitura a partir de uns 80px na tela.
 * ------------------------------------------------------------------ */

/** A mão no gesto do lança-teias — indicador e mindinho pra cima, polegar aberto. */
export function WebShooterHand({ className = "", ...rest }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden {...rest}>
      <rect x="34" y="47" width="32" height="37" rx="11" />
      <rect x="37" y="14" width="12" height="40" rx="6" transform="rotate(-6 43 34)" />
      <rect x="62" y="21" width="11" height="34" rx="5.5" transform="rotate(11 67 38)" />
      <rect x="20" y="43" width="11" height="28" rx="5.5" transform="rotate(-34 25 57)" />
      <rect x="47" y="38" width="21" height="17" rx="8.5" />
    </svg>
  );
}
