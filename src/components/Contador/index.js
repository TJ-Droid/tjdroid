import React, { useEffect, useState } from "react";
import { format, parseISO, formatISO } from "date-fns";
import {
  BorderlessButton,
  TouchableOpacity,
} from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

import Header from "../Header";

import minutes_to_hhmm from "../../utils/minutes_to_hhmm";
import { changeDateFormatToYearMonthDay } from "../../utils/utils";

import {
  StyledScrollView,
  TopSectionContainer,
  TopSectionContainerArea,
  ContadorArea,
  ContadorButtonArea,
  ContadorMinutesText,
  TopSectionTextInput,
  BottomSectionContainer,
  BottomSectionActionButtonsContainer,
  BottomSectionButtonsWrapper,
  BottomSectionTextArea,
  BottomSectionLabelText,
  BottomSectionButtonsArea,
  BottomSectionButtonWrapper,
  BottomSectionQuantityText,
  StyledFeatherIconContadorButton,
  StyledFeatherIconSectionButton,
  BottomSectionLabelDateTimeText,
} from "./styles";

export default function Contador({
  relatorioId = false,
  diaProp = "00/00/0000",
  horaProp = "00:00",
  minutosProp = 0,
  revisitasProp = 0,
  colocacoesProp = 0,
  videosMostradosProp = 0,
  observacoesProp = false,
  paginaCronometroParado = false,
  paginaRelatorioDetalhes = false,
  paginaRelatorioAdicionar = false,
}) {

  const {t} = useTranslation();

  // Date e time Picker
  const [time, setTime] = useState(
    changeDateFormatToYearMonthDay(diaProp, horaProp) || new Date()
  );
  const [date, setDate] = useState(
    diaProp === "00/00/0000"
      ? new Date()
      : changeDateFormatToYearMonthDay(diaProp)
  );

  // Estados gerais
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timerBotaoPrecionado, setTimerBotaoPrecionado] = useState(0);

  const [minutos, setMinutos] = useState(0);
  const [relatorio, setRelatorio] = useState({
    dia: "00/00/0000",
    hora: "00:00",
    revisitas: 0,
    colocacoes: 0,
    videosMostrados: 0,
    observacoes: "",
  });

  // Recebe os dados para configurar os estado inicial do contador
  // Como esse componente é usado em várias screens, abaixo é feita essa configuração
  useEffect(() => {
    // Pega os minutos via prop
    if (minutosProp) {
      setMinutos(minutosProp);
    }

    // Pega os outros dados via prop
    if (
      colocacoesProp ||
      videosMostradosProp ||
      revisitasProp ||
      observacoesProp ||
      diaProp ||
      horaProp
    ) {
      setRelatorio({
        id: relatorioId,
        colocacoes: colocacoesProp,
        videosMostrados: videosMostradosProp,
        revisitas: revisitasProp,
        observacoes: observacoesProp,
        dia: diaProp,
        hora: horaProp,
      });
    }

    return () => {};
  }, []);

  // Previne os minutos de ficarem negativo ao pressionar continuamente
  useEffect(() => {
    if (minutos < 0) {
      setMinutos(0);
    }
  }, [minutos]);

  // Mostra o DATE PICKER com o modo CALENDARIO
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Trata o retorno da DATE PICKER modo CALENDARIO
  const onChangeDatePicker = (_, selectedDate) => {
    const currentDate = selectedDate || date;
    const currentDateFormatted = format(currentDate, "dd/MM/yyyy");
    setShowDatePicker(false);
    setRelatorio({ ...relatorio, dia: currentDateFormatted });
    setDate(currentDate);
  };

  // Mostra o DATE PICKER com o modo HORA
  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  // Trata o retorno da DATE PICKER modo HORA
  const onChangeTimePicker = (_, selectedTime) => {
    const currentTime = selectedTime || time; // 2021-09-22T21:58:00.000Z
    const currentTimeFormatted = format(
      parseISO(formatISO(currentTime)),
      "HH:mm"
    );
    setShowTimePicker(false);
    setRelatorio({ ...relatorio, hora: currentTimeFormatted });
    setTime(currentTime);
  };

  // FUNCAO PARA OS BOTOES DO CONTADOR
  async function contar(local, tipo) {

    if(local === 'minutos'){
      if (tipo === "soma") {
        return setMinutos(minutos + 1);
      } else {
        if (minutos > 0) {
          return setMinutos(minutos - 1);
        }
      }
    }

    if(local === 'colocacoes'){
      if (tipo === "soma") {
        return setRelatorio({
          ...relatorio,
          colocacoes: relatorio.colocacoes + 1,
        });
      } else {
        if (relatorio.colocacoes > 0) {
          return setRelatorio({
            ...relatorio,
            colocacoes: relatorio.colocacoes - 1,
          });
        }
      }
    }

    if(local === 'videosMostrados'){
      if (tipo === "soma") {
        return setRelatorio({
          ...relatorio,
          videosMostrados: relatorio.videosMostrados + 1,
        });
      } else {
        if (relatorio.videosMostrados > 0) {
          return setRelatorio({
            ...relatorio,
            videosMostrados: relatorio.videosMostrados - 1,
          });
        }
      }
    }

    if(local === 'revisitas'){
      if (tipo === "soma") {
        return setRelatorio({
          ...relatorio,
          revisitas: relatorio.revisitas + 1,
        });
      } else {
        if (relatorio.revisitas > 0) {
          return setRelatorio({
            ...relatorio,
            revisitas: relatorio.revisitas - 1,
          });
        }
      }
    }
  }

  async function somarMinutosContinuamente() {
    setMinutos((m) => m + 10);
    setTimerBotaoPrecionado(setTimeout(() => somarMinutosContinuamente(), 100));
    clearTimeout(timerBotaoPrecionado);
  }

  async function subtrairMinutosContinuamente() {
    setMinutos((m) => m - 10);
    setTimerBotaoPrecionado(
      setTimeout(() => subtrairMinutosContinuamente(), 100)
    );
    clearTimeout(timerBotaoPrecionado);
  }

  async function pararContagemContinua() {
    clearTimeout(timerBotaoPrecionado);
  }

  return (
    <>

      {paginaCronometroParado && (
        <Header
          title={t("components.contador.header_title_chronometer")} 
          showGoBackHome
          showContadorSave={{ relatorio, minutos: minutos }}
        />
      )}

      {paginaRelatorioDetalhes && (
        <Header
          title={t("components.contador.header_title_report")} 
          showGoBack
          showReportSave={{ relatorio, minutos: minutos }}
        />
      )}

      {paginaRelatorioAdicionar && (
        <Header
          title={t("components.contador.header_title_new_report")} 
          showGoBack
          showNewReportSave={{ relatorio, minutos: minutos }}
        />
      )}

      <StyledScrollView>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDatePicker}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTimePicker}
          />
        )}

        <TopSectionContainer>
          <TopSectionContainerArea>
            <ContadorArea>
              <TouchableOpacity
                onPress={() => contar("minutos", "")}
                onLongPress={() => subtrairMinutosContinuamente()}
                onPressOut={() => pararContagemContinua()}
              >
                <ContadorButtonArea>
                  <StyledFeatherIconContadorButton name="minus" size={26} />
                </ContadorButtonArea>
              </TouchableOpacity>

              <ContadorMinutesText>
                {minutes_to_hhmm(minutos)}
              </ContadorMinutesText>

              <TouchableOpacity
                onPress={() => contar("minutos", "soma")}
                onLongPress={() => somarMinutosContinuamente()}
                onPressOut={() => pararContagemContinua()}
              >
                <ContadorButtonArea>
                  <StyledFeatherIconContadorButton name="plus" size={26} />
                </ContadorButtonArea>
              </TouchableOpacity>
            </ContadorArea>

            <TopSectionTextInput
              multiline
              autoCorrect
              placeholder={t("components.contador.input_description_placeholder")}
              elevation={3}
              onChangeText={(texto) =>
                setRelatorio({ ...relatorio, observacoes: texto })
              }
            >
              {observacoesProp}
            </TopSectionTextInput>
          </TopSectionContainerArea>
        </TopSectionContainer>

        <BottomSectionContainer>
          <BottomSectionActionButtonsContainer>
            <BottomSectionButtonsWrapper>
              <BottomSectionTextArea>
                <BottomSectionLabelText>{t("words.date")}:</BottomSectionLabelText>
              </BottomSectionTextArea>

              <BottomSectionButtonsArea>
                <BorderlessButton onPress={showDatepicker}>
                  <BottomSectionButtonWrapper marginRight={5}>
                    <BottomSectionLabelDateTimeText>{relatorio.dia}</BottomSectionLabelDateTimeText>
                  </BottomSectionButtonWrapper>
                </BorderlessButton>

                <BorderlessButton onPress={showTimepicker}>
                  <BottomSectionButtonWrapper>
                    <BottomSectionLabelDateTimeText>{relatorio.hora}</BottomSectionLabelDateTimeText>
                  </BottomSectionButtonWrapper>
                </BorderlessButton>
              </BottomSectionButtonsArea>
            </BottomSectionButtonsWrapper>

            <BottomSectionButtonsWrapper>
              <BottomSectionTextArea>
                <BottomSectionLabelText>{t("words.placements")}:</BottomSectionLabelText>
              </BottomSectionTextArea>

              <BottomSectionButtonsArea>
                <BorderlessButton
                  onPress={() => {
                    contar("colocacoes", "");
                  }}
                >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="minus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>

                <BottomSectionQuantityText>
                  {relatorio.colocacoes}
                </BottomSectionQuantityText>

                <BorderlessButton
                  onPress={() => {
                    contar("colocacoes", "soma");
                  }}
                >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="plus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>
              </BottomSectionButtonsArea>
            </BottomSectionButtonsWrapper>

            <BottomSectionButtonsWrapper>
              <BottomSectionTextArea>
                <BottomSectionLabelText>
                  {t("words.videos_showed")}:
                </BottomSectionLabelText>
              </BottomSectionTextArea>

              <BottomSectionButtonsArea>
                <BorderlessButton
                  onPress={() => {
                    contar("videosMostrados", "");
                  }}
                >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="minus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>

                <BottomSectionQuantityText>
                  {relatorio.videosMostrados}
                </BottomSectionQuantityText>

                <BorderlessButton
                  onPress={() => {
                    contar("videosMostrados", "soma");
                  }}
                >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="plus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>
              </BottomSectionButtonsArea>
            </BottomSectionButtonsWrapper>

            <BottomSectionButtonsWrapper>
              <BottomSectionTextArea>
                <BottomSectionLabelText>{t("words.revisits")}:</BottomSectionLabelText>
              </BottomSectionTextArea>

              <BottomSectionButtonsArea>
                <BorderlessButton
                  onPress={() => {
                    contar("revisitas", "");
                  }}
                >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="minus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>

                <BottomSectionQuantityText>
                  {relatorio.revisitas}
                </BottomSectionQuantityText>

                <BorderlessButton
                  onPress={() => {
                    contar("revisitas", "soma");
                  }}
                >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="plus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>
              </BottomSectionButtonsArea>
            </BottomSectionButtonsWrapper>
          </BottomSectionActionButtonsContainer>
        </BottomSectionContainer>
      </StyledScrollView>
    </>
  );
}
