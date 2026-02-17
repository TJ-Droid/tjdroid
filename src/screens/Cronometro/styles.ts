import { ScrollView } from "react-native";
import styled from "styled-components/native";

export const StyledScrollView = styled(ScrollView)`
  background: ${({ theme }) => theme.color.bg};
  height: 100%;
  flex: 1;
`;
