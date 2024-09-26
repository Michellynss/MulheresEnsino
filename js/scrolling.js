
const grafico = document.querySelector(".grafico");
const scroller = scrollama();

// Instruções para quando entrar num step
function entrou(resposta) {
  const ordem = resposta.index + 1;

  // Muda para o gráfico correspondente
  grafico.src = `media/grafico_mulheres${ordem}.svg`;
}

function saiu(resposta) {
  if (resposta.index === 0 && resposta.direction === "up") {
    // Muda para o gráfico original
    grafico.src = `media/grafico_mulheres.svg`;
  }
}

// Configura a instância do scrollama e passa funções
scroller
  .setup({
    step: ".step",
  })
  .onStepEnter(entrou)
  .onStepExit(saiu);