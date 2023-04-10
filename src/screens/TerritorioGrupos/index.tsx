import React, { useState, useEffect, useRef, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  View,
  Alert,
  ToastAndroid,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";

import {
  buscarTerritoriosGrupos,
  deletarResidenciaTerritorio,
  TerritoryCasaInterface,
  TerritoryGrupoInterface,
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
  "TerritorioGrupos"
>;

interface Props extends ProfileScreenRouteProp {}

export default function TerritorioGrupos({ route, navigation }: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const { width } = Dimensions.get("window");

  const refScrollViewGrupos = useRef<ScrollView>(null);

  // Pega os dados do territorio
  const { idTerritorio, nome, ordenacao, disposicao, swipeCurrentID } =
    route.params;

  const [territorioNome, setTerritorioNome] = useState("");
  const [idTerritorioState, setIdTerritorioState] = useState("");
  const [swipeCurrentIdState, setSwipeCurrentIdState] = useState(0);

  const [visualDisposition, setVisualDisposition] = useState(disposicao);
  const [reload, setReload] = useState(false);
  const [allTerritorioGrupos, setAllTerritorioGrupos] = useState<
    TerritoryGrupoInterface[]
  >([]);
  const [carregando, setCarregando] = useState(true);

  const goToScrollSwipeIndex = useCallback(() => {
    if (swipeCurrentIdState > 0) {
      refScrollViewGrupos.current?.scrollTo({
        x: width * swipeCurrentIdState,
        // animated: true,
      });
    } else if (swipeCurrentID) {
      refScrollViewGrupos.current?.scrollTo({
        x: width * swipeCurrentID,
        // animated: true,
      });
    }
  }, [swipeCurrentID, swipeCurrentIdState]);

  async function buscarDados() {
    // Busca os anos de Servico para setar no SectionList
    await buscarTerritoriosGrupos(idTerritorio, ordenacao)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Seta o estado com todos as casas do território para o SectionList
          setAllTerritorioGrupos(dados);

          // Retira a mensagem de carregando
          setCarregando(false);

          // Navega até a tela da ação
          goToScrollSwipeIndex();
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
      setTerritorioNome(nome);
      setIdTerritorioState(idTerritorio);

      // Seta o index para 0
      // setSwipeCurrentIdState(0);
      // goToScrollSwipeIndex();

      // Busca os territórios
      buscarDados();
    }
  }, [isFocused, reload]);

  // ALERTA de DELETAR TERRITÓRIO
  const alertaExclusaoResidencia = ({
    idCasa,
    residenciaNome,
  }: {
    idCasa: string;
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
          onPress: () =>
            handleDeletarResidencia(
              idCasa,
              allTerritorioGrupos[swipeCurrentIdState]?.idPredio
            ),
        },
      ],
      { cancelable: true }
    );
  };

  // DELETAR TERRITÓRIO
  function handleDeletarResidencia(idCasa: string, idPredio: string) {
    deletarResidenciaTerritorio(idCasa, idTerritorioState, idPredio)
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
    setTerritorioNome(newTerritoryName);
  }

  // ITEM PARA A DISPOSIÇÃO VISUAL DE LINHAS
  const Item = ({ item }: { item: TerritoryCasaInterface }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("TerritorioResidenciasVisitas", {
          idCasa: item.idCasa,
          idTerritorio: idTerritorioState,
          idPredio: allTerritorioGrupos[swipeCurrentIdState]?.idPredio,
        })
      }
      onLongPress={() =>
        alertaExclusaoResidencia({
          idCasa: item.idCasa,
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
  const ItemBox = ({ item }: { item: TerritoryCasaInterface }) => {
    return (
      <View
        style={{
          backgroundColor: item.corVisita,
          flex: 1,
          margin: 3,
          height: width / NUM_COLUMNS - 8,
          borderRadius: 7,
        }}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("TerritorioResidenciasVisitas", {
              idCasa: item.idCasa,
              idTerritorio: idTerritorioState,
              idPredio: allTerritorioGrupos[swipeCurrentIdState]?.idPredio,
            })
          }
          onLongPress={() =>
            alertaExclusaoResidencia({
              idCasa: item.idCasa,
              residenciaNome: item.titulo.toString().substring(0, 3),
            })
          }
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            width: "100%",
            padding: 2,
          }}
        >
          <TerritoryBoxText adjustsFontSizeToFit numberOfLines={1}>
            {item.titulo.toString()}
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

  const handleGetSwipeCurrentID = (event: any) => {
    setSwipeCurrentIdState(
      parseInt(`${event.nativeEvent.contentOffset.x / (width - 10)}`)
    );
  };

  return (
    <Container>
      <Header
        title={territorioNome}
        showGoBack
        showOptionAddNovaCasa
        showTerritoryMenu
        territoryData={{
          nome: territorioNome,
          idTerritorio: idTerritorio,
          idPredio:
            allTerritorioGrupos.length === swipeCurrentIdState
              ? "novo"
              : allTerritorioGrupos[swipeCurrentIdState]?.idPredio,
          swipeCurrentID: swipeCurrentIdState,
        }}
        showChangeDisposition={{
          visualDisposition,
          idTerritorio: idTerritorio,
        }}
        showChangeDispositionFunc={(r) => handleChangeVisualDisposition(r)}
        handleChangeTerritoryNameFunc={(r) => handleChangeTerritoryName(r)}
      />
      {carregando ? (
        <LoadingSpinner />
      ) : (
        <ScrollView
          ref={refScrollViewGrupos}
          horizontal
          decelerationRate={0}
          snapToInterval={width} //your element width
          snapToAlignment="center"
          style={{
            height: "100%",
          }}
          onMomentumScrollEnd={handleGetSwipeCurrentID}
          scrollEventThrottle={16}
        >
          {allTerritorioGrupos.map((predio, index) => (
            <View
              key={predio.idPredio}
              style={{
                width:
                  allTerritorioGrupos.length - 1 === index ? width - 10 : width,
                zIndex: 0,
                backgroundColor: "#ffffff",
              }}
            >
              {visualDisposition !== "caixas" ? (
                <FlatList
                  style={{
                    width: "100%",
                  }}
                  contentContainerStyle={
                    predio.casas.length === 0
                      ? {
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }
                      : {}
                  }
                  data={predio.casas}
                  renderItem={Item}
                  ListEmptyComponent={EmptyListMessage}
                  key={"_"}
                  keyExtractor={(_, index) => "_" + index}
                />
              ) : (
                <FlatList
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                  }}
                  contentContainerStyle={
                    predio.casas.length === 0
                      ? {
                          paddingBottom: 20,
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }
                      : {
                          paddingBottom: 20,
                        }
                  }
                  data={predio.casas}
                  renderItem={ItemBox}
                  ListEmptyComponent={EmptyListMessage}
                  key={"#"}
                  keyExtractor={(_, index) => "#" + index}
                  numColumns={NUM_COLUMNS}
                />
              )}
            </View>
          ))}
          <View
            style={{
              width: width,
              elevation: 10,
              shadowColor: "#000000",
              backgroundColor: "#ffffff",
              zIndex: 1,
              borderLeftWidth: 1,
              borderLeftColor: "#b3b3b3",
            }}
          >
            <EmptyListMessage />
          </View>
        </ScrollView>
      )}
    </Container>
  );
}
