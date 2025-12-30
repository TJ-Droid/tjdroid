import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native-animatable";

import {
  ButtonsContainer,
  StyledDialogButtonCancel,
  StyledDialogButtonOk,
  StyledDialogContainer,
  StyledDialogDescription,
  StyledDialogDescriptionErrorMessage,
  StyledDialogInput1,
  StyledDialogInput2,
  StyledDialogInput3,
  StyledDialogTitle,
  TextsContainer,
} from "./styles";

type DialogModalPropsType = {
  dialogVisibleProp: boolean;
  dialogMessage: string;
  dialogTitle: string;
  dialogValue?: string | undefined;
  dialogFunction: (value: string, value2?: string) => void;
  dialogCloseFunction: () => void;
  keyboardTypeNumberAddManyHouses?: boolean;
};

export default function DialogModal({
  dialogVisibleProp,
  dialogMessage,
  dialogTitle,
  dialogValue,
  dialogFunction,
  dialogCloseFunction,
  keyboardTypeNumberAddManyHouses = false,
}: DialogModalPropsType) {
  const { t } = useTranslation();

  // Constant
  const BLANK_INPUT_STATES = {
    input1: {
      value: dialogValue ? dialogValue : "",
      isError: false,
      isErrorMessage: "",
    },
    input2: {
      value: "",
      isError: false,
      isErrorMessage: "",
    },
  };

  // Dialog states
  const [inputsValues, setInputsValue] = useState(BLANK_INPUT_STATES);

  useEffect(() => {
    if (dialogValue) {
      setInputsValue(BLANK_INPUT_STATES);
    }
  }, [dialogValue]);

  // Dialog Cancel
  function handleCancelDialog() {
    dialogCloseFunction();
    setInputsValue(BLANK_INPUT_STATES);
  }

  // Handle Dialog Text Input Change
  function handleDialogTextInputChange(
    text: string,
    inputNumber: "input1" | "input2"
  ) {
    switch (inputNumber) {
      case "input1":
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            value: text,
            isError: text === "",
            isErrorMessage: t("components.dialogmodal.empty_error_message"),
          },
        }));
        break;
      case "input2":
        setInputsValue((prev) => ({
          ...prev,
          input2: {
            value: text.trim(),
            isError: text === "",
            isErrorMessage: t("components.dialogmodal.empty_error_message"),
          },
        }));
        break;

      default:
        break;
    }
  }

  // Handle Submit modal function
  function handleSubmitButton() {
    if (keyboardTypeNumberAddManyHouses === true) {
      if (
        inputsValues.input1.value &&
        parseInt(inputsValues.input1.value) < 1
      ) {
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            value: "",
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.less_than_1_error_message"
            ),
          },
        }));
        return;
      }

      if (
        inputsValues.input2.value &&
        parseInt(inputsValues.input2.value) < 1
      ) {
        setInputsValue((prev) => ({
          ...prev,
          input2: {
            value: "",
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.less_than_1_error_message"
            ),
          },
        }));
        return;
      }

      if (
        parseInt(inputsValues.input2.value) -
          parseInt(inputsValues.input1.value) <
        0
      ) {
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            ...prev.input1,
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.first_value_must_be_greater_than_second_message"
            ),
          },
        }));
        return;
      } else {
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            ...prev.input1,
            isError: false,
            isErrorMessage: "",
          },
        }));
      }

      if (
        parseInt(inputsValues.input2.value) -
          parseInt(inputsValues.input1.value) >
        100
      ) {
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            ...prev.input1,
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.more_than_100_error_message"
            ),
          },
        }));
        return;
      }

      if (
        inputsValues.input2.value === "" ||
        inputsValues.input2.value === undefined
      ) {
        setInputsValue((prev) => ({
          ...prev,
          input2: {
            ...prev.input2,
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.empty_error_message_fields"
            ),
          },
        }));
        return;
      }

      // RETORNO
      return dialogFunction(
        inputsValues.input1.value,
        inputsValues.input2.value
      );
    } else {
      if (
        inputsValues.input1.value === "" ||
        inputsValues.input1.value === undefined
      ) {
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            ...prev.input1,
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.empty_error_message_fields"
            ),
          },
        }));
        return;
      }

      // RETORNO
      return dialogFunction(inputsValues.input1.value);
    }
  }

  return (
    <>
      <StyledDialogContainer
        visible={dialogVisibleProp}
        onBackdropPress={handleCancelDialog}
      >
        <TextsContainer>
          <StyledDialogTitle>{dialogTitle}</StyledDialogTitle>
          <StyledDialogDescription>{dialogMessage}</StyledDialogDescription>

          {inputsValues.input1.isError && (
            <StyledDialogDescriptionErrorMessage>
              {inputsValues.input1.isErrorMessage}
            </StyledDialogDescriptionErrorMessage>
          )}

          {inputsValues.input2.isError && (
            <StyledDialogDescriptionErrorMessage>
              {inputsValues.input2.isErrorMessage}
            </StyledDialogDescriptionErrorMessage>
          )}
        </TextsContainer>

        {keyboardTypeNumberAddManyHouses ? (
          <View style={{ flexDirection: "row" }}>
            <StyledDialogInput3
              placeholder={t("components.dialogmodal.input_placeholder")}
              // autoCapitalize="words"
              // multiline
              numberOfLines={1}
              onChangeText={(e: string) =>
                handleDialogTextInputChange(e, "input1")
              }
              value={inputsValues.input1.value}
              keyboardType="numeric"
              maxLength={10}
              underlineColorAndroid="transparent"
            />

            <StyledDialogInput2
              placeholder={t("components.dialogmodal.input_placeholder")}
              // autoCapitalize="words"
              // multiline
              numberOfLines={1}
              onChangeText={(e: string) =>
                handleDialogTextInputChange(e, "input2")
              }
              value={inputsValues.input2.value}
              keyboardType="numeric"
              maxLength={10}
              underlineColorAndroid="transparent"
            />
          </View>
        ) : (
          <StyledDialogInput1
            placeholder={t("components.dialogmodal.input_placeholder")}
            // autoCapitalize="words"
            multiline
            numberOfLines={1}
            onChangeText={(e: string) =>
              handleDialogTextInputChange(e, "input1")
            }
            value={inputsValues.input1.value}
            keyboardType="default"
            maxLength={200}
            underlineColorAndroid="transparent"
          />
        )}

        <ButtonsContainer>
          <StyledDialogButtonCancel
            label={t("words.cancel")}
            onPress={handleCancelDialog}
          />
          <StyledDialogButtonOk
            label={t("words.add")}
            onPress={handleSubmitButton}
          />
        </ButtonsContainer>
      </StyledDialogContainer>
    </>
  );
}
