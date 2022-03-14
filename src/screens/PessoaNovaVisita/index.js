import React, { useState } from "react";
import { format, formatISO } from "date-fns";

import Header from "../../components/Header";
import { VisitBox } from "../../components/VisitBox";
import { useTranslation } from "react-i18next";

export default function PessoaNovaVisita({ route }) {
  const { t } = useTranslation();

  const { personId } = route.params;

  const [novaVisitaPessoa, setNovaVisitaPessoa] = useState({
    pessoaId: personId,
    dia: format(new Date(), "dd/MM/yyyy"),
    hora: format(new Date(), "HH:mm"),
    visita: 0,
    colocacoes: 0,
    videosMostrados: 0,
    anotacoes: "",
    data: formatISO(new Date()),
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
