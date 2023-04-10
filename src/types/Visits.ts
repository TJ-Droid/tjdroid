export type VisitsType = {
  idVisita: string;
  data: string;
  colocacoes: number;
  visita: number;
  anotacoes: string;
  videosMostrados: number;
};

export type VisitDataType = {
  idPessoa: string;
  idVisita: string;
  anotacoes: string;
  colocacoes: number;
  data: string;
  dia: string;
  hora: string;
  videosMostrados: number;
  visita: number;
  idTerritorio?: string;
  idCasa?: string;
  idPredio?: string;
};
