import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../services/AsyncStorageMethods";
import { SettingsType } from "../types/Settings";

// Função para carregar os dados
export const buscarConfiguracoesStorage = async () => {
  try {
    const json = await buscarAsyncStorage("@tjdroid:config");

    // Se não existir nada, adiciona um array com as configuracoes padrao
    // Salva o modelo das configuracoes padrao
    if (json === undefined) {
      const newConfig: SettingsType = {
        darkMode: false,
        actualTheme: "azulEscuroDefault",
      };
      // Salva
      await salvarAsyncStorage(newConfig, "@tjdroid:config");

      // Retorna as configurações
      return newConfig;
    }

    // Verifica se o retorno é null.
    // ele retorna null quando não existe
    // se existir algo, retorna o conteudo
    if (json !== null) {
      return json;
    }
  } catch (e) {
    // error reading value
    return false;
  }
};

// Carrega as configuracoes
export async function carregarConfiguracoes() {
  return await buscarConfiguracoesStorage()
    .then((dados) => {
      return dados;
    })
    .catch(() => {
      return false;
    });
}

// Salva as configuracoes
export async function salvarConfiguracoes(dados: SettingsType) {
  return await salvarAsyncStorage(dados, "@tjdroid:config")
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
