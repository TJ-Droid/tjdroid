import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native";

export const TopSectionContainer = styled.View`
  padding: 20px 15px;
  width: 100%;
  min-height: 170px;
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
  border: 1px solid ${({ theme }) => theme.color.primary};
  font-size: 17px;
  border-radius: 7px;
  elevation: 3;
`;

export const ContadorArea = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 110px;
  margin-top: 10px;
  margin-bottom: -15px;
  margin-top: -15px;
`;

export const ContadorButtonArea = styled.View`
  background: ${({ theme }) => theme.color.primary}20;
  border-radius: 7px;
  padding: 10px;
`;

export const ContadorMinutesText = styled.Text`
  font-size: 82px;
  color: ${({ theme }) => theme.color.primary};
  margin-top: -10px;
  padding: 0px 12px;
  font-family: monospace;
  letter-spacing: -7px;
`;

export const BottomSectionContainer = styled.View`
  background: ${({ theme }) => theme.color.primary}08;
  width: 100%;
  min-height: 100px;
  padding: 20px 15px;
`;

export const BottomSectionActionButtonsContainer = styled.View`
  width: 100%;
  min-height: 200px;
  max-height: 200px;
`;

export const BottomSectionMessageContainer = styled.View`
  width: 100%;
  padding: 10px 0px;
  justify-content: center;
  align-items: center;
`;

export const BottomSectionMessageText = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.color.primary};
  padding: 0px 12px;
  text-align: center;
  max-width: 500px;
`;

export const BottomSectionButtonsWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const BottomSectionTextArea = styled.View`
  flex: 1.2;
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
`;

export const BottomSectionButtonWrapper = styled.View<{
  marginRight?: number;
}>`
  background: ${({ theme }) => theme.color.primary}20;
  border-radius: 7px;
  padding: 8px;
  margin-right: ${({ marginRight }) =>
    marginRight ? `${marginRight}px` : "0px"};
`;

export const BottomSectionQuantityText = styled.Text`
  width: 60px;
  text-align: center;
  font-size: 24px;
  color: ${({ theme }) => theme.color.primary_dark};
  padding: 0px 12px;
`;

export const BottomSectionTextAreaVideoBulletButton = styled.View`
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.color.primary}40;
  border-radius: 7px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  margin-top: 6px;
`;

export const BottomSectionTextAreaVideoBulletText = styled.Text`
  color: ${({ theme }) => theme.color.primary}99;
`;

// ScrollView

export const StyledScrollView = styled(ScrollView)`
  background: ${({ theme }) => theme.color.bg};
`;

// Componentes com Feather Icons

export const StyledFeatherIconContadorButton = styled(Feather)`
  color: ${({ theme }) => theme.color.primary_dark};
`;

export const StyledFeatherIconSectionButton = styled(Feather)`
  color: ${({ theme }) => theme.color.primary_dark};
`;

export const StyledFeatherIconVideoPlay = styled(Feather)`
  color: ${({ theme }) => theme.color.primary}60;
`;
