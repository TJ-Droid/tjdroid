import React, { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useTranslation } from "react-i18next";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import { buscarVisitaResidencia } from "../../controllers/territoriosController";

import { VisitBox } from "../../components/VisitBox";

export default function TerritorioResidenciaEditarVisita({ route }) {
  
  const { t } = useTranslation();
  const [visitaPessoa, setVisitaPessoa] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { idVisita, residenciaId, territorioId } = route.params;

    setCarregando(true);

    let continuarBuscarDados = true;

    const buscarDados = async () => {
      if (continuarBuscarDados) {
        // Busca os anos de Servico para setar no SectionList
        await buscarVisitaResidencia(idVisita, residenciaId, territorioId)
          .then((dados) => {
            // Trata o retorno
            if (dados) {
              // Seta o estado com todos as visitas da pessoa para o SectionList
              setVisitaPessoa(dados.visita);

              // Retira a mensagem de carregando
              setCarregando(false);
            } else {
              ToastAndroid.show(
                t("screens.territorioresidenciaeditarvisita.visits_load_message_error"),
                ToastAndroid.LONG
              );
            }
          })
          .catch((error) => {
            ToastAndroid.show(
              t("screens.territorioresidenciaeditarvisita.visits_load_message_error"),
              ToastAndroid.LONG
            );
          });
      }
    };
    buscarDados();

    return () => (continuarBuscarDados = false);
  }, []);

  return (
    <>
      <Header
        title={t("screens.territorioresidenciaeditarvisita.screen_name")}
        showGoBack
        showEditHomeVisit={visitaPessoa}
      />

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <VisitBox
          visitData={visitaPessoa}
          onVisitChangeValues={(v) => setVisitaPessoa(v)}
        />
      )}
    </>
  );
}
