import styled from 'styled-components/native';

export const Container = styled.View`
  background: ${({theme}) => theme.color.bg};
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const StyuledActivityIndicator = styled.ActivityIndicator.attrs(({theme}) => ({
  color: theme.color.primary,
}))``;