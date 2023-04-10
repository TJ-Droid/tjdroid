import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Alert, ToastAndroid } from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";

import buscarPessoas, {
  BuscarPessoasType,
  deletarPessoa,
} from "../../controllers/pessoasController";

import {
  Container,
  ItemList,
  ItemListPerson,
  ItemListTextName,
  ItemListTextDateVisits,
  ItemListTextLastVisit,
  ItemListTextNoVisits,
} from "./styles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";

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
                ToastAndroid.LONG
              );
            }

            // Retira a mensagem de carregando
            setCarregando(false);
          })
          .catch((error) => {
            // Mensagem Toast
            ToastAndroid.show(
              t("screens.pessoas.person_load_message_error"),
              ToastAndroid.LONG
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
      { cancelable: true }
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
            ToastAndroid.SHORT
          );
          // Atualiza a lista de pessoas
          setReload(!reload);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.pessoas.person_deleted_message_error"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("screens.pessoas.person_deleted_message_error"),
          ToastAndroid.LONG
        );
      });
  }

  const Item = ({ item }: { item: BuscarPessoasType }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("PessoaVisitas", { idPessoa: item.idPessoa })
      }
      onLongPress={() => alertaExclusaoPessoa(item.idPessoa)}
    >
      <ItemList>
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
          <ItemListTextNoVisits>
            {t("screens.pessoas.no_visits")}
          </ItemListTextNoVisits>
        ) : (
          <ItemListTextLastVisit fontColor={item.visitaFontColor}>
            {item.ultimaVisita}
          </ItemListTextLastVisit>
        )}
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
        <FlatList
          style={{ width: "100%" }}
          data={allPessoasOrdenadas}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          keyExtractor={(item) => item.idPessoa.toString()}
        />
      )}
    </Container>
  );
}
