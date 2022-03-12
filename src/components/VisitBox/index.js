import React, { useEffect, useState } from 'react'
import { BorderlessButton } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, formatISO, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { changeDateFormatToYearMonthDay } from '../../utils/utils';
import SelectPicker from '../SelectPicker';
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
  BottomSectionLabelDateTimeText
} from "./styles";

export function VisitBox({visitData, onVisitChangeValues}) {
  
  const {t} = useTranslation();

  const [date, setDate] = useState(changeDateFormatToYearMonthDay(visitData.dia));
  const [time, setTime] = useState(changeDateFormatToYearMonthDay(visitData.dia, visitData.hora));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [visitDataState, setVisitDataState] = useState(visitData);

  useEffect(() => {
    onVisitChangeValues(visitDataState);
  }, [visitDataState])

  const onChangeDatePicker = (_, selectedDate) => {
    const currentDate = selectedDate || date;
    const currentDateFormatted = format(currentDate, 'dd/MM/yyyy');
    setShowDatePicker(false);
    setDate(currentDate); 
    setVisitDataState({ ...visitDataState, dia: currentDateFormatted, data: formatISO(changeDateFormatToYearMonthDay(currentDateFormatted, visitDataState.hora)) });
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  
  const onChangeTimePicker = (_, selectedTime) => {
    const currentTime = selectedTime || time;
    const currentTimeFormatted = format(parseISO(formatISO(currentTime)), 'HH:mm');
    setShowTimePicker(false);
    setTime(currentTime); 
    setVisitDataState({ ...visitDataState, hora: currentTimeFormatted, data: formatISO(changeDateFormatToYearMonthDay(visitDataState.dia, currentTimeFormatted)) });
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  function contar(local, tipo) {
    switch (local) {

      case 'colocacoes':
        if (tipo === 'soma') {
          return setVisitDataState({ ...visitDataState, colocacoes: visitDataState.colocacoes + 1});
        } else {
          if (visitDataState.colocacoes > 0) {
            setVisitDataState({ ...visitDataState, colocacoes: visitDataState.colocacoes - 1});
          }
        }
        break;

      case 'videosMostrados':
        if (tipo === 'soma') {
          return setVisitDataState({ ...visitDataState, videosMostrados: visitDataState.videosMostrados + 1})
        } else {
          if (visitDataState.videosMostrados > 0) {
            setVisitDataState({ ...visitDataState, videosMostrados: visitDataState.videosMostrados - 1});
          }
        }
        break;
    
      default:
        // Não faz nada por default
        break;
    }
  }

  // Lida com a mudanca do SelectPicker
  function handleSelectPickerChange(idSelected){
    setVisitDataState({ ...visitDataState, visita: idSelected});
  }

  return (
    <>
      <StyledScrollView>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={onChangeDatePicker}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode={'time'}
            is24Hour={true}
            display="default"
            onChange={onChangeTimePicker}
          />
        )}

        <TopSectionContainer>
          <TopSectionContainerArea>

            <TopSectionTextInput multiline autoCorrect placeholder={t("components.visitbox.input_placeholder")} elevation={3} onChangeText={texto => setVisitDataState({...visitDataState, anotacoes: texto})}
            >
              {visitDataState.anotacoes}
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
                    <BottomSectionLabelDateTimeText>{visitDataState.dia}</BottomSectionLabelDateTimeText>
                  </BottomSectionButtonWrapper>
                </BorderlessButton>

                <BorderlessButton onPress={showTimepicker}>
                  <BottomSectionButtonWrapper>
                    <BottomSectionLabelDateTimeText>{visitDataState.hora}</BottomSectionLabelDateTimeText>
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
                  onPress={() => contar('colocacoes', '')}
                  >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="minus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>

                <BottomSectionQuantityText>{visitDataState.colocacoes}</BottomSectionQuantityText>

                <BorderlessButton 
                  onPress={() => contar('colocacoes', 'soma')}
                  >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="plus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>
              </BottomSectionButtonsArea>
            </BottomSectionButtonsWrapper>
            
            <BottomSectionButtonsWrapper>
              <BottomSectionTextArea>
                <BottomSectionLabelText>{t("words.videos")}:</BottomSectionLabelText>
              </BottomSectionTextArea>

              <BottomSectionButtonsArea>
                <BorderlessButton 
                  onPress={() => contar('videosMostrados', '')}
                  >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="minus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>

                <BottomSectionQuantityText>{visitDataState.videosMostrados}</BottomSectionQuantityText>

                <BorderlessButton 
                  onPress={() => contar('videosMostrados', 'soma')}
                  >
                  <BottomSectionButtonWrapper>
                    <StyledFeatherIconSectionButton name="plus" size={20} />
                  </BottomSectionButtonWrapper>
                </BorderlessButton>
              </BottomSectionButtonsArea>
            </BottomSectionButtonsWrapper>

            <BottomSectionButtonsWrapper>

              <BottomSectionTextArea>
                <BottomSectionLabelText>{t("words.visit_type")}:</BottomSectionLabelText>
              </BottomSectionTextArea>

              <BottomSectionButtonsArea>
                <SelectPicker visita={visitDataState.visita} onChangeVisitValue={(idSelected) => handleSelectPickerChange(idSelected)} />
              </BottomSectionButtonsArea>

            </BottomSectionButtonsWrapper>
          </BottomSectionActionButtonsContainer>
        </BottomSectionContainer>
      </StyledScrollView>
        
    </>
  )
}
