import { StackScreenProps } from "@react-navigation/stack";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastAndroid, Dimensions, View } from "react-native";
import { RootStackParamListType } from "../../routes";
import {
  Container,
  MenuItem,
  MenuName,
  StyledIconTerritoriosSvg,
  StyledIconRelatoriosSvg,
  StyledIconPessoasSvg,
  StyledIconCronometroSvg,
  ContainerLand,
  MenuItemLand,
  StyledIconTerritoriosSvgLand,
  StyledIconRelatoriosSvgLand,
  StyledIconPessoasSvgLand,
  StyledIconCronometroSvgLand,
} from "./styles";

type ProfileScreenRouteProp = StackScreenProps<RootStackParamListType, "Home">;

interface Props extends ProfileScreenRouteProp {}

let hasShownHomeToast = false;

export default function Home({ navigation }: Props) {
  const { t } = useTranslation();
  const [isLandscape, setIsLandscape] = useState(false);

  // Um pequeno Toast com uma saudação dependendo do horário
  useEffect(() => {
    if (!hasShownHomeToast) {
      const hora = parseInt(format(new Date(), "H"));

      if (hora >= 18) {
        ToastAndroid.show(
          `${t("screens.home.good_night")} 🌑`,
          ToastAndroid.SHORT
        );
      } else if (hora >= 12) {
        ToastAndroid.show(
          `${t("screens.home.good_afternoon")}`,
          ToastAndroid.SHORT
        );
      } else if (hora >= 6) {
        ToastAndroid.show(
          `${t("screens.home.good_morning_day")} 🌞`,
          ToastAndroid.SHORT
        );
      } else if (hora <= 5) {
        ToastAndroid.show(
          `${t("screens.home.good_morning_night")} 💤`,
          ToastAndroid.SHORT
        );
      }

      hasShownHomeToast = true;
    }

    // Função que calcula se a Home está numa tela landiscape ou não ao carregar a tela pela primeira vez
    const isLandscapeFunc = () => {
      const dim = Dimensions.get("screen");
      return dim.width >= dim.height;
    };
    setIsLandscape(isLandscapeFunc());

    // Função que calcula se a Home está numa tela landiscape ou não
    const subscription = Dimensions.addEventListener("change", () => {
      setIsLandscape(isLandscapeFunc());
    });

    return () => subscription?.remove();
  }, []);

  return (
    <View>
      {isLandscape ? (
        <ContainerLand>
          <MenuItemLand
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Territorios")}
          >
            <StyledIconTerritoriosSvgLand />
            <MenuName>{t("screens.home.territories")}</MenuName>
          </MenuItemLand>

          <MenuItemLand
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Relatorios")}
          >
            <StyledIconRelatoriosSvgLand />
            <MenuName>{t("screens.home.reports")}</MenuName>
          </MenuItemLand>

          <MenuItemLand
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Pessoas")}
          >
            <StyledIconPessoasSvgLand />
            <MenuName>{t("screens.home.people")}</MenuName>
          </MenuItemLand>

          <MenuItemLand
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Cronometro")}
          >
            <StyledIconCronometroSvgLand />
            <MenuName>{t("screens.home.chronometer")}</MenuName>
          </MenuItemLand>
        </ContainerLand>
      ) : (
        <Container>
          <MenuItem
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Territorios")}
          >
            <StyledIconTerritoriosSvg />
            <MenuName>{t("screens.home.territories")}</MenuName>
          </MenuItem>

          <MenuItem
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Relatorios")}
          >
            <StyledIconRelatoriosSvg />
            <MenuName>{t("screens.home.reports")}</MenuName>
          </MenuItem>

          <MenuItem
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Pessoas")}
          >
            <StyledIconPessoasSvg />
            <MenuName>{t("screens.home.people")}</MenuName>
          </MenuItem>

          <MenuItem
            activeOpacity={0.6}
            onPress={() => navigation.navigate("Cronometro")}
          >
            <StyledIconCronometroSvg />
            <MenuName>{t("screens.home.chronometer")}</MenuName>
          </MenuItem>
        </Container>
      )}
    </View>
  );
}

