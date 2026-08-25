/**
 * Os lugares.
 *
 * Cada lugar é um mundo visual próprio — paleta, logotipo e fundo — igual ao
 * que a referência faz: não é o mesmo template repintado.
 *
 * São os cinco endereços que o site atravessa: onde ele mora, por onde ele
 * anda, a universidade que seguiu sem ele, o cofre do Controle de Danos e o
 * único lugar da cidade onde ele para de correr.
 *
 * ⚠️ A ESU É A EXCEÇÃO DA REGRA "nada que o filme não visita", e entrou assim
 * de propósito em 25/08. Ela não é locação da trama; está aqui pelo que
 * significa — a vida comum que continuou do outro lado do muro. Por isso o
 * texto dela não conta nada: é o único lugar da lista onde não acontece nada.
 *
 * ---- ONDE ENTRAM AS FOTOS ----------------------------------------------
 *
 * Duas frentes por lugar, as duas preenchidas AQUI:
 *
 *   · `foto` (no lugar) — o cartão-postal. ⚠️ UMA FOTO, TRÊS TELAS: ela é a
 *     carta do leque na home, o cartão da grade em `/lugares` e o postal de
 *     abertura da faixa. Proporção 4/3, e precisa ler pequena — na home ela
 *     aparece com 248px de largura.
 *   · `galeria[].foto` — as fotos da faixa horizontal. A proporção de cada uma
 *     sai de `w` e `h`; a mais larga do site tem 1040px.
 *
 * ```js
 * foto: "/sotao-postal.jpg",
 * galeria: [{ legenda: "...", w: 420, h: 0.62, rot: -3.2, sobe: 0.55, foto: "/sotao-escada.jpg" }],
 * ```
 *
 * Sem `foto`, o vão segue na chapa desenhada. Dá para preencher aos poucos.
 *
 * ---- O FIXADOR DO CARTÃO ------------------------------------------------
 *
 * `fixadores` prende o cartão no mural de cortiça da página `/lugares` (ver
 * `GradeLugares`). Mesma peça e mesmas âncoras dos capítulos — o desenho
 * está em `Fixadores.jsx` e a explicação dos três modos de fixação, em
 * `personagens.js`.
 *
 * ⚠️ AQUI É UM POR CARTÃO, e os cinco são de TIPOS DIFERENTES. São só cinco
 * objetos lado a lado na mesma tela: dois alfinetes iguais a dois cartões de
 * distância viram padrão, e padrão é o contrário de "alguém espetou isso
 * aqui". Na galeria dos capítulos, onde as fotos não se veem todas de uma
 * vez, a regra é mais frouxa (lá o que não pode repetir é a COMBINAÇÃO).
 * O bloco no fim do arquivo confere.
 *
 * ⚠️ Com foto, a `legenda` vira o `alt` da imagem — conferir se ela ainda
 * descreve o que se vê.
 *
 * A faixa horizontal é montada a partir de `galeria`. Cada item traz:
 *
 *   | campo | o que é |
 *   |---|---|
 *   | `w` | largura em px (vira `min(w, 78vw)` no celular) |
 *   | `h` | altura em fração da faixa |
 *   | `rot` | inclinação em graus |
 *   | `sobe` | quanto sai do rodapé, de 0 a 1 |
 *
 * ⚠️ `sobe` NÃO é px nem porcentagem da faixa: é a fração do espaço que sobra
 * acima da foto (`1 - h`). Em 1 a foto encosta no topo da faixa, em 0 fica no
 * rodapé — e por ser relativo ao próprio vão, **não tem como estourar para
 * fora e ser cortado** pelo `overflow-y: hidden`. Uma foto com `h: 1` não tem
 * vão nenhum, então `sobe` nela é sempre 0, escreva-se o que escrever.
 *
 * ⚠️ NADA AQUI PODE SER SORTEADO. Foi por isso que estes números viraram dado
 * em vez de sair de um `Math.random()` ou de um embaralhamento por índice: o
 * servidor pinta a faixa uma vez e o cliente pinta de novo, e um número
 * diferente entre os dois quebra a hidratação. Mesma regra do leque em
 * `ChamadaLugares.jsx`.
 *
 * ⚠️ CADA LUGAR TEM O SEU PRÓPRIO RITMO, E ELES NÃO SE REPETEM. Antes as fotos
 * só variavam de tamanho e penduravam todas do mesmo rodapé — cinco faixas com
 * a mesma cara. Agora o arranjo diz alguma coisa sobre o lugar:
 *
 *   · sótão — sobe conforme se aproxima do telhado; a claraboia é a mais alta
 *   · telhados — o que é céu flutua, o que é chão fica embaixo
 *   · ESU — quase sem inclinação, tudo alinhado; é institucional
 *   · Roosevelt — todas tombam para o mesmo lado, como correnteza
 *   · túmulo da May — parado e reto, com UMA foto torta: a do Peter sentado
 *
 * Ao acrescentar um lugar, invente um ritmo novo em vez de copiar um destes.
 * Faixa útil da inclinação: **±4,5°**. Passando disso deixa de ser "foto
 * esparramada na mesa" e vira enfeite.
 *
 * O comprimento total sai do conteúdo, não de um template: some as larguras
 * e some o painel de abertura. ~2,5 a 3,5 telas é a faixa que funciona.
 *
 * ⚠️ As legendas descrevem o plano que vai entrar em cada vão — trocar quando
 * houver material.
 */

export const LUGARES = [
  {
    slug: "o-sotao",
    nome: "O sótão",
    logotipo: "O sótão",
    chamada: "Onde ele volta quando acaba",
    acento: "#e83a3aff",
    fundo: "#1a0f0a",
    tinta: "#f4e6d6",
    titulo: "Era depósito do prédio",
    foto: "/sotaofoto.jpg",
    fixadores: [{ tipo: "alfinete", em: "topo-esquerda" }],
    destaque: "Um colchão, uma lâmpada e o traje aberto em cima da mesa.",
    corpo:
      "Ele subiu um andar para não ter que cumprimentar ninguém no corredor. É onde o traje é costurado à mão, onde o aparelho do Banner é montado de madrugada e onde ninguém bate na porta — porque ninguém sabe que existe uma porta ali.",
    galeria: [
      // sobe conforme se aproxima do telhado; a claraboia é a mais alta de todas
      { foto: "/sotao1.jpg", legenda: "O traje rodando na máquina, ele no chão", w: 420, h: 0.62, rot: -3.2, sobe: 0.55 },
      { foto: "/sotao2.jpg", legenda: "A máscara no travesseiro, o abajur aceso", w: 620, h: 0.78, rot: 1.8, sobe: 0.14 },
      { foto: "/sotao3.jpg", legenda: "O sótão inteiro", w: 760, h: 0.92, rot: -1.2, sobe: 0.4 },
      { foto: "/sotao14.jpg", legenda: "Costurando a máscara à mão, na bancada", w: 500, h: 0.55, rot: 4.1, sobe: 0.82 },
      { foto: "/sotao5.jpg", legenda: "A cama desfeita, o ventilador ligado", w: 880, h: 1, rot: 0, sobe: 0 },
    ],
  },
  {
    slug: "os-telhados",
    nome: "Os telhados",
    logotipo: "Telhados",
    chamada: "A cidade vista de onde ela não olha",
    acento: "#5f9fdd",
    fundo: "#080d16",
    tinta: "#dceaf8",
    titulo: "Ninguém olha pra cima",
    foto: "/telhadofoto.jpg",
    fixadores: [{ tipo: "clipe", em: "topo-direita" }],
    destaque: "Caixa d'água, antena, respiro de ar-condicionado. O escritório dele.",
    corpo:
      "De baixo é trânsito. De cima é um mapa, e é o único lugar onde ele não precisa fingir ser outra pessoa. Passa mais tempo aqui do que no endereço onde dorme — e é daqui que ele acompanha, de longe, duas pessoas que não lembram mais dele.",
    galeria: [
      // o que é céu flutua, o que é chão fica embaixo
      { foto: "/telhado1.jpg", legenda: "Caixas d'água e o Empire State aceso atrás", w: 480, h: 0.95, rot: 1.4, sobe: 0.2 },
      { foto: "/telhado2.jpg", legenda: "Telhados cinzentos até a ponte", w: 640, h: 0.6, rot: -2.6, sobe: 0.88 },
      { foto: "/telhado3.jpg", legenda: "Do parapeito, prédio contra prédio, céu limpo", w: 900, h: 0.82, rot: 0.9, sobe: 0.52 },
      { foto: "/telhado4.jpg", legenda: "O sol se pondo atrás do Empire State", w: 420, h: 0.5, rot: -4.2, sobe: 0.06 },
      { foto: "/telhado5.jpg", legenda: "A cidade inteira, na hora dourada", w: 1040, h: 1, rot: 0, sobe: 0 },
    ],
  },
  {
    slug: "esu",
    nome: "ESU",
    logotipo: "ESU",
    chamada: "A vida que continuou sem ele",
    acento: "#8f7d1aff",
    fundo: "#0c0f12",
    tinta: "#e4e9ed",
    titulo: "Aqui ele não é ninguém",
    foto: "/esufoto.jpg",
    fixadores: [{ tipo: "percevejo", em: "topo-direita" }],
    destaque: "Selo de 1865, pátio cheio, anfiteatro lotado. Nada disso é sobre ele.",
    corpo:
      "É a vida comum seguindo em frente do outro lado do muro: o pátio atravessado todo dia, a aula que enche e esvazia, gente decidindo o resto da vida entre um corredor e outro. O feitiço não apagou só o nome dele — apagou o lugar que ele ocupava aqui. É o endereço que mais lembra o que ele perdeu, e o único desta lista onde não acontece nada.",
    galeria: [
      // quase sem inclinação e tudo baixo: é institucional, não é mesa de casa
      { foto: "/esu1.jpg", legenda: "O pátio no fim da tarde, a biblioteca acesa", w: 820, h: 1, rot: 0, sobe: 0 },
      { foto: "/esu3.jpg", legenda: "O anfiteatro cheio, visto da última fileira", w: 560, h: 0.7, rot: -1.1, sobe: 0.34 },
      { foto: "/esu2.jpg", legenda: "De moletom da ESU, rindo no meio da aula", w: 400, h: 0.86, rot: 0.6, sobe: 0.1 },
      { foto: "/esu4.jpg", legenda: "A avenida à noite, o Empire State no fim dela", w: 700, h: 0.58, rot: -0.8, sobe: 0.62 },
    ],
  },
  {
    slug: "roosevelt-island",
    nome: "Roosevelt Island",
    logotipo: "Roosevelt",
    chamada: "O cofre no meio do rio",
    acento: "#5fd06a",
    fundo: "#04120a",
    tinta: "#dcf6e0",
    titulo: "Uma ilha inteira para um arquivo",
    foto: "/rooseveltcapa.jpg",
    fixadores: [{ tipo: "fita", em: "topo-esquerda" }],
    destaque: "Água dos dois lados, uma entrada só, e o que o departamento não quer que se leia.",
    corpo:
      "Fica a duzentos metros de Manhattan e é mais difícil de alcançar do que qualquer prédio da cidade: para chegar no cofre é preciso passar pela ilha, e para sair também. É onde o segredo do departamento está trancado — e onde a coisa mais forte de Nova York aparece batendo na porta sem ser ela mesma.",
    galeria: [
      // todas tombam para o mesmo lado, como correnteza
      { foto: "/roosevelt1.jpg", legenda: "Dentro do bloco de celas, e eles em bando", w: 720, h: 0.66, rot: 2.2, sobe: 0.72 },
      { foto: "/roosevelt2.jpg", legenda: "A lâmina parada com teia, a um palmo do rosto", w: 860, h: 1, rot: 0, sobe: 0 },
      { foto: "/roosevelt3.jpg", legenda: "Os bancos da margem virados para Manhattan", w: 460, h: 0.9, rot: 2.8, sobe: 0.26 },
      { foto: "/roosevelt4.jpg", legenda: "A ilha de cima: água dos dois lados", w: 980, h: 0.74, rot: 1.6, sobe: 0.46 },
    ],
  },
  {
    slug: "tumulo-da-may",
    nome: "O túmulo da May",
    logotipo: "Túmulo da May",
    chamada: "O único lugar onde ele para",
    acento: "#312f27ff",
    fundo: "#141008",
    tinta: "#f6ecd2",
    titulo: "A pessoa que ainda responde",
    foto:"/tumulofoto.jpg",
    fixadores: [{ tipo: "grampo", em: "topo" }],
    destaque: "Grama cortada, uma pedra com o nome inteiro, e ninguém por perto.",
    corpo:
      "Ele vem sempre, e vem sem o traje. É a única conversa da cidade em que ele não precisa esconder o nome — e é aqui que ele finalmente ouve de volta a coisa que passou quatro anos entendendo errado: que carregar tudo sozinho nunca foi a parte da responsabilidade.",
    galeria: [
      // parado e reto — só a foto do Peter sai do prumo, e é a única sem traje
      { foto: "/tumulo1.jpg", legenda: "A mão na pedra, o resto fora de quadro", w: 780, h: 0.72, rot: -0.7, sobe: 0.3 },
      { foto: "/tumulo2.jpg", legenda: "Agachado na lápide, arrumando as flores", w: 900, h: 1, rot: 0, sobe: 0 },
      { foto: "/tumulo3.jpg", legenda: "De capuz, a mão na boca, sem conseguir dizer", w: 440, h: 0.88, rot: 3.6, sobe: 0.16 },
      { foto: "/tumulo4.jpg", legenda: "O campo de pedras, e uma pessoa só nele", w: 600, h: 0.55, rot: -1.3, sobe: 0.64 },
    ],
  },
];

/**
 * O fixador de cada cartão da grade, conferido ao carregar o módulo.
 *
 * ⚠️ Pequeno de propósito, mas não dispensável: são cinco linhas espalhadas por
 * um arquivo de 200, e "os cinco tipos são diferentes" é o tipo de coisa que se
 * confere uma vez, na hora de escrever, e nunca mais. Acrescentar um sexto lugar
 * copiando o bloco de um existente repete o tipo sem ninguém notar.
 *
 * `process.env.NODE_ENV` é substituído no build, então isto some da produção.
 */
if (process.env.NODE_ENV !== "production") {
  const CANTOS = ["topo-esquerda", "topo-direita"];
  const vistos = new Map();

  for (const l of LUGARES) {
    const fixadores = l.fixadores ?? [];

    if (fixadores.length !== 1) {
      console.error(
        `[lugares] ${l.slug}: ${fixadores.length} fixador(es) — na grade é exatamente um por cartão.`,
      );
    }

    for (const f of fixadores) {
      if (f.tipo === "cantoneira" && !CANTOS.includes(f.em)) {
        console.error(`[lugares] ${l.slug}: cantoneira em "${f.em}" — ela só existe em canto.`);
      }
      if (vistos.has(f.tipo)) {
        console.error(
          `[lugares] o fixador "${f.tipo}" se repete — ${vistos.get(f.tipo)} e ${l.slug}. Os cinco aparecem na mesma tela.`,
        );
      }
      vistos.set(f.tipo, l.slug);
    }
  }
}
