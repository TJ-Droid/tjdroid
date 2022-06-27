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

export const ItemListPerson = styled.View`
  width: 55%;
  flex-direction: column;
  justify-content: space-between;
`;

export const ItemListTextName = styled.Text`
  width: 100%;
  font-size: 18px;
  color: ${({ theme }) => theme.color.text_primary};
  text-transform: capitalize;
`;

export const ItemListTextDateVisits = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color.text_primary}80;
`;

export const ItemListTextLastVisit = styled.Text<{
  fontColor: string;
}>`
  font-size: 16px;
  color: ${(props) => props.fontColor};
  background: ${(props) => props.fontColor}20;
  text-align: right;
  padding: 4px 14px;
  border-radius: 40px;
  font-weight: bold;
`;

export const ItemListTextNoVisits = styled.Text`
  font-size: 16px;
  color: #99999980;
  background: #99999910;
  text-align: right;
  padding: 4px 14px;
  border-radius: 40px;
  font-weight: bold;
`;
