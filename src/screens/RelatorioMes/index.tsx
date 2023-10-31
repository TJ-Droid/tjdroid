import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  ToastAndroid,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import momentLocales from "moment/min/moment-with-locales";
import moment from "moment";
import minutes_to_hhmm from "../../utils/minutes_to_hhmm";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";
import {
  buscarAsyncStorageTjDroidIdioma,
  formatarLocale,
} from "../../utils/utils";

import {
  buscarDadosMesAnoServico,
  deletarRelatorio,
  toggleSalvarMesTrabalhado,
  SelectedMonthServiceDataType,
  verificarSeMesTrabalhado,
} from "../../controllers/relatoriosController";

import { RootStackParamListType } from "../../routes";
import { StackScreenProps } from "@react-navigation/stack";
import { ReportType } from "../../types/Reports";
import { AppLanguages } from "../../types/Languages";
import CustomSwitch from "../../components/CustomSwitch";
import {
  Container,
  ItemList,
  HeaderTotalsBox,
  HeaderTotalsTopSection,
  HeaderTotalsBottomSection,
  HeaderTotalsTopSectionText,
  HeaderTotalsTopSectionHours,
  HeaderTotalsBottomSectionText,
  ItemListTopContent,
  ItemListTopContentDayText,
  ItemListTopContentHoursText,
  ItemListMidleContent,
  ItemListMidleContentText,
  ItemListBottomContent,
  ItemListBottomContentText,
  StyledContainerWorkedMonth,
  StyledContainerWorkedMonthText,
} from "./styles";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "RelatorioMes"
>;

interface Props extends ProfileScreenRouteProp {}

export default function RelatorioMes({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { mesAno, mesAnoFormatado } = route.params;

  // Estado local para setar o idioma nos locais
  const [appLanguageLocal, setAppLanguageLocal] = useState<{
    language: AppLanguages | undefined;
  }>({ language: undefined });

  const isFocused = useIsFocused();

  const [reload, setReload] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [isMesTrabalhado, setIsMesTrabalhado] = useState(false);
  const [carregandoMesTrabalhado, setCarregandoMesTrabalhado] = useState(false);
  const [todosRelatoriosDoMes, setTodosRelatoriosDoMes] = useState<
    ReportType[]
  >([]);
  const [totaisDoMes, setTotaisDoMes] = useState<
    Partial<SelectedMonthServiceDataType>
  >({
    totalMinutos: 0,
    totalRevisitas: 0,
    totalColocacoes: 0,
    totalVideosMostrados: 0,
    totalEstudosBiblicos: 0,
  });

  useEffect(() => {
    // let continuarBuscarDados = true;
    if (isFocused) {
      const buscarDados = async () => {
        // if (continuarBuscarDados) {
        await buscarDadosMesAnoServico(mesAno)
          .then((dados) => {
            // Trata o retorno
            if (dados) {
              // if (dados.relatoriosDoMes.length === 0) {
              //   navigation.push('Relatorios');
              // }

              const {
                relatoriosDoMes,
                totalMinutos,
                totalRevisitas,
                totalColocacoes,
                totalVideosMostrados,
                totalEstudosBiblicos,
              } = dados;

              setTotaisDoMes({
                totalMinutos,
                totalRevisitas,
                totalColocacoes,
                totalVideosMostrados,
                totalEstudosBiblicos,
              });

              setTodosRelatoriosDoMes(relatoriosDoMes);

              setCarregando(false);
            } else {
              // Mensagem Toast
              ToastAndroid.show(
                t("screens.relatoriomes.month_report_load_error_message"),
                ToastAndroid.SHORT
              );
            }
          })
          .catch((error) => {
            // Mensagem Toast
            ToastAndroid.show(
              t("screens.relatoriomes.month_report_load_error_message"),
              ToastAndroid.SHORT
            );
          })
          .finally(async () => {
            // Verifica se o mês foi trabalhdo
            carregarSeMesFoiTrabalhado();
          });
        // }
      };

      buscarDados();
    }

    // return () => (continuarBuscarDados = false);
  }, [isFocused, reload]);

  useEffect(() => {
    // Função para pegar o idioma do app
    const getAppLanguage = async () => {
      // Busca o idioma salvo no AsyncStorage
      setAppLanguageLocal(await buscarAsyncStorageTjDroidIdioma());
    };
    getAppLanguage();

    return () => setAppLanguageLocal({ language: undefined });
  }, []);

  // ALERTA de DELETAR RELATÓRIO
  const alertaExclusaoRelatorioAtual = (
    idRelatorio: string,
    dataRelatorio: string
  ) =>
    Alert.alert(
      t("screens.relatoriomes.alert_report_deleted_title"),
      t("screens.relatoriomes.alert_report_deleted_message"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () => handleDeletarRelatorio(idRelatorio, dataRelatorio),
        },
      ],
      { cancelable: true }
    );

  // DELETAR RELATÓRIO
  function handleDeletarRelatorio(idRelatorio: string, dataRelatorio: string) {
    deletarRelatorio(idRelatorio, dataRelatorio)
      .then((dados) => {
        // Trata o retorno
        if (dados?.mesAno) {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.relatoriomes.report_deleted_message_success"),
            ToastAndroid.SHORT
          );
          // Faz reaload da página
          setReload(!reload);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.relatoriomes.report_deleted_message_error"),
            ToastAndroid.SHORT
          );
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("screens.relatoriomes.report_deleted_message_error"),
          ToastAndroid.SHORT
        );
      });
  }

  // Verifica se o mes foi trabalhado
  const carregarSeMesFoiTrabalhado = async () => {
    const mesAnoDessaTela = moment(`${mesAno}`, "MMMM yy", true).format(
      "MM/YYYY"
    );
    await verificarSeMesTrabalhado(mesAnoDessaTela)
      .then((dados) => {
        if (typeof dados === "boolean") {
          setIsMesTrabalhado(dados);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.errors.error_message_1"),
            ToastAndroid.SHORT
          );
        }
      })
      .catch(() => {
        // Mensagem Toast
        ToastAndroid.show(
          t("screens.errors.error_message_1"),
          ToastAndroid.SHORT
        );
      });
  };

  // Toggle do Mes Trabalhado
  const handleCheckMesTrabalhado = async (isChecked: boolean) => {
    // Loading
    setCarregandoMesTrabalhado(true);

    // Pega o anoMes formatado
    const mesAnoDessaTela = moment(`${mesAno}`, "MMMM yy", true).format(
      "MM/YYYY"
    );

    // Toggle do Mes Trabalhado
    await toggleSalvarMesTrabalhado(mesAnoDessaTela)
      .then((dados) => {
        if (typeof dados === "boolean") {
          setIsMesTrabalhado(dados);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("screens.errors.error_message_1"),
            ToastAndroid.SHORT
          );
        }
        // Remove Loading
        setCarregandoMesTrabalhado(false);
      })
      .catch(() => {
        // Remove Loading
        setCarregandoMesTrabalhado(false);
        // Mensagem Toast
        ToastAndroid.show(
          t("screens.errors.error_message_1"),
          ToastAndroid.SHORT
        );
      });
  };

  const Item = ({ item }: { item: ReportType }) => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("RelatorioDetalhes", { ...item })}
      onLongPress={() => alertaExclusaoRelatorioAtual(item.id, item.data)}
    >
      <ItemList>
        <ItemListTopContent>
          <ItemListTopContentDayText style={{ flexShrink: 1 }}>
            {momentLocales(item.data)
              .locale(formatarLocale(appLanguageLocal?.language))
              .format("DD/MM/yy, dddd, HH:mm")}
          </ItemListTopContentDayText>
          <ItemListTopContentHoursText>
            {minutes_to_hhmm(item.minutos)}
          </ItemListTopContentHoursText>
        </ItemListTopContent>

        {item.anotacoes ? (
          <ItemListMidleContent>
            <ItemListMidleContentText>
              {item.anotacoes}
            </ItemListMidleContentText>
          </ItemListMidleContent>
        ) : (
          <View></View>
        )}

        {item.revisitas || item.colocacoes || item.videosMostrados ? (
          <ItemListBottomContent>
            <ItemListBottomContentText>
              {`${
                item.revisitas
                  ? `${
                      item.revisitas === 1
                        ? `${item.revisitas} ${t("words.revisit")}`
                        : `${item.revisitas} ${t("words.revisits")}`
                    }`
                  : ""
              } ${
                item.colocacoes
                  ? `${
                      item.colocacoes === 1
                        ? `${item.colocacoes} ${t("words.placement")}`
                        : `${item.colocacoes} ${t("words.placements")}`
                    }`
                  : ""
              } ${
                item.videosMostrados
                  ? `${
                      item.videosMostrados === 1
                        ? `${item.videosMostrados} ${t("words.video")}`
                        : `${item.videosMostrados} ${t("words.videos")}`
                    }`
                  : ""
              }`}
            </ItemListBottomContentText>
          </ItemListBottomContent>
        ) : (
          <View></View>
        )}
      </ItemList>
    </TouchableWithoutFeedback>
  );

  const EmptyListMessage = () => (
    <EmptyMessage
      title={t("screens.relatoriomes.screen_empty_title")}
      message={t("screens.relatoriomes.screen_empty_message")}
    />
  );

  return (
    <SafeAreaView>
      <Header
        title={mesAnoFormatado}
        capitalize
        showGoBackReportDetails
        showReportAdd={{ mesAno }}
        showReportSend={{
          totaisDoMes,
          mesAnoFormatado,
          isMesTrabalhado: isMesTrabalhado,
        }}
      />
      {!carregando ? (
        <Container>
          <HeaderTotalsBox>
            <HeaderTotalsTopSection>
              <HeaderTotalsTopSectionText>
                {t("screens.relatoriomes.month_total")}
              </HeaderTotalsTopSectionText>
              <HeaderTotalsTopSectionHours>
                {minutes_to_hhmm(totaisDoMes.totalMinutos ?? 0)}
              </HeaderTotalsTopSectionHours>
            </HeaderTotalsTopSection>
            <HeaderTotalsBottomSection>
              <HeaderTotalsBottomSectionText>
                {`${
                  totaisDoMes.totalEstudosBiblicos
                    ? `${
                        totaisDoMes.totalEstudosBiblicos === 1
                          ? `${totaisDoMes.totalEstudosBiblicos} ${t(
                              "words.bible_study"
                            )},`
                          : `${totaisDoMes.totalEstudosBiblicos} ${t(
                              "words.bible_studies"
                            )},`
                      }`
                    : `0 ${t("words.bible_studies")},`
                } ${
                  totaisDoMes.totalRevisitas
                    ? `${
                        totaisDoMes.totalRevisitas === 1
                          ? `${totaisDoMes.totalRevisitas} ${t(
                              "words.revisit"
                            )},`
                          : `${totaisDoMes.totalRevisitas} ${t(
                              "words.revisits"
                            )},`
                      }`
                    : `0 ${t("words.revisits")},`
                } ${
                  totaisDoMes.totalColocacoes
                    ? `${
                        totaisDoMes.totalColocacoes === 1
                          ? `${totaisDoMes.totalColocacoes} ${t(
                              "words.placement"
                            )},`
                          : `${totaisDoMes.totalColocacoes} ${t(
                              "words.placements"
                            )},`
                      }`
                    : `0 ${t("words.placements")},`
                } ${
                  totaisDoMes.totalVideosMostrados
                    ? `${
                        totaisDoMes.totalVideosMostrados === 1
                          ? `${totaisDoMes.totalVideosMostrados} ${t(
                              "words.video"
                            )}`
                          : `${totaisDoMes.totalVideosMostrados} ${t(
                              "words.videos"
                            )}`
                      }`
                    : `0 ${t("words.videos")}`
                }`}
              </HeaderTotalsBottomSectionText>
            </HeaderTotalsBottomSection>
            <StyledContainerWorkedMonth>
              <View style={{ flex: 1 }}>
                <StyledContainerWorkedMonthText>
                  {t("screens.relatoriomes.worked_month_description")}
                </StyledContainerWorkedMonthText>
              </View>
              <View>
                <CustomSwitch
                  disabled={carregandoMesTrabalhado}
                  isChecked={isMesTrabalhado}
                  option1Text={t("words.yes")}
                  option2Text={t("words.no")}
                  onSelectSwitch={(v) => handleCheckMesTrabalhado(v)}
                />
              </View>
            </StyledContainerWorkedMonth>
          </HeaderTotalsBox>
          <FlatList
            style={{ width: "100%", marginBottom: 114 }}
            data={todosRelatoriosDoMes}
            renderItem={Item}
            ListEmptyComponent={EmptyListMessage}
            keyExtractor={(item) => item.id.toString()}
          />
        </Container>
      ) : (
        <Container>
          <LoadingSpinner />
        </Container>
      )}
    </SafeAreaView>
  );
}
