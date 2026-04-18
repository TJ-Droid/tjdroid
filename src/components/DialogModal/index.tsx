import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Platform } from "react-native";
import { View } from "react-native-animatable";

import {
  ButtonsContainer,
  SegmentedControlButton,
  SegmentedControlButtonText,
  SegmentedControlContainer,
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

type AddManyHousesMode = "all" | "odd" | "even";

const countSelectedHouses = (
  initialValue: number,
  finalValue: number,
  mode: AddManyHousesMode,
) => {
  let total = 0;

  for (let i = initialValue; i <= finalValue; i++) {
    if (mode === "odd" && i % 2 === 0) {
      continue;
    }

    if (mode === "even" && i % 2 !== 0) {
      continue;
    }

    total += 1;
  }

  return total;
};

type DialogModalPropsType = {
  dialogVisibleProp: boolean;
  dialogMessage: string;
  dialogTitle: string;
  dialogValue?: string | undefined;
  dialogFunction: (
    value: string,
    value2?: string,
    addManyHousesMode?: AddManyHousesMode,
  ) => void;
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

  const getBlankInputStates = useCallback(
    () => ({
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
    }),
    [dialogValue],
  );

  const [inputsValues, setInputsValue] = useState(getBlankInputStates);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [addManyHousesMode, setAddManyHousesMode] =
    useState<AddManyHousesMode>("all");

  useEffect(() => {
    if (!dialogVisibleProp) {
      setKeyboardOffset(0);
      return;
    }

    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      const keyboardHeight = e.endCoordinates?.height ?? 0;
      if (keyboardHeight > 0) {
        setKeyboardOffset(Math.min(keyboardHeight / 2, 180));
      }
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [dialogVisibleProp]);

  useEffect(() => {
    setInputsValue(getBlankInputStates());
    setAddManyHousesMode("all");
  }, [dialogVisibleProp, dialogValue, getBlankInputStates]);

  function handleCancelDialog() {
    dialogCloseFunction();
    setInputsValue(getBlankInputStates());
    setAddManyHousesMode("all");
  }

  function handleDialogTextInputChange(
    text: string,
    inputNumber: "input1" | "input2",
  ) {
    switch (inputNumber) {
      case "input1":
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            value: text.trim(),
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

  function handleSubmitButton() {
    if (keyboardTypeNumberAddManyHouses === true) {
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
              "components.dialogmodal.empty_error_message_fields",
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
              "components.dialogmodal.empty_error_message_fields",
            ),
          },
        }));
        return;
      }

      if (parseInt(inputsValues.input1.value) < 1) {
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            value: "",
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.less_than_1_error_message",
            ),
          },
        }));
        return;
      }

      if (parseInt(inputsValues.input2.value) < 1) {
        setInputsValue((prev) => ({
          ...prev,
          input2: {
            value: "",
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.less_than_1_error_message",
            ),
          },
        }));
        return;
      }

      const initialValue = parseInt(inputsValues.input1.value);
      const finalValue = parseInt(inputsValues.input2.value);

      if (finalValue - initialValue < 0) {
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            ...prev.input1,
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.first_value_must_be_greater_than_second_message",
            ),
          },
        }));
        return;
      }

      setInputsValue((prev) => ({
        ...prev,
        input1: {
          ...prev.input1,
          isError: false,
          isErrorMessage: "",
        },
      }));

      const totalToAdd = countSelectedHouses(
        initialValue,
        finalValue,
        addManyHousesMode,
      );

      if (totalToAdd > 100) {
        setInputsValue((prev) => ({
          ...prev,
          input1: {
            ...prev.input1,
            isError: true,
            isErrorMessage: t(
              "components.dialogmodal.more_than_100_error_message",
            ),
          },
        }));
        return;
      }

      return dialogFunction(
        inputsValues.input1.value,
        inputsValues.input2.value,
        addManyHousesMode,
      );
    }

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
            "components.dialogmodal.empty_error_message_fields",
          ),
        },
      }));
      return;
    }

    return dialogFunction(inputsValues.input1.value);
  }

  const dialogContentStyle =
    Platform.OS === "android" && keyboardOffset > 0
      ? { transform: [{ translateY: -keyboardOffset }] }
      : undefined;

  return (
    <StyledDialogContainer
      visible={dialogVisibleProp}
      onBackdropPress={handleCancelDialog}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : undefined}
      contentStyle={dialogContentStyle}
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
        <>
          <SegmentedControlContainer>
            <SegmentedControlButton
              isActive={addManyHousesMode === "all"}
              onPress={() => setAddManyHousesMode("all")}
            >
              <SegmentedControlButtonText
                isActive={addManyHousesMode === "all"}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {t("components.dialogmodal.add_many_houses_mode_all")}
              </SegmentedControlButtonText>
            </SegmentedControlButton>

            <SegmentedControlButton
              isActive={addManyHousesMode === "odd"}
              onPress={() => setAddManyHousesMode("odd")}
            >
              <SegmentedControlButtonText
                isActive={addManyHousesMode === "odd"}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {t("components.dialogmodal.add_many_houses_mode_odd")}
              </SegmentedControlButtonText>
            </SegmentedControlButton>

            <SegmentedControlButton
              isActive={addManyHousesMode === "even"}
              isLast
              onPress={() => setAddManyHousesMode("even")}
            >
              <SegmentedControlButtonText
                isActive={addManyHousesMode === "even"}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {t("components.dialogmodal.add_many_houses_mode_even")}
              </SegmentedControlButtonText>
            </SegmentedControlButton>
          </SegmentedControlContainer>

          <View style={{ flexDirection: "row" }}>
            <StyledDialogInput3
              placeholder={t("components.dialogmodal.input_placeholder")}
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
        </>
      ) : (
        <StyledDialogInput1
          placeholder={t("components.dialogmodal.input_placeholder")}
          multiline
          numberOfLines={1}
          onChangeText={(e: string) => handleDialogTextInputChange(e, "input1")}
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
  );
}
