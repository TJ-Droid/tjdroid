import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  View,
  Alert,
  ToastAndroid,
  Text,
  Dimensions,
  Pressable,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";

import {
  buscarTerritoriosResidencias,
  deletarResidenciaTerritorio,
  TerritoryHomesInterface,
} from "../../controllers/territoriosController";

import {
  Container,
  ItemList,
  ItemListTerritory,
  ItemListTerritoryColor,
  ItemListTerritoryTitle,
  ItemListTerritoryQuantityVisits,
  ItemListTerritoryQuantityZeroVisits,
  ItemListTerritoryDescription,
  ItemListTerritoryTextBold,
  TerritoryBoxText,
} from "./styles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";
import { TerritoryDispositionType } from "../../types/Territories";

// Número de linhas
const NUM_COLUMNS = 6;

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "TerritorioResidencias"
>;

interface Props extends ProfileScreenRouteProp {}

export default function TerritorioResidencias({ route, navigation }: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  // Pega os dados do territorio
  const { id, nome, ordenacao, disposicao } = route.params;

  const [territoryName, setTerritoryName] = useState("");
  const [territoryId, setTerritoryId] = useState("");

  const [visualDisposition, setVisualDisposition] = useState(disposicao);
  const [reload, setReload] = useState(false);
  const [allTerritoriosResidencias, setAllTerritoriosResidencias] = useState<
    TerritoryHomesInterface[]
  >([]);
  const [carregando, setCarregando] = useState(true);

  async function buscarDados() {
    // Busca os anos de Servico para setar no SectionList
    await buscarTerritoriosResidencias(id, ordenacao)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Seta o estado com todos as casas do território para o SectionList
          setAllTerritoriosResidencias(dados);

          // Retira a mensagem de carregando
          setCarregando(false);
        } else {
          // Retira a mensagem de carregando
          setCarregando(false);

          // Mensagem Toast
          ToastAndroid.show(
            t("screens.territorioresidencias.homes_load_message_error"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((error) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("screens.territorioresidencias.homes_load_message_error"),
          ToastAndroid.LONG
        );
      });
  }

  // On component mount
  useEffect(() => {
    if (isFocused) {
      setCarregando(true);

      // Seta a disposicao dos itens
      setVisualDisposition(visualDisposition);

      // Seta o nome do territorio
      setTerritoryName(nome);
      setTerritoryId(id);

      // Busca os territórios
      buscarDados();
    }
  }, [isFocused, reload]);

  // ALERTA de DELETAR TERRITÓRIO
  const alertaExclusaoResidencia = ({
    residenciaId,
    residenciaNome,
  }: {
    residenciaId: string;
    residenciaNome: string;
  }) => {
    Alert.alert(
      t("screens.territorioresidencias.alert_home_deleted_title"),
      t("screens.territorioresidencias.alert_home_deleted_message", {
        residenciaNome,
      }),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () => handleDeletarResidencia(residenciaId),
        },
      ],
      { cancelable: true }
    );
  };

  // DELETAR TERRITÓRIO
  function handleDeletarResidencia(residenciaId: string) {
    deletarResidenciaTerritorio(residenciaId, territoryId)
      .then((dados) => {
        //Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.territorioresidencias.home_deleted_message_success"),
            ToastAndroid.SHORT
          );
          // Atualiza a lista
          setReload(!reload);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.territorioresidencias.home_deleted_message_error"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("screens.territorioresidencias.home_deleted_message_error"),
          ToastAndroid.LONG
        );
      });
  }

  // Função que altera a disposição dos itens na tela
  function handleChangeVisualDisposition(
    newDisposition: TerritoryDispositionType
  ) {
    setVisualDisposition(newDisposition);
  }
  // Função que altera o nome do territorio na tela
  function handleChangeTerritoryName(newTerritoryName: string) {
    setTerritoryName(newTerritoryName);
  }

  // ITEM PARA A DISPOSIÇÃO VISUAL DE LINHAS
  const Item = ({ item }: { item: TerritoryHomesInterface }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("TerritorioResidenciasVisitas", {
          residenciaId: item.id,
          territoryId: territoryId,
        })
      }
      onLongPress={() =>
        alertaExclusaoResidencia({
          residenciaId: item.id,
          residenciaNome: item.titulo,
        })
      }
      delayLongPress={800}
    >
      <View style={{ flexDirection: "row", marginBottom: 0.8 }}>
        <ItemListTerritoryColor bgColor={item.corVisita} />
        <ItemList>
          <ItemListTerritory>
            <ItemListTerritoryTitle ellipsizeMode="tail" numberOfLines={2}>
              {item.titulo}
            </ItemListTerritoryTitle>

            {item.qtdVisitas !== 0 ? (
              <ItemListTerritoryQuantityVisits>
                {item.qtdVisitas === 1
                  ? `${item.qtdVisitas} ${t("words.visit")}`
                  : `${item.qtdVisitas} ${t("words.visits")}`}
              </ItemListTerritoryQuantityVisits>
            ) : (
              <ItemListTerritoryQuantityZeroVisits>
                {t("screens.territorioresidencias.no_visits")}
              </ItemListTerritoryQuantityZeroVisits>
            )}
          </ItemListTerritory>

          {item.qtdVisitas !== 0 ? (
            <ItemListTerritoryDescription
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              <ItemListTerritoryTextBold>{`${item.descData}`}</ItemListTerritoryTextBold>

              {item.descNome !== "" ? (
                item.descAnotacoes !== "" ? (
                  <ItemListTerritoryTextBold>{` • ${item.descNome} • `}</ItemListTerritoryTextBold>
                ) : (
                  <ItemListTerritoryTextBold>{` • ${item.descNome}`}</ItemListTerritoryTextBold>
                )
              ) : (
                item.descAnotacoes !== "" && " • "
              )}
              <Text>{`${item.descAnotacoes}`}</Text>
            </ItemListTerritoryDescription>
          ) : item.descNome !== "" ? (
            <>
              <ItemListTerritoryDescription
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                <ItemListTerritoryTextBold>
                  {item.descNome}
                </ItemListTerritoryTextBold>
              </ItemListTerritoryDescription>
            </>
          ) : (
            <></>
          )}
        </ItemList>
      </View>
    </TouchableWithoutFeedback>
  );

  // ITEM PARA A DISPOSIÇÃO VISUAL DE CAIXAS
  const ItemBox = ({ item }: { item: TerritoryHomesInterface }) => {
    return (
      <View
        style={{
          backgroundColor: item.corVisita,
          flex: 1,
          margin: 3,
          height: Dimensions.get("window").width / NUM_COLUMNS - 8,
          borderRadius: 7,
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("TerritorioResidenciasVisitas", {
              residenciaId: item.id,
              territoryId: territoryId,
            })
          }
          onLongPress={() =>
            alertaExclusaoResidencia({
              residenciaId: item.id,
              residenciaNome: item.titulo.toString().substring(0, 3),
            })
          }
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            width: "100%",
          }}
        >
          <TerritoryBoxText adjustsFontSizeToFit numberOfLines={1}>
            {item.titulo.toString().substring(0, 3)}
          </TerritoryBoxText>
        </Pressable>
      </View>
    );
  };

  const EmptyListMessage = () => (
    <EmptyMessage
      title={t("screens.territorioresidencias.screen_empty_title")}
      message={t("screens.territorioresidencias.screen_empty_message")}
    />
  );

  return (
    <Container>
      <Header
        title={territoryName}
        showGoBack
        showOptionAddNewResidences
        showTerritoryMenu
        territoryData={{ nome: territoryName, territoryId: id }}
        showChangeDisposition={{ visualDisposition, id }}
        showChangeDispositionFunc={(r) => handleChangeVisualDisposition(r)}
        handleChangeTerritoryNameFunc={(r) => handleChangeTerritoryName(r)}
      />
      {carregando ? (
        <LoadingSpinner />
      ) : visualDisposition !== "caixas" ? (
        <FlatList
          style={{ width: "100%" }}
          data={allTerritoriosResidencias}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          key={"_"}
          keyExtractor={(_, index) => "_" + index}
        />
      ) : (
        <FlatList
          style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          data={allTerritoriosResidencias}
          renderItem={ItemBox}
          ListEmptyComponent={EmptyListMessage}
          key={"#"}
          keyExtractor={(_, index) => "#" + index}
          numColumns={NUM_COLUMNS}
        />
      )}
    </Container>
  );
}
