import React, { useState } from "react";
import i18next from "i18next";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type SelectPickerPropsType = {
  visita: number;
  onChangeVisitValue: (indexItemSelected: number) => void;
};

type SelectPickerOptionsType = {
  value: number;
  bgColor: string;
  fontColor: string;
  label: string;
};

export default function SelectPicker({
  visita = 0,
  onChangeVisitValue,
}: SelectPickerPropsType) {
  const SELECT_PICKER_OPTIONS = [
    {
      value: 0,
      bgColor: "#5e913430",
      fontColor: "#5e9134",
      label: i18next.t("selectpickeroptions.bible_studies"),
    },
    {
      value: 1,
      bgColor: "#7346ad30",
      fontColor: "#7346ad",
      label: i18next.t("selectpickeroptions.revisit"),
    },
    {
      value: 2,
      bgColor: "#25467c30",
      fontColor: "#25467c",
      label: i18next.t("selectpickeroptions.second_visit"),
    },
    {
      value: 3,
      bgColor: "#4a6da730",
      fontColor: "#4a6da7",
      label: i18next.t("selectpickeroptions.first_visit"),
    },
    {
      value: 4,
      bgColor: "#d7754930",
      fontColor: "#d77549",
      label: i18next.t("selectpickeroptions.absentee"),
    },
    {
      value: 5,
      bgColor: "#c33f5530",
      fontColor: "#c33f55",
      label: i18next.t("selectpickeroptions.refused"),
    },
  ] as SelectPickerOptionsType[];

  const [pickerOptionSelected, setPickerOptionSelected] = useState(visita);
  const [bgPickerColor, setBgPickerColor] = useState(
    SELECT_PICKER_OPTIONS[visita].bgColor
  );
  const [bgFontColor, setBgFontColor] = useState(
    SELECT_PICKER_OPTIONS[visita].fontColor
  );

  function handlePickerValueChange(itemIndex: number) {
    setPickerOptionSelected(itemIndex);
    setBgPickerColor(SELECT_PICKER_OPTIONS[itemIndex].bgColor);
    setBgFontColor(SELECT_PICKER_OPTIONS[itemIndex].fontColor);
    // Leva o ID para o select acima
    onChangeVisitValue(itemIndex);
  }

  return (
    <View
      style={{
        backgroundColor: bgPickerColor,
        borderRadius: 7,
        height: 42,
        borderLeftWidth: 7,
        borderLeftColor: bgFontColor,
      }}
    >
      <Picker
        selectedValue={
          // pickerOptions.length === 0 ? visita : pickerOptions.value
          pickerOptionSelected
        }
        style={{ width: 180, marginTop: -6 }}
        onValueChange={(itemIndex) => handlePickerValueChange(itemIndex)}
        dropdownIconColor={bgFontColor}
      >
        {SELECT_PICKER_OPTIONS.map((item) => {
          return (
            <Picker.Item
              key={item.value}
              label={`${item.label}`}
              value={item.value}
              color={item.fontColor}
            />
          );
        })}
      </Picker>
    </View>
  );
}
