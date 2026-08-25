# `_arquivo/` — o que saiu do site e por quê

> ⚠️ **Nada aqui foi apagado, e o motivo é sempre o mesmo:** o `.git` do projeto
> só tem o commit `c9a505e Initial commit from Create Next App`. Todo o trabalho
> real está fora do versionamento, então **apagar é perder a única cópia**.

Cada item saiu por **decisão de direção ou por não ter mais uso** — nenhum saiu
por estar quebrado. Tudo aqui funcionava quando foi arquivado.

## Pastas

| Pasta | O que é |
|---|---|
| `costurado-a-mao/` | A direção anterior do site inteiro, arquivada em 22/08. Tem `LEIA-ME` próprio, com os tokens de CSS que precisam voltar junto |
| `originais/` | Fontes de mídia antes do encode. Hoje só `corte-4k-original.mp4` (o clipe do herói) |

## Arquivos soltos

| Arquivo | O que era | Por que saiu |
|---|---|---|
| `spider-icon.jsx` | `SpiderIcon`, o desenho do botão de voltar ao topo | O botão virou seta em 24/08 — uma aranha não diz "subir". ⚠️ **É a origem do desenho de `src/app/icon.svg`**, o favicon: mexeu num, olhe o outro |
| `mao-lanca-teias.jsx` | `WebShooterHand`, no centro do selo "role a página" | O centro do selo perdeu o vetor em 24/08 e virou uma conta descendo um fio, em CSS |
| `achar-lugar.js` | `acharLugar(slug)`, em `src/lib/lugares.js` | **Nunca foi chamada.** Supunha uma rota `/lugares/[slug]` que não existe: a faixa é sobreposição, aberta por estado, sem navegação |
| `favicon-create-next-app.ico` | O favicon padrão do scaffold | Trocado pela aranha em 24/08. Enquanto existisse em `src/app/`, ganharia do `icon.svg` na rota `/favicon.ico` |

## Também removido em 24/08, e que não está aqui

- **`lucide-react`** — dependência que nunca foi importada por nenhum arquivo do
  projeto. Saiu do `package.json`; volta com `npm i lucide-react` se um dia
  precisar de biblioteca de ícones (até aqui todo ícone do site é desenhado à
  mão em `src/components/art.jsx`).
- **`angulo`, `cy` e `passo` em `Chapa.jsx`** — três valores que continuavam
  sendo calculados a partir da semente da legenda e que ninguém lia desde que a
  chapa trocou a teia em SVG por gradiente. Três linhas, reconstituíveis pela
  fórmula que ficou logo acima delas.

## Como restaurar qualquer coisa daqui

1. Mover o arquivo de volta para `src/components/` ou `src/lib/`.
2. Reimportar onde for usar.
3. Ler o cabeçalho do próprio arquivo — cada um diz o que mais precisa voltar
   junto (tokens de CSS, no caso do `costurado-a-mao/`).
4. Rodar `next build`. **Neste projeto o build é o árbitro, não a leitura:** em
   23/08 o `SpiderIcon` quase virou baixa por engano numa varredura, e só o
   build acusou que ele tinha ganhado um uso novo no meio da sessão.
