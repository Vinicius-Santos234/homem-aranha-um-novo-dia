import Image from "next/image";

/**
 * Chapa — o lugar de uma imagem que ainda não existe.
 *
 * O site vive de imagem grande e `public/` só tem o clipe do herói. Em vez de
 * caixa cinza, a chapa é desenhada no acento do trecho: gradiente + anéis de
 * teia + a legenda do que vai ali. O layout fica real e a troca por foto é um
 * prop — passe `src` e ela vira `<Image>`, sem mexer em mais nada.
 *
 * ⚠️ TUDO AQUI É CSS DE PROPÓSITO. A primeira versão desenhava a teia em SVG
 * (a mesma peça do herói) e o compositor do Chrome engasgava: o JS continuava
 * respondendo, mas `captureScreenshot` estourava. Uma teia é ~25 caminhos com
 * traço; esticada a 150% de um contêiner grande, e repetida numa faixa com
 * quatro ou cinco chapas na tela, vira área de rasterização demais.
 * Gradiente repetido é tile — o navegador pinta um pedaço e carimba.
 *
 * A chapa é um espaço reservado: não pode custar mais caro que a foto que ela
 * substitui.
 *
 * Nada aqui é aleatório: o desenho sai do próprio texto da legenda, então o
 * servidor e o cliente pintam a mesma coisa e a hidratação não quebra.
 */

/** Soma dos códigos da legenda — determinística, só para variar o desenho. */
function semente(texto) {
  let n = 0;
  for (let i = 0; i < texto.length; i++) n = (n * 31 + texto.charCodeAt(i)) % 997;
  return n;
}

export default function Chapa({
  legenda,
  acento,
  src = null,
  /* ⚠️ `sizes` NÃO É DETALHE. Ele diz ao Next qual variante servir, e o padrão
     "100vw" faz sentido só para as chapas que ocupam a tela inteira. Numa carta
     do leque (248px) ou num cartão da grade (~380px), 100vw manda o navegador
     baixar a variante de 1920 para desenhar 248 — com ~47 fotos entrando no
     site, é a diferença entre a página abrir e a página arrastar.
     Quem chama passa o seu; ver os valores em cada ponto de uso. */
  sizes = "100vw",
  className = "",
  style = {},
  mostrarLegenda = true,
  /* Como a foto termina. Só vale quando há `src` — a chapa desenhada tem a
     moldura dela desde sempre. Sobraram DOIS jeitos de uma foto acabar neste
     site, e não mais três:

       | valor | para quê | o que faz |
       |---|---|---|
       | `nua` | foto dentro de uma moldura de verdade — toda `Polaroide` e os postais dos lugares | só a vinheta |
       | `sangra` | foto que ocupa a viewport (capa, citação) | dissolve em cima e embaixo, onde encosta no capítulo |

     ⚠️ `nua` NÃO É "sem tratamento por preguiça". A foto emoldurada vive
     dentro de um `bg-bone`, e qualquer coisa que a `Chapa` acrescente ali
     briga com uma borda que já existe: a máscara antiga derretia a foto PARA
     DENTRO do papel (comparado na tela em 25/08, no cartão do sótão), e um fio
     de contorno seria uma segunda borda encostada na primeira.

     ⚠️ O TERCEIRO VALOR, `moldura`, SAIU EM 25/08 — e o que ele fazia não se
     perdeu, mudou de dono. Ele dava aresta a uma foto solta no escuro: fio de
     osso a 9% + sombra. Quando a galeria e a colagem ganharam moldura de
     papel, esse trabalho passou a ser da `Polaroide` (o papel É a aresta, e é
     ele que projeta a sombra) e `moldura` ficou sem um único chamador. Não
     ficou aqui "por garantia": opção sem chamador é intenção fingindo ser
     funcionalidade, e este projeto já perdeu uma sessão com uma dessas. */
  borda = "nua",
}) {
  // com imagem de verdade, a chapa some e sobra a foto — mesmo contrato de
  // tamanho: quem manda continua sendo o `className`/`style` de quem chamou
  if (src) {
    const sangra = borda === "sangra";

    return (
      <div className={`grao-foto relative overflow-hidden ${className}`} style={style}>
        <Image
          src={src}
          alt={legenda}
          fill
          sizes={sizes}
          className={`object-cover ${sangra ? "foto-sangra" : ""}`}
        />

        {/* Vinheta — o que assenta a foto no papel. Ela escurece o miolo das
            arestas por DENTRO, então um canto claro para de saltar sem
            precisar apagar a alpha da borda (ver a utilidade `foto-sangra` no
            `globals.css` para o porquê de não ser máscara). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 100% at 50% 50%, transparent 42%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>
    );
  }

  /* Só o `cx` sobrou. `angulo`, `cy` e `passo` eram da versão que desenhava a
     teia em SVG e ficaram sendo calculados sem ninguém ler — nem o lint nem o
     build acusam variável sem uso neste projeto. Saíram em 24/08. */
  const s = semente(legenda);
  const cx = 18 + (s % 64); // centro do reflexo, em %

  return (
    <div
      className={`relative overflow-hidden bg-carvao ${className}`}
      style={style}
      role="img"
      aria-label={legenda}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            // O acento entra como um reflexo difuso vindo do chão molhado
            // (como um letreiro neon refletindo no asfalto)
            `radial-gradient(ellipse at ${cx}% 90%, ${acento}75 0%, ${acento}25 40%, transparent 75%)`,
            // Chuva — camada 1 (mais próxima/forte) caindo levemente inclinada
            "repeating-linear-gradient(168deg, rgba(255,255,255,0.06) 0px, transparent 1px, transparent 11px)",
            // Chuva — camada 2 (mais de fundo)
            "repeating-linear-gradient(174deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 7px)",
            // Textura do asfalto / varredura horizontal para "quebrar" a linha contínua da chuva
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0 1px, transparent 1px 4px)",
          ].join(", "),
        }}
      />

      {/* moldura interna */}
      <div className="absolute inset-0 border border-white/10" />

      {mostrarLegenda && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
          <p className="max-w-[26ch] text-[0.7rem] leading-snug text-bone/45">{legenda}</p>
          <span
            className="eyebrow shrink-0 text-[0.5rem] opacity-70"
            style={{ color: acento }}
            aria-hidden
          >
            sem imagem
          </span>
        </div>
      )}
    </div>
  );
}
