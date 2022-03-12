import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para salvar os dados
export const salvarAsyncStorage = async (value, identificador) => {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(identificador, json);
  } catch (e) {
    return false;
  }
};

// Função para buscar os dados
export const buscarAsyncStorage = async (identificador) => {
  try {
    const json = JSON.parse(await AsyncStorage.getItem(identificador));

    // Verifica se o retorno é null.
    // ele retorna null quando não existe
    // se existir algo, retorna o conteudo
    if (json !== null) { return json; }
    
    // Se não existir nada, adiciona um array vazio e retorna o novo array vazio
    await AsyncStorage.setItem(identificador, JSON.stringify([]))
      .then(async () => {
        return JSON.parse(await AsyncStorage.getItem(identificador));
      })
      .catch(() => {
        return false;
      });

  } catch (e) {
    return false;
  }
};
