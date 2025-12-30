import { VisitsType } from "./Visits";

export type TerritoriesType = {
  id: string;
  nome: string;
  ordenacao?: TerritoryOrderingType;
  disposicao?: TerritoryDispositionType;
  informacoes: TerritoryInfoType;
  casas: TerritoryHomeType[];
  // predio: TerritoryPredioType[];
};

export type TerritoryInfoType = {
  observacoes: string;
  dataSelecionado: string;
  dataTrabalhado: string;
  ultimaVisita: string;
};

// export type TerritoryPredioType = {
//   idPredio: string;
//   posicao: number;
//   casas: TerritoryHomeType[];
// };

export type TerritoryHomeType = {
  id: string;
  nome: string;
  nomeMorador: string;
  posicao: number;
  interessado: number;
  visitas: VisitsType[];
};

export type TerritoryOrderingType = "nome" | undefined;
export type TerritoryDispositionType = "linhas" | "caixas" | undefined;
