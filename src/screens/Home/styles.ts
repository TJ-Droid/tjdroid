import styled from "styled-components/native";
import { ResponsiveSize } from "../../utils/fontResponsive";
import { TouchableOpacity } from "react-native";

import IconTerritoriosSvg from "../../images/svg/IconTerritoriosSvg";
import IconPessoasSvg from "../../images/svg/IconPessoasSvg";
import IconRelatoriosSvg from "../../images/svg/IconRelatoriosSvg";
import IconCronometroSvg from "../../images/svg/IconCronometroSvg";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.color.bg};
  padding: 15px;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const MenuItem = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.color.primary}36;
  border-radius: 17px;
  padding: 15px;
  width: 47%;
  height: 47%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1.5%;
`;

export const MenuName = styled.Text`
  color: ${({ theme }) => theme.color.home_button_bg};
  font-size: ${ResponsiveSize(17)}px;
  margin-top: 10px;
  text-align: center;
`;

export const StyledIconCronometroSvg = styled(IconCronometroSvg).attrs(
  ({ theme }) => ({
    iconColor: theme.color.home_button_bg,
  })
)``;

export const StyledIconTerritoriosSvg = styled(IconTerritoriosSvg).attrs(
  ({ theme }) => ({
    iconColor: theme.color.home_button_bg,
  })
)``;

export const StyledIconPessoasSvg = styled(IconPessoasSvg).attrs(
  ({ theme }) => ({
    iconColor: theme.color.home_button_bg,
  })
)``;

export const StyledIconRelatoriosSvg = styled(IconRelatoriosSvg).attrs(
  ({ theme }) => ({
    iconColor: theme.color.home_button_bg,
  })
)``;

/* Landingscape styles */

export const ContainerLand = styled.View`
  background-color: ${({ theme }) => theme.color.bg};
  padding: 15px;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const MenuItemLand = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.color.primary}36;
  border-radius: 17px;
  padding: 15px;
  width: 47%;
  height: 45%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1%;
`;

export const StyledIconCronometroSvgLand = styled(IconCronometroSvg).attrs(
  ({ theme }) => ({
    iconColor: theme.color.home_button_bg,
    width: 60,
    height: 50,
    widthVB: 67,
    heightVB: 89,
  })
)``;

export const StyledIconTerritoriosSvgLand = styled(IconTerritoriosSvg).attrs(
  ({ theme }) => ({
    iconColor: theme.color.home_button_bg,
    width: 60,
    height: 50,
    widthVB: 67,
    heightVB: 89,
  })
)``;

export const StyledIconPessoasSvgLand = styled(IconPessoasSvg).attrs(
  ({ theme }) => ({
    iconColor: theme.color.home_button_bg,
    width: 60,
    height: 50,
    widthVB: 67,
    heightVB: 89,
  })
)``;

export const StyledIconRelatoriosSvgLand = styled(IconRelatoriosSvg).attrs(
  ({ theme }) => ({
    iconColor: theme.color.home_button_bg,
    width: 60,
    height: 50,
    widthVB: 67,
    heightVB: 89,
  })
)``;
