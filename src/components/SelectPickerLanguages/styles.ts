import { Picker } from "@react-native-picker/picker";
import styled from "styled-components/native";

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
  height: 56px;
  color: ${({ theme }) => theme.color.primary};
`;
