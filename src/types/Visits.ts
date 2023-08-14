export type VisitsType = {
  id: string;
  data: string;
  colocacoes: number;
  visita: number;
  anotacoes: string;
  videosMostrados: number;
};

export type VisitDataType = {
  anotacoes: string;
  colocacoes: number;
  data: string;
  dia: string;
  hora: string;
  videosMostrados: number;
  visita: number;
  idPessoa: string;
  idVisita: string;
  territoryId?: string;
  residenciaId?: string;
};
