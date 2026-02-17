import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  SectionList,
  SectionListRenderItemInfo,
  ToastAndroid,
  TouchableWithoutFeedback,
} from "react-native";

import { StackScreenProps } from "@react-navigation/stack";
import EmptyMessage from "../../components/EmptyMessage";
import LoadingSpinner from "../../components/LoadingSpinner";

import { RootStackParamListType } from "../../routes";

import buscarAnosServico, {
  deletarRelatorioMes,
  MonthTotalsType,
  SectionHeadersType,
} from "../../controllers/relatoriosController";

import {
  Container,
  HeaderItemList,
  HeaderItemListText,
  ItemList,
  ItemListMonthHour,
  ItemListTextHour,
  ItemListTextMonth,
} from "./styles";

type ReportSectionHeaderProps = {
  title: string;
};

const ReportSectionHeader = React.memo(
  ({ title }: ReportSectionHeaderProps) => (
    <HeaderItemList>
      <HeaderItemListText numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </HeaderItemListText>
    </HeaderItemList>
  ),
  (prev, next) => prev.title === next.title,
);

ReportSectionHeader.displayName = "ReportSectionHeader";

type ReportListItemProps = {
  item: MonthTotalsType;
  onPress: (item: MonthTotalsType) => void;
  onLongPress: (item: MonthTotalsType) => void;
};

const ReportListItem = React.memo(
  ({ item, onPress, onLongPress }: ReportListItemProps) => (
    <TouchableWithoutFeedback
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      delayLongPress={1200} // 1.2 seconds
    >
      <ItemList>
        <ItemListMonthHour>
          <ItemListTextMonth adjustsFontSizeToFit numberOfLines={1}>
            {item.mes_formatado}
          </ItemListTextMonth>
          <ItemListTextHour>{item.minutos_formatados}</ItemListTextHour>
        </ItemListMonthHour>
      </ItemList>
    </TouchableWithoutFeedback>
  ),
  (prev, next) =>
    prev.item.mes === next.item.mes &&
    prev.item.minutos_formatados === next.item.minutos_formatados &&
    prev.onPress === next.onPress &&
    prev.onLongPress === next.onLongPress,
);

ReportListItem.displayName = "ReportListItem";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "Relatorios"
>;

interface Props extends ProfileScreenRouteProp {}

export default function Relatorios({ navigation }: Props) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const [reload, setReload] = useState(false);
  const [allAnosServicosOrdenados, setAllAnosServicosOrdenados] = useState<
    SectionHeadersType[]
  >([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let isActive = true;

    const carregarDados = async () => {
      try {
        const dados = await buscarAnosServico();
        if (!isActive) {
          return;
        }

        if (dados) {
          setAllAnosServicosOrdenados(dados);
        } else {
          setAllAnosServicosOrdenados([]);
          ToastAndroid.show(
            t("screens.relatorios.reports_load_message_error"),
            ToastAndroid.SHORT,
          );
        }
      } catch (error) {
        if (isActive) {
          setAllAnosServicosOrdenados([]);
          ToastAndroid.show(
            t("screens.relatorios.reports_load_message_error"),
            ToastAndroid.SHORT,
          );
        }
      } finally {
        if (isActive) {
          setCarregando(false);
        }
      }
    };

    if (isFocused) {
      setCarregando(true);
      setTimeout(() => {
        carregarDados();
      }, 100);
    } else {
      setCarregando(false);
    }

    return () => {
      isActive = false;
    };
  }, [isFocused, reload, t]);

  // Deleta relatorio do mes selecionado
  const handleDeletarRelatorioMes = useCallback(
    (mes: string) => {
      deletarRelatorioMes(mes)
        .then((dados) => {
          if (dados === 1) {
            ToastAndroid.show(
              t("screens.relatoriomes.month_report_deleted_message_success"),
              ToastAndroid.LONG,
            );
            setReload((prev) => !prev);
          } else if (dados === 2) {
            ToastAndroid.show(
              t(
                "screens.relatoriomes.actual_month_report_delete_message_error",
              ),
              ToastAndroid.LONG,
            );
          } else {
            ToastAndroid.show(
              t("screens.relatoriomes.month_report_deleted_message_error"),
              ToastAndroid.LONG,
            );
          }
        })
        .catch(() => {
          ToastAndroid.show(
            t("screens.relatoriomes.month_report_deleted_message_error"),
            ToastAndroid.LONG,
          );
        });
    },
    [t],
  );

  // Mostra alerta para excluir relatorio do mes
  const alertaExclusaoRelatorioMes = useCallback(
    (mes: string, mesFormatado: string) =>
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
          {
            text: t("words.yes"),
            onPress: () => handleDeletarRelatorioMes(mes),
          },
        ],
        { cancelable: true },
      ),
    [handleDeletarRelatorioMes, t],
  );

  const handleNavigateToReport = useCallback(
    (item: MonthTotalsType) => {
      navigation.navigate("RelatorioMes", {
        mesAno: item.mes,
        mesAnoFormatado: item.mes_formatado,
      });
    },
    [navigation],
  );

  const handleLongPressReport = useCallback(
    (item: MonthTotalsType) =>
      alertaExclusaoRelatorioMes(item.mes, item.mes_formatado.toUpperCase()),
    [alertaExclusaoRelatorioMes],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionHeadersType }) => (
      <ReportSectionHeader title={section.title} />
    ),
    [],
  );

  const renderItem = useCallback(
    ({
      item,
    }: SectionListRenderItemInfo<MonthTotalsType, SectionHeadersType>) => (
      <ReportListItem
        item={item}
        onPress={handleNavigateToReport}
        onLongPress={handleLongPressReport}
      />
    ),
    [handleLongPressReport, handleNavigateToReport],
  );

  const keyExtractor = useCallback((item: MonthTotalsType) => item.mes, []);

  const emptyListComponent = useMemo(
    () => (
      <EmptyMessage
        title={t("screens.relatorios.screen_empty_title")}
        message={t("screens.relatorios.screen_empty_message")}
      />
    ),
    [t],
  );

  return (
    <>
      {carregando ? (
        <LoadingSpinner />
      ) : (
        <Container>
          <SectionList
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: 80 }}
            sections={allAnosServicosOrdenados}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            ListEmptyComponent={emptyListComponent}
            keyExtractor={keyExtractor}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={7}
            removeClippedSubviews
            stickySectionHeadersEnabled
          />
        </Container>
      )}
    </>
  );
}
