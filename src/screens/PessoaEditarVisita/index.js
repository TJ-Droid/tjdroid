import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastAndroid } from "react-native";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import { VisitBox } from "../../components/VisitBox";

import { buscarVisitaPessoa } from "../../controllers/pessoasController";

export default function PessoaEditarVisitaStyles({ route }) {

  const { t } = useTranslation();
  const [visitaPessoa, setVisitaPessoa] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { idVisita, idPessoa } = route.params;

    setCarregando(true);

    let continuarBuscarDados = true;

    const buscarDados = async () => {
      if (continuarBuscarDados) {
        // Busca os anos de Servico para setar no SectionList
        await buscarVisitaPessoa(idPessoa, idVisita)
          .then((dados) => {
            // Trata o retorno
            if (dados) {
              // Seta o estado com todos as visitas da pessoa para o SectionList
              setVisitaPessoa(dados.visita);

              // Retira a mensagem de carregando
              setCarregando(false);
            } else {
              ToastAndroid.show(
                t("screens.pessoaeditarvisita.visits_load_error_message"),
                ToastAndroid.LONG
              );
            }
          })
          .catch((error) => {
            ToastAndroid.show(
              t("screens.pessoaeditarvisita.visits_load_error_message"),
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
        title={t("screens.pessoaeditarvisita.screen_name")}
        showGoBack
        showEditPersonVisit={visitaPessoa}
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
