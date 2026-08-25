import CapituloPersonagem from "@/components/CapituloPersonagem";
import { FICHAS } from "@/lib/fichas";
import { PERSONAGENS } from "@/lib/personagens";

/**
 * Os quatro capítulos, em sequência.
 *
 * A ficha do Controle de Danos de cada capítulo desce até a `Capa` dele — não
 * existe seção própria para os registros.
 *
 * ⚠️ ELA JÁ FOI SEÇÃO PRÓPRIA, por algumas horas em 24/08, e o motivo de não
 * ser mais vale ficar escrito: a ficha resolvia a emenda entre capítulos, mas
 * a chapa da CAPA continuava sendo um retângulo escuro sem nada — o vazio só
 * tinha andado alguns pixels para baixo. Somando as duas coisas, a página
 * pagava 2.332px para dizer o que agora cabe no espaço que já existia.
 *
 * A leitura que fica: quando um bloco novo e um bloco vazio estão colados,
 * antes de empilhar, ver se um não é o conteúdo que falta no outro.
 *
 * A cor de cada ficha vai do acento do capítulo ANTERIOR para o do próximo. A
 * primeira não tem anterior: sai de um cinza morto, que é a leitura certa —
 * antes do Peter não existe capítulo nenhum, e o departamento não tem ficha
 * dele.
 */

/* O "capítulo zero": nem o site nem o Controle de Danos têm nada aqui. É o
   mesmo cinza que o `ScrollRevealText` usa como cor de repouso. */
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
