"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { liberarEntrada } from "@/lib/entrada";

/** O aviso que abre o site. */

const VERSAO = "2";
const CHAVE = "aviso-entrada";

const DEPOIS_DO_PRELOADER = 620;
const SEM_PRELOADER = 320;

export default function AvisoEntrada() {
  const [visivel, setVisivel] = useState(false);
  const botaoRef = useRef(null);

  const fechar = useCallback(() => {
    setVisivel(false);
    liberarEntrada();
    try {
      window.localStorage.setItem(CHAVE, VERSAO);
    } catch {
    }
  }, []);

  useEffect(() => {
    let jaLeu = false;
    try {
      jaLeu = window.localStorage.getItem(CHAVE) === VERSAO;
    } catch {
      jaLeu = false;
    }
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

    botaoRef.current?.focus({ preventScroll: true });

    const aoTeclar = (e) => {
      if (e.key === "Escape") {
        fechar();
        return;
      }
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

            <p>
              Ele foi feito para ser visto{" "}
              <strong className="font-semibold text-bone">no computador</strong>: a tela grande tem
              animação comandada pela rolagem que o celular não recebe.
            </p>
          </div>

          <p className="mt-7 font-mono text-[0.72rem] leading-relaxed text-bone-dim/50">
            Sem cookies, sem cadastro.{" "}
            <a
              href="/privacidade"
              className="text-bone-dim/80 underline decoration-bone/25 underline-offset-4 transition-colors hover:text-bone hover:decoration-bone"
            >
              O que o site guarda
            </a>
            .
          </p>

          <button
            ref={botaoRef}
            type="button"
            onClick={fechar}
            className="eyebrow mt-6 w-full rounded-full bg-bone px-6 py-4 text-ink transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blood-400"
          >
            Entendi — entrar
          </button>
        </div>
      </div>
    </div>
  );
}
