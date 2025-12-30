import AsyncStorage from "@react-native-async-storage/async-storage";

type MMKVLike = {
  getBoolean: (key: string) => boolean;
  getString: (key: string) => string | undefined;
  set: (key: string, value: string | boolean) => void;
};

let storage: MMKVLike | null = null;
let createMMKVFn: ((config?: { id?: string }) => MMKVLike) | null = null;
let storageUnavailable = false;
const MIGRATION_KEY = "@tjdroid:mmkv_migrated_v1";
let migrationPromise: Promise<boolean> | null = null;

const loadMMKV = () => {
  if (createMMKVFn || storageUnavailable) {
    return createMMKVFn;
  }

  try {
    const module = require("react-native-mmkv");
    createMMKVFn =
      module.createMMKV ||
      (module.default && module.default.createMMKV) ||
      null;
  } catch (e) {
    storageUnavailable = true;
    createMMKVFn = null;
  }

  return createMMKVFn;
};

const getStorage = () => {
  if (storageUnavailable) {
    return null;
  }

  if (!storage) {
    try {
      const createMMKV = loadMMKV();
      if (!createMMKV) {
        return null;
      }

      storage = createMMKV({ id: "tjdroid" });
    } catch (e) {
      storageUnavailable = true;
      storage = null;
    }
  }

  return storage;
};

const ensureMigrated = async () => {
  const currentStorage = getStorage();
  if (!currentStorage) {
    return false;
  }

  if (currentStorage.getBoolean(MIGRATION_KEY)) {
    return true;
  }

  if (migrationPromise) {
    return migrationPromise;
  }

  const runMigration = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const tjdroidKeys = keys.filter((key) => key.startsWith("@tjdroid:"));

      if (tjdroidKeys.length > 0) {
        const pairs = await AsyncStorage.multiGet(tjdroidKeys);
        pairs.forEach(([key, value]) => {
          if (value !== null && currentStorage.getString(key) === undefined) {
            currentStorage.set(key, value);
          }
        });
      }

      currentStorage.set(MIGRATION_KEY, true);
      return true;
    } catch (e) {
      return false;
    }
  };

  migrationPromise = runMigration().finally(() => {
    migrationPromise = null;
  });

  return migrationPromise;
};

// Funcao para salvar os dados
export const salvarAsyncStorage = async (value: any, identificador: string) => {
  try {
    const currentStorage = getStorage();
    if (currentStorage) {
      await ensureMigrated();
      const json = JSON.stringify(value);
      currentStorage.set(identificador, json);
      return;
    }
  } catch (e) {
    // fallback to AsyncStorage below
  }

  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(identificador, json);
  } catch (err) {
    return false;
  }
};

// Funcao para buscar os dados
export const buscarAsyncStorage = async (identificador: string) => {
  try {
    const currentStorage = getStorage();
    if (currentStorage) {
      await ensureMigrated();
      const mmkvValue = currentStorage.getString(identificador);
      if (mmkvValue !== undefined) {
        return JSON.parse(mmkvValue);
      }
    }
  } catch (e) {
    // fallback to AsyncStorage below
  }

  try {
    const raw = await AsyncStorage.getItem(identificador);
    const parsed = JSON.parse(raw || "[]");

    // Verifica se o retorno e null.
    // ele retorna null quando nao existe
    // se existir algo, retorna o conteudo
    if (parsed !== null) {
      const currentStorage = getStorage();
      if (raw !== null && currentStorage) {
        currentStorage.set(identificador, raw);
      }
      return parsed;
    }

    // Se nao existir nada, adiciona um array vazio e retorna o novo array vazio
    const empty = JSON.stringify([]);
    await AsyncStorage.setItem(identificador, empty);
    const currentStorage = getStorage();
    if (currentStorage) {
      currentStorage.set(identificador, empty);
    }
    return JSON.parse(empty);
  } catch (e) {
    return false;
  }
};
