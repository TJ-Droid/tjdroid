import React, { useEffect, useState, useContext } from "react";
import { Text, Linking, ToastAndroid } from "react-native";
import { Switch } from "react-native-gesture-handler";
import Rate, { AndroidMarket } from "react-native-rate";
import {
  carregarConfiguracoes,
  salvarConfiguracoes,
} from "../../controllers/configuracoesController";
import ThemeContext from "../../contexts/Theme";
import LoadingSpinner from "../../components/LoadingSpinner";

import {
  Container,
  ItemList,
  ItemListTitleSpace60,
  ItemListTitleSpace100,
  ItemListTextTitle,
  ItemListTextDescription,
  ItemListTextDescriptionTranslation,
  ItemListBoxSpace,
  ItemListBoxButtonCircleColor,
  StyledFeatherLeftIcon,
  StyledIoniconsLeftIcon,
  ItemListSpaceBetween,
  SectionDivider,
  SectionDividerText,
} from "./styles";
import { analyticsCustomEvent } from "../../services/AnalyticsCustomEvents";
import SelectPickerLanguages from "../../components/SelectPickerLanguages";
import { useTranslation } from "react-i18next";

export default function Configuracoes({ navigation }) {
  const { switchTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const [carregando, setCarregando] = useState(true);
  const [isEnabledDarkMode, setIsEnabledDarkMode] = useState(false);
  const [tema, setTema] = useState({
    azulEscuroDefault: false,
    verde: false,
    roxo: false,
    laranja: false,
    rosa: false,
    azulClaro: false,
    preto: false,
  });
  const [configuracoes, setConfiguracoes] = useState({});
  const [obgEscondido, setObgEscondido] = useState(0);

  // Altera o idioma para o selecionado
  const languageSelected = (language) => {
    i18n.changeLanguage(language);
  };

  // Obrigado escondido
  useEffect(() => {
    if (obgEscondido >= 5) {
      ToastAndroid.show(`${t("screens.configuracoes.hide_message")} 😁`, ToastAndroid.LONG);
      setObgEscondido(0);
    }
  }, [obgEscondido]);

  useEffect(() => {
    // Carrega as configuracoes salvas no Storage
    const carregaConfiguracoes = async () => {
      // Chama o controller para carregar as configurações
      await carregarConfiguracoes().then((configs) => {
        // Trata o retorno
        if (configs) {
          // Seta o estado com as configurações
          setConfiguracoes(configs);

          // Seta o Switch do Dark mode
          setIsEnabledDarkMode(configs.darkMode);

          // Seta o tema do app
          salvarTemaLocal(configs.actualTheme);

          // Seta o carregando para false, tirando a mensagem de carregando
          setCarregando(false);
        } else {
          // Se erro, dispara o toast
          ToastAndroid.show(
            `${t("screens.configuracoes.error_load_configs")}`,
            ToastAndroid.SHORT
          );
        }
      });
    };
    carregaConfiguracoes();
  }, []);

  // Função do Switch de Dark Mode
  const toggleSwitchDarkMode = async () => {
    // Salva no Storage
    await salvarConfiguracoes({
      ...configuracoes,
      darkMode: !isEnabledDarkMode,
    })
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Salva nas configurações
          setConfiguracoes({ ...configuracoes, darkMode: !isEnabledDarkMode });

          // Muda o switch
          setIsEnabledDarkMode(!isEnabledDarkMode);

          // Salva no context
          if (isEnabledDarkMode === false) {
            switchTheme("darkMode");
          } else {
            switchTheme(configuracoes.actualTheme);
          }
        } else {
          // Se erro, dispara o toast
          ToastAndroid.show(
            `${t("screens.configuracoes.error_save_theme")}`,
            ToastAndroid.SHORT
          );
        }
      })
      .catch(() => {
        // Se erro, dispara o toast
        ToastAndroid.show(
          `${t("screens.configuracoes.error_save_theme")}`,
          ToastAndroid.SHORT
        );
      });

    if (!isEnabledDarkMode) {
      // Adiciona o evento ao Analytics
      await analyticsCustomEvent("config_toque_cor", { cor: "darkMode" });
    }
  };

  // Função para salvar o tema selecionado
  const salvarTema = async (tema) => {
    // Salva no Storage
    await salvarConfiguracoes({
      ...configuracoes,
      actualTheme: tema,
      darkMode: false,
    })
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Salva nas configurações
          setConfiguracoes({ ...configuracoes, actualTheme: tema });

          // Salva no estado atual
          salvarTemaLocal(tema);

          // Muda o switch para false
          setIsEnabledDarkMode(false);

          // Salva no context
          switchTheme(tema);
        } else {
          // Se erro, dispara o toast
          ToastAndroid.show(
            `${t("screens.configuracoes.error_save_theme")}`,
            ToastAndroid.SHORT
          );
        }
      })
      .catch(() => {
        // Se erro, dispara o toast
        ToastAndroid.show(
          `${t("screens.configuracoes.error_save_theme")}`,
          ToastAndroid.SHORT
        );
      });

    // Adiciona o evento ao Analytics
    await analyticsCustomEvent("config_toque_cor", { cor: tema });
  };
  
  // Função para salvar o tema escolhido
  const salvarTemaLocal = (tema) => {
    switch (tema) {
      case "azulEscuroDefault":
        setTema({
          azulEscuroDefault: true,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
        });
        break;
      case "verde":
        setTema({
          verde: true,
          azulEscuroDefault: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
        });
        break;
      case "roxo":
        setTema({
          roxo: true,
          azulEscuroDefault: false,
          verde: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
        });
        break;
      case "laranja":
        setTema({
          laranja: true,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
        });
        break;
      case "rosa":
        setTema({
          rosa: true,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          azulClaro: false,
          preto: false,
          marsala: false,
        });
        break;
      case "azulClaro":
        setTema({
          azulClaro: true,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          preto: false,
          marsala: false,
        });
        break;
      case "preto":
        setTema({
          preto: true,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          marsala: false,
        });
        break;
      case "marsala":
        setTema({
          preto: false,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          marsala: true,
        });
        break;
      default:
        setTema({
          azulEscuroDefault: true,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
        });
        break;
    }
  };

  // Função que mostra o pop up com a caixa de avaliação
  const reviewInAppPopUp = () => {
    const options = {
      GooglePackageName: "dev.pedropaulo.tjdroid",
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
      OtherAndroidURL:
        "https://play.google.com/store/apps/details?id=dev.pedropaulo.tjdroid",
      fallbackPlatformURL:
        "https://play.google.com/store/apps/details?id=dev.pedropaulo.tjdroid",
    };
    Rate.rate(options, (success, errorMessage) => {
      if (success) {
        // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
        // console.log("Usuário viu a tela de review com sucesso!");
        ToastAndroid.show(":)", ToastAndroid.SHORT);
      }
      if (errorMessage) {
        // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
        // console.error(`Example page Rate.rate() error: ${errorMessage}`)
        ToastAndroid.show(`${t("errors.error_message_1")}`, ToastAndroid.LONG);
      }
    });
  };

  return (
    <>
      {carregando ? (
        <LoadingSpinner />
      ) : (
        <Container>
          <ItemList>
            <StyledFeatherLeftIcon name="moon" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace60>
                <ItemListTextTitle tail numberOfLines={1}>
                  {t("screens.configuracoes.night_mode")}
                </ItemListTextTitle>
              </ItemListTitleSpace60>

              <Switch
                style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                trackColor={{ false: "#767577", true: "#94EB8C" }}
                thumbColor={isEnabledDarkMode ? "#42B240" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchDarkMode}
                value={isEnabledDarkMode}
              />
            </ItemListSpaceBetween>
          </ItemList>

          <ItemList>
            <StyledFeatherLeftIcon name="droplet" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <ItemListTextTitle tail numberOfLines={1}>
                  {t("screens.configuracoes.themes")}
                </ItemListTextTitle>
                <ItemListBoxSpace>
                  <ItemListBoxButtonCircleColor
                    bgColor="#3690B7"
                    onPress={() => salvarTema("azulEscuroDefault")}
                    selected={tema.azulEscuroDefault}
                    accessible={true}
                    accessibilityLabel={t("screens.configuracoes.color_accessibility_label_blue")}
                    accessibilityHint={t("screens.configuracoes.color_accessibility_hint_blue")}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#50B87C"
                    onPress={() => salvarTema("verde")}
                    selected={tema.verde}
                    accessible={true}
                    accessibilityLabel={t("screens.configuracoes.color_accessibility_label_green")}
                    accessibilityHint={t("screens.configuracoes.color_accessibility_hint_green")}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#EC903C"
                    onPress={() => salvarTema("laranja")}
                    selected={tema.laranja}
                    accessible={true}
                    accessibilityLabel={t("screens.configuracoes.color_accessibility_label_orange")}
                    accessibilityHint={t("screens.configuracoes.color_accessibility_hint_orange")}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#EC6FAB"
                    onPress={() => salvarTema("rosa")}
                    selected={tema.rosa}
                    accessible={true}
                    accessibilityLabel={t("screens.configuracoes.color_accessibility_label_pink")}
                    accessibilityHint={t("screens.configuracoes.color_accessibility_hint_pink")}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#2DA0E1"
                    onPress={() => salvarTema("azulClaro")}
                    selected={tema.azulClaro}
                    accessible={true}
                    accessibilityLabel={t("screens.configuracoes.color_accessibility_label_lightblue")}
                    accessibilityHint={t("screens.configuracoes.color_accessibility_hint_lightblue")}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#581d22"
                    onPress={() => salvarTema("marsala")}
                    selected={tema.marsala}
                    accessible={true}
                    accessibilityLabel={t("screens.configuracoes.color_accessibility_label_marsala")}
                    accessibilityHint={t("screens.configuracoes.color_accessibility_hint_marsala")}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#523B73"
                    onPress={() => salvarTema("roxo")}
                    selected={tema.roxo}
                    accessible={true}
                    accessibilityLabel={t("screens.configuracoes.color_accessibility_label_purple")}
                    accessibilityHint={t("screens.configuracoes.color_accessibility_hint_purple")}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#383838"
                    onPress={() => salvarTema("preto")}
                    selected={tema.preto}
                    accessible={true}
                    accessibilityLabel={t("screens.configuracoes.color_accessibility_label_black")}
                    accessibilityHint={t("screens.configuracoes.color_accessibility_hint_black")}
                  />
                </ItemListBoxSpace>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>

          <SectionDivider>
            <SectionDividerText>{t("screens.configuracoes.languages")}</SectionDividerText>
          </SectionDivider>

          <ItemList>
            <StyledFeatherLeftIcon name="globe" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <SelectPickerLanguages
                  onChangeLanguageValue={(l) => languageSelected(l)}
                />
                <ItemListTextDescriptionTranslation
                  onPress={() => {
                    Linking.openURL("https://crowdin.com/project/tjdroid/invite");
                  }}
                >
                  {t("screens.configuracoes.app_translation_question")}
                </ItemListTextDescriptionTranslation>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>

          <SectionDivider>
            <SectionDividerText>{t("screens.configuracoes.infos")}</SectionDividerText>
          </SectionDivider>

          <ItemList>
            <StyledFeatherLeftIcon name="help-circle" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <ItemListTextTitle tail numberOfLines={1}>
                {t("screens.configuracoes.help")}
                </ItemListTextTitle>
                <ItemListTextDescription
                  onPress={() => navigation.navigate("Ajuda")}
                >
                  {t("screens.configuracoes.help_description")}
                </ItemListTextDescription>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>

          <ItemList>
            <StyledFeatherLeftIcon name="file-text" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <ItemListTextTitle tail numberOfLines={1}>
                {t("screens.configuracoes.terms")}
                </ItemListTextTitle>
                <ItemListTextDescription>
                  <Text
                    onPress={async () => {
                      // Adiciona o evento ao Analytics
                      await analyticsCustomEvent("config_toque_politprivlgpd");
                      Linking.openURL(
                        "https://pedropaulodev.notion.site/Pol-tica-de-Privacidade-e-LGPD-dc8a17a00aa14566a9238f5024674d9a"
                      );
                    }}
                  >
                    {t("screens.configuracoes.terms_description")}
                  </Text>
                </ItemListTextDescription>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>

          <ItemList>
            <StyledFeatherLeftIcon name="smile" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <ItemListTextTitle tail numberOfLines={1}>
                {t("screens.configuracoes.like_app")}
                </ItemListTextTitle>
                <ItemListTextDescription
                  onPress={async () => {
                    // Adiciona o evento ao Analytics
                    await analyticsCustomEvent("config_toque_avaliarapp");
                    reviewInAppPopUp();
                  }}
                >
                  {t("screens.configuracoes.like_app_description")}
                </ItemListTextDescription>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>
          
          <ItemList>
            <StyledFeatherLeftIcon name="github" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <ItemListTextTitle tail numberOfLines={1}>
                {t("screens.configuracoes.github")}
                </ItemListTextTitle>
                <ItemListTextDescription
                   onPress={async () => {
                    Linking.openURL("https://github.com/pedropaulodf/tjdroid");
                  }}
                >
                  {t("screens.configuracoes.github_description")}
                </ItemListTextDescription>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>

          <ItemList>
            <StyledFeatherLeftIcon
              name="info"
              onPress={() => setObgEscondido((o) => o + 1)}
            />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <ItemListTextDescription
                  onPress={() => setObgEscondido((o) => o + 1)}
                >
                  {t("screens.configuracoes.version")} 1.0.13
                </ItemListTextDescription>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>
        </Container>
      )}
    </>
  );
}
