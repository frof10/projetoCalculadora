const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let janela;

const caminhoHistorico = path.join(app.getPath("userData"), "historico.json");

function garantirArquivoHistorico() {
  if (!fs.existsSync(caminhoHistorico)) {
    fs.writeFileSync(caminhoHistorico, JSON.stringify([], null, 2));
  }
}

function criarJanela() {
  janela = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  janela.loadFile("calc.html");
}

app.whenReady().then(() => {
  garantirArquivoHistorico();
  criarJanela();
});


ipcMain.handle("salvar-calculo", (event, calculo) => {
  const dados = JSON.parse(fs.readFileSync(caminhoHistorico));
  dados.unshift(calculo);

  if (dados.length > 10) {
    dados.pop();
  }

  fs.writeFileSync(caminhoHistorico, JSON.stringify(dados, null, 2));

  return dados;
});

ipcMain.handle("obter-historico", () => {
  return JSON.parse(fs.readFileSync(caminhoHistorico));
});

ipcMain.handle("limpar-historico", () => {
  fs.writeFileSync(caminhoHistorico, JSON.stringify([], null, 2));
  return [];
});
