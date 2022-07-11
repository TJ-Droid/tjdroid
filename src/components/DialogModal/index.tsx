import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ButtonsContainer,
  TextsContainer,
  StyledDialogTitle,
  StyledDialogInput,
  StyledDialogButtonCancel,
  StyledDialogButtonOk,
  StyledDialogDescription,
  StyledDialogDescriptionErrorMessage,
  StyledDialogContainer,
} from "./styles";

type DialogModalPropsType = {
  dialogVisibleProp: boolean;
  dialogMessage: string;
  dialogTitle: string;
  dialogValue: string | undefined;
  dialogFunction: (value: string | undefined) => void;
  dialogCloseFunction: () => void;
  keyboardTypeNumber: boolean;
};

export default function DialogModal({
  dialogVisibleProp,
  dialogMessage,
  dialogTitle,
  dialogValue,
  dialogFunction,
  dialogCloseFunction,
  keyboardTypeNumber = false,
}: DialogModalPropsType) {
  const { t } = useTranslation();

  // Dialog states
  const [firstValue, setFirstValue] = useState(true);
  const [dialogTextInputValue, setDialogTextInputValue] = useState(dialogValue);
  const [dialogTextInputError, setDialogTextInputError] = useState(false);
  const [dialogTextInputErrorMessage, setDialogTextInputErrorMessage] =
    useState<string>(t("components.dialogmodal.empty_error_message"));

  // useEffect(() => {
  //   setDialogTextInputValue(dialogValue);
  // }, []);

  // Dialog Cancel
  function handleCancelDialog() {
    dialogCloseFunction();
    setDialogTextInputValue("");
    setDialogTextInputError(false);
  }

  // Handle Dialog Text Input Change
  function handleDialogTextInputChange(text: string) {
    setDialogTextInputValue(text);
    if (text === "") {
      setDialogTextInputErrorMessage(
        t("components.dialogmodal.empty_error_message")
      );
      setDialogTextInputError(true);
    } else {
      setDialogTextInputError(false);
    }
    setFirstValue(false);
  }

  // Handle Submit modal function
  function handleSubmitButton() {
    if (
      keyboardTypeNumber === true &&
      dialogTextInputValue &&
      parseInt(dialogTextInputValue) < 1
    ) {
      setDialogTextInputErrorMessage(
        t("components.dialogmodal.less_than_1_error_message")
      );
      setDialogTextInputValue("");
      setDialogTextInputError(true);
      return;
    }

    if (
      keyboardTypeNumber === true &&
      dialogTextInputValue &&
      parseInt(dialogTextInputValue) >= 100
    ) {
      setDialogTextInputErrorMessage(
        t("components.dialogmodal.more_than_100_error_message")
      );
      setDialogTextInputError(true);
      setDialogTextInputValue("100");
      return;
    }

    if (
      dialogValue !== "" &&
      firstValue === true &&
      dialogValue !== undefined
    ) {
      return dialogFunction(dialogValue);
    } else {
      if (dialogTextInputValue === "" || dialogTextInputValue === undefined) {
        setDialogTextInputErrorMessage(
          t("components.dialogmodal.empty_error_message")
        );
        setDialogTextInputError(true);
      } else {
        return dialogFunction(dialogTextInputValue);
      }
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

          {dialogTextInputError && (
            <StyledDialogDescriptionErrorMessage>
              {dialogTextInputErrorMessage}
            </StyledDialogDescriptionErrorMessage>
          )}
        </TextsContainer>

        <StyledDialogInput
          placeholder={t("components.dialogmodal.input_placeholder")}
          // autoCapitalize="words"
          multiline
          numberOfLines={1}
          onChangeText={(e) => handleDialogTextInputChange(e)}
          value={
            firstValue
              ? dialogValue !== ""
                ? dialogValue
                : dialogTextInputValue
              : dialogTextInputValue
          }
          keyboardType={keyboardTypeNumber ? "numeric" : "default"}
          maxLength={keyboardTypeNumber ? 3 : 200}
          underlineColorAndroid="transparent"
        />

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
