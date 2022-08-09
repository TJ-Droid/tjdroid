import React from "react";
import Contador from "../../components/Contador";

type ConometroParadoProps = {
  route: RouteProps;
};

type RouteProps = {
  params: {
    dia: string;
    hora: string;
    minutos: number;
    colocacoes: number;
    videosMostrados: number;
    revisitas: number;
  };
};

export default function CronometroParado({ route }: ConometroParadoProps) {
  const { colocacoes, dia, hora, minutos, revisitas, videosMostrados } =
    route.params;

  return (
    <>
      <Contador
        minutosProp={minutos}
        colocacoesProp={colocacoes}
        videosMostradosProp={videosMostrados}
        revisitasProp={revisitas}
        observacoesProp=""
        diaProp={dia}
        horaProp={hora}
        paginaCronometroParado
      />
    </>
  );
}
