import React, { useEffect, useState } from "react";
import { ToastAndroid, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

import { format, formatISO, parseISO } from "date-fns";

import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  buscarInformacoesTerritorio,
  SearchTerritoryInfoType,
} from "../../controllers/territoriosController";

import {
  StyledScrollView,
  TopSectionContainer,
  TopSectionContainerArea,
  TopSectionTextInput,
  BottomSectionContainer,
  BottomSectionActionButtonsContainer,
  BottomSectionButtonsWrapper,
  BottomSectionTextArea,
  BottomSectionLabelText,
  BottomSectionButtonsArea,
  BottomSectionButtonWrapper,
  BottomSectionButtonWrapperDisabled,
  BottomSectionDateText,
} from "./styles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "TerritorioInformacao"
>;

interface Props extends ProfileScreenRouteProp {}

export default function TerritorioInformacao({ route }: Props) {
  const { t } = useTranslation();
  const [territorioInfos, setTerritorioInfos] =
    useState<SearchTerritoryInfoType>();
  const [carregando, setCarregando] = useState(true);

  const [dateDtSelecionado, setDateDtSelecionado] = useState(new Date());
  const [showDatePickerDtSelecionado, setShowDatePickerDtSelecionado] =
    useState(false);

  const [dateDtTrabalhado, setDateDtTrabalhado] = useState(new Date());
  const [showDatePickerDtTrabalhado, setShowDatePickerDtTrabalhado] =
    useState(false);

  const onChangeDatePickerDtSelecionado = (_: any, selectedDate: Date) => {
    const currentDate = selectedDate || dateDtSelecionado;
    const currentDateFormatted = format(currentDate, "dd/MM/yyyy");
    setShowDatePickerDtSelecionado(false);
    setDateDtSelecionado(currentDate);
    setTerritorioInfos({
      ...territorioInfos,
      dataSelecionadoFormatada: currentDateFormatted,
      dataSelecionado: formatISO(currentDate),
    });
  };

  const showDatepickerDtSelecionadoFunc = () => {
    setShowDatePickerDtSelecionado(true);
  };

  const onChangeDatePickerDtTrabalhado = (_: any, selectedDate: Date) => {
    if (selectedDate !== undefined) {
      const currentDate = selectedDate;
      const currentDateFormatted = format(currentDate, "dd/MM/yyyy");
      setShowDatePickerDtTrabalhado(false);
      setDateDtTrabalhado(currentDate);
      setTerritorioInfos({
        ...territorioInfos,
        dataTrabalhadoFormatada: currentDateFormatted,
        dataTrabalhado: formatISO(currentDate),
      });
    } else {
      setShowDatePickerDtTrabalhado(false);
    }
  };

  const showDatepickerDtTrabalhadoFunc = () => {
    setShowDatePickerDtTrabalhado(true);
  };

  useEffect(() => {
    const { territorioId } = route.params;

    setCarregando(true);

    // let continuarBuscarDados = true;

    const buscarDados = async () => {
      // if (continuarBuscarDados) {
      // Busca os anos de Servico para setar no SectionList
      await buscarInformacoesTerritorio(territorioId)
        .then((dados) => {
          // Trata o retorno
          if (dados) {
            // Seta o estado com todos as visitas da pessoa para o SectionList
            setTerritorioInfos(dados);

            // Seta o date e time para serem usados no date/timepicker
            setDateDtSelecionado(parseISO(dados.dataSelecionado ?? ""));
            setDateDtTrabalhado(
              dados.dataTrabalhado === ""
                ? new Date()
                : parseISO(dados.dataTrabalhado ?? "")
            );

            // Retira a mensagem de carregando
            setCarregando(false);
          } else {
            ToastAndroid.show(
              t(
                "screens.territorioinformacao.territory_info_load_message_error"
              ),
              ToastAndroid.LONG
            );
          }
        })
        .catch((error) => {
          ToastAndroid.show(
            t("screens.territorioinformacao.territory_info_load_message_error"),
            ToastAndroid.LONG
          );
        });
      // }
    };
    buscarDados();

    // return () => (continuarBuscarDados = false);
  }, []);

  return (
    <>
      <Header
        title={territorioInfos?.nome}
        showGoBack
        showEditTerritoryInfo={territorioInfos}
      />

      {carregando ? (
        <LoadingSpinner />
      ) : (
        <StyledScrollView>
          {showDatePickerDtSelecionado && (
            <DateTimePicker
              value={dateDtSelecionado}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={(evt: any, date: any) =>
                onChangeDatePickerDtSelecionado(evt, date)
              }
            />
          )}

          {showDatePickerDtTrabalhado && (
            <DateTimePicker
              value={dateDtTrabalhado}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={(evt: any, date: any) =>
                onChangeDatePickerDtTrabalhado(evt, date)
              }
            />
          )}

          <TopSectionContainer>
            <TopSectionContainerArea>
              <TopSectionTextInput
                multiline
                autoCorrect
                placeholder={t(
                  "screens.territorioinformacao.territory_description_placeholder"
                )}
                onChangeText={(texto) =>
                  setTerritorioInfos({ ...territorioInfos, observacoes: texto })
                }
              >
                {territorioInfos?.observacoes}
              </TopSectionTextInput>
            </TopSectionContainerArea>
          </TopSectionContainer>

          <BottomSectionContainer>
            <BottomSectionActionButtonsContainer>
              <BottomSectionButtonsWrapper>
                <BottomSectionTextArea>
                  <BottomSectionLabelText>
                    {t("screens.territorioinformacao.territory_selected")}
                  </BottomSectionLabelText>
                </BottomSectionTextArea>

                <BottomSectionButtonsArea>
                  <TouchableOpacity
                    style={{ width: "100%" }}
                    onPress={() => showDatepickerDtSelecionadoFunc()}
                  >
                    <BottomSectionButtonWrapper>
                      <BottomSectionDateText>
                        {territorioInfos?.dataSelecionadoFormatada}
                      </BottomSectionDateText>
                    </BottomSectionButtonWrapper>
                  </TouchableOpacity>
                </BottomSectionButtonsArea>
              </BottomSectionButtonsWrapper>

              <BottomSectionButtonsWrapper>
                <BottomSectionTextArea>
                  <BottomSectionLabelText>
                    {t("screens.territorioinformacao.territory_worked")}
                  </BottomSectionLabelText>
                </BottomSectionTextArea>

                <BottomSectionButtonsArea>
                  <TouchableOpacity
                    style={{ width: "100%" }}
                    onPress={() => showDatepickerDtTrabalhadoFunc()}
                  >
                    <BottomSectionButtonWrapper>
                      <BottomSectionDateText>
                        {territorioInfos?.dataTrabalhadoFormatada &&
                        territorioInfos.dataTrabalhadoFormatada === ""
                          ? "-"
                          : territorioInfos?.dataTrabalhadoFormatada}
                      </BottomSectionDateText>
                    </BottomSectionButtonWrapper>
                  </TouchableOpacity>
                </BottomSectionButtonsArea>
              </BottomSectionButtonsWrapper>

              <BottomSectionButtonsWrapper>
                <BottomSectionTextArea>
                  <BottomSectionLabelText>
                    {t("screens.territorioinformacao.territory_last_visit")}
                  </BottomSectionLabelText>
                </BottomSectionTextArea>

                <BottomSectionButtonsArea>
                  <BottomSectionButtonWrapperDisabled>
                    <BottomSectionDateText>
                      {territorioInfos?.ultimaVisitaFormatada &&
                      territorioInfos.ultimaVisitaFormatada === ""
                        ? "-"
                        : territorioInfos?.ultimaVisitaFormatada}
                    </BottomSectionDateText>
                  </BottomSectionButtonWrapperDisabled>
                </BottomSectionButtonsArea>
              </BottomSectionButtonsWrapper>
            </BottomSectionActionButtonsContainer>
          </BottomSectionContainer>
        </StyledScrollView>
      )}
    </>
  );
}
