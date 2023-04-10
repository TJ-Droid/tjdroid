import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Alert, ToastAndroid, TouchableOpacity } from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import {
  buscarAsyncStorageTjDroidIdioma,
  formatarLocale,
} from "../../utils/utils";

import moment from "moment/min/moment-with-locales";

import Header from "../../components/Header";
import DialogModal from "../../components/DialogModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";

import {
  buscarResidenciasVisitas,
  CustomSearchHomeVisitsIterface,
  CustomSearchVisitType,
  editarNomeCasa,
  excluirVisitaCasa,
} from "../../controllers/territoriosController";

import {
  Container,
  ItemList,
  ItemListDay,
  ItemListTextDay,
  ItemListTextDayInfo,
  ItemListTextLastVisit,
  HeaderBoxPersonName,
  HeaderPersonName,
  HeaderPersonNameIcon,
} from "./styles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";
import { AppLanguages } from "../../types/Languages";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "TerritorioResidenciasVisitas"
>;

interface Props extends ProfileScreenRouteProp {}

export default function TerritorioResidenciasVisitas({
  route,
  navigation,
}: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  // Estado local para setar o idioma nos locais
  const [appLanguageLocal, setAppLanguageLocal] = useState<{
    language: AppLanguages | undefined;
  }>({ language: undefined });

  // Dialog states
  const [reload, setReload] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [allVisitasResidencia, setAllVisitasResidencia] =
    useState<CustomSearchHomeVisitsIterface>(
      {} as CustomSearchHomeVisitsIterface
    );
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Pega o ID via props da rota
    const { idCasa, idTerritorio, idPredio } = route.params;

    // Mostra a mensagem de carregando
    setCarregando(true);

    // Estado que mostra se ainda é para continuar buscando os dados da tela
    let continuarBuscarDados = true;

    // Se o aplicativo estiver com o foco nessa tela, faz isso
    if (isFocused) {
      const buscarDados = async () => {
        if (continuarBuscarDados) {
          // Busca os anos de Servico no Controller para setar no SectionList
          await buscarResidenciasVisitas(idCasa, idTerritorio, idPredio)
            .then((dados) => {
              // Trata o retorno
              if (dados) {
                // Seta o estado com todos as visitas da pessoa para o SectionList
                setAllVisitasResidencia(dados);

                // Retira a mensagem de carregando
                // setCarregando(false);
              } else {
                // Retira a mensagem de carregando
                // setCarregando(false);

                // Se der errado, dispara o toast
                ToastAndroid.show(
                  t(
                    "screens.territorioresidenciasvisitas.visits_load_message_error"
                  ),
                  ToastAndroid.LONG
                );
              }
            })
            .catch((error) => {
              // Se der errado, dispara o toast
              ToastAndroid.show(
                t(
                  "screens.territorioresidenciasvisitas.visits_load_message_error"
                ),
                ToastAndroid.LONG
              );
            });
        }
      };
      buscarDados();
    }

    // Função para pegar o idioma do app
    const getAppLanguage = async () => {
      // Busca o idioma salvo no AsyncStorage
      setAppLanguageLocal(await buscarAsyncStorageTjDroidIdioma());
      setCarregando(false);
    };
    getAppLanguage();

    // Quando sair da tela, para de buscar
    return () => {
      continuarBuscarDados = false;
      setAppLanguageLocal({ language: undefined });
    };
  }, [isFocused, reload]);

  // Abrir dialod do nome
  function handleOpenDialog(showDialogBoolean: boolean) {
    setDialogVisible(showDialogBoolean);
  }

  // Fechar dialod do nome
  function handleCancelDialog() {
    setDialogVisible(false);
  }

  // Seta o novo nome da tela
  function handleChangeHomeIdentifier(newIdentifier: string) {
    setAllVisitasResidencia({ ...allVisitasResidencia, nome: newIdentifier });
  }

  // ALERTA de DELETAR VISITA
  const alertaDeletarVisitaCasa = ({
    idVisita,
    idCasa,
    idTerritorio,
    idPredio,
  }: {
    idVisita: string;
    idCasa: string;
    idTerritorio: string;
    idPredio: string;
  }) =>
    Alert.alert(
      t("screens.territorioresidenciasvisitas.alert_visit_deleted_title"),
      t("screens.territorioresidenciasvisitas.alert_visit_deleted_message"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () =>
            handleDeletarVisita(idVisita, idCasa, idTerritorio, idPredio),
        },
      ],
      { cancelable: true }
    );

  // EDITAR NOME CASA
  function handleChangeHomeName(
    casaNome: string,
    idCasa: string,
    idTerritorio: string,
    idPredio: string
  ) {
    editarNomeCasa(casaNome, idCasa, idTerritorio, idPredio)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t(
              "screens.territorioresidenciasvisitas.house_change_name_message_success"
            ),
            ToastAndroid.SHORT
          );

          // Oculta o dialogModal
          setDialogVisible(false);

          // Altera o nome no objeto no estado atual
          setAllVisitasResidencia({
            ...allVisitasResidencia,
            nomeMorador: casaNome,
          });
        } else {
          // Se der errado, dispara o toast
          ToastAndroid.show(
            t(
              "screens.territorioresidenciasvisitas.house_change_name_message_error"
            ),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        // Se der errado, dispara o toast
        ToastAndroid.show(
          t(
            "screens.territorioresidenciasvisitas.house_change_name_message_error"
          ),
          ToastAndroid.LONG
        );
      });
  }

  // DELETAR VISITA PESSOA
  function handleDeletarVisita(
    idVisita: string,
    idCasa: string,
    idTerritorio: string,
    idPredio: string
  ) {
    excluirVisitaCasa(idVisita, idCasa, idTerritorio, idPredio)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t(
              "screens.territorioresidenciasvisitas.visit_deleted_message_success"
            ),
            ToastAndroid.SHORT
          );
          // Faz reaload da página
          setReload(!reload);
        } else {
          // Se der errado, dispara o toast
          ToastAndroid.show(
            t(
              "screens.territorioresidenciasvisitas.visit_deleted_message_error"
            ),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("screens.territorioresidenciasvisitas.visit_deleted_message_error"),
          ToastAndroid.LONG
        );
      });
  }

  const Item = ({ item }: { item: CustomSearchVisitType }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("TerritorioResidenciaEditarVisita", {
          idVisita: item.idVisita,
          idCasa: allVisitasResidencia.idCasa,
          idTerritorio: allVisitasResidencia.idTerritorio,
          idPredio: allVisitasResidencia.idPredio,
        })
      }
      onLongPress={() =>
        alertaDeletarVisitaCasa({
          idVisita: item.idVisita,
          idCasa: allVisitasResidencia.idCasa,
          idTerritorio: allVisitasResidencia.idTerritorio,
          idPredio: allVisitasResidencia.idPredio,
        })
      }
    >
      <ItemList>
        <ItemListDay>
          <ItemListTextDay ellipsizeMode="tail" numberOfLines={1}>
            {moment(item.data)
              .locale(formatarLocale(appLanguageLocal?.language))
              .format("DD/MM/yy")}
          </ItemListTextDay>
          <ItemListTextDayInfo ellipsizeMode="tail" numberOfLines={1}>
            {moment(item.data)
              .locale(formatarLocale(appLanguageLocal?.language))
              .format("dddd, HH:mm")}
          </ItemListTextDayInfo>
        </ItemListDay>
        <ItemListTextLastVisit
          bgColor={item.visitaBgColor}
          fontColor={item.visitaFontColor}
        >
          {item.visita}
        </ItemListTextLastVisit>
      </ItemList>
    </TouchableWithoutFeedback>
  );

  const EmptyListMessage = () => (
    <EmptyMessage
      title={t("screens.territorioresidenciasvisitas.screen_empty_title")}
      message={t("screens.territorioresidenciasvisitas.screen_empty_message")}
    />
  );

  return (
    <Container>
      <Header
        title={allVisitasResidencia.nome}
        showGoBack
        showDeleteTerritoryHome={{
          idCasa: allVisitasResidencia.idCasa,
          idTerritorio: allVisitasResidencia.idTerritorio,
          idPredio: allVisitasResidencia.idPredio,
        }}
        showAddHomeVisit={{
          idCasa: allVisitasResidencia.idCasa,
          idTerritorio: allVisitasResidencia.idTerritorio,
          idPredio: allVisitasResidencia.idPredio,
        }}
        showEditHomeIdentifier={{
          idCasa: allVisitasResidencia.idCasa,
          idTerritorio: allVisitasResidencia.idTerritorio,
          idPredio: allVisitasResidencia.idPredio,
        }}
        territoryData={{
          nome: allVisitasResidencia.nome,
          idCasa: allVisitasResidencia.idCasa,
          idTerritorio: allVisitasResidencia.idTerritorio,
          idPredio: allVisitasResidencia.idPredio,
        }}
        handleChangeHomeIdentifierFunc={(r) => handleChangeHomeIdentifier(r)}
      />

      <DialogModal
        dialogVisibleProp={dialogVisible}
        dialogValue={`${allVisitasResidencia.nomeMorador}`}
        dialogTitle={t(
          "screens.territorioresidenciasvisitas.dialog_change_name_household_title"
        )}
        dialogMessage={t(
          "screens.territorioresidenciasvisitas.dialog_change_name_household_message"
        )}
        dialogFunction={(residenciaNome) =>
          handleChangeHomeName(
            residenciaNome,
            allVisitasResidencia.idCasa,
            allVisitasResidencia.idTerritorio,
            allVisitasResidencia.idPredio
          )
        }
        dialogCloseFunction={() => handleCancelDialog()}
      />

      <HeaderBoxPersonName>
        <HeaderPersonName>{allVisitasResidencia.nomeMorador}</HeaderPersonName>
        <TouchableOpacity onPress={() => handleOpenDialog(true)}>
          <HeaderPersonNameIcon name="edit-2" size={22} />
        </TouchableOpacity>
      </HeaderBoxPersonName>

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          style={{ width: "100%", paddingBottom: 150 }}
          data={allVisitasResidencia.visitas}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          keyExtractor={(item) => item.idVisita.toString()}
        />
      )}
    </Container>
  );
}
