import Chapa from "@/components/Chapa";

/**
 * Polaroide — a foto revelada, com moldura de papel e legenda no rodapé.
 *
 * É a mesma peça que os cartões-postais dos lugares já eram (`bg-bone` com um
 * respiro em volta e o nome impresso embaixo). Aqui ela virou componente
 * porque passou a valer para a galeria dos capítulos e para a colagem das
 * faixas — as duas frentes que antes eram foto nua sobre o preto da página.
 *
 * ⚠️ A LEGENDA MORA AQUI, E NÃO MAIS DENTRO DA FOTO. Isto é consequência da
 * moldura, não gosto: com um rodapé de papel embaixo, uma legenda flutuando
 * por cima da imagem deixa o rodapé vazio e as duas coisas brigando pelo mesmo
 * papel. O lugar da legenda numa polaroide é a tira branca — é para isso que
 * ela existe. O ramo que desenhava legenda por cima da foto saiu da `Chapa` no
 * mesmo movimento: ficou sem nenhum chamador.
 *
 * ⚠️ POR DENTRO A FOTO É SEMPRE `nua`, e não é economia. `moldura` (o fio de
 * contorno + a sombra) existia para dar aresta a uma foto solta no escuro.
 * Dentro de uma moldura de osso, o fio encosta numa borda que já existe e a
 * sombra sai do objeto errado — quem projeta sombra é o papel, não a imagem
 * impressa nele. Foi o mesmo motivo que criou o `nua` para os postais.
 *
 * ⚠️ `flex` E NÃO POSIÇÃO ABSOLUTA NO RODAPÉ. A legenda quebra em duas linhas
 * nas chapas estreitas, e com o rodapé travado em altura a segunda linha caía
 * para fora do papel. Em coluna, a foto fica com o que sobra e o papel cresce
 * junto com o texto.
 *
 * A proporção de quem chama (`aspectRatio`) passa a valer para a POLAROIDE
 * inteira, não para a foto: a tira de baixo come uns 40px, e a imagem dentro
 * fica um pouco mais baixa que o `ratio` pedido. Como o recorte é
 * `object-cover`, isso aparece como um enquadramento levemente mais fechado —
 * não como distorção.
 */
export default function Polaroide({
  legenda,
  src = null,
  acento,
  sizes = "100vw",
  className = "",
  style = {},
}) {
  return (
    <div
      className={`flex flex-col bg-bone p-2.5 pb-2 shadow-2xl shadow-black/50 md:p-3 md:pb-2.5 ${className}`}
      style={style}
    >
      <Chapa
        legenda={legenda}
        src={src}
        acento={acento}
        sizes={sizes}
        /* `min-h-0` não é enfeite: sem ele um filho de flex se recusa a
           encolher abaixo do conteúdo e a foto estoura o papel para baixo. */
        className="min-h-0 flex-1"
        mostrarLegenda={false}
      />

      {/* A legenda na tira de papel. Mono porque é a voz de arquivo do site —
          a mesma da ficha do Controle de Danos —, e centralizada porque é
          assim que os postais dos lugares já imprimem o nome deles.

          ⚠️ SEM O TRACINHO DE ACENTO que a legenda tinha por cima da foto. Em
          cima do osso ele some: dos quatro acentos de capítulo, o do
          Justiceiro é #b9c2c9 e o do Hulk #5fd06a — cinza-claro e verde-claro
          sobre papel creme. Quem carrega o acento nesta peça é a cabeça do
          alfinete, que fica sobre a foto. */}
      {/* ⚠️ O RESPIRO LATERAL (`px-2`/`px-3`) NÃO É SÓ ESTÉTICA. As chapas da
          primeira coluna encostam na borda esquerda da viewport e a
          inclinação empurra o canto mais uns 15px para fora — medido, a
          legenda da primeira foto da Jean saía 4px da tela e comia meio
          caractere. Com o texto mais estreito que o papel, ele quebra em duas
          linhas antes de chegar na aresta, e o rodapé cresce junto. */}
      <p className="mt-2.5 px-2 text-center font-mono text-[0.72rem] leading-snug text-ink/70 md:mt-3 md:px-3 md:text-[0.75rem]">
        {legenda}
      </p>
    </div>
  );
}
