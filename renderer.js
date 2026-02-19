const display = document.getElementById("display");
const botoes = document.querySelectorAll("button");
const listaHistorico = document.getElementById("listaHistorico");

function renderizarHistorico(historico) {
  listaHistorico.innerHTML = "";

  historico.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    listaHistorico.appendChild(li);
  });
}

async function carregarHistorico() {
  try {
    const historico = await window.api.obterHistorico();
    renderizarHistorico(historico);
  } catch (erro) {
    console.error("Erro ao carregar histórico:", erro);
  }
}


botoes.forEach(botao => {
  botao.addEventListener("click", async () => {

    if (botao.id === "btnLimparHistorico") return;

    const valor = botao.textContent;

    if (valor === "C") {
      display.value = "";
    }

    else if (valor === "=") {
      try {
        let expressao = display.value.trim();

        if (!expressao) return;

        if (/[+\-*/.]$/.test(expressao)) {
          display.value = "Erro";
          return;
        }

        const resultado = Function('"use strict"; return (' + expressao + ')')();

        const calculo = `${expressao} = ${resultado}`;
        display.value = resultado;

        const historicoAtualizado = await window.api.salvarCalculo(calculo);
        renderizarHistorico(historicoAtualizado);

      } catch (erro) {
        display.value = "Erro";
      }
    }

    else {
      display.value += valor;
    }
  });
});

const btnLimpar = document.getElementById("btnLimparHistorico");

btnLimpar.addEventListener("click", async () => {
  const historicoVazio = await window.api.limparHistorico();
  renderizarHistorico(historicoVazio);
});

carregarHistorico();
