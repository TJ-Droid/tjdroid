import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

export const StyledContainer = styled.View`
  min-width: 110px;
  background-color: "#ffffff30";
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.primary};
  border-radius: 50px;
  flex-direction: row;
  justify-content: center;
  padding: 2px;
`;

export const StyledButtonSwitch = styled(TouchableOpacity)<{
  isSelected?: boolean;
}>`
  flex: 1;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 4px;
  padding-bottom: 4px
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.primary : "#ffffff00"};
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;

export const StyledButtonText = styled.Text<{
  isSelected?: boolean;
}>`
  color: ${({ theme, isSelected }) =>
    isSelected ? "#ffffff" : theme.color.primary};
  font-size: 14px;
`;
