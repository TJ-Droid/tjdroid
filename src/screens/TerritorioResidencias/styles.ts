import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  background: ${({ theme }) => theme.color.bg};
  flex: 1;
`;

export const ItemList = styled.View`
  padding: 7px 0px 0px 0px;
  flex: 1;
  height: auto;
  flex-direction: column;
  background: ${({ theme }) => theme.color.bg};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.primary}20;
`;

export const ItemListTerritoryColor = styled.View<{
  bgColor: string;
}>`
  width: 10px;
  height: 100%;
  background: ${(props) => props.bgColor};
  margin-right: 10px;
  /* opacity: 0.7; */
`;

export const ItemListTerritory = styled.View`
  width: 98%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const ItemListTerritoryTitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.color.text_primary}99;
  text-transform: capitalize;
  font-weight: bold;
  padding: 0px 0px 8px 0px;
`;

export const ItemListTerritoryQuantityVisits = styled.Text`
  color: ${({ theme }) => theme.color.primary};
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border-radius: 50px;
  padding: 4px 10px;
  background: ${({ theme }) => theme.color.primary}20;
`;

export const ItemListTerritoryQuantityZeroVisits = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border-radius: 50px;
  padding: 4px 10px;
  margin-top: -7px;
  color: #99999980;
  background: #99999910;
`;

export const ItemListTerritoryDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color.text_secondary}80;
  padding: 0px 10px 12px 0px;
  width: 100%;
`;

export const ItemListTerritoryTextBold = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color.text_secondary}80;
  font-weight: bold;
`;

export const TerritoryBoxText = styled.Text`
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 6px #00000040;
`;
