import { VisitsType } from "./Visits";

export type TerritorioType = {
  idTerritorio: string;
  nome: string;
  ordenacao?: TerritoryOrderingType;
  disposicao?: TerritoryDispositionType;
  informacoes: TerritoryInfoType;
  predio: TerritorioPredioType[];
};

export type TerritoryInfoType = {
  observacoes: string;
  dataSelecionado: string;
  dataTrabalhado: string;
  ultimaVisita: string;
};

export type TerritorioPredioType = {
  idPredio: string;
  posicao: number;
  casas: TerritorioCasaType[];
};

export type TerritorioCasaType = {
  idCasa: string;
  nome: string;
  nomeMorador: string;
  posicao: number;
  interessado: number;
  visitas: VisitsType[];
};

export type TerritoryOrderingType = "nome" | undefined;
export type TerritoryDispositionType = "linhas" | "caixas" | undefined;
