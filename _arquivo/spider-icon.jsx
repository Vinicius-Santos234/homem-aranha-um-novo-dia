/* ------------------------------------------------------------------ *
 *  `SpiderIcon` — arquivada em 2026-08-24.
 *
 *  Vivia em `src/components/art.jsx` e era o desenho do botão de voltar ao
 *  topo. Saiu de lá quando o botão passou a usar uma seta (`SetaTeia`): uma
 *  aranha é bonita e temática, mas não diz "subir".
 *
 *  ⚠️ ELA NÃO É CÓDIGO MORTO QUALQUER — É A ORIGEM DO FAVICON. O
 *  `src/app/icon.svg` tem estas mesmas oito pernas, com três ajustes feitos
 *  para os 16px:
 *
 *    · traço 4,5 → 7 (a 4,5 daria 0,7px num favicon de 16px)
 *    · cabeça de cy 35 r 6 → cy 32 r 6,5, para descolar do corpo
 *    · corpo de ry 14 → ry 13, senão vira mancha
 *    · aranha a 80% do quadrado; as pernas vão até x=8 e y=95
 *
 *  Ficou aqui e não em `art.jsx` porque não tinha mais importador nenhum, e
 *  componente sem importador em `src/` é armadilha para a próxima varredura.
 *  **Mexeu no favicon, olhe este arquivo; mexeu neste arquivo, olhe o favicon.**
 *  São dois desenhos irmãos, não um só em dois lugares.
 *
 *  Para restaurar: recolar a função em `src/components/art.jsx` e reimportar.
 * ------------------------------------------------------------------ */

export function SpiderIcon({ className = "", ...rest }) {
  const legs = (
    <>
      <path d="M44 41C31 36 23 24 21 11" />
      <path d="M42 49C26 47 14 41 8 31" />
      <path d="M42 57C26 61 14 69 10 79" />
      <path d="M45 64C35 73 29 84 28 95" />
    </>
  );

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      aria-hidden
      {...rest}
    >
      {legs}
      <g transform="translate(100 0) scale(-1 1)">{legs}</g>
      <ellipse cx="50" cy="54" rx="7.5" ry="14" fill="currentColor" stroke="none" />
      <circle cx="50" cy="35" r="6" fill="currentColor" stroke="none" />
    </svg>
  );
}
