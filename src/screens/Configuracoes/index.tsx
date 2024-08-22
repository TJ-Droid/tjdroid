import React, { useEffect, useState } from "react";
import { Text, Linking, ToastAndroid, Switch, View } from "react-native";
import Rate, { AndroidMarket } from "react-native-rate";
import { useThemeContext } from "../../contexts/Theme";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  carregarConfiguracoes,
  salvarConfiguracoes,
} from "../../controllers/configuracoesController";
import { analyticsCustomEvent } from "../../services/AnalyticsCustomEvents";
import SelectPickerLanguages from "../../components/SelectPickerLanguages";
import { useTranslation } from "react-i18next";
import themes from "../../themes";
import { ThemeColors, ThemeConfiguracoesScreenType } from "../../types/Theme";
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
  ItemListSpaceBetween,
  SectionDivider,
  SectionDividerText,
  ItemListTextDescriptionTranslationIcon,
} from "./styles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamListType } from "../../routes";
import { AppLanguages } from "../../types/Languages";

type ProfileScreenRouteProp = StackScreenProps<
  RootStackParamListType,
  "Configuracoes"
>;

interface Props extends ProfileScreenRouteProp {}

export default function Configuracoes({ navigation }: Props) {
  const { t, i18n } = useTranslation();
  const { setActualTheme, actualTheme } = useThemeContext();

  const [carregando, setCarregando] = useState(true);
  const [isEnabledDarkMode, setIsEnabledDarkMode] = useState(false);
  const [temaLocal, setTemaLocal] = useState({
    azulEscuroDefault: false,
    verde: false,
    roxo: false,
    laranja: false,
    rosa: false,
    azulClaro: false,
    preto: false,
    marsala: false,
    vermelho: false,
    gold: false,
    violeta: false,
  });
  const [configuracoes, setConfiguracoes] =
    useState<ThemeConfiguracoesScreenType>({
      actualTheme: "azulEscuroDefault",
      darkMode: false,
    });
  const [obgEscondido, setObgEscondido] = useState(0);
  const [isRelatorioSimplificadoAtivado, setIsRelatorioSimplificadoAtivado] =
    useState(true);

  // Altera o idioma para o selecionado
  const languageSelected = (language: string) => {
    i18n.changeLanguage(language);
  };

  // Obrigado escondido
  useEffect(() => {
    if (obgEscondido >= 5) {
      ToastAndroid.show(
        `${t("screens.configuracoes.hide_message")} 😁`,
        ToastAndroid.LONG
      );
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

          // Salva o relatorio simplificado estado local
          setIsRelatorioSimplificadoAtivado(
            configs?.isRelatorioSimplificado ?? true
          );

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
          setConfiguracoes((prev) => ({
            ...prev,
            darkMode: !isEnabledDarkMode,
          }));

          // Salva no context
          if (!isEnabledDarkMode === true) {
            setActualTheme && setActualTheme(themes["darkMode"]);
          } else {
            setActualTheme && setActualTheme(themes[configuracoes.actualTheme]);
          }

          // Muda o switch
          setIsEnabledDarkMode(!isEnabledDarkMode);
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

  // Função do Switch de Relatório Simplificado
  const toggleRelatorioSimplificado = async (isAtivado: boolean) => {
    // Salva no Storage
    await salvarConfiguracoes({
      ...configuracoes,
      isRelatorioSimplificado: isAtivado,
    })
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Salva no estado local
          setIsRelatorioSimplificadoAtivado(isAtivado);
        } else {
          // Se erro, dispara o toast
          ToastAndroid.show(
            `${t("screens.configuracoes.error_save_simplified_report")}`,
            ToastAndroid.SHORT
          );
        }
      })
      .catch(() => {
        // Se erro, dispara o toast
        ToastAndroid.show(
          `${t("screens.configuracoes.error_save_simplified_report")}`,
          ToastAndroid.SHORT
        );
      });
  };

  // Função para salvar o tema selecionado
  const salvarTema = async (tema: ThemeColors) => {
    // Salva no Storage
    await salvarConfiguracoes({
      actualTheme: tema,
      darkMode: false,
    })
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Salva nas configurações
          setConfiguracoes((prev) => ({ ...prev, actualTheme: tema }));

          // Salva no estado atual
          salvarTemaLocal(tema);

          // Muda o switch para false
          setIsEnabledDarkMode(false);

          // Salva no context
          setActualTheme && setActualTheme(themes[tema]);
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
  const salvarTemaLocal = (tema: ThemeColors) => {
    switch (tema) {
      case "azulEscuroDefault":
        setTemaLocal({
          azulEscuroDefault: true,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: false,
        });
        break;
      case "verde":
        setTemaLocal({
          verde: true,
          azulEscuroDefault: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: false,
        });
        break;
      case "roxo":
        setTemaLocal({
          roxo: true,
          azulEscuroDefault: false,
          verde: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: false,
        });
        break;
      case "laranja":
        setTemaLocal({
          laranja: true,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: false,
        });
        break;
      case "rosa":
        setTemaLocal({
          rosa: true,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          azulClaro: false,
          preto: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: false,
        });
        break;
      case "azulClaro":
        setTemaLocal({
          azulClaro: true,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          preto: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: false,
        });
        break;
      case "preto":
        setTemaLocal({
          preto: true,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: false,
        });
        break;
      case "marsala":
        setTemaLocal({
          preto: false,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          marsala: true,
          vermelho: false,
          gold: false,
          violeta: false,
        });
        break;
      case "vermelho":
        setTemaLocal({
          preto: false,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          marsala: false,
          vermelho: true,
          gold: false,
          violeta: false,
        });
        break;
      case "gold":
        setTemaLocal({
          preto: false,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          marsala: false,
          vermelho: false,
          gold: true,
          violeta: false,
        });
        break;
      case "violeta":
        setTemaLocal({
          preto: false,
          azulEscuroDefault: false,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: true,
        });
        break;
      default:
        setTemaLocal({
          azulEscuroDefault: true,
          verde: false,
          roxo: false,
          laranja: false,
          rosa: false,
          azulClaro: false,
          preto: false,
          marsala: false,
          vermelho: false,
          gold: false,
          violeta: false,
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
                <ItemListTextTitle numberOfLines={1}>
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
                <ItemListTextTitle numberOfLines={1}>
                  {t("screens.configuracoes.themes")}
                </ItemListTextTitle>
                <ItemListBoxSpace>
                  <ItemListBoxButtonCircleColor
                    bgColor="#3690B7"
                    onPress={() => salvarTema("azulEscuroDefault")}
                    selected={temaLocal.azulEscuroDefault}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_blue"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_blue"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#2DA0E1"
                    onPress={() => salvarTema("azulClaro")}
                    selected={temaLocal.azulClaro}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_lightblue"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_lightblue"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#50B87C"
                    onPress={() => salvarTema("verde")}
                    selected={temaLocal.verde}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_green"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_green"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#EC903C"
                    onPress={() => salvarTema("laranja")}
                    selected={temaLocal.laranja}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_orange"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_orange"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#D4AF37"
                    onPress={() => salvarTema("gold")}
                    selected={temaLocal.gold}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_gold"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_gold"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#EC6FAB"
                    onPress={() => salvarTema("rosa")}
                    selected={temaLocal.rosa}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_pink"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_pink"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#C94040"
                    onPress={() => salvarTema("vermelho")}
                    selected={temaLocal.vermelho}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_vermelho"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_vermelho"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#581d22"
                    onPress={() => salvarTema("marsala")}
                    selected={temaLocal.marsala}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_marsala"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_marsala"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#6B52D7"
                    onPress={() => salvarTema("violeta")}
                    selected={temaLocal.violeta}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_violeta"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_violeta"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#523B73"
                    onPress={() => salvarTema("roxo")}
                    selected={temaLocal.roxo}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_purple"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_purple"
                    )}
                  />
                  <ItemListBoxButtonCircleColor
                    bgColor="#383838"
                    onPress={() => salvarTema("preto")}
                    selected={temaLocal.preto}
                    accessible={true}
                    accessibilityLabel={t(
                      "screens.configuracoes.color_accessibility_label_black"
                    )}
                    accessibilityHint={t(
                      "screens.configuracoes.color_accessibility_hint_black"
                    )}
                  />
                </ItemListBoxSpace>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>

          <SectionDivider>
            <SectionDividerText>
              {t("screens.configuracoes.languages")}
            </SectionDividerText>
          </SectionDivider>

          <ItemList>
            <StyledFeatherLeftIcon name="globe" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <SelectPickerLanguages
                  onChangeLanguageValue={(l: AppLanguages) =>
                    languageSelected(l)
                  }
                />
                <ItemListTextDescriptionTranslation
                  onPress={() => {
                    Linking.openURL(
                      "https://github.com/TJ-Droid/tjdroid#world_map-contribution-with-translations"
                    );
                  }}
                >
                  {t("screens.configuracoes.app_translation_question")}{" "}
                  <ItemListTextDescriptionTranslationIcon name="external-link" />
                </ItemListTextDescriptionTranslation>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>

          <SectionDivider>
            <SectionDividerText>{t("screens.home.reports")}</SectionDividerText>
          </SectionDivider>

          <ItemList>
            <StyledFeatherLeftIcon name="file-minus" />
            <ItemListSpaceBetween>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <ItemListTextTitle numberOfLines={1}>
                  {t("screens.configuracoes.simplified_report_title")}
                </ItemListTextTitle>
                <ItemListTextDescription>
                  {t("screens.configuracoes.simplified_report_description")}
                </ItemListTextDescription>
              </View>

              <Switch
                style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                trackColor={{ false: "#767577", true: "#94EB8C" }}
                thumbColor={
                  isRelatorioSimplificadoAtivado ? "#42B240" : "#f4f3f4"
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleRelatorioSimplificado}
                value={isRelatorioSimplificadoAtivado}
              />
            </ItemListSpaceBetween>
          </ItemList>
          <SectionDivider>
            <SectionDividerText>
              {t("screens.configuracoes.infos")}
            </SectionDividerText>
          </SectionDivider>

          <ItemList>
            <StyledFeatherLeftIcon name="help-circle" />
            <ItemListSpaceBetween>
              <ItemListTitleSpace100>
                <ItemListTextTitle numberOfLines={1}>
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
                <ItemListTextTitle numberOfLines={1}>
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
                <ItemListTextTitle numberOfLines={1}>
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
                <ItemListTextTitle numberOfLines={1}>
                  {t("screens.configuracoes.github")}
                </ItemListTextTitle>
                <ItemListTextDescription
                  onPress={async () => {
                    Linking.openURL("https://github.com/TJ-Droid/tjdroid");
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
                  {t("screens.configuracoes.version")} 1.2.2
                </ItemListTextDescription>
              </ItemListTitleSpace100>
            </ItemListSpaceBetween>
          </ItemList>
        </Container>
      )}
    </>
  );
}
