import styled from "styled-components/native";
import { StatusBar, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.color.header_bg};
  padding: 0px 15px 0px 15px;
  flex-direction: row;
  align-items: center;
  height: 56px;
  position: relative;
  elevation: 5;
`;

export const ContainerTitleButtons = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.header_text};
  font-size: 20px;
  flex: 1;
`;

export const ContainerButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 42px;
`;

export const WrapperButton = styled.View`
  margin-left: 12px;
`;

export const StyledFeatherHeaderButtons = styled(Feather)`
  color: ${({ theme }) => theme.color.white};
  padding: 6px 0px;
`;

export const StyledIoniconsHeaderButtons = styled(Ionicons)`
  color: ${({ theme }) => theme.color.white};
  padding: 6px 0px;
`;

export const StyledFeatherHeaderButtonsIcon = styled(Feather)`
  color: ${({ theme }) => theme.color.white};
  margin-left: 6px;
`;

export const StyledFeatherHeaderButtonsIconRed = styled(Feather)`
  color: ${({ theme }) => theme.color.header_buttons_red};
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.color.white};
  font-size: 17px;
  text-transform: capitalize;
`;

export const StyledStatusBar = styled(StatusBar).attrs(({ theme }) => ({
  barStyle: theme.statusbar_style,
  backgroundColor: theme.color.statusbar_bg,
}))``;

export const StyledButtonSave = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.color.black_translucent10};
  padding: 0px 5px;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  /* width: 120px; */
`;

export const StyledButton = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.color.black_translucent10};
  padding: 0px 5px;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  margin-left: -6px;
`;

export const StyledButtonDelete = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.color.red_translucent40};
  padding: 0px 5px;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  margin-left: -6px;
`;

export const StyledButtonGoBack = styled(TouchableOpacity)`
  margin-right: 5px;
  padding: 6px 0px;
`;
