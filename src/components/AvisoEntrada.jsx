"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { liberarEntrada } from "@/lib/entrada";

/**
 * O aviso que abre o site.
 *
 * Quatro coisas que quem chega precisa saber antes de rolar: isto é portfólio
 * e não é oficial, o material é dos estúdios, os textos saíram de IA e podem
 * divergir do filme, e tem spoiler.
 *
 * ⚠️ O SPOILER VEM PRIMEIRO, e a ordem não é estética. Dos quatro avisos, é o
 * único que pede uma DECISÃO de quem está lendo — os outros três são contexto
 * que só importa depois. Um aviso de spoiler no quarto parágrafo é um aviso
 * que chega tarde.
 *
 * ⚠️ NADA DE MOLDURA DE FICÇÃO AQUI. Passou pela cabeça montar o painel como
 * mais uma ficha do Controle de Danos, que é a voz de documento do site. Não:
 * um aviso de direitos autorais fantasiado de peça da história lê como parte
 * da história, e é exatamente o que ele não pode fazer. O painel usa a
 * tipografia do site (mono, osso, carvão) e diz o que é, de fora da trama.
 */

/* Muda quando o texto mudar: quem já leu a versão anterior volta a ver o
   aviso, em vez de ficar com um "li isso" que vale para outro texto. */
const VERSAO = "1";
const CHAVE = "aviso-entrada";

/* Tempo entre o preloader anunciar que acabou e o aviso entrar. A saída dele
   dura 550ms; entrar antes disso poria dois painéis na tela ao mesmo tempo. */
const DEPOIS_DO_PRELOADER = 620;
/* Sem preloader (a rota `/lugares`), só o tempo de a página pintar. */
const SEM_PRELOADER = 320;

export default function AvisoEntrada() {
  /* Começa fechado SEMPRE, inclusive quando já se sabe que vai abrir: ler o
     `localStorage` durante a renderização daria HTML diferente no servidor e
     no cliente, e a hidratação quebra. Quem decide é o efeito. */
  const [visivel, setVisivel] = useState(false);
  const botaoRef = useRef(null);

  const fechar = useCallback(() => {
    setVisivel(false);
    liberarEntrada();
    try {
      window.localStorage.setItem(CHAVE, VERSAO);
    } catch {
      /* modo privado, armazenamento cheio, cookies bloqueados: o aviso
         reaparece na próxima visita, e isso é bem melhor do que estourar. */
    }
  }, []);

  useEffect(() => {
    let jaLeu = false;
    try {
      jaLeu = window.localStorage.getItem(CHAVE) === VERSAO;
    } catch {
      jaLeu = false;
    }
    /* ⚠️ QUEM JÁ LEU TAMBÉM PRECISA LIBERAR A TELA, e não pode ser aqui
       mesmo: a tela de carregamento ainda pode estar no ar. Sem isto, o clipe
       do herói no celular esperaria para sempre por uma liberação que nunca
       viria — ver `lib/entrada.js`. */
    if (jaLeu) {
      const semPreloader = !document.querySelector("[data-preloader]");
      if (semPreloader) {
        liberarEntrada();
        return;
      }
      const aoFimDoPreloader = () => liberarEntrada();
      window.addEventListener("preloader:fim", aoFimDoPreloader, { once: true });
      const redeDeSeguranca = setTimeout(liberarEntrada, 3600);
      return () => {
        window.removeEventListener("preloader:fim", aoFimDoPreloader);
        clearTimeout(redeDeSeguranca);
      };
    }

    // o preloader só existe na home; sem ele, não há o que esperar
    const temPreloader = !!document.querySelector("[data-preloader]");
    let temporizador;

    const abrir = (atraso) => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => setVisivel(true), atraso);
    };

    if (!temPreloader) {
      abrir(SEM_PRELOADER);
      return () => clearTimeout(temporizador);
    }

    /* Rede de segurança em tempo de relógio. O preloader tem a própria guarda
       e sempre fecha, mas se um dia ele deixar de disparar o evento o aviso
       não pode sumir junto — ele é obrigação, não enfeite. O número é o teto
       do preloader (2400 + 700 da guarda dele) com folga. */
    const guarda = setTimeout(() => abrir(0), 3600);

    const aoTerminar = () => {
      clearTimeout(guarda);
      abrir(DEPOIS_DO_PRELOADER);
    };
    window.addEventListener("preloader:fim", aoTerminar, { once: true });

    return () => {
      window.removeEventListener("preloader:fim", aoTerminar);
      clearTimeout(temporizador);
      clearTimeout(guarda);
    };
  }, []);

  useEffect(() => {
    if (!visivel) return;

    document.documentElement.classList.add("rolagem-travada");
    botaoRef.current?.focus();

    const aoTeclar = (e) => {
      if (e.key === "Escape") {
        fechar();
        return;
      }
      /* Prender o foco. O painel tem UM elemento focável, então "prender" é
         só devolver o foco para ele — não precisa da dança de primeiro/último
         de um diálogo com formulário. */
      if (e.key === "Tab") {
        e.preventDefault();
        botaoRef.current?.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.documentElement.classList.remove("rolagem-travada");
    };
  }, [visivel, fechar]);

  if (!visivel) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aviso-titulo"
      aria-describedby="aviso-corpo"
      /* z acima do preloader (100) e da faixa dos lugares (90): enquanto ele
         estiver aberto, nada da página vai por cima. */
      className="fixed inset-0 z-[110] flex items-center justify-center overscroll-contain bg-void/85 p-5 backdrop-blur-sm"
    >
      <div className="surgir-aviso w-full max-w-[38rem] border border-bone/12 bg-carvao shadow-2xl shadow-black/70">
        <div className="max-h-[86vh] overflow-y-auto px-6 py-8 sm:px-9 sm:py-10">
          <p className="eyebrow text-bone-dim/50">Aviso</p>
          <h2 id="aviso-titulo" className="display mt-3 text-[clamp(1.9rem,5vw,2.6rem)] text-bone">
            Antes de entrar
          </h2>
          <div className="mt-5 h-[3px] w-14 bg-blood-400" />

          <div id="aviso-corpo" className="mt-7 space-y-5 font-mono text-[0.82rem] leading-relaxed text-bone-dim/75 sm:text-[0.875rem]">
            <p className="text-bone">
              <span className="text-blood-400">⚠</span> Este site{" "}
              <strong className="font-semibold">contém spoilers</strong> de{" "}
              <cite className="not-italic text-bone">Homem-Aranha: Um Novo Dia</cite>.
            </p>

            <p>
              É um projeto <strong className="font-semibold text-bone">fictício, de portfólio</strong>,
              feito para estudar animação e layout. Não é um site oficial e não tem vínculo com
              nenhum estúdio ou distribuidora.
            </p>

            <p>
              O Homem-Aranha, os demais personagens e todo o material visual pertencem à{" "}
              <strong className="font-semibold text-bone">Marvel</strong>, à{" "}
              <strong className="font-semibold text-bone">Sony Pictures</strong> e aos seus
              respectivos detentores de direitos. Nada aqui é usado com fim comercial.
            </p>

            <p>
              Os textos foram <strong className="font-semibold text-bone">gerados por IA</strong> a
              partir do enredo do filme. Eles e as imagens podem divergir do que de fato acontece
              na trama.
            </p>
          </div>

          <button
            ref={botaoRef}
            type="button"
            onClick={fechar}
            className="eyebrow mt-9 w-full rounded-full bg-bone px-6 py-4 text-ink transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blood-400"
          >
            Entendi — entrar
          </button>
        </div>
      </div>
    </div>
  );
}
