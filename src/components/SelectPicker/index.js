import React, { useState } from "react";
import i18next from 'i18next';
import { View } from "react-native";
import { Picker } from '@react-native-picker/picker';

export default function SelectPicker({visita, onChangeVisitValue}) {
  
  const SELECT_PICKER_OPTIONS = [
    { "value": 0, "bgColor":"#5e913430" , "fontColor":"#5e9134", "label": i18next.t("selectpickeroptions.bible_studies") },
    { "value": 1, "bgColor":"#7346ad30" , "fontColor":"#7346ad", "label": i18next.t("selectpickeroptions.revisit") },
    { "value": 2, "bgColor":"#25467c30" , "fontColor":"#25467c", "label": i18next.t("selectpickeroptions.second_visit") },
    { "value": 3, "bgColor":"#4a6da730" , "fontColor":"#4a6da7", "label": i18next.t("selectpickeroptions.first_visit") },
    { "value": 4, "bgColor":"#c33f5530" , "fontColor":"#c33f55", "label": i18next.t("selectpickeroptions.absentee") }
  ]

  const [pickerOptions, setPickerOptions] = useState([]);
  const [bgPickerColor, setBgPickerColor] = useState(SELECT_PICKER_OPTIONS[visita].bgColor);
  const [bgFontColor, setBgFontColor] = useState(SELECT_PICKER_OPTIONS[visita].fontColor);

  function handlePickerValueChange(idSelected){
    setPickerOptions({value: idSelected });
    setBgPickerColor(SELECT_PICKER_OPTIONS[idSelected].bgColor);
    setBgFontColor(SELECT_PICKER_OPTIONS[idSelected].fontColor);
    // Leva o ID para o select acima
    onChangeVisitValue(idSelected);
  }
  
  return (
    <View style={{ backgroundColor: bgPickerColor, borderRadius: 7, height: 42, borderLeftWidth: 7, borderLeftColor: bgFontColor }}>
      <Picker
        selectedValue={pickerOptions.length === 0 ? visita : pickerOptions.value }
        style={{ width: 180, marginTop: -6 }}
        onValueChange={(itemValue) => handlePickerValueChange(itemValue)}
        dropdownIconColor={bgFontColor}
      >
        {SELECT_PICKER_OPTIONS.map((item) => {
          return <Picker.Item key={item.value} label={`${item.label}`} value={item.value} color={item.fontColor} />;
        })}
      </Picker>
    </View>
  );
}
