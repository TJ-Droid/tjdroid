import React, {useEffect, useRef, useState} from 'react';
import { Provider } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';

import { carregarConfiguracoes } from './src/controllers/configuracoesController';
import ThemeContext from './src/contexts/Theme'
import Routes from './src/routes';
import themes from './src/themes';

import * as Linking from 'expo-linking';
const prefix = Linking.makeUrl('/');

// import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

// Configurações do Push Notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  
  const notificationListener = useRef();
  const responseListener = useRef();
  // // Esatado relacionados ao push
  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const [actualTheme, updateActualTheme] = useState(themes.azulEscuroDefault);
  const [linkData, setLinkData] = useState(null);
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: "home",
        Cronometro: "cronometro"
      }
    }
  }
  
  useEffect(() => {
    
    // Carrega as configuracoes salvas no Storage
    const carregaConfiguracoes = async () => {

      // Chama o controller para carregar as configurações
      await carregarConfiguracoes()
      .then((configs) => {
        
        // Checa se é a primeira vez que está carregando as configurações
        if(configs !== undefined) {

          // Verifica qual tema aplicar
          if(configs.darkMode === true) {
            handleSwicthTheme('darkMode');
          } else {
            handleSwicthTheme(configs.actualTheme);
          }
        } else {
          // Se for a primeira vez, seta o tema padrão
          handleSwicthTheme('azulEscuroDefault');
        }

      });
    }
    carregaConfiguracoes();

    async function getInitialURL() {
      const initialURL = await Linking.getInitialURL();
      if(initialURL){
        setLinkData(Linking.parse(initialURL));
      }
    }

    // Lida com o Deep link do app
    Linking.addEventListener('url', handleDeepLink);

    if(!linkData){
      getInitialURL()
    }

    // // CONFIGURAÇÕES DO PUSH NOTIFICATION
    // // Pega o token do push
    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // setNotification(notification);
    });
    
    // Pega o retorno do clique no push
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log('Push clicado-aberto');
      // navigation.navigate('Cronometro');
      Linking.openURL(`${[prefix]}${response.notification.request.content.data.deepLinkPage}`)
    });

    return (() => {
      Linking.removeEventListener('url');
      
      // Remove as configurações do Push Notification
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    })
  }, [])

  function handleDeepLink(event){
    let data = Linking.parse(event.url);
    setLinkData(data);
  }

  // Função que controla a seleção dos temas
  const handleSwicthTheme = (valor) => {
    updateActualTheme(themes[valor]);
    // Depois de setado o tema, sai da splash screen
    setIsReady(true);
  }

  // Segura a splash screen até o tema ser aplicado e evitar o piscar do tema no início
  if (!isReady) {
    return (
      <AppLoading />
    );
  }

  return (
    <ThemeContext.Provider value={{switchTheme: handleSwicthTheme}}>
      <ThemeProvider theme={actualTheme ?? themes.azulEscuroDefault}>
        <Provider>
          <Routes deepLinkingProp={linking}/>
        </Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Constants.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       // console.log('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//   } else {
//     // console.log('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#00ff00',
//     });
//   }

//   return token;
// }