import React, { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useTranslation } from "react-i18next";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  buscarVisitaResidencia,
  VisitCustomSearchHomeVisitIterface,
} from "../../controllers/territoriosController";

import { VisitBox } from "../../components/VisitBox";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";
import { VisitDataType } from "../../types/Visits";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "TerritorioResidenciaEditarVisita"
>;

interface Props extends ProfileScreenRouteProp {}

export default function TerritorioResidenciaEditarVisita({ route }: Props) {
  const { t } = useTranslation();
  const [homeVisit, setHomeVisit] =
    useState<VisitCustomSearchHomeVisitIterface>();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { idVisita, idCasa, idTerritorio, idPredio } = route.params;

    setCarregando(true);

    // let continuarBuscarDados = true;

    const buscarDados = async () => {
      // if (continuarBuscarDados) {
      // Busca os anos de Servico para setar no SectionList
      await buscarVisitaResidencia(idVisita, idCasa, idTerritorio, idPredio)
        .then((dados) => {
          // Trata o retorno
          if (dados) {
            // Seta o estado com todos as visitas da pessoa para o SectionList
            setHomeVisit(dados.visita);

            // Retira a mensagem de carregando
            setCarregando(false);
          } else {
            ToastAndroid.show(
              t(
                "screens.territorioresidenciaeditarvisita.visits_load_message_error"
              ),
              ToastAndroid.LONG
            );
          }
        })
        .catch((error) => {
          ToastAndroid.show(
            t(
              "screens.territorioresidenciaeditarvisita.visits_load_message_error"
            ),
            ToastAndroid.LONG
          );
        });
      // }
    };
    buscarDados();

    // return () => (continuarBuscarDados = false);
  }, []);

  return (
    <>
      <Header
        title={t("screens.territorioresidenciaeditarvisita.screen_name")}
        showGoBack
        showEditHomeVisit={homeVisit}
      />

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <VisitBox
          visitData={homeVisit as VisitDataType}
          onVisitChangeValues={(v) =>
            setHomeVisit(v as VisitCustomSearchHomeVisitIterface)
          }
        />
      )}
    </>
  );
}
