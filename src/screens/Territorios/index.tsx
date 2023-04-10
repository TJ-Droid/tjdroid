import React, { useState, useEffect } from "react";
import { View, Alert, ToastAndroid } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";

import buscarTerritorios, {
  CustomTerritoriesType,
} from "../../controllers/territoriosController";
import { deletarTerritorio } from "../../controllers/territoriosController";

import {
  Container,
  ItemList,
  ItemListTerritory,
  ItemListTerritoryTextName,
  ItemListTextDateSelected,
  ItemListTextDateWorked,
} from "./styles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "Territorios"
>;

interface Props extends ProfileScreenRouteProp {}

export default function Territorios({ navigation }: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const [reload, setReload] = useState(false);
  const [allTerritorios, setAllTerritorios] = useState<CustomTerritoriesType[]>(
    []
  );
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    // let continuarBuscarDados = true;

    if (isFocused) {
      const buscarDados = async () => {
        // if (continuarBuscarDados) {
        // Busca os anos de Servico para setar no SectionList
        await buscarTerritorios()
          .then((dados) => {
            // Trata o retorno
            if (dados) {
              // Seta o estado com todos os territórios para o SectionList
              setAllTerritorios(dados);

              // Retira a mensagem de carregando
              setCarregando(false);
            } else {
              // Retira a mensagem de carregando
              setCarregando(false);

              // Mensagem Toast
              ToastAndroid.show(
                t("screens.territorios.territory_load_message_error"),
                ToastAndroid.LONG
              );
            }
          })
          .catch((error) => {
            // Mensagem Toast
            ToastAndroid.show(
              t("screens.territorios.territory_load_message_error"),
              ToastAndroid.LONG
            );
          });
        // }
      };
      buscarDados();
    }

    // return () => (continuarBuscarDados = false);
  }, [isFocused, reload]);

  // ALERTA de DELETAR TERRITÓRIO
  const alertaExclusaoTerritorio = (idTerritorio: string) => {
    Alert.alert(
      t("screens.territorios.alert_territory_deleted_title"),
      t("screens.territorios.alert_territory_deleted_message"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () => handleDeletarTerritorio(idTerritorio),
        },
      ],
      { cancelable: true }
    );
  };

  // DELETAR TERRITÓRIO
  function handleDeletarTerritorio(idTerritorio: string) {
    deletarTerritorio(idTerritorio)
      .then((dados) => {
        //Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.territorios.territory_deleted_message_success"),
            ToastAndroid.SHORT
          );
          // Atualiza a lista
          setReload(!reload);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.territorios.territory_deleted_message_error"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("screens.territorios.territory_deleted_message_error"),
          ToastAndroid.LONG
        );
      });
  }

  const Item = ({ item }: { item: CustomTerritoriesType }) => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("TerritorioGrupos", item)}
      onLongPress={() => alertaExclusaoTerritorio(item.idTerritorio)}
      delayLongPress={800}
    >
      <ItemList>
        <ItemListTerritory>
          <ItemListTerritoryTextName ellipsizeMode="tail" numberOfLines={2}>
            {item.nome}
          </ItemListTerritoryTextName>
        </ItemListTerritory>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <ItemListTextDateSelected>
            {item.dataSelecionado}
          </ItemListTextDateSelected>
          {item.dataTrabalhado !== "--" ? (
            <ItemListTextDateWorked>
              {item.dataTrabalhado}
            </ItemListTextDateWorked>
          ) : (
            <></>
          )}
        </View>
      </ItemList>
    </TouchableWithoutFeedback>
  );

  const EmptyListMessage = () => (
    <EmptyMessage
      title={t("screens.territorios.screen_empty_title")}
      message={t("screens.territorios.screen_empty_message")}
    />
  );

  return (
    <Container>
      <Header
        title={t("screens.territorios.screen_name")}
        showGoBackHome
        showAddNewTerritory
      />

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          style={{ width: "100%" }}
          data={allTerritorios}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          keyExtractor={(item) => item.idTerritorio.toString()}
        />
      )}
    </Container>
  );
}
