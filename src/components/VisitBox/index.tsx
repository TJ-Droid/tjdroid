import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, formatISO, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

import { changeDateFormatToYearMonthDay } from "../../utils/utils";
import SelectPicker from "../SelectPicker";
import { VisitDataType } from "../../types/Visits";
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
  BottomSectionQuantityText,
  StyledFeatherIconSectionButton,
  BottomSectionLabelDateTimeText,
} from "./styles";
import { carregarConfiguracoes } from "../../controllers/configuracoesController";

type VisitBoxPropsType = {
  visitData: VisitDataType;
  onVisitChangeValues: (visitData: VisitDataType) => void;
};

export function VisitBox({
  visitData,
  onVisitChangeValues,
}: VisitBoxPropsType) {
  const { t } = useTranslation();

  const [date, setDate] = useState(
    changeDateFormatToYearMonthDay(visitData.dia)
  );
  const [time, setTime] = useState(
    changeDateFormatToYearMonthDay(visitData.dia, visitData.hora)
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [isRelatorioSimplificadoAtivado, setIsRelatorioSimplificadoAtivado] =
    useState(true);

  const [visitDataState, setVisitDataState] =
    useState<VisitDataType>(visitData);

  useEffect(() => {
    onVisitChangeValues(visitDataState);
  }, [visitDataState]);

  const onChangeDatePicker = (_: any, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    const currentDateFormatted = format(currentDate, "dd/MM/yyyy");
    setShowDatePicker(false);
    setDate(currentDate);
    setVisitDataState({
      ...visitDataState,
      dia: currentDateFormatted,
      data: formatISO(
        changeDateFormatToYearMonthDay(
          currentDateFormatted,
          visitDataState.hora
        )
      ),
    });
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onChangeTimePicker = (_: any, selectedTime: Date) => {
    const currentTime = selectedTime || time;
    const currentTimeFormatted = format(
      parseISO(formatISO(currentTime)),
      "HH:mm"
    );
    setShowTimePicker(false);
    setTime(currentTime);
    setVisitDataState({
      ...visitDataState,
      hora: currentTimeFormatted,
      data: formatISO(
        changeDateFormatToYearMonthDay(visitDataState.dia, currentTimeFormatted)
      ),
    });
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  function contar(local: "colocacoes" | "videosMostrados", tipo: "soma" | "") {
    switch (local) {
      case "colocacoes":
        if (tipo === "soma") {
          return setVisitDataState({
            ...visitDataState,
            colocacoes: visitDataState.colocacoes + 1,
          });
        } else {
          if (visitDataState.colocacoes > 0) {
            setVisitDataState({
              ...visitDataState,
              colocacoes: visitDataState.colocacoes - 1,
            });
          }
        }
        break;

      case "videosMostrados":
        if (tipo === "soma") {
          return setVisitDataState({
            ...visitDataState,
            videosMostrados: visitDataState.videosMostrados + 1,
          });
        } else {
          if (visitDataState.videosMostrados > 0) {
            setVisitDataState({
              ...visitDataState,
              videosMostrados: visitDataState.videosMostrados - 1,
            });
          }
        }
        break;

      default:
        // Não faz nada por default
        break;
    }
  }

  // Lida com a mudanca do SelectPicker
  function handleSelectPickerChange(indexSelected: number) {
    setVisitDataState({ ...visitDataState, visita: indexSelected });
  }

  useEffect(() => {
    const loadConfiguracoes = async () => {
      // Chama o controller para carregar as configurações
      await carregarConfiguracoes().then(async (configs) => {
        // Trata o retorno
        if (configs) {
          try {
            setIsRelatorioSimplificadoAtivado(
              !!configs?.isRelatorioSimplificado
            );
          } catch (e) {}
        }
      });
    };
    loadConfiguracoes();
  }, []);

  return (
    <>
      <StyledScrollView>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode={"date"}
            is24Hour={true}
            display="default"
            onChange={(evt: any, date: any) => onChangeDatePicker(evt, date)}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={(evt: any, date: any) => onChangeTimePicker(evt, date)}
          />
        )}

        <TopSectionContainer>
          <TopSectionContainerArea>
            <TopSectionTextInput
              multiline
              autoCorrect
              placeholder={t("components.visitbox.input_placeholder")}
              onChangeText={(texto) =>
                setVisitDataState({ ...visitDataState, anotacoes: texto })
              }
            >
              {visitDataState.anotacoes}
            </TopSectionTextInput>
          </TopSectionContainerArea>
        </TopSectionContainer>

        <BottomSectionContainer>
          <BottomSectionActionButtonsContainer
            ocultarCampos={isRelatorioSimplificadoAtivado}
          >
            <BottomSectionButtonsWrapper>
              <BottomSectionTextArea>
                <BottomSectionLabelText>
                  {t("words.date")}:
                </BottomSectionLabelText>
              </BottomSectionTextArea>

              <BottomSectionButtonsArea>
                <TouchableOpacity onPress={showDatepicker}>
                  <BottomSectionButtonWrapper marginRight={5}>
                    <BottomSectionLabelDateTimeText>
                      {visitDataState.dia}
                    </BottomSectionLabelDateTimeText>
                  </BottomSectionButtonWrapper>
                </TouchableOpacity>

                <TouchableOpacity onPress={showTimepicker}>
                  <BottomSectionButtonWrapper>
                    <BottomSectionLabelDateTimeText>
                      {visitDataState.hora}
                    </BottomSectionLabelDateTimeText>
                  </BottomSectionButtonWrapper>
                </TouchableOpacity>
              </BottomSectionButtonsArea>
            </BottomSectionButtonsWrapper>

            {!isRelatorioSimplificadoAtivado ? (
              <>
                <BottomSectionButtonsWrapper>
                  <BottomSectionTextArea>
                    <BottomSectionLabelText>
                      {t("words.placements")}:
                    </BottomSectionLabelText>
                  </BottomSectionTextArea>

                  <BottomSectionButtonsArea>
                    <TouchableOpacity onPress={() => contar("colocacoes", "")}>
                      <BottomSectionButtonWrapper>
                        <StyledFeatherIconSectionButton
                          name="minus"
                          size={20}
                        />
                      </BottomSectionButtonWrapper>
                    </TouchableOpacity>

                    <BottomSectionQuantityText>
                      {visitDataState.colocacoes}
                    </BottomSectionQuantityText>

                    <TouchableOpacity
                      onPress={() => contar("colocacoes", "soma")}
                    >
                      <BottomSectionButtonWrapper>
                        <StyledFeatherIconSectionButton name="plus" size={20} />
                      </BottomSectionButtonWrapper>
                    </TouchableOpacity>
                  </BottomSectionButtonsArea>
                </BottomSectionButtonsWrapper>

                <BottomSectionButtonsWrapper>
                  <BottomSectionTextArea>
                    <BottomSectionLabelText>
                      {t("words.videos")}:
                    </BottomSectionLabelText>
                  </BottomSectionTextArea>

                  <BottomSectionButtonsArea>
                    <TouchableOpacity
                      onPress={() => contar("videosMostrados", "")}
                    >
                      <BottomSectionButtonWrapper>
                        <StyledFeatherIconSectionButton
                          name="minus"
                          size={20}
                        />
                      </BottomSectionButtonWrapper>
                    </TouchableOpacity>

                    <BottomSectionQuantityText>
                      {visitDataState.videosMostrados}
                    </BottomSectionQuantityText>

                    <TouchableOpacity
                      onPress={() => contar("videosMostrados", "soma")}
                    >
                      <BottomSectionButtonWrapper>
                        <StyledFeatherIconSectionButton name="plus" size={20} />
                      </BottomSectionButtonWrapper>
                    </TouchableOpacity>
                  </BottomSectionButtonsArea>
                </BottomSectionButtonsWrapper>
              </>
            ) : null}

            <BottomSectionButtonsWrapper>
              <BottomSectionTextArea>
                <BottomSectionLabelText>
                  {t("words.visit_type")}:
                </BottomSectionLabelText>
              </BottomSectionTextArea>

              <BottomSectionButtonsArea>
                <SelectPicker
                  visita={visitDataState.visita}
                  onChangeVisitValue={(indexSelected) =>
                    handleSelectPickerChange(indexSelected)
                  }
                />
              </BottomSectionButtonsArea>
            </BottomSectionButtonsWrapper>
          </BottomSectionActionButtonsContainer>
        </BottomSectionContainer>
      </StyledScrollView>
    </>
  );
}
