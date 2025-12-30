import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Container = styled(SafeAreaView)`
  background: ${({ theme }) => theme.color.bg};
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const ItemList = styled.View`
  padding: 0px 15px;
  width: 100%;
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.color.bg};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.primary}20;
`;

export const ItemListDay = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

export const ItemListTextDay = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.color.text_primary}99;
  font-weight: bold;
`;

export const ItemListTextDayInfo = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.color.text_secondary}90;
  text-transform: capitalize;
`;

export const ItemListTextLastVisit = styled.Text<{
  fontColor: string;
  bgColor: string;
}>`
  font-size: 14px;
  color: ${(props) => props.fontColor};
  background: ${(props) => props.bgColor};
  text-align: right;
  padding: 4px 14px;
  border-radius: 40px;
  font-weight: bold;
`;

export const HeaderBoxPersonName = styled.View`
  padding: 10px 15px;
  width: 100%;
  height: auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.color.primary}20;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.primary}30;
`;

export const HeaderPersonName = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.primary};
  width: 90%;
  text-align: center;
`;

export const HeaderPersonNameIcon = styled(Feather)`
  color: ${({ theme }) => theme.color.primary}70;
  padding: 10px;
`;
