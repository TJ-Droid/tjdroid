import React, { useEffect, useState } from "react";

import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import {
  Alert,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { useTranslation } from "react-i18next";

import { format } from "date-fns";
import moment from "moment/min/moment-with-locales";
import {
  buscarAsyncStorageTjDroidIdioma,
  changeDateFormatToYearMonthDay,
  formatarLocale,
} from "../../utils/utils";

import DialogModal from "../../components/DialogModal";
import EmptyMessage from "../../components/EmptyMessage";
import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";

import {
  buscarVisitasPessoa,
  BuscarVisitasPessoaType,
  CustomVisitsType,
  editarNomePessoa,
  excluirVisita,
} from "../../controllers/pessoasController";

import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";
import { AppLanguages } from "../../types/Languages";
import {
  Container,
  HeaderBoxPersonName,
  HeaderPersonName,
  HeaderPersonNameIcon,
  ItemList,
  ItemListDay,
  ItemListTextDay,
  ItemListTextDayInfo,
  ItemListTextLastVisit,
} from "./styles";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "PessoaVisitas"
>;

interface Props extends ProfileScreenRouteProp {}

export default function PessoaVisitas({ route, navigation }: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  // Estado local para setar o idioma nos locais
  const [appLanguageLocal, setAppLanguageLocal] = useState<{
    language: AppLanguages | undefined;
  }>({ language: undefined });

  // Dialog states
  const [reload, setReload] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [allVisitasPessoas, setAllVisitasPessoas] =
    useState<BuscarVisitasPessoaType>({} as BuscarVisitasPessoaType);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Pega o ID da pessoa via props da rota
    const { idPessoa } = route.params;

    // Mostra a mensagem de carregando
    setCarregando(true);

    // Estado que mostra se ainda é para continuar buscando os dados da tela
    let continuarBuscarDados = true;

    // Se o aplicativo estiver com o foco nessa tela, faz isso
    if (isFocused) {
      const buscarDados = async () => {
        if (continuarBuscarDados) {
          // Busca os anos de Servico no Controller para setar no SectionList
          await buscarVisitasPessoa(idPessoa)
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

  // ALERTA de DELETAR VISITA PESSOA
  const alertaDeletarVisitaPessoa = ({
    idPessoa,
    idVisita,
  }: {
    idPessoa: string;
    idVisita: string;
  }) =>
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
  function handleChangePersonName(pessoaNome: string, idPessoa: string) {
    editarNomePessoa(pessoaNome, idPessoa)
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
  function handleDeletarVisitaPessoa(idPessoa: string, idVisita: string) {
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

  const Item = ({ item }: { item: CustomVisitsType }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("PessoaEditarVisita", {
          idVisita: item.id,
          idPessoa: allVisitasPessoas?.id,
        })
      }
      onLongPress={() =>
        alertaDeletarVisitaPessoa({
          idVisita: item.id,
          idPessoa: allVisitasPessoas?.id,
        })
      }
    >
      <ItemList>
        <ItemListDay>
          <ItemListTextDay ellipsizeMode="tail" numberOfLines={1}>
            {format(changeDateFormatToYearMonthDay(item.data), "dd/MM/yyyy")}
          </ItemListTextDay>
          <ItemListTextDayInfo ellipsizeMode="tail" numberOfLines={1}>
            {moment(changeDateFormatToYearMonthDay(item.data))
              .locale(formatarLocale(appLanguageLocal?.language))
              .format("dddd, HH:mm")}
          </ItemListTextDayInfo>
        </ItemListDay>
        <ItemListTextLastVisit
          bgColor={item.visitaBgColor}
          fontColor={item.visitaFontColor}
        >
          {item.visitaLabel}
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
        <TouchableOpacity onPress={() => handleOpenDialog(true)}>
          <HeaderPersonNameIcon name="edit-2" size={22} />
        </TouchableOpacity>
      </HeaderBoxPersonName>

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <FlashList
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 50 }}
          data={allVisitasPessoas.visitas}
          renderItem={Item}
          ListEmptyComponent={EmptyListMessage}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </Container>
  );
}
