import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Container, StyledPicker } from "./styles";

import languagesOptions from "../../json/languagesOptions.json";
import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../../services/AsyncStorageMethods";

type SelectPickerLanguagesPropsType = {
  onChangeLanguageValue: (language: string) => void;
};

export default function SelectPickerLanguages({
  onChangeLanguageValue,
}: SelectPickerLanguagesPropsType) {
  const [pickerOptions, setPickerOptions] = useState({ language: "en" });

  async function handlePickerValueChange(languageSelected: string) {
    setPickerOptions({ language: languageSelected });
    // Leva o ID para o select acima
    onChangeLanguageValue(languageSelected);

    // Salva o idioma escolhido no asyncStorage
    await salvarAsyncStorage(
      { language: languageSelected, choosed: true },
      "@tjdroid:idioma"
    );
  }

  // Seta o idioma escolhido no SelectPicker
  useEffect(() => {
    const getLanguages = async () => {
      return await buscarAsyncStorage("@tjdroid:idioma");
    };
    getLanguages()
      .then((response) => {
        setPickerOptions({ language: response.language });
      })
      .catch((err) => {});
  }, []);

  return (
    <Container>
      <StyledPicker
        selectedValue={
          // pickerOptions.length === 0 ? language : pickerOptions.language
          pickerOptions.language
        }
        onValueChange={(itemValue) =>
          handlePickerValueChange(itemValue as unknown as string)
        }
      >
        {languagesOptions.map((item) => {
          return (
            <Picker.Item
              key={item.language}
              label={`${item.label}`}
              value={item.language}
            />
          );
        })}
      </StyledPicker>
    </Container>
  );
}
