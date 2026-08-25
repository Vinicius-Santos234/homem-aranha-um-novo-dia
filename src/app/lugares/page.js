import Link from "next/link";

import GradeLugares from "@/components/lugares/GradeLugares";
import { Logo } from "@/components/art";

export const metadata = {
  title: "Os lugares — Homem-Aranha: Um Novo Dia",
  description:
    "Cinco endereços que a história atravessa: o sótão onde ele mora, os telhados, a prisão do Controle de Danos, o cofre de Roosevelt Island e o túmulo da May.",
};

export default function LugaresPage() {
  return (
    <main className="min-h-screen bg-void pb-32">
      <header className="flex items-center justify-between px-6 py-7 lg:px-10">
        <Link href="/" aria-label="Um Novo Dia — início" className="text-bone">
          <Logo />
        </Link>
        {/* `whitespace-nowrap`: com o texto inteiro a pílula quebrava em duas
            linhas num celular de 390px. No lugar de deixar quebrar, o rótulo
            encurta — o ← já diz para onde vai. */}
        <Link
          href="/#lugares"
          className="eyebrow shrink-0 whitespace-nowrap rounded-full border border-bone/25 px-4 py-3 text-bone-dim transition-colors hover:border-bone/60 hover:text-bone sm:px-5"
        >
          ← Voltar<span className="hidden sm:inline"> ao início</span>
        </Link>
      </header>

      <div className="px-6 pt-10 lg:px-10 lg:pt-16">
        <p className="eyebrow text-blood-400">Nova York</p>
        <h1 className="display mt-4 max-w-[14ch] text-[clamp(2.8rem,8vw,6.5rem)] text-bone">
          Os lugares
        </h1>
        <p className="mt-7 max-w-[52ch] text-[1rem] font-light leading-relaxed text-bone-dim/75">
          Abra um cartão para atravessar o lugar. Cada faixa anda de lado — role
          como sempre, no dedo ou na roda, que a imagem caminha para o lado.
        </p>
      </div>

      {/* ---- o mural ----
          A grade deixa de flutuar no preto e passa a estar PRESA em alguma
          coisa. Os cartões já eram polaroides e ganharam fita, clipe e
          alfinete; faltava a prancha.

          ⚠️ As pontas fecham no `void` com gradiente, e não com uma aresta.
          Uma prancha de cortiça que começa e termina num corte reto lê como
          `<div>` colorida; dissolvendo, ela vira o pedaço de parede que a
          página atravessa. É o mesmo recurso que a `ChamadaLugares` usa para
          emendar a seção da cidade no capítulo anterior.

          ⚠️ `isolate` no pai: o `::after` da textura usa `mix-blend-mode:
          overlay`, e sem contexto de empilhamento próprio ele mistura com o
          que estiver atrás da página inteira — ver
          `mix-blend-mode-e-contexto-de-empilhamento` na cabeça do projeto. */}
      <div className="relative isolate mt-20 lg:mt-28">
        <div aria-hidden className="cortica absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-void to-transparent lg:h-40"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-void to-transparent lg:h-40"
        />

        <div className="px-6 py-24 lg:px-10 lg:py-32">
          <GradeLugares />
        </div>
      </div>
    </main>
  );
}
