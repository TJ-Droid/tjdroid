import styled from 'styled-components/native';
import { Feather } from "@expo/vector-icons";

export const Container = styled.ScrollView`
  background: ${({theme}) => theme.color.bg};
`;

export const ItemList = styled.View`
  padding: 14px 15px;
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: center;
  /* background: ${({theme}) => theme.color.bg}; */
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.color.primary}20;
`;

export const ItemListSpaceBetween = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ItemListTitleSpace60 = styled.View`
  width: 60%;
  flex-direction: column;
  justify-content: space-between;
`;

export const ItemListTitleSpace100 = styled.View`
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export const ItemListTextTitle = styled.Text`
  width: 100%;
  font-size: 18px;
  color: ${({theme}) => theme.color.text_secondary};
`;

export const ItemListTextDescription = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.color.text_secondary}90;
`;

export const ItemListTextDescriptionTranslation = styled.Text`
  font-size: 16px;
  margin-top: 10px;
  color: ${({theme}) => theme.color.text_secondary}90;
`;

export const ItemListBoxSpace = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
`;

// Cor da borda do tema selecionado é fixo
export const ItemListBoxButtonCircleColor = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  background: ${props => props.bgColor};
  border-radius: 26px;
  margin-right: 6px;
  margin-bottom: 6px;
  ${props => props.selected && `border: 5px solid #cdcdcd`}
`;

export const StyledFeatherLeftIcon = styled(Feather)`
  color: ${({theme}) => theme.color.text_secondary};
  margin-right: 15px;
  font-size: 25px;
`;

export const SectionDivider = styled.View`
  padding: 6px 15px;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: ${({theme}) => theme.color.primary}28;
`;

export const SectionDividerText = styled.Text`
  color: ${({theme}) => theme.color.text_list_divider};
  font-size: 18px;
`;