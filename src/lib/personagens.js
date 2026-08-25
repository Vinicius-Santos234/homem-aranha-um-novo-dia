/**
 * Os capítulos de personagem.
 *
 * Regra do site: nada aqui fala do filme como filme. Sem ator, sem papel,
 * sem estreia. O texto descreve quem a pessoa é DENTRO da história.
 *
 * Segunda regra, desde a reescrita: nada aqui é inventado. Cada capítulo sai
 * do que acontece na trama — o sótão, as teias orgânicas, a irmã da Jean, o
 * inibidor do Banner. O que não entra é o terceiro ato: quem chega pelo site
 * ainda não viu o fim.
 *
 * Cada capítulo manda na própria cor: `acento` pinta lead, número e detalhes;
 * `fundo` é o preto tingido daquele trecho.
 *
 * ---- ONDE ENTRAM AS FOTOS ----------------------------------------------
 *
 * São SEIS vaos por personagem, e todos se preenchem AQUI — nenhum pede tocar
 * em componente. Ponha o arquivo em `public/` e escreva o caminho começando
 * com `/`:
 *
 *   | campo | onde aparece | proporção |
 *   |---|---|---|
 *   | `fundoMidia.imagem` | fundo desfocado do capítulo inteiro | qualquer |
 *   | `capa.foto` | a capa de tela cheia, atrás da ficha | 16/9 |
 *   | `galeria[].foto` | as três da galeria | o `ratio` de cada uma |
 *   | `fotoCitacao` | o plano atrás da citação | 16/9 |
 *
 * ```js
 * capa: { legenda: "...", ratio: "16 / 9", foto: "/peter-capa.jpg" },
 * galeria: [{ legenda: "...", ratio: "3 / 4", foto: "/peter-sotao.jpg" }],
 * fotoCitacao: "/peter-citacao.jpg",
 * ```
 *
 * Sem `foto`, o vão continua na chapa desenhada — dá para ir preenchendo aos
 * poucos, e o que faltar não quebra nada.
 *
 * ⚠️ `legenda` NÃO É DECORAÇÃO, E AGORA APARECE NA TELA. Com foto ela é o
 * `alt` da imagem E a legenda visível no pé da chapa (ver `Chapa.jsx`). As da
 * galeria foram reescritas em 25/08 olhando foto por foto — descrevem o que
 * está na imagem, não o plano que se imaginava para o vão. Ao trocar uma foto,
 * a legenda tem que ser trocada junto: agora ela mente para todo mundo, não só
 * para o leitor de tela.
 *
 * ⚠️ AS QUATRO `capa.legenda` SÃO PLACEHOLDER NEUTRO ("— plano de abertura do
 * capítulo"). As antigas descreviam planos específicos que não existem em
 * lugar nenhum, e como `capa.foto` continua `null` nos quatro, não havia como
 * conferir. Ao preencher a capa, escrever ali a descrição do que a foto mostra
 * — ela vira o `alt`. Legenda visível a capa não tem, de propósito: é o vão
 * que leva a ficha do Controle de Danos por cima.
 *
 * ⚠️ A capa e a citação recebem um véu preto de 45% por cima, porque tem texto
 * em cima delas. Foto clara e cheia de detalhe no meio do quadro briga com a
 * leitura — nesses dois vãos, plano mais escuro ou mais vazio funciona melhor.
 *
 * `fundoMidia` é a mídia ambiente que fica desfocada atrás do capítulo inteiro
 * (ver `FundoCapitulo.jsx`). Aceita `{ imagem }` ou `{ video, poster }`.
 * Deixando `null`, cai na chapa desenhada e o efeito continua existindo.
 *
 * Os quatro fundos são escuros o bastante para o site continuar sendo o mesmo
 * depois do herói.
 *
 * ---- OS FIXADORES E A INCLINAÇÃO ---------------------------------------
 *
 * Cada foto da galeria é prendida na página por peças de papelaria — fita,
 * clipe, alfinete, percevejo, grampo, cantoneira — e assentada um pouco fora
 * do prumo. É a mesma ideia do arranjo das faixas em `lugares.js`: a página
 * para de parecer uma grade de imagens e passa a parecer material espalhado
 * numa mesa. O desenho das peças está em `Fixadores.jsx`; a ESCOLHA é aqui.
 *
 * ```js
 * inclinacao: -1.4,                              // graus, ver a faixa útil abaixo
 * fixadores: [{ tipo: "fita", em: "topo-direita" }],
 * ```
 *
 * `tipo`: `fita` · `clipe` · `alfinete` · `percevejo` · `grampo` · `cantoneira`
 * `em`:   `topo-esquerda` · `topo` · `topo-direita` · `esquerda` · `direita`
 * `giro`: opcional, em graus — sobrescreve o giro natural da peça naquela âncora
 *
 * ⚠️ NADA AQUI PODE SER SORTEADO, pelo mesmo motivo de `lugares.js`: o
 * servidor pinta a galeria uma vez e o cliente pinta de novo, e um
 * `Math.random()` (ou um embaralhamento por índice) dá resultado diferente
 * entre os dois e quebra a hidratação. Variedade se escreve à mão.
 *
 * ⚠️ AS QUATRO REGRAS, que o bloco no fim do arquivo confere em
 * desenvolvimento:
 *   1. no mínimo TRÊS fixadores por foto;
 *   2. dois fixadores IGUAIS na mesma foto, nunca;
 *   3. duas peças na MESMA ÂNCORA da mesma foto, nunca — elas se empilhariam;
 *   4. a mesma COMBINAÇÃO de tipos duas vezes no mesmo capítulo, nunca.
 * A 3 e a 4 são invisíveis olhando uma foto de cada vez: a 3 só aparece na
 * tela, já empilhada, e a 4 só aparece comparando as três fotos de um
 * capítulo. É por isso que existe a checagem, e não só este aviso.
 *
 * ⚠️ NÃO EXISTE ÂNCORA NO PÉ DA FOTO, e a falta é de propósito: é lá que mora
 * a legenda visível. Fixador ali cai em cima do texto.
 *
 * ⚠️ A ÂNCORA DEPENDE DE ONDE A FOTO CAI NA GRADE, e isso não dá para ver
 * daqui. A 1ª foto vai para a esquerda de tudo, a 2ª para a direita, a 3ª fica
 * solta no meio (ver `CapituloPersonagem`). Desde 25/08 a galeria tem 56px de
 * afastamento das bordas da tela, então nenhuma âncora é proibida — mas a
 * folga não é infinita, e o que gasta ela é o tipo da peça:
 *
 *   | modo | quanto sobra para fora do papel | pode no lado de fora? |
 *   |---|---|---|
 *   | monta na borda (`fita`, `clipe`) | até ~27px, e a rampa ainda cresce a chapa 6% | evitar |
 *   | atravessa (`alfinete`, `percevejo`, `grampo`) | nada, fica 24px para dentro | sim |
 *   | abraça o canto (`cantoneira`) | nada, fica inteira dentro | sim |
 *
 * "Lado de fora" é a esquerda da 1ª foto e a direita da 2ª. Na dúvida, medir:
 * o que corta é o `overflow-x: hidden` do `body`, e ele corta sem avisar.
 *
 * ⚠️ `cantoneira` SÓ EM CANTO (`topo-esquerda` ou `topo-direita`). Ela abraça
 * o vértice; no meio de uma borda vira um triângulo solto sem sentido.
 *
 * A faixa útil da inclinação aqui é **±2,5°**, e não os ±4,5° das faixas de
 * `lugares.js`. A conta é a mesma, o tamanho é que não: uma chapa da galeria
 * chega a 900px de largura, e no mesmo ângulo de uma foto de 420px ela
 * desloca o dobro. Passando de 2,5° a chapa começa a invadir a vizinha e a
 * cunha de fundo que aparece na borda da tela deixa de parecer intenção.
 *
 * Cada capítulo tem o seu ritmo, como os lugares têm o deles:
 *   · Peter — quase reto, e o mínimo de peça: ele guarda tudo com cuidado
 *   · Justiceiro — o mais reto de todos; é ficha de investigação, não álbum
 *   · Jean — o mais torto; é ela que desarruma
 *   · Hulk — uma quase reta e duas fugindo do prumo: contenção que escapa
 */

export const PERSONAGENS = [
  {
    slug: "peter-parker",
    fundoMidia: { imagem: "/spidermanfundo.jpg" },
    nome: "Peter Parker",
    alcunha: "Quatro anos sem ninguém saber",
    acento: "#e01b2c",
    fundo: "#0b0507",
    lead: "Ninguém sabe quem ele é. Nem quem deveria.",
    corpo:
      "Ele mora num sótão que o dono do prédio usava de depósito, costura o próprio traje e não tem nada parecido com um emprego: ser o Homem-Aranha é o que ele faz o dia inteiro. Vê MJ e Ned de longe e não chega perto, porque decidiu que perto é onde as pessoas se machucam. E o corpo dele começou a responder a isso do jeito errado — os sentidos abrindo demais, os olhos ficando pretos, a teia saindo do pulso sem precisar de lançador.",
    citacao: "Às vezes o Homem-Aranha tem que escolher a decisão difícil mesmo que deixe o Peter Parker arrasado.",
    fotoCitacao: "/spidermancitacao1.jpeg",
    capa: {
      legenda: "Peter Parker — plano de abertura do capítulo",
      ratio: "16 / 9",
      foto: null,
    },
    // guardado com cuidado: quase reto, e o mínimo de peça em cada foto
    galeria: [
      {
        foto: "/spiderman111.jpg",
        legenda: "O traje por baixo da roupa de todo dia",
        ratio: "4 / 6",
        inclinacao: -1.4,
        fixadores: [
          { tipo: "cantoneira", em: "topo-esquerda" },
          { tipo: "fita", em: "topo-direita" },
          { tipo: "percevejo", em: "direita" },
        ],
      },
      {
        foto: "/spiderman12.jpg",
        legenda: "Numa festa acesa, olhando de longe",
        ratio: "3 / 2",
        inclinacao: 0.9,
        fixadores: [
          { tipo: "clipe", em: "topo" },
          { tipo: "percevejo", em: "esquerda" },
          { tipo: "alfinete", em: "topo-direita" },
        ],
      },
      {
        foto: "/spiderman13.jpg",
        legenda: "De cabeça para baixo na teia, entre os prédios",
        ratio: "4 / 5",
        inclinacao: -0.7,
        fixadores: [
          { tipo: "alfinete", em: "topo-esquerda" },
          { tipo: "grampo", em: "topo" },
          { tipo: "fita", em: "direita" },
        ],
      },
    ],
  },
  {
    slug: "justiceiro",
    fundoMidia: { imagem: "/justiceirofundo.jpg" },
    nome: "Justiceiro",
    alcunha: "Frank Castle",
    acento: "#b9c2c9",
    fundo: "#08090b",
    lead: "Ele não veio ajudar. Veio terminar.",
    corpo:
      "Os dois se conhecem no pior jeito possível: Frank atrás de um tanque no meio da rua, sem contar quem estava no caminho, e o Aranha segurando o estrago que ele deixaria para trás. Depois disso Frank continua por perto — sabe ouvir a cidade, sabe onde perguntar, e é o único que entende exatamente o que é passar a vida inteira trabalhando sem ninguém do outro lado. Por isso ele olha para o garoto do jeito que olha: como quem reconhece uma sentença.",
    citacao: "Eu faço a única coisa que você não consegue! Você bate neles e eles se levantam! Eu bato neles e eles ficam no chão!",
    fotoCitacao: "/justiceirocitacao.jpg",
    capa: {
      legenda: "Justiceiro — plano de abertura do capítulo",
      ratio: "16 / 9",
      foto: null,
    },
    // isto é ficha de investigação, não álbum: quase sem torção, e o metal
    // aparecendo mais que a fita
    galeria: [
      {
        foto: "/justiceiro1.jpg",
        legenda: "A caveira no colete, saindo à luz do dia",
        ratio: "6 / 7",
        inclinacao: 0.5,
        fixadores: [
          { tipo: "grampo", em: "topo-esquerda" },
          { tipo: "percevejo", em: "topo-direita" },
          { tipo: "clipe", em: "direita" },
        ],
      },
      {
        foto: "/justiceiro2.jpg",
        legenda: "Ao volante, gritando, a arma na outra mão",
        ratio: "1 / 1",
        inclinacao: -0.8,
        fixadores: [
          { tipo: "cantoneira", em: "topo-esquerda" },
          { tipo: "alfinete", em: "topo" },
          { tipo: "clipe", em: "esquerda" },
          { tipo: "grampo", em: "direita" },
        ],
      },
      {
        foto: "/justiceiro3.jpg",
        legenda: "Camisa xadrez e fuzil a tiracolo, no escuro",
        ratio: "1 / 1",
        inclinacao: 0.6,
        fixadores: [
          { tipo: "grampo", em: "topo-esquerda" },
          { tipo: "fita", em: "topo-direita" },
          { tipo: "alfinete", em: "direita" },
          { tipo: "percevejo", em: "esquerda" },
        ],
      },
    ],
  },
  {
    slug: "jean-grey",
    fundoMidia: { imagem: "/jeangreyfundo.jpg" },
    nome: "Jean Grey",
    alcunha: "A que chega dentro de outra pessoa",
    acento: "#ff7a2f",
    fundo: "#0d0603",
    lead: "Ela não invade sozinha. Ela usa você para invadir.",
    corpo:
      "Uma adolescente entra na cabeça de quem estiver por perto e faz essa pessoa arrombar o Controle de Danos por ela — guarda, motorista, quem for. Não é roubo: eles levaram a irmã dela, a Sara, e a única coisa que sobrou é uma palavra que a Sara conseguiu empurrar para dentro da cabeça dela antes de sumir. Enquanto ninguém responde, o poder da Jean cresce sozinho, e passa muito do tamanho que ela sabe segurar.",
    citacao: "E o único crime dela foi ser especial. Assim como você. Assim como eu.",
    fotoCitacao: "/jeangreycitacao.jpg",
    capa: {
      legenda: "Jean Grey — plano de abertura do capítulo",
      ratio: "16 / 9",
      foto: null,
    },
    // a mais torta das quatro, de propósito: é ela que desarruma o resto
    galeria: [
      {
        foto: "/jeangrey1.jpg",
        legenda: "O rádio junto da boca, a resposta que não vem",
        ratio: "2 / 3",
        inclinacao: 2.2,
        fixadores: [
          { tipo: "fita", em: "topo" },
          { tipo: "clipe", em: "topo-direita" },
          { tipo: "alfinete", em: "esquerda" },
        ],
      },
      {
        foto: "/jeangrey2.jpg",
        legenda: "Capuz levantado, a luz da rua no rosto",
        ratio: "1 / 1",
        inclinacao: -2.4,
        fixadores: [
          { tipo: "alfinete", em: "topo-esquerda" },
          { tipo: "fita", em: "topo" },
          { tipo: "percevejo", em: "direita" },
        ],
      },
      {
        foto: "/jeangrey3.jpg",
        legenda: "O capuz sem rosto, a mão erguida no galpão",
        ratio: "16 / 9",
        inclinacao: 1.6,
        fixadores: [
          { tipo: "cantoneira", em: "topo-esquerda" },
          { tipo: "percevejo", em: "topo" },
          { tipo: "clipe", em: "direita" },
          { tipo: "grampo", em: "esquerda" },
        ],
      },
    ],
  },
  {
    slug: "hulk",
    fundoMidia: { imagem: "/hulkfundo.jpg" },
    nome: "Hulk",
    alcunha: "Bruce Banner",
    acento: "#5fd06a",
    fundo: "#040905",
    lead: "O único que já resolveu o problema de ter uma coisa dentro de si.",
    corpo:
      "Banner passou anos aprendendo a segurar o outro, e chegou num aparelho que faz isso por ele — um inibidor que desliga o que ele não quer que acorde. É a porta que Peter bate quando o próprio corpo começa a fugir do controle, e o conselho vem junto com a peça. O problema é que uma cabeça que já tem duas pessoas dentro é a mais fácil de invadir: quando a Jean entra, o que levanta não é o Banner.",
    citacao: "E se você tentar conter a expressão de uma coisa que precisa ser expressada?",
    fotoCitacao: "/hulkcitacao.jpg",
    capa: {
      legenda: "Hulk — plano de abertura do capítulo",
      ratio: "16 / 9",
      foto: null,
    },
    // contenção que escapa: uma quase reta e duas fugindo do prumo
    galeria: [
      {
        foto: "/hulk3.jpg",
        legenda: "Os olhos, de perto demais para caber o resto",
        ratio: "16 / 9",
        inclinacao: -0.4,
        fixadores: [
          { tipo: "percevejo", em: "topo-esquerda" },
          { tipo: "fita", em: "topo" },
          { tipo: "grampo", em: "direita" },
        ],
      },
      {
        foto: "/hulk2.jpg",
        legenda: "No meio do estrago, ainda de pé",
        ratio: "16 / 9",
        inclinacao: 1.9,
        fixadores: [
          { tipo: "alfinete", em: "topo-esquerda" },
          { tipo: "cantoneira", em: "topo-direita" },
          { tipo: "clipe", em: "esquerda" },
        ],
      },
      {
        foto: "/hulk1.jpg",
        legenda: "Lado a lado, e a diferença de tamanho",
        ratio: "3 / 5",
        inclinacao: -1.8,
        fixadores: [
          { tipo: "cantoneira", em: "topo-esquerda" },
          { tipo: "grampo", em: "topo" },
          { tipo: "fita", em: "topo-direita" },
          { tipo: "clipe", em: "direita" },
          { tipo: "alfinete", em: "esquerda" },
        ],
      },
    ],
  },
];

/**
 * As quatro regras dos fixadores, conferidas ao carregar o módulo.
 *
 * ⚠️ ISTO NÃO É EXCESSO DE ZELO. Duas delas são INVISÍVEIS na revisão: a da
 * combinação repetida (olhando uma foto de cada vez, cada uma está certa — só
 * quebra comparando as três, e ninguém compara de novo depois da primeira vez)
 * e a do mínimo de três (some numa lista de doze). O aviso em comentário não
 * pega; este bloco pega.
 *
 * ⚠️ E ELE SÓ VALE SE FOR TESTADO QUEBRANDO O DADO. Uma checagem calada é
 * indistinguível de uma checagem quebrada: `if` invertido, `.sort()` faltando,
 * `Set` comparado com `===` — tudo isso passa em silêncio. Ao mexer aqui,
 * plantar uma violação de cada tipo e conferir que as quatro aparecem.
 *
 * `process.env.NODE_ENV` é substituído no build, então o bloco inteiro some
 * do pacote de produção.
 */
if (process.env.NODE_ENV !== "production") {
  const CANTOS = ["topo-esquerda", "topo-direita"];
  const MINIMO = 3;

  for (const p of PERSONAGENS) {
    const combinacoes = new Map();

    for (const item of p.galeria) {
      const fixadores = item.fixadores ?? [];
      const tipos = fixadores.map((f) => f.tipo);
      const ancoras = fixadores.map((f) => f.em);

      if (fixadores.length < MINIMO) {
        console.error(
          `[personagens] ${p.slug} · "${item.legenda}": ${fixadores.length} fixador(es), o mínimo é ${MINIMO}.`,
        );
      }

      if (new Set(tipos).size !== tipos.length) {
        console.error(
          `[personagens] ${p.slug} · "${item.legenda}": dois fixadores iguais na mesma foto (${tipos.join(", ")}).`,
        );
      }

      if (new Set(ancoras).size !== ancoras.length) {
        console.error(
          `[personagens] ${p.slug} · "${item.legenda}": duas peças na mesma âncora (${ancoras.join(", ")}) — elas se empilham.`,
        );
      }

      for (const f of item.fixadores ?? []) {
        if (f.tipo === "cantoneira" && !CANTOS.includes(f.em)) {
          console.error(
            `[personagens] ${p.slug} · "${item.legenda}": cantoneira em "${f.em}" — ela só existe em canto.`,
          );
        }
      }

      // a combinação é o CONJUNTO de tipos, ordenado: {fita, clipe} e
      // {clipe, fita} são a mesma combinação, mudou só a ordem de escrita
      const chave = [...tipos].sort().join("+");
      if (combinacoes.has(chave)) {
        console.error(
          `[personagens] ${p.slug}: a combinação "${chave}" se repete — "${combinacoes.get(chave)}" e "${item.legenda}".`,
        );
      }
      combinacoes.set(chave, item.legenda);
    }
  }
}
