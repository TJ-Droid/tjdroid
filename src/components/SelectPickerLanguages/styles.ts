import styled from "styled-components/native";
import { Picker } from "@react-native-picker/picker";

export const Container = styled.View`
  border-width: 1px;
  border-radius: 7px;
  border-color: ${({ theme }) => theme.color.primary}80;
  border-left-width: 7px;
  border-left-color: ${({ theme }) => theme.color.primary}80;
`;

export const StyledPicker = styled(Picker).attrs(({ theme }) => ({
  dropdownIconColor: `${theme.color.text_primary}`,
}))`
  width: 100%;
  height: 48px;
  margin-top: -6px;
  color: ${({ theme }) => theme.color.primary};
`;
