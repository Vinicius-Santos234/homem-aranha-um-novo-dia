"use client";

import { useEffect, useRef } from "react";

import Chapa from "@/components/Chapa";
import Polaroide from "@/components/Polaroide";

/**
 * A faixa horizontal de um lugar.
 *
 * Sobreposição de tela cheia que rola no eixo X. O layout é CSS: um flex com
 * `overflow-x: auto`, `overflow-y: hidden` e altura travada na viewport.
 *
 * O que NÃO é de graça é a roda do mouse — ver o aviso no `useEffect` lá
 * embaixo. A conversão de `deltaY` em `scrollLeft` é feita na mão, de
 * propósito.
 *
 * `items-end` é o que dá o desencontro: as chapas penduram pelo rodapé e cada
 * uma tem a sua altura, então o topo fica irregular de graça.
 */
export default function FaixaLugar({ lugar, aoFechar }) {
  const scrollerRef = useRef(null);
  const voltarRef = useRef(null);

  useEffect(() => {
    // trava a página de trás; a posição volta sozinha porque nada foi rolado
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const aoTeclar = (e) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", aoTeclar);

    voltarRef.current?.focus();

    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aoFechar]);

  /**
   * Roda do mouse para baixo = faixa para o lado.
   *
   * ⚠️ Isto NÃO pode ficar por conta do navegador. A regra de "contêiner que
   * só transborda em X recebe o deltaY" existe no Chrome, mas é heurística:
   * aqui ela não disparou (medido — zero transbordo vertical e mesmo assim a
   * roda não andava), e no Firefox ela não existe.
   *
   * Listener nativo com `passive: false` para poder `preventDefault()`. O
   * `onWheel` do React entra passivo no root e não serve.
   */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // com movimento reduzido a faixa anda direto, sem inércia
    const semInercia = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let alvo = el.scrollLeft;
    let quadro = null;

    /* Aproximação exponencial: a cada quadro a faixa anda uma fração do que
       falta. É o mesmo princípio da mola do herói, mas sem sobrepasso — numa
       galeria, passar do ponto e voltar embrulha o estômago.
       0.16 dá ~250ms para percorrer quase todo o trecho. */
    const passear = () => {
      const falta = alvo - el.scrollLeft;
      if (Math.abs(falta) < 0.5) {
        el.scrollLeft = alvo;
        quadro = null;
        return;
      }
      el.scrollLeft += falta * 0.16;
      quadro = requestAnimationFrame(passear);
    };

    const aoRolar = (e) => {
      // gesto lateral de trackpad já faz a coisa certa: não sequestrar
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;

      e.preventDefault();
      // deltaMode: 0 = pixels, 1 = linhas (Firefox), 2 = páginas
      const passo =
        e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * el.clientWidth : e.deltaY;

      /* Aba oculta não roda `requestAnimationFrame`. Sem esta saída a faixa
         ficaria PARADA em vez de andar sem inércia — pior que a versão sem
         suavização. Descoberto medindo: o handler corria, `preventDefault`
         acontecia, e o `scrollLeft` não saía do zero porque o quadro nunca
         chegava. Vale a mesma regra para movimento reduzido. */
      if (semInercia || document.hidden) {
        el.scrollLeft += passo;
        alvo = el.scrollLeft;
        return;
      }

      const limite = el.scrollWidth - el.clientWidth;
      // acumula no ALVO, não no scrollLeft: girar a roda três vezes seguidas
      // soma os três empurrões em vez de reiniciar o movimento a cada um
      alvo = Math.min(Math.max(alvo + passo, 0), limite);
      if (quadro === null) quadro = requestAnimationFrame(passear);
    };

    /* Barra arrastada, teclado, toque: quem manda é o elemento. Se o alvo não
       for sincronizado, o próximo giro de roda puxa a faixa de volta para onde
       ela estava antes do arrasto. */
    const aoMudar = () => {
      if (quadro === null) alvo = el.scrollLeft;
    };

    el.addEventListener("wheel", aoRolar, { passive: false });
    el.addEventListener("scroll", aoMudar, { passive: true });
    return () => {
      el.removeEventListener("wheel", aoRolar);
      el.removeEventListener("scroll", aoMudar);
      if (quadro !== null) cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${lugar.nome} — galeria`}
      className="fixed inset-0 z-[90]"
      style={{ backgroundColor: lugar.fundo, color: lugar.tinta }}
    >
      {/* Marca-d'água: fica parada enquanto a faixa desliza por cima.
          Gradiente e não SVG — ver o aviso em `Chapa.jsx`: teia com traço
          esticada na viewport inteira é o que fazia o compositor engasgar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            // Brilho difuso do lugar (reflexo principal)
            `radial-gradient(120% 90% at 12% 100%, ${lugar.acento}35 0%, transparent 62%)`,
            // Chuva e asfalto como marca d'água (textura sombria)
            "repeating-linear-gradient(168deg, rgba(255,255,255,0.02) 0px, transparent 1px, transparent 15px)",
            "repeating-linear-gradient(174deg, rgba(255,255,255,0.01) 0px, transparent 1px, transparent 9px)",
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 4px)",
          ].join(", "),
        }}
      />

      <button
        ref={voltarRef}
        type="button"
        onClick={aoFechar}
        className="eyebrow fixed left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full px-5 py-3 text-ink transition-transform duration-200 hover:-translate-x-1 md:left-9 md:top-9"
        style={{ backgroundColor: lugar.acento }}
      >
        <span aria-hidden>←</span> Voltar
      </button>

      <div
        ref={scrollerRef}
        tabIndex={0}
        style={{ "--acento-faixa": lugar.acento }}
        className="faixa-h relative flex h-full w-full items-end gap-8 overflow-x-auto overflow-y-hidden overscroll-none px-6 pb-10 pt-28 md:gap-14 md:px-14 md:pt-32"
      >
        {/* ---- painel de abertura ----
            No celular o cartão e o texto EMPILHAM. Lado a lado eles somavam
            68vw + 72vw + o vão, quase uma tela e meia: o parágrafo começava
            visível e terminava fora da borda, e para ler o fim era preciso
            arrastar a faixa no meio de uma frase. Empilhado, o painel cabe
            numa tela e a faixa só anda quando a leitura acabou. */}
        <div className="flex flex-none flex-col justify-center gap-7 self-stretch md:flex-row md:items-center md:gap-16">
          <figure className="w-[62vw] max-w-[300px] flex-none rotate-[-2.5deg] bg-bone p-3 shadow-2xl shadow-black/50 md:w-[520px] md:max-w-[560px]">
            <Chapa
              legenda={`${lugar.nome} — cartão-postal`}
              src={lugar.foto}
              acento={lugar.acento}
              sizes="(min-width: 768px) 560px, 62vw"
              className="w-full"
              style={{ aspectRatio: "4 / 3" }}
              mostrarLegenda={false}
              borda="nua"
            />
            <figcaption className="display mt-3 text-center text-[1.5rem] text-ink">
              {lugar.logotipo}
            </figcaption>
          </figure>

          <div className="w-[82vw] max-w-[430px] flex-none">
            {/* line-height INLINE, e não `leading-*`: o `.display` mora em
                `@layer utilities` junto com as utilidades do Tailwind e ganha
                por ordem de origem — medido, o `leading-[1.02]` era ignorado e
                o título continuava com 0.86. Aqui ele quebra em duas linhas e
                a cedilha de uma batia no topo da outra. */}
            <h2
              className="display text-[clamp(2rem,4vw,3.4rem)]"
              style={{ color: lugar.acento, lineHeight: 1.04 }}
            >
              {lugar.titulo}
            </h2>
            <p className="eyebrow mt-5 leading-relaxed opacity-90">{lugar.destaque}</p>
            <p className="mt-5 text-[0.95rem] font-light leading-relaxed opacity-75">
              {lugar.corpo}
            </p>
          </div>
        </div>

        {/* ---- a colagem ----
            Fotos esparramadas na mesa, não um mostruário. Antes elas só
            mudavam de tamanho e penduravam todas do mesmo rodapé: o olho lia
            "gráfico de barras", não "pilha de fotos". O arranjo de cada lugar
            (`rot` e `sobe`) mora em `lib/lugares.js` — inclusive o porquê de
            ele ser diferente em cada um. */}
        {lugar.galeria.map((item) => (
          <figure
            key={item.legenda}
            /* a sombra saiu daqui e foi para a `Polaroide`: quem projeta é o
               papel, e é ele que agora tem a borda de verdade */
            className="flex-none"
            style={{
              width: `min(${item.w}px, 78vw)`,
              height: `${item.h * 100}%`,
              /* ⚠️ A CONTA DO `sobe` É EM PORCENTAGEM DA PRÓPRIA FOTO, não da
                 faixa: `translateY(%)` no CSS é relativo à altura do elemento.
                 Levantar `sobe` do vão livre (`1 - h` da faixa) equivale a
                 `sobe · (1-h)/h` da própria altura. É essa conversão que
                 garante que nada suba além do topo — o `overflow-y: hidden`
                 da faixa cortaria sem avisar. */
              transform: `translateY(-${((item.sobe * (1 - item.h)) / item.h) * 100}%) rotate(${item.rot}deg)`,
            }}
          >
            <Polaroide
              legenda={item.legenda}
              src={item.foto}
              acento={lugar.acento}
              /* a maior da faixa tem 1040px; no celular vira `min(w, 78vw)` */
              sizes="(min-width: 768px) 1040px, 78vw"
              className="h-full w-full"
            />
          </figure>
        ))}

        {/* respiro no fim, senão a última chapa cola na borda */}
        <div aria-hidden className="h-px w-2 flex-none md:w-8" />
      </div>
    </div>
  );
}
