import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";

import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../../services/AsyncStorageMethods";

import { AppLanguages } from "../../types/Languages";
import { Container, StyledPicker } from "./styles";
import LoadingSpinner from "../LoadingSpinner";

const LANGUAGES_OPTIONS = [
  { language: "en", label: "English (100%)" },
  { language: "pt", label: "Português (100%)" },
  { language: "es", label: "Español (100%)" },
  { language: "ru", label: "Русский (100%)" },
  { language: "pl", label: "Polski (100%)" },
];

type SelectPickerLanguagesPropsType = {
  onChangeLanguageValue: (language: AppLanguages) => void;
};

export default function SelectPickerLanguages({
  onChangeLanguageValue,
}: SelectPickerLanguagesPropsType) {
  const [isLoading, setIsLoading] = useState(false);
  const [pickerOptions, setPickerOptions] = useState<{
    language: AppLanguages;
  }>({ language: "en" });

  async function handlePickerValueChange(languageSelected: AppLanguages) {
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
    setIsLoading(true);
    const getLanguages = async () => {
      return await buscarAsyncStorage("@tjdroid:idioma");
    };
    getLanguages()
      .then((response) => {
        setPickerOptions({ language: response.language });
        setIsLoading(false);
      })
      .catch((err) => {
        setPickerOptions({ language: "en" });
        setIsLoading(false);
      });
  }, []);

  return (
    <Container>
      {isLoading ? (
        <LoadingSpinner size={40} />
      ) : (
        <StyledPicker
          selectedValue={
            // pickerOptions.length === 0 ? language : pickerOptions.language
            pickerOptions.language
          }
          onValueChange={(itemValue) => {
            handlePickerValueChange(itemValue as AppLanguages);
          }}
        >
          {LANGUAGES_OPTIONS.map((item) => {
            return (
              <Picker.Item
                key={item.language}
                label={`${item.label}`}
                value={item.language}
              />
            );
          })}
        </StyledPicker>
      )}
    </Container>
  );
}
