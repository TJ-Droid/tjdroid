import React, { useEffect, useRef, useState } from "react";
import { Provider as ReactNativePaperProvider } from "react-native-paper";
import { ThemeProvider } from "styled-components";
import AppLoading from "expo-app-loading";

import { carregarConfiguracoes } from "./src/controllers/configuracoesController";
import ThemeContextProvider, { useThemeContext } from "./src/contexts/Theme";
import Routes from "./src/routes";
import themes from "./src/themes";

import * as Linking from "expo-linking";
const prefix = Linking.createURL("/");

// import Constants from 'expo-constants';
import * as Notifications from "expo-notifications";
import { ParsedURL } from "expo-linking";
import { ThemeColors, ThemeType } from "./src/types/Theme";
import { Platform } from "react-native";
import * as Device from "expo-device";

// Configurações do Push Notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <ThemeContextProvider>
      <AppWrapper />
    </ThemeContextProvider>
  );
}

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
      // Chama o controller para carregar as configurações
      await carregarConfiguracoes().then((configs) => {
        // Checa se é a primeira vez que está carregando as configurações
        if (configs !== undefined) {
          // Verifica qual tema aplicar
          if (configs.darkMode === true) {
            handleSwicthTheme(themes["darkMode"]);
          } else {
            handleSwicthTheme(themes[configs?.actualTheme as ThemeColors]);
          }
        } else {
          // Se for a primeira vez, seta o tema padrão
          handleSwicthTheme(themes["azulEscuroDefault"]);
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

    // CONFIGURAÇÕES DO PUSH NOTIFICATION
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
      // // Remove as configurações do Push Notification
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
      <ReactNativePaperProvider>
        <Routes />
      </ReactNativePaperProvider>
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
