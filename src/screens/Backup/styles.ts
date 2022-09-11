import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import IconGoogleDrive from "../../images/svg/iconGoogleDrive";

export const Container = styled.ScrollView`
  background: ${({ theme }) => theme.color.bg};
`;

export const ItemList = styled.View`
  padding: 14px 15px;
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.primary}20;
`;

export const ItemListColumn = styled.View`
  padding: 14px 15px;
  width: 100%;
  height: auto;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.primary}20;
`;

export const ItemListSpaceBetween = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ItemListTitleSpace = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export const ItemListTextTitle = styled.Text`
  width: 100%;
  font-size: 18px;
  color: ${({ theme }) => theme.color.text_secondary};
`;

export const ItemListTextTitleCentered = styled.Text`
  width: 100%;
  font-size: 18px;
  text-align: center;
  color: ${({ theme }) => theme.color.text_secondary};
`;

export const ItemListTextDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color.text_secondary}90;
`;

export const ItemListTextDescriptionCentered = styled.Text`
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.color.text_secondary}90;
`;

export const SectionDivider = styled.View`
  padding: 6px 15px;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.color.primary}28;
`;

export const SectionDividerText = styled.Text`
  color: ${({ theme }) => theme.color.text_list_divider};
  font-size: 18px;
`;

export const SectionDividerIconWrapper = styled.View`
  margin-right: 10px;
`;

export const StyledIconGoogleDrive = styled(IconGoogleDrive).attrs(
  ({ theme }) => ({
    iconColor: theme.color.text_list_divider,
  })
)``;

export const StyledZipIcon = styled.Text`
  background-color: ${({ theme }) => theme.color.text_list_divider};
  color: ${({ theme }) => theme.color.bg};
  padding: 0px 5px 3px 5px;
  border-radius: 3px;
  margin-left: 10px;
`;

export const StyledFeatherButtonWrapper = styled.View<{
  bgColor: string;
  marginBottom: string;
}>`
  flex: 1;
  background-color: ${(props) => props.bgColor};
  flex-direction: row;
  align-items: center;
  border-radius: 50px;
  margin-bottom: ${(props) => props.marginBottom};
  padding-right: 14px;
`;

export const StyledFeatherButtonLeftOverlay = styled.View`
  border-radius: 50px;
  background-color: #00000020;
  padding: 8px 0px 8px 14px;
  margin-right: 10px;
`;

export const StyledFeatherButtonLeftIcon = styled(Feather)`
  color: #ffffff;
  margin-right: 15px;
  font-size: 25px;
`;

export const StyledFeatherButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  flex: 1;
`;
