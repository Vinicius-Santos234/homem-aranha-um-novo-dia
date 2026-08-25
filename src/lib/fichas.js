/**
 * As fichas do Controle de Danos.
 *
 * Uma por capítulo, impressa POR CIMA DA CAPA dele (ver `CapituloPersonagem`).
 * O número da ficha é o do capítulo que ela abre — bate com o `01 / 04` do
 * cabeçalho logo abaixo.
 *
 * ------------------------------------------------------------------
 *  POR QUE ISTO EXISTE. As emendas eram ~1.190px (1,7 tela) de chapa escura
 *  sem uma palavra, logo depois da citação — que é a batida mais forte do
 *  capítulo. Em toda a página cada bloco diz alguma coisa; ali, nada.
 *
 *  A escolha do dispositivo não é nova: a análise da referência, em 22/08, já
 *  tinha apontado "artefato do próprio mundo — o jornal / a corporação" como o
 *  equivalente aqui aos cartões-postais de turismo do GTA. Ficou dois dias sem
 *  ser construído. É isto.
 *
 *  E ele resolve o problema certo: a emenda não estava vazia de IMAGEM (o site
 *  já tem ~30 chapas esperando material — mais uma só repetiria o problema),
 *  estava vazia de INFORMAÇÃO. Ficha é texto e retângulo: não espera foto
 *  nenhuma para ficar pronta.
 *
 *  ⚠️ A PRIMEIRA TENTATIVA FOI UMA SEÇÃO SÓ PARA ISTO, e estava errada: a chapa
 *  da capa continuava vazia logo abaixo e a página crescia 2.332px. A ficha
 *  virou camada de dentro da capa — mesmo conteúdo, zero altura nova, e a
 *  chapa deixou de ser um retângulo escuro sem nada.
 * ------------------------------------------------------------------
 *
 * ⚠️ AS DUAS REGRAS DO SITE VALEM AQUI TAMBÉM. Nada fala do filme como filme,
 * e nada é inventado: cada campo aponta para algo que acontece na trama — os
 * telhados, o tanque na rua, as entradas sem arrombamento, o cofre da ilha.
 * O que é "invenção" é só a papelada em volta, que é o próprio dispositivo.
 *
 * ⚠️ NADA DO TERCEIRO ATO. Quem chega pelo site ainda não viu o fim.
 *
 * `valor` é uma lista de pedaços: string vira texto, `{ tarja: n }` vira uma
 * barra de censura com `n` caracteres de largura. É o que deixa a ficha dizer
 * e esconder na mesma linha — e o que esconde é sempre o que o departamento
 * não quer no papel.
 */

export const FICHAS = [
  {
    numero: "01",
    campos: [
      { rotulo: "Ocorrência", valor: ["Atividade recorrente na linha de telhados"] },
      { rotulo: "Setor", valor: [{ tarja: 12 }, ", Nova York"] },
      { rotulo: "Ativo", valor: ["não identificado"] },
      { rotulo: "Registro anterior", valor: ["sem correspondência em arquivo"] },
      { rotulo: "Status", valor: [{ tarja: 9 }] },
    ],
    nota: "Nenhum banco de dados devolve resultado para este ativo.",
  },
  {
    numero: "02",
    campos: [
      { rotulo: "Ocorrência", valor: ["Veículo blindado em via pública"] },
      { rotulo: "Local", valor: [{ tarja: 14 }, ", Manhattan"] },
      { rotulo: "Ativo", valor: ["Castle, Frank"] },
      { rotulo: "Vínculo", valor: ["ativo não identificado (ver registro 01)"] },
      { rotulo: "Status", valor: [{ tarja: 8 }] },
    ],
    nota: "Não intervir sem autorização.",
  },
  {
    numero: "03",
    campos: [
      { rotulo: "Ocorrência", valor: ["Entrada não autorizada — sem arrombamento"] },
      { rotulo: "Local", valor: ["Unidade de detenção, ", { tarja: 10 }] },
      { rotulo: "Ativo", valor: [{ tarja: 16 }] },
      { rotulo: "Método", valor: ["pessoal interno, sem memória do ocorrido"] },
      { rotulo: "Procurado", valor: ["registro de uma interna: ", { tarja: 7 }] },
    ],
    nota: "As portas foram abertas por dentro. Ninguém lembra de tê-las aberto.",
  },
  {
    numero: "04",
    campos: [
      { rotulo: "Ocorrência", valor: ["Perímetro rompido — cofre"] },
      { rotulo: "Local", valor: ["Roosevelt Island"] },
      { rotulo: "Ativo", valor: [{ tarja: 6 }, ", Bruce"] },
      { rotulo: "Observação", valor: ["o ativo não respondia ao próprio nome"] },
      { rotulo: "Contenção", valor: [{ tarja: 11 }] },
    ],
    nota: "A porta do cofre está amassada por dentro.",
  },
];
