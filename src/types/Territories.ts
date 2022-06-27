import { VisitsType } from "./Visits";

export type TerritoriesType = {
  id: string;
  nome: string;
  ordenacao: string;
  disposicao: string;
  informacoes: InformacoesType;
  casas: CasasType[];
}

export type InformacoesType = {
  observacoes: string;
  dataSelecionado: string;
  dataTrabalhado: string;
  ultimaVisita: string;
}
export type CasasType = {
  id: string;
  nome: string;
  nomeMorador: string;
  posicao: number;
  interessado: number;
  visitas: VisitsType[];
}
