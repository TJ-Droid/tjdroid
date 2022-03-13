import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Alert, ToastAndroid } from "react-native";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

import moment from 'moment/min/moment-with-locales';
import minutes_to_hhmm from "../../utils/minutes_to_hhmm";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyMessage from "../../components/EmptyMessage";
import { buscarAsyncStorageTjDroidIdioma, formatarLocale } from "../../utils/utils";

import { buscarDadosMesAnoServico, deletarRelatorio } from "../../controllers/relatoriosController";

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
} from "./styles";

export default function RelatorioMes({ route, navigation }) {

  const { t } = useTranslation();
  const { mesAno, mesAnoFormatado } = route.params;

  // Estado local para setar o idioma nos locais
  const [appLanguageLocal, setAppLanguageLocal] = useState("");

  const isFocused = useIsFocused();

  const [reload, setReload] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [todosRelatoriosDoMes, setTodosRelatoriosDoMes] = useState([]);
  const [totaisDoMes, setTotaisDoMes] = useState([]);

  useEffect(() => {

    if (isFocused) {

      const buscarDados = async () => {

        let continuarBuscarDados = true;
        
        if (continuarBuscarDados) {

          await buscarDadosMesAnoServico(mesAno)
          .then((dados) => {

            // Trata o retorno
            if(dados) {
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
              ToastAndroid.show(t("screens.relatoriomes.month_report_load_error_message"), ToastAndroid.SHORT);
            }
            
          })
          .catch((error) => {
            // Mensagem Toast
            ToastAndroid.show(t("screens.relatoriomes.month_report_load_error_message"), ToastAndroid.SHORT);
          });
        }
      }

      buscarDados();
    }

    return () => continuarBuscarDados = false;
  }, [isFocused,reload]);

  useEffect(() => {
    
    // Função para pegar o idioma do app
    const getAppLanguage = async () => {
      // Busca o idioma salvo no AsyncStorage
      setAppLanguageLocal(await buscarAsyncStorageTjDroidIdioma());
    }
    getAppLanguage();
    
    return () => setAppLanguageLocal("");
  }, [])

  // ALERTA de DELETAR RELATÓRIO
  const alertaExclusaoRelatorioAtual = (idRelatorio, dataRelatorio) =>
    Alert.alert(
      t("screens.relatoriomes.alert_report_deleted_title"),
      t("screens.relatoriomes.alert_report_deleted_message"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel"
        },
        { text: t("words.yes"), onPress: () => handleDeletarRelatorio(idRelatorio, dataRelatorio) }
      ],
      { cancelable: true }
  );

  // DELETAR RELATÓRIO
  function handleDeletarRelatorio(idRelatorio, dataRelatorio) {
    deletarRelatorio(idRelatorio, dataRelatorio)
    .then((dados) => {
      
      // Trata o retorno
      if(dados){
        // Mensagem Toast
        ToastAndroid.show(t("screens.relatoriomes.report_deleted_message_success"), ToastAndroid.SHORT);
        // Faz reaload da página
        setReload(!reload);
      } else {
        // Mensagem Toast
        ToastAndroid.show(t("screens.relatoriomes.report_deleted_message_error"), ToastAndroid.SHORT);
      }
    })
    .catch((e) => {
      // Mensagem Toast
      ToastAndroid.show(t("screens.relatoriomes.report_deleted_message_error"), ToastAndroid.SHORT);
    });
  }

  const Item = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('RelatorioDetalhes', item)}
      onLongPress={() => alertaExclusaoRelatorioAtual(item.id, item.data)}
    >
      <ItemList>
        <ItemListTopContent>
          <ItemListTopContentDayText style={{ flexShrink: 1 }}>
            {moment(item.data).locale(formatarLocale(appLanguageLocal?.language)).format("DD/MM/yy, dddd, HH:mm")}
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
              {`${item.revisitas
                ? `${item.revisitas === 1
                  ? `${item.revisitas} ${t("words.revisit")}`
                  : `${item.revisitas} ${t("words.revisits")}`}`
                : ""
              } ${item.colocacoes
                  ? `${item.colocacoes === 1
                    ? `${item.colocacoes} ${t("words.placement")}`
                    : `${item.colocacoes} ${t("words.placements")}`}`
                  : ""
              } ${item.videosMostrados
                  ? `${item.videosMostrados === 1
                    ? `${item.videosMostrados} ${t("words.video")}`
                    : `${item.videosMostrados} ${t("words.videos")}`}`
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
      <Header title={mesAnoFormatado} capitalize={{textTransform: 'capitalize'}} showGoBackReportDetails showReportAdd={mesAno} showReportSend={{totaisDoMes, mesAno, mesAnoFormatado} || []} />
      {!carregando ? (
        <Container>
          <HeaderTotalsBox>
            <HeaderTotalsTopSection>
              <HeaderTotalsTopSectionText>
                {t("screens.relatoriomes.month_total")}
              </HeaderTotalsTopSectionText>
              <HeaderTotalsTopSectionHours>
                {minutes_to_hhmm(totaisDoMes.totalMinutos)}
              </HeaderTotalsTopSectionHours>
            </HeaderTotalsTopSection>
            <HeaderTotalsBottomSection>
              <HeaderTotalsBottomSectionText>
                {`${totaisDoMes.totalEstudosBiblicos
                  ? `${totaisDoMes.totalEstudosBiblicos === 1
                    ? `${totaisDoMes.totalEstudosBiblicos} ${t("words.bible_study")},`
                    : `${totaisDoMes.totalEstudosBiblicos} ${t("words.bible_studies")},`}`
                  : `0 ${t("words.bible_studies")},`
                } ${totaisDoMes.totalRevisitas
                  ? `${totaisDoMes.totalRevisitas === 1
                    ? `${totaisDoMes.totalRevisitas} ${t("words.revisit")},`
                    : `${totaisDoMes.totalRevisitas} ${t("words.revisits")},`}`
                  : `0 ${t("words.revisits")},`
                } ${totaisDoMes.totalColocacoes
                  ? `${totaisDoMes.totalColocacoes === 1
                    ? `${totaisDoMes.totalColocacoes} ${t("words.placement")},`
                    : `${totaisDoMes.totalColocacoes} ${t("words.placements")},`}`
                  : `0 ${t("words.placements")},`
                } ${totaisDoMes.totalVideosMostrados
                  ? `${totaisDoMes.totalVideosMostrados === 1
                    ? `${totaisDoMes.totalVideosMostrados} ${t("words.video")}`
                    : `${totaisDoMes.totalVideosMostrados} ${t("words.videos")}`}`
                  : `0 ${t("words.videos")}`
                }`}
              </HeaderTotalsBottomSectionText>
            </HeaderTotalsBottomSection>
          </HeaderTotalsBox>
          <FlatList
            style={{ width: "100%", marginBottom: 114 }}
            data={todosRelatoriosDoMes}
            renderItem={Item}
            ListEmptyComponent={EmptyListMessage}
            keyExtractor={(item) => item.id.toString()}
          />
        </Container>
      ) : (<Container><LoadingSpinner /></Container>)}
    </SafeAreaView>
  );
}
