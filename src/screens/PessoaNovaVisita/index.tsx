import React, { useState } from "react";
import { format, formatISO } from "date-fns";

import Header from "../../components/Header";
import { VisitBox } from "../../components/VisitBox";
import { useTranslation } from "react-i18next";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";
import { VisitDataType } from "../../types/Visits";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "PessoaNovaVisita"
>;

interface Props extends ProfileScreenRouteProp {}

export default function PessoaNovaVisita({ route }: Props) {
  const { t } = useTranslation();

  const { personId } = route.params;

  const [novaVisitaPessoa, setNovaVisitaPessoa] = useState<VisitDataType>({
    idPessoa: personId,
    dia: format(new Date(), "dd/MM/yyyy"),
    hora: format(new Date(), "HH:mm"),
    visita: 0,
    colocacoes: 0,
    videosMostrados: 0,
    anotacoes: "",
    data: formatISO(new Date()),
    idVisita: "",
  });

  return (
    <>
      <Header
        title={t("screens.territorioresidencianovavisita.screen_name")}
        showGoBack
        showNewPersonVisit={novaVisitaPessoa}
      />

      <VisitBox
        visitData={novaVisitaPessoa}
        onVisitChangeValues={(v) => setNovaVisitaPessoa(v)}
      />
    </>
  );
}
