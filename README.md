# Um Novo Dia

Landing fictícia de *Homem-Aranha: Um Novo Dia*, feita como peça de portfólio e
laboratório de **animação guiada por rolagem**. Uma página de ~16.000px que
atravessa quatro capítulos de personagem e cinco endereços da cidade.

> ### ⚠️ Antes de tudo
>
> - Este site **não é oficial** e não tem vínculo com nenhum estúdio ou
>   distribuidora. É projeto de estudo, sem fim comercial.
> - O Homem-Aranha, os demais personagens e **todo o material visual** pertencem
>   à Marvel, à Sony Pictures e aos seus respectivos detentores de direitos.
> - Os **textos foram gerados por IA** a partir do enredo do filme. Eles e as
>   imagens podem divergir do que de fato acontece na trama.
> - **Contém spoilers.**
>
> O mesmo aviso aparece para quem entra no site, antes de qualquer conteúdo.

---

## O que tem aqui

A graça do projeto não é o layout, é o que a rolagem faz com ele:

| | |
|---|---|
| **Herói em vídeo comandado pela rolagem** | O clipe não toca: ele é *raspado* quadro a quadro conforme a página desce. |
| **Fecho que tem tempo próprio** | O clipe do fim **não** é raspado — ele toca uma vez ao entrar em cena, acaba e fica parado no último quadro. Nem todo vídeo quer virar linha do tempo da rolagem. |
| **Texto que se revela** | Lead e corpo dos capítulos acendem palavra a palavra conforme entram na tela. |
| **Faixa horizontal** | Em cada lugar, a roda do mouse (ou o dedo) rola para baixo e a imagem caminha para o lado. |
| **Fichas do Controle de Danos** | As emendas entre capítulos são documentos de ocorrência, em monoespaçada, com campos tarjados. |
| **Fotos como objeto** | Toda foto é uma polaroide presa por papelaria — fita, clipe, alfinete, percevejo, grampo ou cantoneira — assentada fora do prumo. |
| **Mural de cortiça** | A grade de lugares fica espetada numa prancha desenhada só com gradiente ladrilhado. Nenhuma textura em imagem. |
| **Tela de carregamento honesta** | Espera as fontes e o primeiro quadro do vídeo, em vez de contar um tempo fixo. O sinal do Aranha se desenhando **é** a barra de progresso. |

## Três decisões que explicam o resto do código

**Nada de sorteio.** O arranjo das fotos — inclinação, quais fixadores, onde —
parece aleatório e é **dado escrito à mão**. Um `Math.random()` daria resultado
diferente no servidor e no cliente, e a hidratação quebra. A mesma regra vale
para o desenho procedural dos espaços reservados, que sai de uma semente
derivada do próprio texto da legenda.

**Regra invisível vira checagem, não comentário.** Algumas regras não dá para
revisar olhando uma peça de cada vez — "nenhuma combinação de fixadores se
repete no mesmo capítulo", por exemplo, só quebra quando você compara as três
fotos. Elas são conferidas por blocos que rodam em desenvolvimento e somem do
build de produção (`src/lib/personagens.js`, `src/lib/lugares.js`).

**No celular o site é outro, e de propósito.** Não é o mesmo layout espremido:
o herói perde a coreografia inteira e vira um cartaz parado, o clipe deixa de
ser raspado e passa a tocar uma vez, e o texto que se revela caractere a
caractere sai do caminho. Raspar vídeo custa uma busca — e uma decodificação —
a cada quadro de rolagem; num telefone isso não passa. As linhas do herói ficam
paradas no estado "agora", nunca no "antes", porque congelar no primeiro quadro
mostraria a descrição do personagem que o filme não tem mais.

## Rodando

Precisa de **Node 20.9+** (exigência do Next 16) e npm.

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # build de produção
npm start        # serve o build
npm run lint
```

## Estrutura

```
src/
├── app/
│   ├── page.js            → home: herói, capítulos, lugares, fecho
│   ├── lugares/page.js    → a grade dos cinco lugares
│   ├── layout.js
│   └── globals.css        → tokens de tema e utilidades (textura, grão, máscaras)
├── components/
│   ├── Hero, SecaoVideo   → os dois vídeos, com padrões opostos
│   ├── CapituloPersonagem → um capítulo inteiro
│   ├── Chapa, Polaroide   → a foto e a moldura de papel
│   ├── Fixadores          → fita, clipe, alfinete, percevejo, grampo, cantoneira
│   ├── FichaControleDanos → as emendas entre capítulos
│   ├── AvisoEntrada       → o aviso que abre o site
│   └── lugares/           → grade e faixa horizontal
└── lib/
    ├── personagens.js     → os quatro capítulos: texto, cores, fotos, arranjo
    └── lugares.js         → os cinco endereços
```

Todo o conteúdo — textos, cores de capítulo, quais fotos, como elas estão
presas — mora em `src/lib/`. Trocar uma foto ou reescrever um capítulo não
pede tocar em componente nenhum.

> Ao trocar qualquer foto, **trocar a legenda junto**: ela é o `alt` da imagem
> **e** o texto impresso no rodapé da polaroide.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion

## Licença

O **código** está sob licença MIT — ver [LICENSE](./LICENSE).

As **imagens e os vídeos não estão**, e não podem estar: são material de
terceiros e o titular deste repositório não detém esses direitos. Reaproveite o
código; troque a mídia por material próprio.
