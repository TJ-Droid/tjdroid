import React, { useEffect, useState } from "react";
import { Picker } from '@react-native-picker/picker';
import { Container, StyledPicker } from './styles';

import languagesOptions from '../../json/languagesOptions.json';
import { buscarAsyncStorage, salvarAsyncStorage } from "../../services/AsyncStorageMethods";

export default function SelectPickerLanguages({language = "en", onChangeLanguageValue}) {
  
  const [pickerOptions, setPickerOptions] = useState({language: "en"});

  async function handlePickerValueChange(languageSelected){
    setPickerOptions({language: languageSelected });
    // Leva o ID para o select acima
    onChangeLanguageValue(languageSelected);

    // Salva o idioma escolhido no asyncStorage
    await salvarAsyncStorage({language: languageSelected, choosed: true}, '@tjdroid:idioma');
  }

  // Seta o idioma escolhido no SelectPicker
  useEffect(() => {
    const getLanguages = async () => {
      return await buscarAsyncStorage("@tjdroid:idioma");
    }
    getLanguages()
    .then((response) => {
      setPickerOptions({language: response.language });
    })
    .catch((err) => {
      // console.log("err",err);
    });

  },[])

  return (
    <Container>
      <StyledPicker
        selectedValue={pickerOptions.length === 0 ? language : pickerOptions.language }
        onValueChange={(itemValue) => handlePickerValueChange(itemValue)}
      >
        {languagesOptions.map((item) => {
          return <Picker.Item key={item.language} label={`${item.label}`} value={item.language} />;
        })}
      </StyledPicker>
    </Container>
  );
}
