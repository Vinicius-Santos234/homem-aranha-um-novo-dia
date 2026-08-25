/**
 * Fixadores — o que prende a foto na página.
 *
 * Fita, clipe, alfinete, percevejo, grampo e cantoneira. Existem para a
 * galeria dos capítulos parar de parecer uma grade de imagens e passar a
 * parecer material espalhado numa mesa: alguém tirou aquelas fotos de um
 * envelope e prendeu ali.
 *
 * ⚠️ ELES MORAM FORA DA `Polaroide`, E ISSO NÃO É ORGANIZAÇÃO — É REQUISITO,
 * por dois motivos que se somam. Primeiro, a `Chapa` lá dentro tem
 * `overflow-hidden` para recortar a foto, e qualquer coisa desenhada dentro
 * dela seria cortada exatamente na borda — fixador que não passa da aresta não
 * prende nada. Segundo, e mais importante desde que a moldura entrou: o que
 * eles prendem é o PAPEL, não a imagem. Um clipe monta na borda da polaroide,
 * uma fita segura o canto do papel. Ancorados dentro da foto, estariam
 * prendendo uma coisa que já está presa.
 *
 * São irmãos da `Polaroide` dentro do `motion.div` da galeria — que, desde
 * 25/08, também não recorta.
 *
 * ⚠️ TUDO É CSS OU SVG DE UM CAMINHO SÓ. Mesma regra da `Chapa`: são até três
 * peças por foto, doze fotos, tudo dentro de uma subárvore que anima `filter`
 * a cada quadro da rolagem. Nada aqui pode custar caro.
 *
 * O que NÃO fica aqui é a escolha: qual peça, onde e quantas é dado, em
 * `src/lib/personagens.js`. O motivo está lá — e é o mesmo do arranjo das
 * faixas em `lugares.js`: sorteio quebra a hidratação.
 */

/* ⚠️ NEM TODO FIXADOR SE PRENDE DO MESMO JEITO, E ERRAR ISSO ESTRAGA A PEÇA.
   São três modos, e o modo é uma propriedade do objeto real:

     · MONTA NA BORDA (fita, clipe) — agarram a aresta por fora. Ficam metade
       para dentro e metade para fora, senão não estão prendendo nada.
     · ATRAVESSA (alfinete, percevejo, grampo) — furam a foto. Ficam INTEIROS
       para dentro, a um dedo da borda. Montado na aresta, um percevejo vira
       uma bolinha branca solta no fundo da página — foi o que aconteceu na
       primeira versão, e ele lia como marcador de lista.
     · ABRAÇA O CANTO (cantoneira) — o bolso de papel em que o vértice entra.

   As laterais ficam em 38% da altura e não em 50% de propósito: no meio exato
   o olho lê "botão de carrossel". */
const NA_BORDA = {
  "topo-esquerda": "left-[9%] top-0",
  topo: "left-1/2 top-0",
  "topo-direita": "right-[9%] top-0",
  esquerda: "left-0 top-[38%]",
  direita: "right-0 top-[38%]",
};

/* Recuo em px e não em %: numa chapa de 4/6 um recuo de 5% fica três vezes
   mais longe da borda do que na de 16/9, e o alfinete some no meio da foto.

   ⚠️ O RECUO PRECISA PASSAR DA MOLDURA DE PAPEL. A âncora é a borda da
   POLAROIDE, e o papel tem 10–12px: com 12px de recuo, a cabeça do percevejo
   (17px) caía metade no papel e metade na foto, bem em cima da emenda — lia
   como peça mal encaixada. 20/24px joga a peça inteira para dentro da imagem,
   que é onde um alfinete espetado num quadro de cortiça fica mesmo. */
const DENTRO = {
  "topo-esquerda": "left-5 top-5 md:left-6 md:top-6",
  topo: "left-1/2 top-5 md:top-6",
  "topo-direita": "right-5 top-5 md:right-6 md:top-6",
  esquerda: "left-5 top-[38%] md:left-6",
  direita: "right-5 top-[38%] md:right-6",
};

const CANTO = {
  "topo-esquerda": "left-0 top-0",
  "topo-direita": "right-0 top-0",
};

const ATRAVESSA = ["alfinete", "percevejo", "grampo"];

/* Giro natural de cada peça por âncora. A fita atravessa o canto na diagonal
   e fica quase reta no meio de uma borda; o clipe e o grampo acompanham a
   aresta em que montam. Dá para sobrescrever no dado com `giro`. */
const GIRO = {
  fita: { "topo-esquerda": -38, topo: -2.5, "topo-direita": 38, esquerda: 84, direita: -84 },
  clipe: { "topo-esquerda": -18, topo: 4, "topo-direita": 16, esquerda: -90, direita: 90 },
  // ⚠️ do alfinete, este é o ângulo da AGULHA (ver o aviso no componente).
  // Ela sempre aponta para DENTRO da foto, a partir da borda em que a peça está.
  alfinete: { "topo-esquerda": 42, topo: 62, "topo-direita": 138, esquerda: 34, direita: 146 },
  percevejo: { "topo-esquerda": 0, topo: 0, "topo-direita": 0, esquerda: 0, direita: 0 },
  grampo: { "topo-esquerda": -26, topo: 3, "topo-direita": 24, esquerda: -88, direita: 88 },
};

/* Fita crepe. O `clipPath` é o que faz ela parecer ARRANCADA em vez de
   recortada — sem os dentinhos nas duas pontas curtas, o retângulo
   translúcido lê como "faixa de UI", não como fita. */
function Fita({ giro }) {
  return (
    <div
      className="h-[24px] w-[86px] md:h-[28px] md:w-[104px]"
      style={{
        transform: `rotate(${giro}deg)`,
        backgroundColor: "rgba(216,206,183,0.42)",
        backgroundImage: [
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 2px, transparent 2px 5px)",
          "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.16))",
        ].join(", "),
        clipPath:
          "polygon(3% 0, 97% 0, 100% 28%, 96% 55%, 99% 100%, 4% 100%, 0 70%, 3% 36%)",
        boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
      }}
    />
  );
}

/* Clipe de papel: um traço só, o contorno do clipe de arame. Duas voltas e
   pronto — desenhar as três dobras "certas" engorda o caminho sem mudar nada
   no tamanho em que ele aparece. */
function Clipe({ giro }) {
  return (
    <svg
      width="24"
      height="54"
      viewBox="0 0 24 54"
      fill="none"
      style={{ transform: `rotate(${giro}deg)`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))" }}
    >
      <path
        d="M17.5 7v33a5.9 5.9 0 0 1-11.8 0V9.5a3.7 3.7 0 0 1 7.4 0v28.8a1.7 1.7 0 0 1-3.4 0V13"
        stroke="#c6cad0"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Alfinete espetado: cabeça redonda + a agulha saindo dela na diagonal. A
   cabeça puxa o acento do capítulo — é o único fixador colorido, e é o que
   amarra a peça à seção em que ela está.

   ⚠️ AQUI O `giro` É O ÂNGULO DA AGULHA, E NÃO DA PEÇA INTEIRA. A primeira
   versão girava o wrapper e a agulha por dentro, e os dois ângulos SE SOMAM:
   com `giro: -34` na âncora de cima-esquerda e 34° fixos na agulha, o total
   dava exatamente zero e o alfinete aparecia deitado, agulha na horizontal,
   como se estivesse largado em cima da foto em vez de espetado nela. Girar a
   cabeça não faz diferença nenhuma — ela é um círculo. */
function Alfinete({ giro, acento }) {
  return (
    <div className="relative h-4 w-4">
      <div
        className="absolute left-1/2 top-1/2 h-[2px] w-[28px] origin-left"
        style={{
          background: "linear-gradient(90deg, #aeb4ba, #eef1f4)",
          transform: `rotate(${giro}deg)`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.55)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.92) 0 13%, ${acento} 42%, rgba(0,0,0,0.55) 100%)`,
          boxShadow: "0 3px 7px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}

/* Percevejo visto de cima: só a cabeça de metal. Sem giro — um círculo girado
   é o mesmo círculo, e o dado não precisa fingir que muda. */
function Percevejo() {
  return (
    <div
      className="h-[17px] w-[17px] rounded-full"
      style={{
        background:
          "radial-gradient(circle at 34% 30%, #f4f6f8 0 13%, #bfc5cb 44%, #767d84 76%, #33383d 100%)",
        boxShadow: "0 3px 7px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(0,0,0,0.4)",
      }}
    />
  );
}

/* Grampo: o colchete de arame, visto de frente. */
function Grampo({ giro }) {
  return (
    <svg
      width="28"
      height="13"
      viewBox="0 0 28 13"
      fill="none"
      style={{ transform: `rotate(${giro}deg)`, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }}
    >
      <path
        d="M2.6 11.4V3.4h22.8v8"
        stroke="#d0d5da"
        strokeWidth="2.5"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}

/* Cantoneira de álbum: o triângulo de papel preto em que o canto da foto
   entra. Fica POR CIMA da foto, encostado no vértice.
 
   ⚠️ O FIO DE LUZ NA HIPOTENUSA NASCEU DE UM PROBLEMA QUE A MOLDURA RESOLVEU
   — e continua aqui porque a peça agora vive nos dois mundos. Ele existia
   porque, com a foto encostada direto no preto da página, um triângulo escuro
   sumia inteiro em qualquer plano noturno. Com a moldura de papel, a
   cantoneira cai no canto da POLAROIDE e tem contraste de graça contra o osso
   — mas ela é grande o bastante para invadir a imagem, e é sobre a imagem que
   o fio ainda faz o trabalho. A luz é só na diagonal porque é a única aresta
   que fica solta: as outras duas encostam na borda do papel.
 
   A conta do ângulo sai do `clipPath`. No triângulo de cima-esquerda a
   hipotenusa é o fim de um gradiente a 135° (que corre para baixo-direita);
   no de cima-direita, o fim de um a 225°. Trocar um pede refazer o outro. */
function Cantoneira({ lado }) {
  const esquerda = lado === "topo-esquerda";
  const paradas =
    "#332e29 0%, #1b1714 74%, #14110e 88%, rgba(241,237,230,0.30) 96%, rgba(241,237,230,0.42) 100%";
  return (
    <div
      className="h-10 w-10 md:h-12 md:w-12"
      style={{
        clipPath: esquerda ? "polygon(0 0, 100% 0, 0 100%)" : "polygon(100% 0, 100% 100%, 0 0)",
        background: `linear-gradient(${esquerda ? 135 : 225}deg, ${paradas})`,
      }}
    />
  );
}

function Peca({ tipo, em, giro, acento }) {
  if (tipo === "cantoneira") return <Cantoneira lado={em} />;
  if (tipo === "percevejo") return <Percevejo />;
  const g = giro ?? GIRO[tipo]?.[em] ?? 0;
  if (tipo === "fita") return <Fita giro={g} />;
  if (tipo === "clipe") return <Clipe giro={g} />;
  if (tipo === "alfinete") return <Alfinete giro={g} acento={acento} />;
  if (tipo === "grampo") return <Grampo giro={g} />;
  return null;
}

export default function Fixadores({ fixadores, acento }) {
  if (!fixadores?.length) return null;

  return (
    <>
      {fixadores.map(({ tipo, em, giro }) => {
        const mapa = tipo === "cantoneira" ? CANTO : ATRAVESSA.includes(tipo) ? DENTRO : NA_BORDA;
        const posicao = mapa[em];
        if (!posicao) return null;
        return (
          /* ⚠️ A CAIXA DA ÂNCORA TEM TAMANHO ZERO, E ISSO É O QUE TORNA A
             GEOMETRIA PREVISÍVEL. Antes ela era do tamanho da peça e centrava
             com `translate-x-1/2` — que é metade da largura NÃO ROTACIONADA. A
             fita tem 86px de largura e gira 84°, ficando com 24px de largura
             visual: era empurrada 43px para fora quando 12 bastavam. Medido em
             25/08 num viewport de 390px, isso punha o `body` em 425px de
             largura e deixava a página arrastar para o lado no celular — o
             defeito que parecia "o botão do cabeçalho sai da tela".

             Caixa de 0×0 com `flex items-center justify-center` centra o filho
             no PONTO, seja qual for o tamanho dele, e a rotação acontece dentro
             do filho em torno do próprio centro. O que sobra para fora passa a
             ser exatamente metade da extensão visual da peça. */
          <div
            key={`${tipo}-${em}`}
            aria-hidden
            className={`pointer-events-none absolute z-20 flex h-0 w-0 items-center justify-center ${posicao}`}
          >
            <Peca tipo={tipo} em={em} giro={giro} acento={acento} />
          </div>
        );
      })}
    </>
  );
}
