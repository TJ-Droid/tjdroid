import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
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
  background: ${({ theme }) => theme.color.bg};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.primary}20;
`;

export const ItemListMonthHour = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ItemListTextMonth = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.color.text_secondary};
  text-transform: capitalize;
`;

export const ItemListTextHour = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.color.text_secondary};
`;

export const HeaderItemList = styled.View`
  padding: 0px 15px;
  width: 100%;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.color.bg_list_divider};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.primary}20;
`;

export const HeaderItemListText = styled.Text`
  font-size: 19px;
  font-weight: bold;
  height: 40px;
  padding-top: 6px;
  color: ${({ theme }) => theme.color.text_list_divider};
  align-self: center;
`;
