import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import styled from "styled-components/native";

export const TopSectionContainer = styled.View`
  padding: 10px 15px;
  width: 100%;
`;

export const TopSectionContainerArea = styled.View`
  justify-content: center;
  align-items: center;
`;

export const TopSectionTextInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: `${theme.color.primary}80`,
}))`
  margin: 10px 15px 10px 15px;
  padding: 10px 15px;
  background: ${({ theme }) => theme.color.bg};
  width: 100%;
  color: ${({ theme }) => theme.color.primary};
  border: 1px solid ${({ theme }) => theme.color.primary}99;
  font-size: 17px;
  border-radius: 7px;
  elevation: 3;
`;

export const BottomSectionContainer = styled.View`
  background: ${({ theme }) => theme.color.primary}08;
  width: 100%;
  padding: 20px 15px;
`;

export const BottomSectionActionButtonsContainer = styled.View<{
  ocultarCampos?: boolean;
}>`
  width: 100%;
  height: auto;
`;

export const BottomSectionButtonsWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const BottomSectionTextArea = styled.View`
  flex: 0.7;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const BottomSectionLabelText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.color.primary_dark};
  padding: 0px 12px;
  text-align: right;
  text-transform: capitalize;
`;

export const BottomSectionLabelDateTimeText = styled.Text`
  color: ${({ theme }) => theme.color.primary_dark};
`;

export const BottomSectionButtonsArea = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
`;

export const BottomSectionButtonWrapper = styled.View<{
  marginRight?: number;
}>`
  background: ${({ theme }) => theme.color.primary}20;
  border-radius: 7px;
  padding: 8px;
  margin-right: ${({ marginRight }) =>
    marginRight ? marginRight + "px" : "0px"};
`;

export const BottomSectionQuantityText = styled.Text`
  width: 100%;
  max-width: 70px;
  text-align: center;
  font-size: 24px;
  color: ${({ theme }) => theme.color.primary_dark};
  padding: 0px 12px;
`;

// ScrollView
export const StyledScrollView = styled(ScrollView)`
  background: ${({ theme }) => theme.color.bg};
`;

// Componentes com Feather Icons
export const StyledFeatherIconSectionButton = styled(Feather)`
  color: ${({ theme }) => theme.color.primary_dark};
`;
