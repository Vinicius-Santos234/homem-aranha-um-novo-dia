import CapituloPersonagem from "@/components/CapituloPersonagem";
import { FICHAS } from "@/lib/fichas";
import { PERSONAGENS } from "@/lib/personagens";

/** Os quatro capítulos, em sequência. */

const ANTES_DE_TUDO = "#3a3a42";

export default function Personagens() {
  return (
    <div id="personagens">
      {PERSONAGENS.map((personagem, i) => (
        <CapituloPersonagem
          key={personagem.slug}
          personagem={personagem}
          ficha={FICHAS[i]}
          corAnterior={i === 0 ? ANTES_DE_TUDO : PERSONAGENS[i - 1].acento}
          indice={i}
          total={PERSONAGENS.length}
        />
      ))}
    </div>
  );
}
