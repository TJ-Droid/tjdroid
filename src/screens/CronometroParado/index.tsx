import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import Contador from "../../components/Contador";
import { RootStackParamListType } from "../../routes";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "CronometroParado"
>;

interface Props extends ProfileScreenRouteProp {}

export default function CronometroParado({ route }: Props) {
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
