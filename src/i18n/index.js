import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import { buscarAsyncStorage, salvarAsyncStorage } from "../services/AsyncStorageMethods";
import en from "./locales/en/en.json";
import pt from "./locales/pt/pt.json";
import es from "./locales/es/es.json";

const smartphoneLanguageCode = RNLocalize.getLocales()[0].languageCode;

// Default Language
const defaultLanguage = "en";

// Languages
const resources = {
  "en": en,
  "pt": pt,
  "es": es,
}

// Busca o idioma salvo no AsyncStorage
const verifyLanguage = async () => {
  return await buscarAsyncStorage("@tjdroid:idioma");
}

// Detecta o idioma do celular do usuario
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    const langSelected = await verifyLanguage();
    const lang = langSelected?.choosed ? langSelected?.language : smartphoneLanguageCode;
    
    await salvarAsyncStorage({ language: lang, choosed: false }, '@tjdroid:idioma');

    callback(lang);
  },
  init: () => {},
  cacheUserLanguage: () => {}
}

// Deixei esse código aqui no erro para evitar problemas de carregamento errado dos idiomas
  // Seta o idioma
  i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: defaultLanguage,
    compatibilityJSON: 'v3',
    resources,
    react: {
      useSuspense: false,
    },
  });

export default i18next;
