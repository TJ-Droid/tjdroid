import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  background: ${({theme}) => theme.color.bg};
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const HeaderTotalsBox = styled.View`
  padding: 15px;
  width: 100%;
  height: auto;
  flex-direction: column;
  background: ${({theme}) => theme.color.primary}20;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.color.primary}30;
`;

export const HeaderTotalsTopSection = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

export const HeaderTotalsTopSectionText = styled.Text`
  color: ${({theme}) => theme.color.primary_dark};
  font-size: 20px;
  font-weight: bold;
`;

export const HeaderTotalsTopSectionHours = styled.Text`
  color: ${({theme}) => theme.color.primary_dark};
  font-size: 22px;
  font-weight: bold;
`;

export const HeaderTotalsBottomSection = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;

export const HeaderTotalsBottomSectionText = styled.Text`
  color: ${({theme}) => theme.color.text_primary};
  font-size: 17px;
`;

export const ItemList = styled.View`
  padding: 7px 15px;
  width: 100%;
  height: auto;
  flex-direction: column;
  background: ${({theme}) => theme.color.bg};
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.color.primary}20;
`;

export const ItemListTopContent = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const ItemListTopContentDayText = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.color.text_secondary};
`;

export const ItemListTopContentHoursText = styled.Text`
  background: ${({theme}) => theme.color.primary}20;
  color: ${({theme}) => theme.color.primary_dark};
  font-size: 16px;
  font-weight: bold;
  padding: 6px 10px;
  border-radius: 50px;
`;

export const ItemListMidleContent = styled.View`
  width: 100%;
`;

export const ItemListMidleContentText = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.color.text_secondary}90;
`;


export const ItemListBottomContent = styled.View`
  width: 100%;
  margin-top: 3px;
`;

export const ItemListBottomContentText = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.color.text_secondary}70;
`;