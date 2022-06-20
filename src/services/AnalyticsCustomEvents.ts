import analytics from '@react-native-firebase/analytics';

// Função que centraliza os custom events do analytics
// Lá no index.js do router, também tem um sendo chamada lá mesmo
export const analyticsCustomEvent = async (event_name: string, event_obj = {}) => {
  await analytics().logEvent(event_name, event_obj);
}