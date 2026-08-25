import Link from "next/link";

import { Logo } from "@/components/art";

export const metadata = {
  title: "Endereço não encontrado — Homem-Aranha: Um Novo Dia",
};

/** A 404. */
export default function NaoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col bg-void">
      <header className="flex items-center justify-between px-6 py-7 lg:px-10">
        <Link href="/" aria-label="Um Novo Dia — início" className="text-bone">
          <Logo />
        </Link>
      </header>

      <div className="flex flex-1 items-center px-6 py-16 lg:px-10">
        <div className="mx-auto w-full max-w-[42rem]">
          <div className="border border-bone/12 bg-carvao p-6 sm:p-9">
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow text-bone-dim/60">Controle de Danos</p>
              <p className="eyebrow text-blood-400">Erro 404</p>
            </div>
            <div className="mt-4 h-px w-full bg-blood-700" />

            <h1
              className="display mt-8 text-[clamp(2rem,6vw,3.4rem)] text-bone"
              style={{ lineHeight: 1 }}
            >
              Endereço não
              <br />
              encontrado
            </h1>

            <dl className="mt-9 flex flex-col gap-3 font-mono text-[0.8rem] leading-relaxed sm:text-[0.875rem]">
              <div className="flex gap-4">
                <dt className="w-[9rem] shrink-0 text-bone-dim/45">OCORRÊNCIA</dt>
                <dd className="text-bone-dim/85">Página inexistente neste domínio</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-[9rem] shrink-0 text-bone-dim/45">REGISTRO</dt>
                <dd className="text-bone-dim/85">
                  <span className="select-none bg-bone-dim/25 text-transparent">
                    ████████████
                  </span>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-[9rem] shrink-0 text-bone-dim/45">CONCLUSÃO</dt>
                <dd className="text-bone-dim/85">Nunca existiu. Não foi apagado.</dd>
              </div>
            </dl>

            <div className="mt-8 h-px w-full bg-bone/10" />

            <p className="mt-6 font-mono text-[0.8rem] leading-relaxed text-bone-dim/70">
              O endereço que você tentou abrir não faz parte deste site. Pode ter sido um link
              velho, um erro de digitação, ou uma página que nunca esteve aqui.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/"
                className="eyebrow rounded-full bg-bone px-6 py-4 text-ink transition-colors hover:bg-white"
              >
                Voltar ao início
              </Link>
              <Link
                href="/lugares"
                className="eyebrow rounded-full border border-bone/25 px-6 py-4 text-bone-dim transition-colors hover:border-bone/60 hover:text-bone"
              >
                Ver os lugares
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
