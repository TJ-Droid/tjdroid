import AppLoading from "expo-app-loading";
import * as Linking from "expo-linking";
import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "styled-components";
import ThemeContextProvider, { useThemeContext } from "./src/contexts/Theme";
import {
  carregarConfiguracoes,
  salvarConfiguracoes,
} from "./src/controllers/configuracoesController";
import Routes from "./src/routes";
import themes from "./src/themes";
// import Constants from 'expo-constants';
import { StyledStatusBar } from "@/components/Header/styles";
import * as Device from "expo-device";
import { ParsedURL } from "expo-linking";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeColors, ThemeType } from "./src/types/Theme";
const prefix = Linking.createURL("/");

// Configurações do Push Notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  return (
    <ThemeContextProvider>
      <AppContainer />
    </ThemeContextProvider>
  );
}

const AppContainer: React.FC = () => {
  const { actualTheme } = useThemeContext();
  const backgroundColor =
    actualTheme?.color.statusbar_bg ??
    themes.azulEscuroDefault.color.statusbar_bg;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <PaperProvider>
        <AppWrapper />
      </PaperProvider>
    </SafeAreaView>
  );
};

const AppWrapper: React.FC = () => {
  // THEME STATE CONTEXT
  const { setActualTheme, actualTheme } = useThemeContext();

  // // Estado relacionados ao push
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  const [isReady, setIsReady] = useState(false);
  // const [actualTheme, setActualTheme] = useState<ThemeType>(
  //   themes.azulEscuroDefault
  // );
  const [linkData, setLinkData] = useState<ParsedURL>();
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: "home",
        Cronometro: "cronometro",
      },
    },
  };

  useEffect(() => {
    // Carrega as configuracoes salvas no Storage
    const carregaConfiguracoes = async () => {
      // Chama o controller para carregar as configuracoes
      await carregarConfiguracoes().then(async (configs) => {
        const defaultConfig = {
          actualTheme: "azulEscuroDefault",
          darkMode: false,
          isRelatorioSimplificado: true,
        };

        if (!configs || configs === false || Array.isArray(configs)) {
          handleSwicthTheme(themes["azulEscuroDefault"]);
          await salvarConfiguracoes(defaultConfig);
          return;
        }

        if (configs.isRelatorioSimplificado === undefined) {
          await salvarConfiguracoes({
            ...configs,
            isRelatorioSimplificado: true,
          });
        }

        if (configs.darkMode === true) {
          handleSwicthTheme(themes["darkMode"]);
        } else {
          handleSwicthTheme(themes[configs.actualTheme as ThemeColors]);
        }
      });
    };
    carregaConfiguracoes();

    async function getInitialURL() {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        setLinkData(Linking.parse(initialURL));
      }
    }

    // Lida com o Deep link do app
    // Linking.addEventListener("url", handleDeepLink);

    if (!linkData) {
      getInitialURL();
    }

    // CONFIGURACOES DO PUSH NOTIFICATION
    // Pega o token do push
    registerForPushNotificationsAsync().then((token) => {});
    // setExpoPushToken(token)

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // setNotification(notification);
      });

    // Pega o retorno do clique no push
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log('Push clicado-aberto');
        // navigation.navigate('Cronometro');
        // Linking.openURL(
        //   `${[prefix]}${
        //     response.notification.request.content.data.deepLinkPage
        //   }`
        // );
      });

    return () => {
      // Linking.removeEventListener("url", linkData);
      // // Remove as configuracoes do Push Notification
      // Notifications.removeNotificationSubscription(
      //   notificationListener.current
      // );
      // Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // function handleDeepLink(event: EventType) {
  //   let data = Linking.parse(event.url);
  //   setLinkData(data);
  // }

  // Controls theme selection
  const handleSwicthTheme = (valor: ThemeType) => {
    setActualTheme && setActualTheme(valor);
    // Depois de setado o tema, sai da splash screen
    setIsReady(true);
  };

  // Hold splash screen until theme is applied and avoid the flicker of the theme at the beginning
  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={actualTheme ?? themes.azulEscuroDefault}>
      <StyledStatusBar />
      <Routes />
    </ThemeProvider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "c3a50ca6-47e0-48f7-83a6-d0425212d430",
      })
    ).data;
    // console.log(token);
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}
