/** As fichas do Controle de Danos. */

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
