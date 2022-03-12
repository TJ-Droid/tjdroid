import { parseISO } from "date-fns";
import { buscarAsyncStorage } from "../services/AsyncStorageMethods";

export function changeDateFormatToYearMonthDay(date, time = false){
  if(time){
    return parseISO(`${date.split('/').reverse().join('-')}T${time}`);
  } else {
    return parseISO(date.split('/').reverse().join('-'));
  }
}

// Busca o idioma salvo no AsyncStorage
export const buscarAsyncStorageTjDroidIdioma = async () => {
  return await buscarAsyncStorage("@tjdroid:idioma");
}