import Link from "next/link";

import { Logo } from "@/components/art";

export const metadata = {
  title: "Endereço não encontrado — Homem-Aranha: Um Novo Dia",
};

/**
 * A 404.
 *
 * ⚠️ AQUI A MOLDURA DE FICÇÃO PODE, e no aviso de entrada não podia. A regra é
 * a mesma dos dois lados: uma peça de ficção não pode fingir ser um documento
 * de verdade. O aviso de entrada É um documento de verdade — direitos autorais,
 * spoiler, IA —, então vestir de ficha do Controle de Danos o faria parecer
 * parte da história, que é exatamente o que ele não pode fazer.
 *
 * Uma 404 não afirma nada sobre o mundo real: ela diz "este endereço não
 * existe" e oferece saída. Pode ser dita na voz do site — e ganha com isso,
 * porque a alternativa é a página mais sem graça de qualquer projeto.
 *
 * ⚠️ O QUE NÃO PODE FALTAR, POR MAIS VESTIDA QUE ESTEJA: dizer sem rodeio que
 * a página não existe, e um caminho de volta que funcione. Piada que esconde a
 * informação vira armadilha para quem chegou aqui perdido.
 */
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
          {/* A ficha, na mesma voz das emendas entre capítulos */}
          <div className="border border-bone/12 bg-carvao p-6 sm:p-9">
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow text-bone-dim/60">Controle de Danos</p>
              <p className="eyebrow text-blood-400">Erro 404</p>
            </div>
            <div className="mt-4 h-px w-full bg-blood-700" />

            {/* ⚠️ `lineHeight` INLINE, e não `leading-*`. O `.display` mora em
                `@layer utilities` junto com as utilidades do Tailwind e ganha
                por ORDEM DE ORIGEM: medido, o `leading-[0.95]` era ignorado e
                o título ficava com 0,86 — a cedilha de "ENDEREÇO" encostava em
                "ENCONTRADO". Mesma pegadinha já documentada no `FaixaLugar`. */}
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
