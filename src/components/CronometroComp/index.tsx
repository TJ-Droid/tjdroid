import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  AppState,
  AppStateStatus,
  Linking,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { differenceInMinutes, format, parseISO } from "date-fns";
import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../../services/AsyncStorageMethods";

import { StackActions, useNavigation } from "@react-navigation/native";
import { useInterval } from "../../hooks/useInterval";
import { analyticsCustomEvent } from "../../services/AnalyticsCustomEvents";
import minutes_to_hhmm from "../../utils/minutes_to_hhmm";
import Header from "../Header";

import {
  dismissAllNotifications,
  schedulePushNotificationPaused,
  schedulePushNotificationStart,
} from "../../services/PushNotifications";

import { carregarConfiguracoes } from "../../controllers/configuracoesController";
import {
  ActionsButtonsArea,
  ActionsButtonsStyle,
  ActionsButtonsText,
  BottomSectionActionButtonsContainer,
  BottomSectionButtonsArea,
  BottomSectionButtonsWrapper,
  BottomSectionButtonWrapper,
  BottomSectionContainer,
  BottomSectionLabelText,
  BottomSectionMessageContainer,
  BottomSectionMessageText,
  BottomSectionQuantityText,
  BottomSectionTextArea,
  BottomSectionTextAreaVideoBulletButton,
  BottomSectionTextAreaVideoBulletText,
  ContadorArea,
  ContadorButtonArea,
  ContadorMinutesText,
  ContadorStartText,
  ContadorStartTextArea,
  StyledFeatherIconContadorButton,
  StyledFeatherIconContadorButtonAction,
  StyledFeatherIconSectionButton,
  StyledFeatherIconVideoPlay,
  StyledScrollView,
  TopSectionContainer,
  TopSectionContainerArea,
  TopSectionContainerButtonsArea,
} from "./styles";

type ReportParamType = {
  colocacoes: number;
  dia: string;
  hora: string;
  observacoes: string;
  revisitas: number;
  videosMostrados: number;
};

export default function CronometroComp() {
  const { t } = useTranslation();

  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();

  const [statusUseTmIntMinutos, setStatusUseTmIntMinutos] = useState("idle");
  const [statusUseTmIntPiscar, setStatusUseTmIntPiscar] = useState("idle");

  // Estados gerais
  const [timerBotaoPrecionado, setTimerBotaoPrecionado] = useState<
    ReturnType<typeof setTimeout>
  >(setTimeout(() => {}));
  const [textoHoraCronometroIniciado, setTextoHoraCronometroIniciado] =
    useState<string>(t("components.cronometrocomp.chronometer_stopped"));
  const [piscar, setPiscar] = useState(false);
  const [contadorDesativado, setContadorDesativado] = useState(true);
  const [minutos, setMinutos] = useState(0);
  const [contadorEstado, setContadorEstado] = useState(0);
  const [relatorio, setRelatorio] = useState({
    revisitas: 0,
    videosMostrados: 0,
    observacoes: "",
    dia: "00/00/0000",
    hora: "00:00",
    colocacoes: 0,
  });

  const [isRelatorioSimplificadoAtivado, setIsRelatorioSimplificadoAtivado] =
    useState(true);

  // Hook para monitorar as adições de minutos
  useInterval(
    () => {
      setMinutos((m) => m + 1);
    },
    statusUseTmIntMinutos === "running" ? 60000 : undefined,
  );

  // Hook para monitorar o piscar dos minutos
  useInterval(
    () => {
      setPiscar((piscar) => !piscar);
    },
    statusUseTmIntPiscar === "running" ? 1000 : undefined,
  );

  // Recebe os dados para configurar os estado inicial do contador
  // Como esse componente é usado em várias screens, abaixo é feita essa configuração
  useEffect(() => {
    // @tjdroid:contador_iniciado
    // 0 = Contador não começou
    // 1 = Contador Iniciado
    // 2 = Contador Pausado

    const verificaContadorIniciado = async () => {
      // Verifica se o contador já foi iniciado ou não, daí seta o contador limpo
      const checkIsUndefined = await buscarAsyncStorage(
        "@tjdroid:contador_completo",
      );
      if (checkIsUndefined === undefined) {
        // Reseta o estado inicial do cronometro quando nada foi iniciado ainda
        await salvarAsyncStorage(
          {
            colocacoes: 0,
            videosMostrados: 0,
            revisitas: 0,
            observacoes: "",
            minutosextras: 0,
            minutospausados: 0,
            dia: "00/00/0000",
            hora: "00:00",
          },
          "@tjdroid:contador_completo",
        );
      }

      const contador_iniciado = await buscarAsyncStorage(
        "@tjdroid:contador_iniciado",
      );

      // Verifica se o contador nunca foi configurado, seta o @tjdroid:contador_iniciado para zero
      if (contador_iniciado === null) {
        await salvarAsyncStorage("0", "@tjdroid:contador_iniciado");

        // Reseta o estado inicial do cronometro quando nada foi iniciado ainda
        await salvarAsyncStorage(
          {
            colocacoes: 0,
            videosMostrados: 0,
            revisitas: 0,
            observacoes: "",
            minutosextras: 0,
            minutospausados: 0,
            dia: "00/00/0000",
            hora: "00:00",
          },
          "@tjdroid:contador_completo",
        );
      }

      // Verifica se o contador não foi iniciado, zera os minutos
      if (contador_iniciado === "0") {
        setMinutos(0);
      }

      // Verifica se o contador já foi iniciado
      if (contador_iniciado === "1") {
        // Ativa os botões do contador
        setContadorDesativado(false);

        // Configura os botões do contador
        setContadorEstado(1);

        // Faz os pontos dos minutos piscar
        piscarPontosContador();

        // Calcula o tempo que passou desde que o app ficou no background ou inativo
        const tempoCalculado = await calculaMinutosPassados();

        // Verifica os minutosextras do storage e soma aos minutos calculados
        // Também verifica seta os outros dados do relatório do storage ao stado atual
        const json = await buscarAsyncStorage("@tjdroid:contador_completo");

        if (json.minutospausados !== undefined && json.minutospausados > 0) {
          // console.log('Aqui-1');

          // Verifica os minutosextras do storage e soma aos minutos calculados
          // Também verifica seta os outros dados do relatório do storage ao stado atual
          const json = await buscarAsyncStorage("@tjdroid:contador_completo");
          setMinutos(
            tempoCalculado + json.minutosextras + json.minutospausados,
          );
          setRelatorio({
            colocacoes: json.colocacoes ?? 0,
            videosMostrados: json.videosMostrados ?? 0,
            revisitas: json.revisitas ?? 0,
            observacoes: json.observacoes ?? "",
            dia: json.dia,
            hora: json.hora,
          });
        } else {
          // console.log('Aqui-2');

          // Verifica os minutosextras do storage e soma aos minutos calculados
          // Também verifica seta os outros dados do relatório do storage ao stado atual
          const json = await buscarAsyncStorage("@tjdroid:contador_completo");
          setMinutos(tempoCalculado + (json.minutosextras ?? 0));
          setRelatorio({
            colocacoes: json.colocacoes ?? 0,
            videosMostrados: json.videosMostrados ?? 0,
            revisitas: json.revisitas ?? 0,
            observacoes: json.observacoes ?? "",
            dia: json.dia,
            hora: json.hora,
          });
        }

        playContador();
        // AppState.addEventListener("change", handleAppStateChange);
      }

      // Verifica se o contador já foi pausado
      if (contador_iniciado === "2") {
        setContadorDesativado(false);
        setContadorEstado(2);

        // Calcula o tempo que passou desde que o app ficou no background ou inativo
        // const tempoCalculado = await calculaMinutosPassados();

        // Verifica os minutosextras do storage e soma aos minutos calculados
        // Também verifica seta os outros dados do relatório do storage ao stado atual
        const json = await buscarAsyncStorage("@tjdroid:contador_completo");
        setMinutos(json.minutospausados ?? 0);
        // setMinutos(json.minutospausados + json.minutosextras);
        setRelatorio({
          colocacoes: json.colocacoes ?? 0,
          videosMostrados: json.videosMostrados ?? 0,
          revisitas: json.revisitas ?? 0,
          observacoes: json.observacoes ?? "",
          dia: json.dia,
          hora: json.hora,
        });
      }

      // Seta o texto sobre o estado iniciado com a hora do cronômetro
      const started_time_message = await buscarAsyncStorage(
        "@tjdroid:started_time_message",
      );

      if (
        typeof started_time_message === "object" ||
        started_time_message ===
          t("components.cronometrocomp.chronometer_stopped")
      ) {
      } else {
        if (typeof started_time_message !== "undefined") {
          // Seta o texto sobre o estado iniciado com a hora do cronômetro
          setTextoHoraCronometroIniciado(started_time_message);
        }
      }
    };

    verificaContadorIniciado();

    // Verifica o estado da aplicação para controlar o contador
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      // console.log('entrouhandle');
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // Calcula o tempo que passou desde que o app ficou no background ou inativo
        const tempoCalculado = await calculaMinutosPassados();
        // Update the elapsed seconds state
        // setElapsed(tempoCalculado);

        const contador_iniciado = await buscarAsyncStorage(
          "@tjdroid:contador_iniciado",
        );

        // Verifica se o contador já foi iniciado
        if (contador_iniciado === "1") {
          // Verifica os minutosextras do storage e soma aos minutos calculados
          // Também verifica seta os outros dados do relatório do storage ao stado atual
          const json = await buscarAsyncStorage("@tjdroid:contador_completo");
          // console.log(tempoCalculado);
          // console.log(tempoCalculado, json.minutosextras, json.minutospausados);
          if (json.minutospausados !== undefined && json.minutospausados > 0) {
            // console.log("Aqui-5");

            // Verifica os minutosextras do storage e soma aos minutos calculados
            // Também verifica seta os outros dados do relatório do storage ao stado atual
            // const json = await buscarAsyncStorage('@tjdroid:contador_completo');
            // setMinutos(tempoCalculado + json.minutosextras + json.minutospausados);
            setMinutos(
              tempoCalculado + json.minutospausados + json.minutosextras,
            );
            setRelatorio({
              colocacoes: json.colocacoes ?? 0,
              videosMostrados: json.videosMostrados ?? 0,
              revisitas: json.revisitas ?? 0,
              observacoes: json.observacoes ?? "",
              dia: json.dia,
              hora: json.hora,
            });
          } else {
            // console.log("Aqui-6");

            // Verifica os minutosextras do storage e soma aos minutos calculados
            // Também verifica seta os outros dados do relatório do storage ao stado atual
            // const json = await buscarAsyncStorage('@tjdroid:contador_completo');
            setMinutos(tempoCalculado + (json.minutosextras ?? 0));
            setRelatorio({
              colocacoes: json.colocacoes ?? 0,
              videosMostrados: json.videosMostrados ?? 0,
              revisitas: json.revisitas ?? 0,
              observacoes: json.observacoes ?? "",
              dia: json.dia,
              hora: json.hora,
            });
          }
        }
      }
      appState.current = nextAppState;
    };

    AppState.addEventListener("change", handleAppStateChange);

    const subscriptionAppState = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscriptionAppState.remove();
      // AppState.removeEventListener("change", handleAppStateChange);
      clearTimeout(timerBotaoPrecionado);
    };
  }, []);

  // Previne os minutos de ficarem negativo
  useEffect(() => {
    if (minutos < 0) {
      setMinutos(0);
    }
  }, [minutos]);

  // FUNCAO PARA OS BOTOES DO CONTADOR
  async function contar(
    local: "minutos" | "colocacoes" | "videosMostrados" | "revisitas",
    tipo: "soma" | "",
  ) {
    if (local === "minutos") {
      if (tipo === "soma") {
        // Verifica os minutosextras do storage
        const json = await buscarAsyncStorage("@tjdroid:contador_completo");
        await salvarAsyncStorage(
          { ...json, minutosextras: (json.minutosextras ?? 0) + 1 },
          "@tjdroid:contador_completo",
        );

        const contador_iniciado = await buscarAsyncStorage(
          "@tjdroid:contador_iniciado",
        );
        if (contador_iniciado === "2") {
          // Verifica os minutosextras do storage
          const json = await buscarAsyncStorage("@tjdroid:contador_completo");
          await salvarAsyncStorage(
            { ...json, minutospausados: (json.minutospausados ?? 0) + 1 },
            "@tjdroid:contador_completo",
          );
        }

        return setMinutos(minutos + 1);
      } else {
        if (minutos > 0) {
          // Verifica os minutos do storage
          const json = await buscarAsyncStorage("@tjdroid:contador_completo");
          await salvarAsyncStorage(
            { ...json, minutosextras: (json.minutosextras ?? 0) - 1 },
            "@tjdroid:contador_completo",
          );

          const contador_iniciado = await buscarAsyncStorage(
            "@tjdroid:contador_iniciado",
          );
          if (contador_iniciado === "2") {
            // Verifica os minutosextras do storage
            const json = await buscarAsyncStorage("@tjdroid:contador_completo");
            await salvarAsyncStorage(
              { ...json, minutospausados: (json.minutospausados ?? 0) - 1 },
              "@tjdroid:contador_completo",
            );
          }

          return setMinutos(minutos - 1);
        }
      }
    }

    if (local === "colocacoes") {
      if (tipo === "soma") {
        // Verifica os colocações do storage
        const json = await buscarAsyncStorage("@tjdroid:contador_completo");
        await salvarAsyncStorage(
          { ...json, colocacoes: (json.colocacoes ?? 0) + 1 },
          "@tjdroid:contador_completo",
        );

        return setRelatorio({
          ...relatorio,
          colocacoes: (relatorio.colocacoes ?? 0) + 1,
        });
      } else {
        if ((relatorio.colocacoes ?? 0) > 0) {
          // Verifica os colocações do storage
          const json = await buscarAsyncStorage("@tjdroid:contador_completo");
          if ((json.colocacoes ?? 0) > 0) {
            await salvarAsyncStorage(
              { ...json, colocacoes: (json.colocacoes ?? 0) - 1 },
              "@tjdroid:contador_completo",
            );
          }

          return setRelatorio({
            ...relatorio,
            colocacoes: (relatorio.colocacoes ?? 0) - 1,
          });
        }
      }
    }

    if (local === "videosMostrados") {
      if (tipo === "soma") {
        // Verifica os vídeos mostrados do storage
        const json = await buscarAsyncStorage("@tjdroid:contador_completo");
        await salvarAsyncStorage(
          { ...json, videosMostrados: (json.videosMostrados ?? 0) + 1 },
          "@tjdroid:contador_completo",
        );

        return setRelatorio({
          ...relatorio,
          videosMostrados: (relatorio.videosMostrados ?? 0) + 1,
        });
      } else {
        if ((relatorio.videosMostrados ?? 0) > 0) {
          // Verifica os vídeos mostrados do storage
          const json = await buscarAsyncStorage("@tjdroid:contador_completo");
          if ((json.videosMostrados ?? 0) > 0) {
            await salvarAsyncStorage(
              { ...json, videosMostrados: (json.videosMostrados ?? 0) - 1 },
              "@tjdroid:contador_completo",
            );
          }

          return setRelatorio({
            ...relatorio,
            videosMostrados: (relatorio.videosMostrados ?? 0) - 1,
          });
        }
      }
    }

    if (local === "revisitas") {
      if (tipo === "soma") {
        // Verifica os revisitas do storage
        const json = await buscarAsyncStorage("@tjdroid:contador_completo");
        await salvarAsyncStorage(
          { ...json, revisitas: (json.revisitas ?? 0) + 1 },
          "@tjdroid:contador_completo",
        );

        return setRelatorio({
          ...relatorio,
          revisitas: (relatorio.revisitas ?? 0) + 1,
        });
      } else {
        if ((relatorio.revisitas ?? 0) > 0) {
          // Verifica os revisitas do storage
          const json = await buscarAsyncStorage("@tjdroid:contador_completo");
          if ((json.revisitas ?? 0) > 0) {
            await salvarAsyncStorage(
              { ...json, revisitas: (json.revisitas ?? 0) - 1 },
              "@tjdroid:contador_completo",
            );
          }

          return setRelatorio({
            ...relatorio,
            revisitas: (relatorio.revisitas ?? 0) - 1,
          });
        }
      }
    }
  }

  async function somarMinutosContinuamente() {
    setMinutos((m) => m + 10);
    setTimerBotaoPrecionado(setTimeout(() => somarMinutosContinuamente(), 300));

    // Verifica os minutosextras do storage
    const json = await buscarAsyncStorage("@tjdroid:contador_completo");
    await salvarAsyncStorage(
      { ...json, minutosextras: (json.minutosextras ?? 0) + 10 },
      "@tjdroid:contador_completo",
    );

    const contador_iniciado = await buscarAsyncStorage(
      "@tjdroid:contador_iniciado",
    );
    if (contador_iniciado === "2") {
      // Verifica os minutosextras do storage
      const json = await buscarAsyncStorage("@tjdroid:contador_completo");
      await salvarAsyncStorage(
        { ...json, minutospausados: (json.minutospausados ?? 0) + 10 },
        "@tjdroid:contador_completo",
      );
      return;
    }

    clearTimeout(timerBotaoPrecionado);
  }

  async function subtrairMinutosContinuamente() {
    setMinutos((m) => m - 10);
    setTimerBotaoPrecionado(
      setTimeout(() => subtrairMinutosContinuamente(), 300),
    );

    // Verifica os minutosextras do storage
    const json = await buscarAsyncStorage("@tjdroid:contador_completo");
    await salvarAsyncStorage(
      { ...json, minutosextras: (json.minutosextras ?? 0) - 10 },
      "@tjdroid:contador_completo",
    );

    const contador_iniciado = await buscarAsyncStorage(
      "@tjdroid:contador_iniciado",
    );
    if (contador_iniciado === "2") {
      // Verifica os minutosextras do storage
      const json = await buscarAsyncStorage("@tjdroid:contador_completo");
      await salvarAsyncStorage(
        { ...json, minutospausados: (json.minutospausados ?? 0) - 10 },
        "@tjdroid:contador_completo",
      );
      return;
    }

    clearTimeout(timerBotaoPrecionado);
  }

  async function pararContagemContinua() {
    clearTimeout(timerBotaoPrecionado);
  }

  const calculaMinutosPassados = async () => {
    //2021-02-08T01:00:44.974Z
    const startTime = await buscarAsyncStorage("@tjdroid:started_time");
    const diferenca = differenceInMinutes(new Date(), Date.parse(startTime));
    // const diferenca = differenceInSeconds(new Date(), Date.parse(startTime));
    return diferenca;
  };

  // Função que iniciar o contador
  function playContador() {
    // setContadorMinutos(setInterval(() => setMinutos((m) => m + 1), 60000));
    setStatusUseTmIntMinutos("running");
  }

  // Função que faz os pontos dos minutos piscarem
  function piscarPontosContador() {
    // setPiscarInterval(setInterval(() => setPiscar((piscar) => !piscar), 1000));
    setStatusUseTmIntPiscar("running");
  }

  // INICIA O CRONÔMETRO
  async function iniciarContador() {
    try {
      // Começa o contador
      playContador();

      // Faz os pontos dos minutos piscar
      piscarPontosContador();

      // Ativa os botões de mais e menos do contador
      setContadorDesativado(false);

      const horaContadorIniciado = format(
        new Date(),
        "yyyy-MM-dd'T'HH:mm:ssxxx",
      );
      // Retorno acima: 2021-09-22T10:40:17-03:00
      // setHoraCronometroIniciado(horaContadorIniciado);

      // Pega o momento atual do começo do cronômetro
      const horaInicioCronometro = `${t(
        "components.cronometrocomp.chronometer_started_at",
      )} ${format(new Date(), "HH:mm")}`;

      // Seta o texto sobre o estado iniciado com a hora do cronômetro
      const started_time_message = await buscarAsyncStorage(
        "@tjdroid:started_time_message",
      );

      // Verifica se é a primeira vez que carrega esse objeto ou se está com a string informada
      if (
        typeof started_time_message === "object" ||
        started_time_message ===
          t("components.cronometrocomp.chronometer_stopped")
      ) {
        setTextoHoraCronometroIniciado(horaInicioCronometro);
        await salvarAsyncStorage(
          horaInicioCronometro,
          "@tjdroid:started_time_message",
        );
      }

      // Limpa todas as push notifications ao pausar e continuar várias vezes
      await dismissAllNotifications();

      // Seta a hora que do início no push notification
      await schedulePushNotificationStart(horaInicioCronometro);

      // const now = new Date();
      await salvarAsyncStorage("1", "@tjdroid:contador_iniciado");
      await salvarAsyncStorage(
        new Date().toISOString(),
        "@tjdroid:started_time",
      );

      // Verifica os minutosextras do storage e soma aos minutos calculados
      // Também verifica seta os outros dados do relatório do storage ao stado atual
      const json = await buscarAsyncStorage("@tjdroid:contador_completo");

      if (json.minutospausados !== undefined && json.minutospausados > 0) {
        // console.log("Aqui-3");

        // Salva o estado inicial do cronometro
        await salvarAsyncStorage(
          {
            colocacoes: json.colocacoes <= 0 ? 0 : (json.colocacoes ?? 0),
            videosMostrados:
              json.videosMostrados <= 0 ? 0 : (json.videosMostrados ?? 0),
            revisitas: json.revisitas <= 0 ? 0 : (json.revisitas ?? 0),
            observacoes: "",
            minutosextras: 0,
            minutospausados: json.minutospausados,
            dia: format(parseISO(horaContadorIniciado), "dd/MM/yyyy"),
            hora: format(parseISO(horaContadorIniciado), "HH:mm"),
          },
          "@tjdroid:contador_completo",
        );
      } else {
        // console.log("Aqui-4");

        // Salva o estado inicial do cronometro
        await salvarAsyncStorage(
          {
            colocacoes: json.colocacoes <= 0 ? 0 : (json.colocacoes ?? 0),
            videosMostrados:
              json.videosMostrados <= 0 ? 0 : (json.videosMostrados ?? 0),
            revisitas: json.revisitas <= 0 ? 0 : (json.revisitas ?? 0),
            observacoes: "",
            minutosextras: 0,
            minutospausados: 0,
            dia: format(parseISO(horaContadorIniciado), "dd/MM/yyyy"),
            hora: format(parseISO(horaContadorIniciado), "HH:mm"),
          },
          "@tjdroid:contador_completo",
        );

        // AppState.addEventListener("change", handleAppStateChange);

        // Mensagem Toast
        ToastAndroid.show(
          t("components.cronometrocomp.chronometer_started"),
          ToastAndroid.SHORT,
        );
      }

      // Adiciona o evento ao Analytics
      await analyticsCustomEvent("cronometro_iniciado");
    } catch (error) {
      // Mensagem Toast
      ToastAndroid.show(
        t("components.cronometrocomp.chronometer_started_error"),
        ToastAndroid.SHORT,
      );
    }
  }

  // PAUSA O CRONÔMETRO
  async function pausarContador() {
    try {
      // setMinutos(minutos);
      setStatusUseTmIntMinutos("idle");
      setStatusUseTmIntPiscar("idle");

      // AppState.removeEventListener("change", handleAppStateChange);
      await salvarAsyncStorage("2", "@tjdroid:contador_iniciado");

      // Salva os minutos atuais na hora da pausa
      const json = await buscarAsyncStorage("@tjdroid:contador_completo");
      await salvarAsyncStorage(
        {
          ...json,
          minutospausados: minutos,
        },
        "@tjdroid:contador_completo",
      );

      // Limpa todas as push notifications
      await dismissAllNotifications();

      // Mostra o push do contador pausado
      await schedulePushNotificationPaused(format(new Date(), "HH:mm"));

      // Mensagem Toast
      ToastAndroid.show(
        t("components.cronometrocomp.chronometer_paused"),
        ToastAndroid.SHORT,
      );
    } catch (error) {
      // TODO: handle errors from setItem properly
      // console.warn(error);
      // Mensagem Toast
      ToastAndroid.show(
        t("components.cronometrocomp.chronometer_paused_error"),
        ToastAndroid.SHORT,
      );
    }
  }

  // Alert de confirmação ao clicar em para cronômetro
  const alertaPararContador = (
    minutosParam: number,
    relatorioParam: ReportParamType,
  ) =>
    Alert.alert(
      t("components.cronometrocomp.alert_stop_chronometer_title"),
      t("components.cronometrocomp.alert_stop_chronometer_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () => pararContador(minutosParam, relatorioParam),
        },
      ],
      { cancelable: true },
    );

  // PARA O CRONÔMETRO
  async function pararContador(
    minutosParam: number,
    relatorioParam: ReportParamType,
  ) {
    try {
      // Seta para parar de piscar
      setStatusUseTmIntPiscar("idle");

      // Altera os botões de começar, pausar e parar contador
      setContadorEstado(0);

      // Limpa todas as push notifications
      await dismissAllNotifications();

      // Seta o estado do contador para 0, não iniciado
      await salvarAsyncStorage("0", "@tjdroid:contador_iniciado");

      // Limpa a hora iniciada mostrada abaixo dos minutos
      await salvarAsyncStorage(
        t("components.cronometrocomp.chronometer_stopped"),
        "@tjdroid:started_time_message",
      );

      // Remove o listener
      // AppState.removeEventListener("change", handleAppStateChange);

      // Verifica a data e hora guardado no storage
      const json = await buscarAsyncStorage("@tjdroid:contador_completo");

      // Monta o relatório
      const relatorioAtual = {
        ...relatorioParam,
        minutos: minutosParam,
        dia: json.dia,
        hora: json.hora,
      };

      // Reseta o estado inicial do cronometro
      await salvarAsyncStorage(
        {
          colocacoes: 0,
          videosMostrados: 0,
          revisitas: 0,
          observacoes: "",
          minutosextras: 0,
          minutospausados: 0,
          dia: "00/00/0000",
          hora: "00:00",
        },
        "@tjdroid:contador_completo",
      );

      // Direciona para a página com os resumo do relatório
      navigation.dispatch(
        StackActions.replace("CronometroParado", relatorioAtual),
      );
    } catch (error) {
      ToastAndroid.show(
        t("components.cronometrocomp.chronometer_stopped_error"),
        ToastAndroid.SHORT,
      );
    }
  }

  useEffect(() => {
    const loadConfiguracoes = async () => {
      // Chama o controller para carregar as configurações
      await carregarConfiguracoes().then(async (configs) => {
        // Trata o retorno
        if (configs) {
          try {
            setIsRelatorioSimplificadoAtivado(
              !!configs?.isRelatorioSimplificado,
            );
          } catch (e) {}
        }
      });
    };
    loadConfiguracoes();
  }, []);

  return (
    <>
      <Header
        title={t("components.cronometrocomp.component_header_name")}
        showGoBackHome
      />

      <StyledScrollView
        contentContainerStyle={{
          flex: 1,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <TopSectionContainer>
          <TopSectionContainerArea>
            <ContadorArea>
              <TouchableOpacity
                onPress={() => contar("minutos", "")}
                onLongPress={() => subtrairMinutosContinuamente()}
                onPressOut={() => pararContagemContinua()}
                disabled={contadorDesativado}
              >
                <ContadorButtonArea
                  style={contadorDesativado ? { opacity: 0.5 } : { opacity: 1 }}
                >
                  <StyledFeatherIconContadorButton name="minus" size={26} />
                </ContadorButtonArea>
              </TouchableOpacity>

              <ContadorMinutesText adjustsFontSizeToFit numberOfLines={1}>
                {minutes_to_hhmm(minutos, piscar)}
              </ContadorMinutesText>

              <TouchableOpacity
                onPress={() => contar("minutos", "soma")}
                onLongPress={() => somarMinutosContinuamente()}
                onPressOut={() => pararContagemContinua()}
                disabled={contadorDesativado}
              >
                <ContadorButtonArea
                  style={contadorDesativado ? { opacity: 0.5 } : { opacity: 1 }}
                >
                  <StyledFeatherIconContadorButton name="plus" size={26} />
                </ContadorButtonArea>
              </TouchableOpacity>
            </ContadorArea>

            <ContadorStartTextArea>
              <ContadorStartText>
                {textoHoraCronometroIniciado}
              </ContadorStartText>
            </ContadorStartTextArea>

            <TopSectionContainerButtonsArea>
              {contadorEstado === 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setContadorEstado(1);
                    iniciarContador();
                  }}
                >
                  <ActionsButtonsStyle darkBlueColor>
                    <ActionsButtonsText
                      adjustsFontSizeToFit
                      allowFontScaling={false}
                    >
                      {t("words.start")}
                    </ActionsButtonsText>
                    <StyledFeatherIconContadorButtonAction
                      name="play"
                      size={20}
                    />
                  </ActionsButtonsStyle>
                </TouchableOpacity>
              )}

              {contadorEstado !== 0 && (
                <ActionsButtonsArea>
                  {contadorEstado === 2 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setContadorEstado(1);
                        iniciarContador();
                      }}
                    >
                      <ActionsButtonsStyle lightColor>
                        <ActionsButtonsText
                          adjustsFontSizeToFit
                          allowFontScaling={false}
                        >
                          {t("words.continue")}
                        </ActionsButtonsText>
                        <StyledFeatherIconContadorButtonAction
                          name="play"
                          size={20}
                        />
                      </ActionsButtonsStyle>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setContadorEstado(2);
                        pausarContador();
                      }}
                    >
                      <ActionsButtonsStyle lightColor>
                        <ActionsButtonsText
                          adjustsFontSizeToFit
                          allowFontScaling={false}
                        >
                          {t("words.pause")}
                        </ActionsButtonsText>
                        <StyledFeatherIconContadorButtonAction
                          name="pause"
                          size={20}
                        />
                      </ActionsButtonsStyle>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      alertaPararContador(minutos, relatorio);
                    }}
                  >
                    <ActionsButtonsStyle>
                      <ActionsButtonsText
                        adjustsFontSizeToFit
                        allowFontScaling={false}
                      >
                        {t("words.stop")}
                      </ActionsButtonsText>
                      <StyledFeatherIconContadorButtonAction
                        name="square"
                        size={20}
                      />
                    </ActionsButtonsStyle>
                  </TouchableOpacity>
                </ActionsButtonsArea>
              )}
            </TopSectionContainerButtonsArea>
          </TopSectionContainerArea>
        </TopSectionContainer>

        <BottomSectionContainer>
          {!isRelatorioSimplificadoAtivado ? (
            <BottomSectionActionButtonsContainer>
              <BottomSectionButtonsWrapper>
                <BottomSectionTextArea>
                  <BottomSectionLabelText>
                    {t("words.placements")}:
                  </BottomSectionLabelText>
                </BottomSectionTextArea>

                <BottomSectionButtonsArea>
                  <TouchableOpacity
                    onPress={() => {
                      contar("colocacoes", "");
                    }}
                    disabled={contadorDesativado}
                  >
                    <BottomSectionButtonWrapper
                      style={
                        contadorDesativado ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    >
                      <StyledFeatherIconSectionButton name="minus" size={20} />
                    </BottomSectionButtonWrapper>
                  </TouchableOpacity>

                  <BottomSectionQuantityText>
                    {relatorio.colocacoes}
                  </BottomSectionQuantityText>

                  <TouchableOpacity
                    onPress={() => {
                      contar("colocacoes", "soma");
                    }}
                    disabled={contadorDesativado}
                  >
                    <BottomSectionButtonWrapper
                      style={
                        contadorDesativado ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    >
                      <StyledFeatherIconSectionButton name="plus" size={20} />
                    </BottomSectionButtonWrapper>
                  </TouchableOpacity>
                </BottomSectionButtonsArea>
              </BottomSectionButtonsWrapper>

              <BottomSectionButtonsWrapper>
                <BottomSectionTextArea>
                  <BottomSectionLabelText>
                    {t("words.videos_showed")}:
                  </BottomSectionLabelText>
                </BottomSectionTextArea>

                <BottomSectionButtonsArea>
                  <TouchableOpacity
                    onPress={() => {
                      contar("videosMostrados", "");
                    }}
                    disabled={contadorDesativado}
                  >
                    <BottomSectionButtonWrapper
                      style={
                        contadorDesativado ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    >
                      <StyledFeatherIconSectionButton name="minus" size={20} />
                    </BottomSectionButtonWrapper>
                  </TouchableOpacity>

                  <BottomSectionQuantityText>
                    {relatorio.videosMostrados}
                  </BottomSectionQuantityText>

                  <TouchableOpacity
                    onPress={() => {
                      contar("videosMostrados", "soma");
                    }}
                    disabled={contadorDesativado}
                  >
                    <BottomSectionButtonWrapper
                      style={
                        contadorDesativado ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    >
                      <StyledFeatherIconSectionButton name="plus" size={20} />
                    </BottomSectionButtonWrapper>
                  </TouchableOpacity>
                </BottomSectionButtonsArea>
              </BottomSectionButtonsWrapper>

              <BottomSectionButtonsWrapper>
                <BottomSectionTextArea>
                  <BottomSectionLabelText>
                    {t("words.revisits")}:
                  </BottomSectionLabelText>
                </BottomSectionTextArea>

                <BottomSectionButtonsArea>
                  <TouchableOpacity
                    onPress={() => {
                      contar("revisitas", "");
                    }}
                    disabled={contadorDesativado}
                  >
                    <BottomSectionButtonWrapper
                      style={
                        contadorDesativado ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    >
                      <StyledFeatherIconSectionButton name="minus" size={20} />
                    </BottomSectionButtonWrapper>
                  </TouchableOpacity>

                  <BottomSectionQuantityText>
                    {relatorio.revisitas}
                  </BottomSectionQuantityText>

                  <TouchableOpacity
                    onPress={() => {
                      contar("revisitas", "soma");
                    }}
                    disabled={contadorDesativado}
                  >
                    <BottomSectionButtonWrapper
                      style={
                        contadorDesativado ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    >
                      <StyledFeatherIconSectionButton name="plus" size={20} />
                    </BottomSectionButtonWrapper>
                  </TouchableOpacity>
                </BottomSectionButtonsArea>
              </BottomSectionButtonsWrapper>
            </BottomSectionActionButtonsContainer>
          ) : null}

          <BottomSectionMessageContainer>
            <BottomSectionMessageText adjustsFontSizeToFit numberOfLines={5}>
              {t("components.cronometrocomp.bottom_helper_text")}
            </BottomSectionMessageText>
            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL("https://youtu.be/2Ff0X9awsjM");
              }}
            >
              <BottomSectionTextAreaVideoBulletButton>
                <BottomSectionTextAreaVideoBulletText>
                  {t("components.cronometrocomp.bottom_helper_button_text")}
                </BottomSectionTextAreaVideoBulletText>
                <View>
                  <StyledFeatherIconVideoPlay name="youtube" size={20} />
                </View>
              </BottomSectionTextAreaVideoBulletButton>
            </TouchableWithoutFeedback>
          </BottomSectionMessageContainer>
        </BottomSectionContainer>
      </StyledScrollView>
    </>
  );
}
