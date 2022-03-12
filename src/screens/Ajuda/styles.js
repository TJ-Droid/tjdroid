import styled from "styled-components/native";
import { View, Text } from "react-native-animatable";
import { Feather } from "@expo/vector-icons";

export const Container = styled.ScrollView`
  background: ${({ theme }) => theme.color.bg};
`;

export const HeaderTextContainer = styled(View).attrs((props) => ({
  duration: props.durationProp,
  transition: props.transitionProp,
}))`
  background-color: ${(props) =>
    props.isActiveProp
      ? ({ theme }) => `${theme.color.help_selected_bg}`
      : ({ theme }) => theme.color.bg};
  /* background-color: ${({ theme }) => theme.color.bg}; */
  padding: 10px 20px;
  border-bottom-color: ${({ theme }) => theme.color.primary}25;
  border-bottom-width: ${(props) => (props.isActiveProp ? "0px" : "1px")};
  /* border-bottom-width: 1px; */

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderText = styled.Text`
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.primary};
`;

export const HeaderDescriptionContainer = styled(View).attrs((props) => ({
  duration: props.durationProp,
  transition: props.transitionProp,
}))`
  background-color: ${(props) =>
    props.isActiveProp
      ? ({ theme }) => `${theme.color.help_selected_bg}`
      : ({ theme }) => theme.color.bg};
  padding: 4px 20px 20px 20px;
  border-bottom-color: ${({ theme }) => theme.color.primary}25;
  border-bottom-width: 1px;
`;

export const DescriptionText = styled(Text).attrs((props) => ({
  animation: props.animationProp ? "fadeInUp" : undefined,
}))`
  text-align: left;
  font-size: 18px;
  color: ${({ theme }) => theme.color.text_primary}80;
`;

export const StyledFeatherIcon = styled(Feather)`
  color: ${({ theme }) => theme.color.primary};
`;