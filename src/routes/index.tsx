import React from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import analytics from "@react-native-firebase/analytics";
import { useTranslation } from "react-i18next";

import Header from "../components/Header";
import Home from "../screens/Home";
import Configuracoes from "../screens/Configuracoes";
import Cronometro from "../screens/Cronometro";
import CronometroParado from "../screens/CronometroParado";
import Pessoas from "../screens/Pessoas";
import Relatorios from "../screens/Relatorios";
import RelatorioMes from "../screens/RelatorioMes";
import RelatorioDetalhes from "../screens/RelatorioDetalhes";
import RelatorioAdicionar from "../screens/RelatorioAdicionar";
import PessoaVisitas from "../screens/PessoaVisitas";
import PessoaEditarVisita from "../screens/PessoaEditarVisita";
import PessoaNovaVisita from "../screens/PessoaNovaVisita";
import Territorios from "../screens/Territorios";
import TerritorioResidencias from "../screens/TerritorioResidencias";
import TerritorioResidenciasVisitas from "../screens/TerritorioResidenciasVisitas";
import TerritorioResidenciaNovaVisita from "../screens/TerritorioResidenciaNovaVisita";
import TerritorioResidenciaEditarVisita from "../screens/TerritorioResidenciaEditarVisita";
import TerritorioInformacao from "../screens/TerritorioInformacao";
import Ajuda from "../screens/Ajuda";
import Backup from "../screens/Backup";

import { ThemeColors } from "../types/Theme";
import { ReportType } from "../types/Reports";
import { CustomTerritoriesType } from "../controllers/territoriosController";

type RoutesTypeProps = {
  // deepLinkingProp: any;
  actualTheme?: ThemeColors;
};

export interface RootStackParamListType
  extends Record<string, object | undefined> {
  Home: undefined;
  Cronometro: undefined;
  CronometroParado: {
    dia: string;
    hora: string;
    minutos: number;
    colocacoes: number;
    videosMostrados: number;
    revisitas: number;
  };
  Pessoas: undefined;
  PessoaVisitas: { idPessoa: string };
  PessoaEditarVisita: { idVisita: string; idPessoa: string };
  PessoaNovaVisita: { personId: string };
  Territorios: undefined;
  TerritorioResidencias: CustomTerritoriesType;
  TerritorioResidenciasVisitas: { residenciaId: string; territoryId: string };
  TerritorioResidenciaNovaVisita: { residenciaId: string; territoryId: string };
  TerritorioResidenciaEditarVisita: {
    idVisita: string;
    residenciaId: string;
    territorioId: string;
  };
  TerritorioInformacao: { territorioId: string };
  Relatorios: undefined;
  RelatorioMes: { mesAno: string; mesAnoFormatado?: string };
  RelatorioDetalhes: ReportType;
  RelatorioAdicionar: { mesAno: string };
  Ajuda: undefined;
  Backup: undefined;
  Configuracoes: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamListType>();

export default function Routes({}: RoutesTypeProps) {
  const routeNameRef = React.useRef<string | undefined>(undefined);
  const navigationRef =
    React.useRef<NavigationContainerRef<RootStackParamListType>>(null);

  const { t } = useTranslation();

  return (
    <NavigationContainer
      // linking={deepLinkingProp}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef?.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
      // theme={{
      //   dark: true,
      //   colors: {
      //     background: "#000000",
      //     border: "",
      //     card: "",
      //     notification: "",
      //     primary: "",
      //     text: "",
      //   },
      // }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            header: () => (
              <Header title="TJ Droid" isHomePage capitalize={false} />
            ),
          }}
        />

        <Stack.Screen
          name="Cronometro"
          component={Cronometro}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="CronometroParado"
          component={CronometroParado}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="Pessoas"
          component={Pessoas}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="PessoaVisitas"
          component={PessoaVisitas}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="PessoaEditarVisita"
          component={PessoaEditarVisita}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="PessoaNovaVisita"
          component={PessoaNovaVisita}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="Territorios"
          component={Territorios}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="TerritorioResidencias"
          component={TerritorioResidencias}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="TerritorioResidenciasVisitas"
          component={TerritorioResidenciasVisitas}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="TerritorioResidenciaNovaVisita"
          component={TerritorioResidenciaNovaVisita}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="TerritorioResidenciaEditarVisita"
          component={TerritorioResidenciaEditarVisita}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="TerritorioInformacao"
          component={TerritorioInformacao}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="Relatorios"
          component={Relatorios}
          options={{
            header: () => (
              <Header
                title={t("screens.relatorios.screen_name")}
                showGoBackHome
              />
            ),
          }}
        />

        <Stack.Screen
          name="RelatorioMes"
          component={RelatorioMes}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="RelatorioDetalhes"
          component={RelatorioDetalhes}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="RelatorioAdicionar"
          component={RelatorioAdicionar}
          options={{ headerShown: false }} // Essa screen usa o Header no proprio componente
        />

        <Stack.Screen
          name="Ajuda"
          component={Ajuda}
          options={{
            header: () => (
              <Header title={t("screens.ajuda.screen_name")} showGoBack />
            ),
          }}
        />

        <Stack.Screen
          name="Backup"
          component={Backup}
          options={{
            header: () => (
              <Header title={t("screens.backup.screen_name")} showGoBack />
            ),
          }}
        />

        <Stack.Screen
          name="Configuracoes"
          component={Configuracoes}
          options={{
            header: () => (
              <Header
                title={t("screens.configuracoes.screen_name")}
                showGoBackHome
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
