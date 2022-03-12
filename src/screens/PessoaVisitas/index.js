import React, { useState } from "react";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Alert, ToastAndroid } from "react-native";
import {
  BorderlessButton,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import moment from "moment";
import "moment/locale/pt";
import { format } from "date-fns";
import { buscarAsyncStorageTjDroidIdioma, changeDateFormatToYearMonthDay } from "../../utils/utils";

import Header from "../../components/Header";
import DialogModal from "../../components/DialogModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";

import {
  excluirVisita,
  buscarVisitasPessoa,
  editarNomePessoa,
} from "../../controllers/pessoasController";

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

export default function PessoaVisitas({ route, navigation }) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  // Estado local para setar o idioma nos locais
  const [appLanguageLocal, setAppLanguageLocal] = useState("");
  
  // Dialog states
  const [reload, setReload] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [allVisitasPessoas, setAllVisitasPessoas] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Pega o ID da pessoa via props da rota
    const pessoaId = route.params.pessoaId;

    // Mostra a mensagem de carregando
    setCarregando(true);

    // Estado que mostra se ainda é para continuar buscando os dados da tela
    let continuarBuscarDados = true;

    // Se o aplicativo estiver com o foco nessa tela, faz isso
    if (isFocused) {
      const buscarDados = async () => {
        if (continuarBuscarDados) {
          // Busca os anos de Servico no Controller para setar no SectionList
          await buscarVisitasPessoa(pessoaId)
            .then((dados) => {
              // Trata o retorno
              if (dados) {
                // Seta o estado com todos as visitas da pessoa para o SectionList
                setAllVisitasPessoas(dados);

                // Retira a mensagem de carregando
                // setCarregando(false);
              } else {
                // Retira a mensagem de carregando
                // setCarregando(false);

                // Se der errado, dispara o toast
                ToastAndroid.show(
                  t("screens.pessoasvisitas.visits_load_error_message"),
                  ToastAndroid.LONG
                );
              }
            })
            .catch((error) => {
              // Se der errado, dispara o toast
              ToastAndroid.show(
                t("screens.pessoasvisitas.visits_load_error_message"),
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
    }
    getAppLanguage();
    
    // Quando sair da tela, para de buscar
    return () => {
      continuarBuscarDados = false;
      setAppLanguageLocal("");
    };
  }, [isFocused, reload]);

  // Abrir dialod do nome
  function handleOpenDialog(showDialogBoolean) {
    setDialogVisible(showDialogBoolean);
  }

  // Fechar dialod do nome
  function handleCancelDialog() {
    setDialogVisible(false);
  }

  // ALERTA de DELETAR VISITA PESSOA
  const alertaDeletarVisitaPessoa = ({ idPessoa, idVisita }) =>
    Alert.alert(
      t("screens.pessoasvisitas.visit_deleted_alert_title"),
      t("screens.pessoasvisitas.visit_deleted_alert_message"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () => handleDeletarVisitaPessoa(idPessoa, idVisita),
        },
      ],
      { cancelable: true }
    );

  // DELETAR VISITA PESSOA
  function handleChangePersonName(pessoaNome, pessoaId) {
    editarNomePessoa(pessoaNome, pessoaId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.pessoasvisitas.person_name_changed_success"),
            ToastAndroid.SHORT
          );

          // Oculta o dialogModal
          setDialogVisible(false);

          // Altera o nome no objeto no estado atual
          setAllVisitasPessoas({ ...allVisitasPessoas, nome: pessoaNome });
        } else {
          // Se der errado, dispara o toast
          ToastAndroid.show(
            t("screens.pessoasvisitas.person_name_changed_error"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        // Se der errado, dispara o toast
        ToastAndroid.show(
          t("screens.pessoasvisitas.person_name_changed_error"),
          ToastAndroid.LONG
        );
      });
  }

  // DELETAR VISITA PESSOA
  function handleDeletarVisitaPessoa(idPessoa, idVisita) {
    excluirVisita(idPessoa, idVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.pessoasvisitas.visit_deleted_message_success"),
            ToastAndroid.SHORT
          );
          // Faz reaload da página
          setReload(!reload);
        } else {
          // Se der errado, dispara o toast
          ToastAndroid.show(
            t("screens.pessoasvisitas.visit_deleted_message_error"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("screens.pessoasvisitas.visit_deleted_message_error"),
          ToastAndroid.LONG
        );
      });
  }

  const Item = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("PessoaEditarVisita", {
          idVisita: item.id,
          idPessoa: allVisitasPessoas.id,
        })
      }
      onLongPress={() =>
        alertaDeletarVisitaPessoa({
          idVisita: item.id,
          idPessoa: allVisitasPessoas.id,
        })
      }
    >
      <ItemList>
        <ItemListDay>
          <ItemListTextDay tail numberOfLines={1}>
            {format(changeDateFormatToYearMonthDay(item.data), "dd/MM/yyyy")}
          </ItemListTextDay>
          <ItemListTextDayInfo tail numberOfLines={1}>
            {moment(changeDateFormatToYearMonthDay(item.data))
              .locale(appLanguageLocal?.language)
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
      title={t("screens.pessoasvisitas.screen_empty_title")}
      message={t("screens.pessoasvisitas.screen_empty_message")}
    />
  );

  return (
    <Container>
      <Header
        title={t("screens.pessoasvisitas.screen_name")}
        showGoBackPersons
        showDeletePerson={{ personId: allVisitasPessoas.id }}
        showAddPersonVisit={{ personId: allVisitasPessoas.id }}
      />

      <DialogModal
        dialogVisibleProp={dialogVisible}
        dialogValue={allVisitasPessoas.nome}
        dialogTitle={t("screens.pessoasvisitas.alert_change_person_name_title")}
        dialogMessage={t(
          "screens.pessoasvisitas.alert_change_person_name_message"
        )}
        dialogFunction={(personName) =>
          handleChangePersonName(personName, allVisitasPessoas.id)
        }
        dialogCloseFunction={() => handleCancelDialog()}
      />

      <HeaderBoxPersonName>
        <HeaderPersonName>{allVisitasPessoas.nome}</HeaderPersonName>
        <BorderlessButton
          onPress={() => handleOpenDialog(true, allVisitasPessoas.nome)}
        >
          <HeaderPersonNameIcon name="edit-2" size={22} />
        </BorderlessButton>
      </HeaderBoxPersonName>

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          style={{ width: "100%", paddingBottom: 150 }}
          data={allVisitasPessoas.visitas}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </Container>
  );
}
