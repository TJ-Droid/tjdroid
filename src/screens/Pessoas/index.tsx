import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from "react";
import {
  Alert,
  PixelRatio,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";

import EmptyMessage from "../../components/EmptyMessage";
import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";

import buscarPessoas, {
  BuscarPessoasType,
  deletarPessoa,
} from "../../controllers/pessoasController";

import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";
import {
  Container,
  ItemList,
  ItemListMidleContent,
  ItemListMidleContentText,
  ItemListPerson,
  ItemListTextDateVisits,
  ItemListTextLastVisit,
  ItemListTextName,
  ItemListTextNoVisits,
  ItemListTopContent,
} from "./styles";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "Pessoas"
>;

interface Props extends ProfileScreenRouteProp {}

export default function Pessoas({ navigation }: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const [reload, setReload] = useState(false);
  const [allPessoasOrdenadas, setAllPessoasOrdenadas] = useState<
    BuscarPessoasType[]
  >([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    // let continuarBuscarDados = true;

    if (isFocused) {
      const buscarDados = async () => {
        // if (continuarBuscarDados) {
        // Busca os anos de Servico para setar no SectionList
        await buscarPessoas()
          .then((dados) => {
            // Trata o retorno
            if (dados) {
              // Seta o estado com todos os anos de servicos para o SectionList
              setAllPessoasOrdenadas(dados);
            } else {
              // Mensagem Toast
              ToastAndroid.show(
                t("screens.pessoas.person_load_message_error"),
                ToastAndroid.LONG,
              );
            }

            // Retira a mensagem de carregando
            setCarregando(false);
          })
          .catch((error) => {
            // Mensagem Toast
            ToastAndroid.show(
              t("screens.pessoas.person_load_message_error"),
              ToastAndroid.LONG,
            );
          });
        // }
      };
      buscarDados();
    }

    // return () => (continuarBuscarDados = false);
  }, [isFocused, reload]);

  // ALERTA de DELETAR PESSOA
  const alertaExclusaoPessoa = (idPessoa: string) => {
    Alert.alert(
      t("screens.pessoas.person_deleted_alert_title"),
      t("screens.pessoas.person_deleted_alert_message"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        { text: t("words.yes"), onPress: () => handleDeletarPessoa(idPessoa) },
      ],
      { cancelable: true },
    );
  };

  // DELETAR PESSOA
  function handleDeletarPessoa(personId: string) {
    deletarPessoa(personId)
      .then((dados) => {
        //Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.pessoas.person_deleted_message_success"),
            ToastAndroid.SHORT,
          );
          // Atualiza a lista de pessoas
          setReload(!reload);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.pessoas.person_deleted_message_error"),
            ToastAndroid.LONG,
          );
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("screens.pessoas.person_deleted_message_error"),
          ToastAndroid.LONG,
        );
      });
  }

  const Item = ({ item }: { item: BuscarPessoasType }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("PessoaVisitas", { idPessoa: item.id })
      }
      onLongPress={() => alertaExclusaoPessoa(item.id)}
    >
      <ItemList>
        <ItemListTopContent>
          <ItemListPerson>
            <ItemListTextName ellipsizeMode="tail" numberOfLines={1}>
              {item.nome}
            </ItemListTextName>
            {item.qtdVisitas === 0 ? (
              <View></View>
            ) : (
              <ItemListTextDateVisits>
                {item.ultimaVisitaData} • {item.qtdVisitas}{" "}
                {item.qtdVisitas >= 2 ? t("words.visits") : t("words.visit")}
              </ItemListTextDateVisits>
            )}
          </ItemListPerson>
          {item.qtdVisitas === 0 ? (
            <ItemListTextNoVisits
              adjustsFontSizeToFit
              numberOfLines={PixelRatio?.getFontScale() >= 1.2 ? 2 : 1}
              isLargeFont={PixelRatio?.getFontScale() >= 1.2}
            >
              {t("screens.pessoas.no_visits")}
            </ItemListTextNoVisits>
          ) : (
            <ItemListTextLastVisit
              adjustsFontSizeToFit
              numberOfLines={PixelRatio?.getFontScale() >= 1.2 ? 2 : 1}
              fontColor={item.visitaFontColor}
              isLargeFont={PixelRatio?.getFontScale() >= 1.2}
            >
              {item.ultimaVisita}
            </ItemListTextLastVisit>
          )}
        </ItemListTopContent>

        {item.ultimaAnotacao ? (
          <ItemListMidleContent>
            <ItemListMidleContentText>
              {item.ultimaAnotacao}
            </ItemListMidleContentText>
          </ItemListMidleContent>
        ) : null}
      </ItemList>
    </TouchableWithoutFeedback>
  );

  const EmptyListMessage = () => (
    <EmptyMessage
      title={t("screens.pessoas.screen_empty_title")}
      message={t("screens.pessoas.screen_empty_message")}
    />
  );

  return (
    <Container>
      <Header
        title={t("screens.pessoas.screen_name")}
        showGoBackHome
        showAddNewPerson
      />

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <FlashList
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 50 }}
          data={allPessoasOrdenadas}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </Container>
  );
}
