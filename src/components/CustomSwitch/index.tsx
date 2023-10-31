import React, { useEffect, useState } from "react";
import {
  StyledContainer,
  StyledButtonSwitch,
  StyledButtonText,
} from "./styles";

type CustomSwitchPropsType = {
  isChecked: boolean;
  option1Text: string;
  option2Text: string;
  disabled: boolean;
  onSelectSwitch: (isChecked: boolean) => void;
};

const CustomSwitch = ({
  isChecked = true,
  option1Text,
  option2Text,
  onSelectSwitch,
  disabled,
}: CustomSwitchPropsType) => {
  const [isSelected, setIsSelected] = useState(isChecked);

  const updatedSwitchData = (val: boolean) => {
    setIsSelected(val);
    onSelectSwitch(val);
  };

  useEffect(() => {
    setIsSelected(isChecked);
  }, [isChecked]);

  return (
    <StyledContainer>
      <StyledButtonSwitch
        activeOpacity={1}
        onPress={() => updatedSwitchData(true)}
        isSelected={isSelected}
        disabled={disabled}
        style={{ opacity: disabled ? 0.7 : 1 }}
      >
        <StyledButtonText
          isSelected={isSelected}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {option1Text}
        </StyledButtonText>
      </StyledButtonSwitch>
      <StyledButtonSwitch
        activeOpacity={1}
        onPress={() => updatedSwitchData(false)}
        isSelected={!isSelected}
        disabled={disabled}
        style={{ opacity: disabled ? 0.7 : 1 }}
      >
        <StyledButtonText
          isSelected={!isSelected}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {option2Text}
        </StyledButtonText>
      </StyledButtonSwitch>
    </StyledContainer>
  );
};
export default CustomSwitch;
