import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import EmptyMessage from "../../components/EmptyMessage";
import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";

import buscarTerritorios, {
  CustomTerritoriesType,
  deletarTerritorio,
} from "../../controllers/territoriosController";

import { StackScreenProps } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";
import { RootStackParamListType } from "../../routes";
import {
  Container,
  DateIconContainer,
  ItemList,
  ItemListTerritory,
  ItemListTerritoryTextName,
  ItemListTextDateSelected,
  ItemListTextDateWorked,
  StyledMaterialCommunityIconsDateIcon,
} from "./styles";

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
    let ativo = true;

    const buscarDados = async () => {
      try {
        const dados = await buscarTerritorios();
        if (!ativo) {
          return;
        }

        if (dados) {
          setAllTerritorios(dados);
        } else {
          ToastAndroid.show(
            t("screens.territorios.territory_load_message_error"),
            ToastAndroid.LONG
          );
        }
      } catch (error) {
        ToastAndroid.show(
          t("screens.territorios.territory_load_message_error"),
          ToastAndroid.LONG
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    if (isFocused) {
      setCarregando(true);
      buscarDados();
    }

    return () => {
      ativo = false;
    };
  }, [isFocused, reload]);

  // ALERTA de DELETAR TERRITÓRIO
  const alertaExclusaoTerritorio = (territorioId: string) => {
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
          onPress: () => handleDeletarTerritorio(territorioId),
        },
      ],
      { cancelable: true }
    );
  };

  // DELETAR TERRITÓRIO
  function handleDeletarTerritorio(territorioId: string) {
    deletarTerritorio(territorioId)
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
      onPress={() => navigation.navigate("TerritorioResidencias", item)}
      onLongPress={() => alertaExclusaoTerritorio(item.id)}
      delayLongPress={800}
    >
      <ItemList>
        <ItemListTerritory>
          <ItemListTerritoryTextName ellipsizeMode="tail" numberOfLines={2}>
            {item.nome}
          </ItemListTerritoryTextName>
        </ItemListTerritory>
        <View>
          <DateIconContainer>
            <ItemListTextDateSelected>
              {item.dataSelecionado}
            </ItemListTextDateSelected>
            <StyledMaterialCommunityIconsDateIcon
              name="calendar-clock"
              size={12}
            />
          </DateIconContainer>

          {item.dataTrabalhado !== "--" ? (
            <DateIconContainer>
              <ItemListTextDateWorked>
                {item.dataTrabalhado}
              </ItemListTextDateWorked>
              <StyledMaterialCommunityIconsDateIcon
                name="calendar-check"
                size={12}
              />
            </DateIconContainer>
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
        <FlashList
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 50 }}
          data={allTerritorios}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </Container>
  );
}
