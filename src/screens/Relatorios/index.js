import React, { useEffect, useState } from "react";
import { SectionList, ToastAndroid } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import buscarAnosServico from "../../controllers/relatoriosController";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";

import {
  Container,
  ItemList,
  ItemListMonthHour,
  ItemListTextMonth,
  ItemListTextHour,
  HeaderItemList,
  HeaderItemListText,
} from "./styles";

export default function Relatorios({ navigation }) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const [allAnosServicosOrdenados, setAllAnosServicosOrdenados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);

    let continuarBuscarDados = true;

    if (isFocused) {
      const buscarDados = async () => {
        if (continuarBuscarDados) {
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
        }
      };
      buscarDados();
    }

    return () => (continuarBuscarDados = false);
  }, [isFocused]);

  const HeaderItem = ({ section }) => (
    <HeaderItemList>
      <HeaderItemListText>{section.title}</HeaderItemListText>
    </HeaderItemList>
  );

  const Item = ({ item }) => (
    <RectButton
      onPress={() => {
        navigation.navigate("RelatorioMes", { mesAno: item.mes, mesAnoFormatado: item.mes_formatado });
      }}
    >
      <ItemList>
        <ItemListMonthHour>
          <ItemListTextMonth>{item.mes_formatado}</ItemListTextMonth>
          <ItemListTextHour>{item.minutos_formatados}</ItemListTextHour>
        </ItemListMonthHour>
      </ItemList>
    </RectButton>
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
