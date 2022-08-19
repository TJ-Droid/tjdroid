import * as Notifications from "expo-notifications";
import i18next from "i18next";

export async function dismissAllNotifications() {
  await Notifications.dismissAllNotificationsAsync();
}

export async function schedulePushNotificationStart(horaInicio: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${i18next.t("services.push_chronometer_started_title")} ⏳`,
      subtitle: horaInicio,
      body: i18next.t("services.push_chronometer_started_body"),
      sticky: true,
      autoDismiss: false,
      data: { deepLinkPage: "cronometro" },
    },
    trigger: null,
  });
}

export async function schedulePushNotificationPaused(horaInicio: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${i18next.t("services.push_chronometer_paused_title")} ⏸`,
      subtitle: horaInicio,
      body: i18next.t("services.push_chronometer_paused_body"),
      sticky: true,
      autoDismiss: false,
      data: { deepLinkPage: "cronometro" },
    },
    trigger: null,
  });
}
