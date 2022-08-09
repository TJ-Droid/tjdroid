import React, { useEffect, useState } from "react";
import { SectionList, ToastAndroid, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import { StackScreenProps } from "@react-navigation/stack";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";

import { RootStackParamListType } from "../../routes";

import buscarAnosServico, {
  deletarRelatorioMes,
  MonthTotalsType,
  SectionHeadersType,
} from "../../controllers/relatoriosController";

import {
  Container,
  ItemList,
  ItemListMonthHour,
  ItemListTextMonth,
  ItemListTextHour,
  HeaderItemList,
  HeaderItemListText,
} from "./styles";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "Relatorios"
>;

interface Props extends ProfileScreenRouteProp {
  // route: ProfileScreenRouteProp;
}
export default function Relatorios({ navigation }: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const [reload, setReload] = useState(false);
  const [allAnosServicosOrdenados, setAllAnosServicosOrdenados] = useState<
    SectionHeadersType[]
  >([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);

    // let continuarBuscarDados = true;

    if (isFocused) {
      const buscarDados = async () => {
        // if (continuarBuscarDados) {
        // Busca os anos de Servico para setar no SectionList
        await buscarAnosServico()
          .then((dados) => {
            // Trata o retorno
            if (dados) {
              // Seta o estado com todos os anos de servicos para o SectionList
              setAllAnosServicosOrdenados(dados);
            } else {
              // Mensagem Toast
              ToastAndroid.show(
                t("screens.relatorios.reports_load_message_error"),
                ToastAndroid.SHORT
              );
            }

            // Retira a mensagem de carregando
            setCarregando(false);
          })
          .catch((error) => {
            // Mensagem Toast
            ToastAndroid.show(
              t("screens.relatorios.reports_load_message_error"),
              ToastAndroid.SHORT
            );
          });
        // }
      };
      buscarDados();
    }

    // return () => (continuarBuscarDados = false);
  }, [isFocused, reload]);

  // ALERTA de DELETAR RELATÓRIO do MÊS
  const alertaExclusaoRelatorioMes = (mes: string, mesFormatado: string) =>
    Alert.alert(
      t("screens.relatoriomes.alert_month_report_deleted_title", {
        mesFormatado,
      }),
      t("screens.relatoriomes.alert_month_report_deleted_message", {
        mesFormatado,
      }),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        { text: t("words.yes"), onPress: () => handleDeletarRelatorioMes(mes) },
      ],
      { cancelable: true }
    );

  // DELETAR RELATÓRIO do MÊS
  function handleDeletarRelatorioMes(mes: string) {
    deletarRelatorioMes(mes)
      .then((dados) => {
        // Trata o retorno
        if (dados === 1) {
          // Sucesso
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.relatoriomes.month_report_deleted_message_success"),
            ToastAndroid.LONG
          );
          // Faz o reload da página
          setReload(!reload);
        } else if (dados === 2) {
          // Erro ao tentar excluir o mês atual
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.relatoriomes.actual_month_report_delete_message_error"),
            ToastAndroid.LONG
          );
        } else {
          ToastAndroid.show(
            t("screens.relatoriomes.month_report_deleted_message_error"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("screens.relatoriomes.month_report_deleted_message_error"),
          ToastAndroid.LONG
        );
      });
  }

  const HeaderItem = ({ section }: { section: { title: string } }) => (
    <HeaderItemList>
      <HeaderItemListText numberOfLines={1} adjustsFontSizeToFit>
        {section.title}
      </HeaderItemListText>
    </HeaderItemList>
  );

  const Item = ({ item }: { item: MonthTotalsType }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("RelatorioMes", {
          mesAno: item.mes,
          mesAnoFormatado: item.mes_formatado,
        });
      }}
      onLongPress={() =>
        alertaExclusaoRelatorioMes(item.mes, item.mes_formatado.toUpperCase())
      }
      delayLongPress={1200} // 1.2 seconds
    >
      <ItemList>
        <ItemListMonthHour>
          <ItemListTextMonth>{item.mes_formatado}</ItemListTextMonth>
          <ItemListTextHour>{item.minutos_formatados}</ItemListTextHour>
        </ItemListMonthHour>
      </ItemList>
    </TouchableWithoutFeedback>
  );

  const EmptyListMessage = () => (
    <EmptyMessage
      title={t("screens.relatorios.screen_empty_title")}
      message={t("screens.relatorios.screen_empty_message")}
    />
  );

  return (
    <>
      {carregando ? (
        <LoadingSpinner />
      ) : (
        <Container>
          <SectionList
            style={{ width: "100%" }}
            sections={allAnosServicosOrdenados}
            renderSectionHeader={HeaderItem}
            renderItem={Item}
            ListEmptyComponent={EmptyListMessage}
            keyExtractor={(_, index) => index.toString()}
            stickySectionHeadersEnabled
          />
        </Container>
      )}
    </>
  );
}
