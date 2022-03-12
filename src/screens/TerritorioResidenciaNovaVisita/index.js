import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
// import "moment/locale/pt-br";

import Header from "../../components/Header";
import { VisitBox } from "../../components/VisitBox";

export default function TerritorioResidenciaNovaVisita({ route }) {

  const { t } = useTranslation();
  const { residenciaId, territoryId } = route.params;

  const [novaVisita, setNovaVisita] = useState({
    territoryId: territoryId,
    residenciaId: residenciaId,
    dia: moment(new Date()).format("DD/MM/YYYY"),
    hora: moment(new Date()).format("HH:mm"),
    visita: 0,
    colocacoes: 0,
    videosMostrados: 0,
    anotacoes: "",
    data: moment(new Date()).format(),
  });

  return (
    <>
      <Header title={t("screens.territorioresidencianovavisita.screen_name")} showGoBack showNewHomeVisit={novaVisita} />

      <VisitBox
        visitData={novaVisita}
        onVisitChangeValues={(v) => setNovaVisita(v)}
      />
    </>
  );
}
