# "Costurado à mão" — direção arquivada em 2026-08-22

Estas quatro seções **saíram do site**, não foram apagadas. Elas eram tudo o que
vinha depois do herói na direção anterior: o site se montava como o traje
caseiro, em papel e linha, abrindo para o claro depois do herói escuro.

O motivo do arquivamento é decisão de direção, não defeito — o código funciona.

> ⚠️ Ficaram aqui e não no lixo porque **o `.git` do projeto só tem o commit do
> `create-next-app`**. Nada disto está versionado em lugar nenhum. Apagar seria
> a única cópia indo embora.

## O que tem aqui

| Arquivo | O que era |
|---|---|
| `Sinopse.jsx` | Folha de caderno com pauta e furos; o texto acendia palavra a palavra e três palavras eram riscadas a caneta na rolagem |
| `Traje.jsx` | A seção de destaque, 420vh — a máscara se costurava em quatro etapas (tecido → contorno → teia → lentes) |
| `traje.js` | A geometria da máscara usada por `Traje.jsx` |
| `Elenco.jsx` | Cards em forma de etiqueta de roupa **com nome de ator** — hoje proibido pela regra do site |
| `Estreia.jsx` | A data bordada em ponto de costura — hoje proibida pela mesma regra |

## Para restaurar

1. `mv` os `.jsx` de volta para `src/components/` e `traje.js` para `src/lib/`.
2. Reimporte em `src/app/page.js`.
3. **Devolva os tokens e as utilidades ao `src/app/globals.css`** — eles foram
   removidos de lá porque só estas seções usavam:

```css
/* dentro de @theme */
--color-papel: #e8e2d6;
--color-papel-fundo: #ddd5c6;
--color-margem: #c8bda9;
--color-linha: #15151a;
--color-linha-fraca: #6a6459;
--color-jeans: #2f4257;
--color-jeans-claro: #4f6a86;
--color-tecido: #9c2b34;
--color-tecido-escuro: #6e1d25;
```

```css
/* dentro de @layer utilities */
.ponto {
  fill: none;
  stroke: var(--color-linha);
  stroke-linecap: round;
  stroke-dasharray: 9 7;
}
.ponto-fino { stroke-width: 2.6; stroke-dasharray: 7 6; }
.ponto-grosso { stroke-width: 4; stroke-dasharray: 11 8; }

.caderno {
  background-color: var(--color-papel);
  background-image: linear-gradient(to bottom, transparent 31px, rgba(47, 66, 87, 0.16) 32px);
  background-size: 100% 32px;
}
```

4. O `Nav.jsx` também mudou: ele trocava de cor ao sair do herói porque o papel
   começava ali. A versão atual não faz mais isso — se `Sinopse` voltar, essa
   lógica volta junto.

## O que NÃO pode voltar como estava

`Elenco.jsx` e `Estreia.jsx` violam a regra que passou a valer: o site fica
dentro da história e não fala do filme como filme. Sem ator, sem estreia, sem
ingresso. Se voltarem, voltam reescritos.
