import React from "react";
import Contador from "../../components/Contador";

import moment from "moment";
import "moment/locale/pt-br";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "RelatorioDetalhes"
>;

interface Props extends ProfileScreenRouteProp {}

export default function RelatorioDetalhes({ route }: Props) {
  const {
    anotacoes,
    colocacoes,
    data,
    idRelatorio,
    minutos,
    revisitas,
    videosMostrados,
  } = route.params;

  return (
    <>
      <Contador
        relatorioId={idRelatorio}
        minutosProp={minutos}
        colocacoesProp={colocacoes}
        videosMostradosProp={videosMostrados}
        revisitasProp={revisitas}
        observacoesProp={anotacoes}
        diaProp={moment(data).format("L")}
        horaProp={moment(data).format("LT")}
        paginaRelatorioDetalhes
      />
    </>
  );
}
