import { parseISO } from "date-fns";
import { buscarAsyncStorage } from "../services/AsyncStorageMethods";
import { AppLanguages } from "../types/Languages";

export function changeDateFormatToYearMonthDay(date: any, time?: string) {
  if (!!time) {
    return parseISO(`${date.split("/").reverse().join("-")}T${time}`);
  } else {
    return parseISO(date.split("/").reverse().join("-"));
  }
}

// Busca o idioma salvo no AsyncStorage
export const buscarAsyncStorageTjDroidIdioma = async () => {
  return (await buscarAsyncStorage("@tjdroid:idioma")) as {
    language: AppLanguages;
  };
};

// Formata o idioma do celular
export const formatarLocale = (locale = "en") => {
  const language =
    locale.indexOf("-") === -1
      ? (locale as AppLanguages)
      : (locale.substr(0, locale.indexOf("-")) as AppLanguages);
  const actualAppLanguages: AppLanguages[] = [
    "pt",
    "es",
    "ru",
    "pl",
    "uk",
    "en",
  ];
  return !actualAppLanguages.includes(language) ? "en" : language;
};
