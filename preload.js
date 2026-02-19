const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    salvarCalculo: (calculo) => ipcRenderer.invoke('salvar-calculo', calculo),
    obterHistorico: () => ipcRenderer.invoke('obter-historico'),
    limparHistorico: () => ipcRenderer.invoke('limpar-historico')
});
