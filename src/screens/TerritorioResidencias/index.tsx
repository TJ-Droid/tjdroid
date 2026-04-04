import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import EmptyMessage from "../../components/EmptyMessage";
import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";

import {
  buscarTerritoriosResidencias,
  deletarResidenciaTerritorio,
  TerritoryFloorResidencesInterface,
  TerritoryHomesInterface,
} from "../../controllers/territoriosController";

import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";
import { TerritoryDispositionType } from "../../types/Territories";
import {
  Container,
  FloorInfoRow,
  FloorNavigationButton,
  FloorNavigationIcon,
  FloorTitleBadge,
  FloorTitleText,
  ItemList,
  ItemListTerritory,
  ItemListTerritoryColor,
  ItemListTerritoryDescription,
  ItemListTerritoryQuantityVisits,
  ItemListTerritoryQuantityZeroVisits,
  ItemListTerritoryTextBold,
  ItemListTerritoryTitle,
  TerritoryBoxText
} from "./styles";

const NUM_COLUMNS = 6;

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "TerritorioResidencias"
>;

type Props = ProfileScreenRouteProp;

export default function TerritorioResidencias({ route, navigation }: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const floorPagerRef = useRef<FlatList<TerritoryFloorResidencesInterface>>(null);

  const { id, nome, ordenacao, disposicao, andarIdSelecionado } = route.params;

  const [territoryName, setTerritoryName] = useState("");
  const [territoryId, setTerritoryId] = useState("");
  const [visualDisposition, setVisualDisposition] = useState(disposicao);
  const [reload, setReload] = useState(false);
  const [allFloors, setAllFloors] = useState<TerritoryFloorResidencesInterface[]>(
    [],
  );
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const selectedFloorIdRef = useRef(andarIdSelecionado ?? "");

  const screenWidth = Dimensions.get("window").width;

  const buscarDados = useCallback(async () => {
    await buscarTerritoriosResidencias(id, ordenacao)
      .then((dados) => {
        if (dados) {
          setAllFloors(dados.andares);

          const preferredFloorId =
            andarIdSelecionado ?? selectedFloorIdRef.current;
          const floorIndex = dados.andares.findIndex(
            (andar) => andar.id === preferredFloorId,
          );
          const nextIndex = floorIndex >= 0 ? floorIndex : 0;
          const nextFloorId = dados.andares[nextIndex]?.id ?? "";

          selectedFloorIdRef.current = nextFloorId;
          setCurrentFloorIndex(nextIndex);

          requestAnimationFrame(() => {
            floorPagerRef.current?.scrollToIndex({
              index: nextIndex,
              animated: false,
            });
          });

          setCarregando(false);
        } else {
          setCarregando(false);
          ToastAndroid.show(
            t("screens.territorioresidencias.homes_load_message_error"),
            ToastAndroid.LONG,
          );
        }
      })
      .catch(() => {
        setCarregando(false);
        ToastAndroid.show(
          t("screens.territorioresidencias.homes_load_message_error"),
          ToastAndroid.LONG,
        );
      });
  }, [andarIdSelecionado, id, ordenacao, t]);

  useEffect(() => {
    if (isFocused) {
      setCarregando(true);
      setVisualDisposition(disposicao);
      setTerritoryName(nome);
      setTerritoryId(id);
      buscarDados();
    }
  }, [buscarDados, disposicao, id, isFocused, nome, reload]);

  const currentFloor = useMemo(
    () => allFloors[currentFloorIndex] ?? allFloors[0],
    [allFloors, currentFloorIndex],
  );

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
      { cancelable: true },
    );
  };

  function handleDeletarResidencia(residenciaId: string) {
    deletarResidenciaTerritorio(residenciaId, territoryId)
      .then((dados) => {
        if (dados) {
          ToastAndroid.show(
            t("screens.territorioresidencias.home_deleted_message_success"),
            ToastAndroid.SHORT,
          );
          selectedFloorIdRef.current =
            dados.andarIdSelecionado ?? selectedFloorIdRef.current;
          setReload(!reload);
        } else {
          ToastAndroid.show(
            t("screens.territorioresidencias.home_deleted_message_error"),
            ToastAndroid.LONG,
          );
        }
      })
      .catch(() => {
        ToastAndroid.show(
          t("screens.territorioresidencias.home_deleted_message_error"),
          ToastAndroid.LONG,
        );
      });
  }

  function handleChangeVisualDisposition(
    newDisposition: TerritoryDispositionType,
  ) {
    setVisualDisposition(newDisposition);
  }

  function handleChangeTerritoryName(newTerritoryName: string) {
    setTerritoryName(newTerritoryName);
  }

  function handleFloorChange(nextIndex: number) {
    const floor = allFloors[nextIndex];

    if (!floor) {
      return;
    }

    setCurrentFloorIndex(nextIndex);
    selectedFloorIdRef.current = floor.id;
  }

  function scrollToFloor(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= allFloors.length) {
      return;
    }

    handleFloorChange(nextIndex);
    floorPagerRef.current?.scrollToOffset({
      offset: nextIndex * screenWidth,
      animated: true,
    });
  }

  const hasPreviousFloor = currentFloorIndex > 0;
  const hasNextFloor = currentFloorIndex < allFloors.length - 1;

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
            <ItemListTerritoryTitle
              ellipsizeMode="tail"
              numberOfLines={2}
              isLineThrough={item?.corVisita === "#c33f55"}
            >
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
            <ItemListTerritoryDescription
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              <ItemListTerritoryTextBold>{item.descNome}</ItemListTerritoryTextBold>
            </ItemListTerritoryDescription>
          ) : null}
        </ItemList>
      </View>
    </TouchableWithoutFeedback>
  );

  const ItemBox = ({ item }: { item: TerritoryHomesInterface }) => (
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
          {item.titulo.toString()}
        </TerritoryBoxText>
      </Pressable>
    </View>
  );

  const EmptyListMessage = () => (
    <EmptyMessage
      title={t("screens.territorioresidencias.screen_empty_title")}
      message={t("screens.territorioresidencias.screen_empty_message")}
    />
  );

  const renderFloorPage: ListRenderItem<TerritoryFloorResidencesInterface> = ({
    item,
  }) => (
    <View style={{ width: screenWidth, flex: 1 }}>
      {visualDisposition !== "caixas" ? (
        <FlashList
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 50 }}
          data={item.residencias}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          key={`list-${item.id}`}
          keyExtractor={(residencia) => residencia.id}
          fadingEdgeLength={12}
        />
      ) : (
        <FlashList
          style={{ flex: 1, paddingHorizontal: 12 }}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
          data={item.residencias}
          renderItem={ItemBox}
          ListEmptyComponent={EmptyListMessage}
          key={`grid-${item.id}`}
          keyExtractor={(residencia) => residencia.id}
          numColumns={NUM_COLUMNS}
          fadingEdgeLength={12}
        />
      )}
    </View>
  );

  return (
    <Container>
      <Header
        title={territoryName}
        showGoBack
        showOptionAddNewResidences
        showTerritoryMenu
        territoryData={{
          nome: territoryName,
          territoryId: id,
          andarId: currentFloor?.id,
          andarPosicao: currentFloor?.posicao,
          totalAndares: allFloors.length,
        }}
        showChangeDisposition={{ visualDisposition, id }}
        showChangeDispositionFunc={(r) => handleChangeVisualDisposition(r)}
        handleChangeTerritoryNameFunc={(r) => handleChangeTerritoryName(r)}
      />

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <>
          <FloorInfoRow>
            <FloorNavigationButton
              disabled={!hasPreviousFloor}
              onPress={() => scrollToFloor(currentFloorIndex - 1)}
            >
              <FloorNavigationIcon
                name="chevron-left"
                disabled={!hasPreviousFloor}
              />
            </FloorNavigationButton>

            <FloorTitleBadge>
              <FloorTitleText>
                {t("screens.territorioresidencias.floor_counter", {
                  current: currentFloorIndex + 1,
                  total: allFloors.length,
                })}
              </FloorTitleText>
            </FloorTitleBadge>

            <FloorNavigationButton
              disabled={!hasNextFloor}
              onPress={() => scrollToFloor(currentFloorIndex + 1)}
            >
              <FloorNavigationIcon
                name="chevron-right"
                disabled={!hasNextFloor}
              />
            </FloorNavigationButton>
          </FloorInfoRow>

          <FlatList
            ref={floorPagerRef}
            style={{ flex: 1 }}
            data={allFloors}
            renderItem={renderFloorPage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth,
              );
              handleFloorChange(nextIndex);
            }}
            onScrollToIndexFailed={() => {
              floorPagerRef.current?.scrollToOffset({
                offset: currentFloorIndex * screenWidth,
                animated: false,
              });
            }}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            extraData={visualDisposition}
          />
        </>
      )}
    </Container>
  );
}
