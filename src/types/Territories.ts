import { VisitsType } from "./Visits";

export type TerritoriesType = {
  id: string;
  nome: string;
  ordenacao?: TerritoryOrderingType;
  disposicao?: TerritoryDispositionType;
  informacoes: TerritoryInfoType;
  casas: TerritoryHomeType[];
};

export type TerritoryInfoType = {
  observacoes: string;
  dataSelecionado: string;
  dataTrabalhado: string;
  ultimaVisita: string;
};

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
