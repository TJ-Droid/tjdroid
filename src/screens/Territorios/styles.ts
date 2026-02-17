import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
  padding: 10px 15px;
  width: 100%;
  height: auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.color.bg};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.primary}20;
`;

export const ItemListTerritory = styled.View`
  width: 65%;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

export const ItemListTerritoryTextName = styled.Text`
  width: 100%;
  font-size: 18px;
  color: ${({ theme }) => theme.color.text_secondary};
  /* text-transform: capitalize; */
`;

export const ItemListTextDateSelected = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color.text_secondary}99;
  text-align: right;
  padding: 0px 2px;
  border-radius: 40px;
`;

export const ItemListTextDateWorked = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color.text_secondary};
  text-align: right;
  padding: 0px 2px;
  border-radius: 40px;
  font-weight: bold;
`;

export const DateIconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
`;

export const StyledMaterialCommunityIconsDateIcon = styled(
  MaterialCommunityIcons,
)`
  color: ${({ theme }) => theme.color.primary_dark};
`;
