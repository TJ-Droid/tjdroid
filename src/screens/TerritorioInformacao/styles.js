import styled from 'styled-components/native';
import { ScrollView } from "react-native-gesture-handler";

export const TopSectionContainer = styled.View`
  padding: 10px 15px;
  width: 100%;
`;

export const TopSectionContainerArea = styled.View`
  justify-content: center;
  align-items: center;
`;

export const TopSectionTextInput = styled.TextInput.attrs(({theme}) => ({
    placeholderTextColor: `${theme.color.primary}80`,
  }))`
  margin: 10px 15px 10px 15px;
  padding: 10px 15px;
  background: ${({theme}) => theme.color.bg};
  width: 100%;
  color: ${({theme}) => theme.color.primary};
  border: 1px solid ${({theme}) => theme.color.primary};
  font-size: 17px;
  border-radius: 7px;
`;

export const BottomSectionContainer = styled.View`
  background: ${({theme}) => theme.color.primary}08;
  width: 100%;
  min-height: 100px;
  padding: 20px 15px;
`;

export const BottomSectionActionButtonsContainer = styled.View`
  width: 100%;
  min-height: 200px;
  max-height: 200px;
`;

export const BottomSectionButtonsWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const BottomSectionTextArea = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const BottomSectionLabelText = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.color.primary_dark};
  padding: 0px 12px;
  text-align: right;
`;

export const BottomSectionButtonsArea = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const BottomSectionButtonWrapper = styled.View`
  background: ${({theme}) => theme.color.primary}20;
  border-radius: 7px;
  padding: 10px;
  width: 100%;
`;

export const BottomSectionButtonWrapperDisabled = styled.View`
  border-radius: 7px;
  padding: 10px;
  width: 100%;
`;

export const BottomSectionDateText = styled.Text`
  text-align: center;
  font-size: 15px;
  color: ${({theme}) => theme.color.primary_dark};
  padding: 0px 2px;
  font-weight: bold;
`;

// ScrollView
export const StyledScrollView = styled(ScrollView)`
  background: ${({theme}) => theme.color.bg};
`;
