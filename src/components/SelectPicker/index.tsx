import { Picker } from "@react-native-picker/picker";
import i18next from "i18next";
import React, { memo, useCallback, useMemo } from "react";
import { Appearance, View } from "react-native";

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

type SelectPickerBaseOptionsType = {
  value: number;
  bgColor: string;
  fontColorLight: string;
  fontColorDark: string;
  labelKey: string;
};

const SELECT_PICKER_BASE_OPTIONS: SelectPickerBaseOptionsType[] = [
  {
    value: 0,
    bgColor: "#5e913430",
    fontColorLight: "#5e9134",
    fontColorDark: "#5e9134",
    labelKey: "selectpickeroptions.bible_studies",
  },
  {
    value: 1,
    bgColor: "#7346ad30",
    fontColorLight: "#7346ad",
    fontColorDark: "#9166caff",
    labelKey: "selectpickeroptions.revisit",
  },
  {
    value: 2,
    bgColor: "#25467c30",
    fontColorLight: "#25467c",
    fontColorDark: "#4476c7ff",
    labelKey: "selectpickeroptions.second_visit",
  },
  {
    value: 3,
    bgColor: "#4a6da730",
    fontColorLight: "#4a6da7",
    fontColorDark: "#7e9fd3ff",
    labelKey: "selectpickeroptions.first_visit",
  },
  {
    value: 4,
    bgColor: "#d7754930",
    fontColorLight: "#d77549",
    fontColorDark: "#d77549",
    labelKey: "selectpickeroptions.absentee",
  },
  {
    value: 5,
    bgColor: "#c33f5530",
    fontColorLight: "#c33f55",
    fontColorDark: "#c33f55",
    labelKey: "selectpickeroptions.refused",
  },
];

function SelectPicker({
  visita = 0,
  onChangeVisitValue,
}: SelectPickerPropsType) {
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === "dark";

  const pickerOptions = useMemo(
    () =>
      SELECT_PICKER_BASE_OPTIONS.map((item) => ({
        value: item.value,
        bgColor: item.bgColor,
        fontColor: isDarkMode ? item.fontColorDark : item.fontColorLight,
        label: i18next.t(item.labelKey),
      })) as SelectPickerOptionsType[],
    [isDarkMode, i18next.language]
  );

  const selectedOption = useMemo(
    () =>
      pickerOptions.find((item) => item.value === visita) ??
      pickerOptions[0],
    [pickerOptions, visita]
  );
  const bgPickerColor = selectedOption.bgColor;
  const bgFontColor = selectedOption.fontColor;

  const handlePickerValueChange = useCallback(
    (itemIndex: number) => {
      // Leva o ID para o select acima
      onChangeVisitValue(itemIndex);
    },
    [onChangeVisitValue]
  );

  const containerStyle = useMemo(
    () => ({
      backgroundColor: bgPickerColor,
      borderRadius: 7,
      height: 42,
      borderLeftWidth: 7,
      borderLeftColor: bgFontColor,
    }),
    [bgFontColor, bgPickerColor]
  );

  const pickerStyle = useMemo(
    () => ({ width: 180, marginTop: -6, color: bgFontColor }),
    [bgFontColor]
  );

  const pickerItems = useMemo(
    () =>
      pickerOptions.map((item) => (
        <Picker.Item
          key={item.value}
          label={`${item.label}`}
          value={item.value}
          color={item.fontColor}
        />
      )),
    [pickerOptions]
  );

  return (
    <View style={containerStyle}>
      <Picker
        selectedValue={visita}
        style={pickerStyle}
        onValueChange={handlePickerValueChange}
        dropdownIconColor={bgFontColor}
      >
        {pickerItems}
      </Picker>
    </View>
  );
}

export default memo(SelectPicker);
