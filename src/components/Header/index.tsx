import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Share,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";
import { Divider, Menu } from "react-native-paper";

import "react-native-get-random-values";
// import "moment/locale/pt-br";
import minutes_to_hhmm from "../../utils/minutes_to_hhmm";
import DialogModal from "../DialogModal";

import {
  deletarPessoa,
  editarVisita,
  excluirVisita,
  salvarPessoa,
  salvarVisita,
  SalvarVisitaType,
} from "../../controllers/pessoasController";
import {
  deletarRelatorio,
  editarRelatorio,
  salvarNovoRelatorio,
  SelectedMonthServiceDataType,
} from "../../controllers/relatoriosController";
import {
  adicionarUmaResidencia,
  adicionarVariasResidencias,
  alterarDisposicaoVisualTerritorio,
  deletarResidenciaTerritorio,
  deletarTerritorio,
  editarNomeIdentificadorResidencia,
  editarNomeTerritorio,
  editarVisitaCasa,
  excluirVisitaCasa,
  salvarInformacoesTerritorio,
  salvarNovoTerritorio,
  salvarVisitaCasa,
  SearchTerritoryInfoType,
  VisitCustomSearchHomeVisitIterface,
} from "../../controllers/territoriosController";

import { StackNavigationProp } from "@react-navigation/stack";
import { carregarConfiguracoes } from "../../controllers/configuracoesController";
import { RootStackParamListType } from "../../routes";
import { ReportCounterType } from "../../types/ReportCounter";
import { TerritoryDispositionType } from "../../types/Territories";
import { VisitDataType } from "../../types/Visits";
import {
  ButtonText,
  Container,
  ContainerButtons,
  ContainerTitleButtons,
  StyledButton,
  StyledButtonDelete,
  StyledButtonGoBack,
  StyledButtonSave,
  StyledFeatherHeaderButtons,
  StyledFeatherHeaderButtonsIcon,
  StyledFeatherHeaderButtonsIconRed,
  StyledIoniconsHeaderButtons,
  StyledStatusBar,
  Title,
  WrapperButton,
} from "./styles";

type TerritoryTypeLocal = {
  nome: string;
  idTerritorio: string;
  idPredio: string;
  idCasa?: string;
  swipeCurrentID?: number;
};

type ShowReportSendType = {
  totaisDoMes: Partial<SelectedMonthServiceDataType>;
  mesAnoFormatado?: string;
  isMesTrabalhado: boolean;
};

type TerritoryType = {
  nome: string;
  territoryId: string;
  residenciaId?: string;
};

type HeaderPropsType = {
  title?: string;
  capitalize?: boolean;
  showGoBack?: boolean;
  showGoBackHome?: boolean;
  showGoBackPersons?: boolean;
  showGoBackReportDetails?: boolean;
  isHomePage?: boolean;
  showCancel?: boolean;
  showContadorSave?: ReportCounterType;
  showReportSave?: ReportCounterType;
  showNewReportSave?: ReportCounterType;
  showReportAdd?: { mesAno: string };
  showReportSend?: ShowReportSendType;
  showAddNewPerson?: boolean;
  showDeletePerson?: { personId: string };
  showAddPersonVisit?: { personId: string };
  showEditPersonVisit?: VisitDataType;
  showNewPersonVisit?: SalvarVisitaType;
  showAddNewTerritory?: boolean;
  showOptionAddNewResidences?: boolean;
  showChangeDisposition?: {
    visualDisposition: TerritoryDispositionType;
    id: string;
  };
  showChangeDispositionFunc?: (disposition: TerritoryDispositionType) => void;
  showTerritoryMenu?: boolean;
  handleChangeTerritoryNameFunc?: (name: string) => void;
  territoryData?: TerritoryType;
  showDeleteTerritoryHome?: { residenciaId: string; territoryId: string };
  showAddHomeVisit?: { residenciaId: string; territoryId: string };
  showEditHomeIdentifier?: { residenciaId: string; territoryId: string };
  showNewHomeVisit?: VisitDataType;
  handleChangeHomeIdentifierFunc?: (newIdentifier: string) => void;
  showEditHomeVisit?: VisitCustomSearchHomeVisitIterface;
  showEditTerritoryInfo?: SearchTerritoryInfoType;
};

const styles = StyleSheet.create({
  titleCapitalize: { textTransform: "capitalize" },
  titleNone: { textTransform: "none" },
  row: { flexDirection: "row" },
  menuWrapper: { flexDirection: "row", justifyContent: "center", flex: 1 },
  menuDeleteItem: { backgroundColor: "#ff000030" },
});

export default function Header({
  title = "",
  capitalize = true,
  showGoBack = false,
  showGoBackHome = false,
  showGoBackPersons = false,
  showGoBackReportDetails = false,
  isHomePage = false,
  showCancel = false,
  showContadorSave = undefined,
  showReportSave = undefined,
  showNewReportSave = undefined,
  showReportAdd = undefined,
  showReportSend = undefined,
  showAddNewPerson = false,
  showDeletePerson = undefined,
  showAddPersonVisit = undefined,
  showEditPersonVisit = undefined,
  showNewPersonVisit = undefined,
  showAddNewTerritory = false,
  showOptionAddNewResidences = false,
  showChangeDisposition = undefined,
  showChangeDispositionFunc = () => {},
  showTerritoryMenu = false,
  handleChangeTerritoryNameFunc = () => {},
  territoryData = {} as TerritoryType,
  showDeleteTerritoryHome = undefined,
  showAddHomeVisit = undefined,
  showEditHomeIdentifier = undefined,
  showNewHomeVisit = undefined,
  handleChangeHomeIdentifierFunc = () => {},
  showEditHomeVisit = undefined,
  showEditTerritoryInfo = undefined,
}: HeaderPropsType) {
  const { t } = useTranslation();

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamListType>>();

  const [addMenu, setAddMenu] = useState(false);
  const openAddMenu = useCallback(() => setAddMenu(true), []);
  const closeAddMenu = useCallback(() => setAddMenu(false), []);

  const [dotsMenu, setDotsMenu] = useState(false);
  const openDotsMenu = useCallback(() => setDotsMenu(true), []);
  const closeDotsMenu = useCallback(() => setDotsMenu(false), []);

  // Dialog states
  const [dialogNewPersonVisible, setDialogNewPersonVisible] = useState(false);
  const [dialogNewTerritoryVisible, setDialogNewTerritoryVisible] =
    useState(false);
  const [
    dialogChangeNameTerritoryVisible,
    setDialogChangeNameTerritoryVisible,
  ] = useState(false);
  const [
    dialogChangeHomeIdentifierVisible,
    setDialogChangeHomeIdentifierVisible,
  ] = useState(false);
  const [dialogAddTerritoryHomeVisible, setDialogAddTerritoryHomeVisible] =
    useState(false);

  const voltarHome = useCallback(
    () => navigation.navigate("Home"),
    [navigation]
  );
  const voltarPessoas = useCallback(
    () => navigation.navigate("Pessoas"),
    [navigation]
  );
  const voltarAtras = useCallback(() => navigation.goBack(), [navigation]);
  const navigateToRelatorios = useCallback(
    () => navigation.navigate("Relatorios"),
    [navigation]
  );
  const navigateToBackup = useCallback(
    () => navigation.navigate("Backup"),
    [navigation]
  );
  const navigateToAjuda = useCallback(
    () => navigation.navigate("Ajuda"),
    [navigation]
  );
  const navigateToConfiguracoes = useCallback(
    () => navigation.navigate("Configuracoes"),
    [navigation]
  );

  // Dialog Open Function
  function handleOpenDialogNewPerson(value: boolean) {
    setDialogNewPersonVisible(value);
  }
  function handleOpenDialogNewTerritory(value: boolean) {
    setDialogNewTerritoryVisible(value);
  }
  function handleOpenDialogChangeNameTerritory(value: boolean) {
    setDialogChangeNameTerritoryVisible(value);
  }
  function handleOpenDialogChangeHomeIdentifier(value: boolean) {
    setDialogChangeHomeIdentifierVisible(value);
  }
  function handleOpenDialogTerritoryHome(value: boolean) {
    setDialogAddTerritoryHomeVisible(value);
  }

  // Dialog Cancel Function
  function handleCancelDialogNewPerson() {
    setDialogNewPersonVisible(false);
  }
  function handleCancelDialogNewTerritory() {
    setDialogNewTerritoryVisible(false);
  }
  function handleCancelDialogChangeNameTerritory() {
    setDialogChangeNameTerritoryVisible(false);
  }
  function handleCancelDialogChangeHomeIdentifier() {
    setDialogChangeHomeIdentifierVisible(false);
  }
  function handleCancelDialogTerritoryHome() {
    setDialogAddTerritoryHomeVisible(false);
  }

  // Script do botão de Compartilhar
  // COMPARTILHAR RELATÓRIO
  function compartilharRelatorio(
    relatorio: ShowReportSendType,
    comHoras?: boolean
  ) {
    const compartilhar = async () => {
      // Chama o controller para carregar as configurações
      await carregarConfiguracoes().then(async (configs) => {
        // Trata o retorno
        if (configs) {
          const {
            totalColocacoes,
            totalMinutos,
            totalRevisitas,
            totalVideosMostrados,
            totalEstudosBiblicos,
          } = relatorio.totaisDoMes;

          try {
            // Monta o texto do relatório
            const relatorioText = comHoras
              ? `${t("components.header.share_report_title")} ${(
                  relatorio.mesAnoFormatado ?? ""
                ).replace(/^\w/, (c) => c.toUpperCase())}\n\n${t(
                  "screens.relatoriomes.worked_month_description"
                )} ${
                  relatorio.isMesTrabalhado ? t("words.yes") : t("words.no")
                }. \n${t(
                  "components.header.share_report_hours"
                )}: ${minutes_to_hhmm(totalMinutos ?? 0)}\n${t(
                  "components.header.share_report_bible_studies"
                )}: ${totalEstudosBiblicos}${
                  !!configs?.isRelatorioSimplificado
                    ? ``
                    : `\n${t(
                        "components.header.share_report_revisits"
                      )}: ${totalRevisitas}\n${t(
                        "components.header.share_report_placements"
                      )}: ${totalColocacoes}\n${t(
                        "components.header.share_report_videos_showed"
                      )}: ${totalVideosMostrados}`
                }`
              : `${t("components.header.share_report_title")} ${(
                  relatorio.mesAnoFormatado ?? ""
                ).replace(/^\w/, (c) => c.toUpperCase())}\n\n${t(
                  "screens.relatoriomes.worked_month_description"
                )} ${
                  relatorio.isMesTrabalhado ? t("words.yes") : t("words.no")
                }. \n${t(
                  "components.header.share_report_bible_studies"
                )}: ${totalEstudosBiblicos}${
                  !!configs?.isRelatorioSimplificado
                    ? ``
                    : `\n${t(
                        "components.header.share_report_revisits"
                      )}: ${totalRevisitas}\n${t(
                        "components.header.share_report_placements"
                      )}: ${totalColocacoes}\n${t(
                        "components.header.share_report_videos_showed"
                      )}: ${totalVideosMostrados}`
                }`;

            // Monta o texto para o compartilhamento
            // Capitaliza o mês do ano
            await Share.share({ message: relatorioText });
          } catch (e) {
            ToastAndroid.show(
              t("components.header.share_report_error_message"),
              ToastAndroid.LONG
            );
          }
        } else {
          // Se erro, dispara o toast
          ToastAndroid.show(
            `${t("screens.configuracoes.error_load_configs")}`,
            ToastAndroid.SHORT
          );
        }
      });
    };
    compartilhar();
  }

  const alertaExclusaoPessoa = (idPessoa: string) =>
    Alert.alert(
      t("components.header.alert_delete_person_title"),
      t("components.header.alert_delete_person_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        { text: t("words.yes"), onPress: () => handleDeletarPessoa(idPessoa) },
      ],
      { cancelable: true }
    );

  const alertaExclusaoCasa = (residenciaId: string, territoryId: string) =>
    Alert.alert(
      t("components.header.alert_delete_household_title"),
      t("components.header.alert_delete_household_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () => handleDeletarCasa(residenciaId, territoryId),
        },
      ],
      { cancelable: true }
    );

  const alertaExclusaoRelatorioAtual = (
    idRelatorio: string,
    dataRelatorio: string
  ) =>
    Alert.alert(
      t("components.header.alert_delete_report_title"),
      t("components.header.alert_delete_report_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () => handleDeletarRelatorio(idRelatorio, dataRelatorio),
        },
      ],
      { cancelable: true }
    );

  const alertaCancelarNovoRelatorio = (caminhoParaVoltar: "Home" | "voltar") =>
    Alert.alert(
      t("components.header.alert_delete_new_report_title"),
      t("components.header.alert_delete_new_report_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () =>
            caminhoParaVoltar === "voltar"
              ? navigation.goBack()
              : navigation.navigate(caminhoParaVoltar),
        },
      ],
      { cancelable: true }
    );

  const alertaDeletarVisitaPessoa = (idPessoa: string, idVisita: string) =>
    Alert.alert(
      t("components.header.alert_delete_visit_person_title"),
      t("components.header.alert_delete_visit_person_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () => handleDeletarVisitaPessoa(idPessoa, idVisita),
        },
      ],
      { cancelable: true }
    );

  const alertaDeletarVisitaCasa = (
    idVisita: string,
    residenciaId: string,
    territorioId: string
  ) =>
    Alert.alert(
      t("components.header.alert_delete_visit_house_title"),
      t("components.header.alert_delete_visit_house_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () =>
            handleDeletarVisitaCasa(idVisita, residenciaId, territorioId),
        },
      ],
      { cancelable: true }
    );

  const alertaCancelarAdicaoVisitaPessoa = (caminhoParaVoltar: "voltar") =>
    Alert.alert(
      t("components.header.alert_cancel_new_visit_person_title"),
      t("components.header.alert_cancel_new_visit_person_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () =>
            caminhoParaVoltar === "voltar"
              ? navigation.goBack()
              : navigation.navigate(caminhoParaVoltar),
        },
      ],
      { cancelable: true }
    );

  const alertaCancelarAdicaoVisitaCasa = (caminhoParaVoltar: "voltar") =>
    Alert.alert(
      t("components.header.alert_cancel_new_visit_house_title"),
      t("components.header.alert_cancel_new_visit_house_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () =>
            caminhoParaVoltar === "voltar"
              ? navigation.goBack()
              : navigation.navigate(caminhoParaVoltar),
        },
      ],
      { cancelable: true }
    );

  const alertaExclusaoTerritorio = (
    idTerritorio: string,
    nomeTerritorio: string
  ) =>
    Alert.alert(
      t("components.header.alert_delete_territory_title"),
      t("components.header.alert_delete_territory_description", {
        nomeTerritorio,
      }),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("words.yes"),
          onPress: () =>
            deletarTerritorio(idTerritorio).then(() => {
              navigation.navigate("Territorios");
            }),
        },
      ],
      { cancelable: true }
    );

  // Editar Relatório
  function handleEditarRelatorio(relatorio: ReportCounterType) {
    editarRelatorio(relatorio)
      .then((dados) => {
        // Trata o retorno
        if (dados?.mesAno) {
          navigation.navigate("RelatorioMes", { mesAno: dados.mesAno });
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.report_edit_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("components.header.report_edit_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // Salvar Relatorio
  function handleSalvarNovoRelatorio(
    relatorio: ReportCounterType,
    origem: "contador" | "relatorio"
  ) {
    salvarNovoRelatorio(relatorio)
      .then((dados) => {
        // Trata o retorno
        if (dados?.mesAno) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.new_report_add_success_message"),
            ToastAndroid.SHORT
          );

          // Se vier do contador, usa o REPLACE, se nao, usa o NAVIGATE
          // Isso é para facilitar a navegação nativa
          origem === "contador"
            ? navigation.replace("RelatorioMes", dados)
            : navigation.navigate("RelatorioMes", dados);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.new_report_add_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("components.header.new_report_add_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // DELETAR RELATÓRIO
  function handleDeletarRelatorio(idRelatorio: string, dataRelatorio: string) {
    deletarRelatorio(idRelatorio, dataRelatorio)
      .then((dados) => {
        // Trata o retorno
        if (dados.mesAno) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.report_delete_success_message"),
            ToastAndroid.LONG
          );

          // Navega até a página abaixo
          navigation.navigate("RelatorioMes", dados);
        } else {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.report_delete_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(
          t("components.header.report_delete_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // ADICIONAR NOVA PESSOA
  function handleAdicionarPessoa(personNewName: string) {
    salvarPessoa(personNewName)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.person_add_success_message"),
            ToastAndroid.LONG
          );
          // Navega até a página abaixo
          navigation.replace("Pessoas");
          // Apos salvar a pessoa, fecha o modal
          setDialogNewPersonVisible(false);
        } else {
          ToastAndroid.show(
            t("components.header.person_add_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.person_add_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // DELETAR PESSOA
  function handleDeletarPessoa(personId: string) {
    deletarPessoa(personId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.person_delete_success_message"),
            ToastAndroid.LONG
          );
          // Navega até a página abaixo
          navigation.replace("Pessoas");
        } else {
          ToastAndroid.show(
            t("components.header.person_delete_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.person_delete_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // DELETAR CASA
  function handleDeletarCasa(residenciaId: string, territoryId: string) {
    deletarResidenciaTerritorio(residenciaId, territoryId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.house_delete_success_message"),
            ToastAndroid.LONG
          );
          // Navega até a página abaixo
          // navigation.goBack("TerritorioResidencias", dados);
          navigation.goBack();
        } else {
          ToastAndroid.show(
            t("components.header.house_delete_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.house_delete_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // DELETAR VISITA CASA
  function handleDeletarVisitaCasa(
    idVisita: string,
    residenciaId: string,
    territorioId: string
  ) {
    excluirVisitaCasa(idVisita, residenciaId, territorioId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.house_visit_delete_success_message"),
            ToastAndroid.SHORT
          );
          // Navega até a página abaixo
          navigation.goBack();
        } else {
          ToastAndroid.show(
            t("components.header.house_visit_delete_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.house_visit_delete_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // DELETAR VISITA PESSOA
  function handleDeletarVisitaPessoa(idPessoa: string, idVisita: string) {
    excluirVisita(idPessoa, idVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados?.idPessoa) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.person_visit_success_message"),
            ToastAndroid.SHORT
          );
          // Navega até a página abaixo
          navigation.navigate("PessoaVisitas", { idPessoa: dados?.idPessoa });
        } else {
          ToastAndroid.show(
            t("components.header.person_visit_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.person_visit_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // EDITAR UMA VISITA FEITA
  function handleEditarVisitaFeita(dadosVisita: VisitDataType) {
    editarVisita(dadosVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados?.idPessoa) {
          navigation.navigate("PessoaVisitas", { idPessoa: dados?.idPessoa });
        } else {
          ToastAndroid.show(
            t("components.header.person_edit_visit_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.person_edit_visit_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // EDITAR UMA VISITA FEITA CASA
  function handleEditarVisitaCasa(
    dadosVisita: VisitCustomSearchHomeVisitIterface
  ) {
    editarVisitaCasa(dadosVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          navigation.goBack();
        } else {
          ToastAndroid.show(
            t("components.header.house_edit_visit_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.house_edit_visit_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // EDITAR INFORMAÇÕES DO TERRITORIO
  function handleEditarInformacoesTerritorio(
    dadosTerritorio: SearchTerritoryInfoType
  ) {
    salvarInformacoesTerritorio(dadosTerritorio)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          navigation.goBack();
        } else {
          ToastAndroid.show(
            t("components.header.territory_edit_infos_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.territory_edit_infos_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // ADICIONAR VISITA DA PESSOA
  function handleAdicionarVisitaFeita(dadosNovaVisita: SalvarVisitaType) {
    salvarVisita(dadosNovaVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados?.idPessoa) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.person_add_visit_success_message"),
            ToastAndroid.SHORT
          );
          // Navega até a página abaixo
          navigation.navigate("PessoaVisitas", { idPessoa: dados?.idPessoa });
        } else {
          ToastAndroid.show(
            t("components.header.person_add_visit_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.person_add_visit_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // ADICIONAR VISITA DA CASA
  function handleAdicionarVisitaFeitaCasa(dadosNovaVisita: VisitDataType) {
    salvarVisitaCasa(dadosNovaVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.house_add_visit_success_message"),
            ToastAndroid.SHORT
          );
          // Navega até a página TerritorioResidenciasVisitas
          navigation.goBack();
        } else {
          ToastAndroid.show(
            t("components.header.house_add_visit_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.house_add_visit_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // ADICIONAR NOVO TERRITÓRIO
  function handleAdicionarTerritorio(territorioNome: string) {
    salvarNovoTerritorio(territorioNome)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.add_territory_success_message"),
            ToastAndroid.LONG
          );
          // Navega até a página abaixo
          navigation.replace("Territorios");
          // Apos salvar a pessoa, fecha o modal
          setDialogNewPersonVisible(false);
        } else {
          ToastAndroid.show(
            t("components.header.add_territory_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.add_territory_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // ALTERAR DISPOSIÇÃO VISUAL DE UM TERRITÓRIO
  function handleChangeDisposition(novosDados: {
    visualDisposition: TerritoryDispositionType;
    id: string;
  }) {
    // Trata os dados alterando entre caixas e linhas
    novosDados.visualDisposition =
      novosDados.visualDisposition === "linhas" ? "caixas" : "linhas";

    // Manda o retorno para a funcao atualizar a lista da tela
    showChangeDispositionFunc(novosDados.visualDisposition);

    // Função para alterar e salvar no storage
    alterarDisposicaoVisualTerritorio(novosDados)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // NÃO FAZ NADA SE DER CERTO
          // A RESPOSTA SERÁ VISUAL AO USUÁRIO
        } else {
          ToastAndroid.show(
            t("components.header.change_territories_disposition_error_message"),
            ToastAndroid.SHORT
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.change_territories_disposition_error_message"),
          ToastAndroid.SHORT
        );
      });
  }

  // ADICIONAR NOVO TERRITÓRIO
  function handleEditarNomeTerritorio(
    territorioNome: string,
    territorioId: string
  ) {
    editarNomeTerritorio(territorioNome, territorioId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.territory_edit_name_succes_message"),
            ToastAndroid.LONG
          );

          // Altera o nome da tela também
          handleChangeTerritoryNameFunc(territorioNome);

          // Apos salvar a pessoa, fecha o modal
          setDialogChangeNameTerritoryVisible(false);
        } else {
          ToastAndroid.show(
            t("components.header.territory_edit_name_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.territory_edit_name_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // ADICIONAR NOVO TERRITÓRIO
  function handleEditarIdentificadorResidencia(
    newIdentifier: string,
    residenciaId = "",
    territoryId: string
  ) {
    editarNomeIdentificadorResidencia(newIdentifier, residenciaId, territoryId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.territory_edit_identificator_succes_message"),
            ToastAndroid.LONG
          );

          // Altera o nome da tela também
          handleChangeHomeIdentifierFunc(newIdentifier);

          // Apos salvar a pessoa, fecha o modal
          handleOpenDialogChangeHomeIdentifier(false);
        } else {
          ToastAndroid.show(
            t("components.header.territory_edit_identificator_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.territory_edit_identificator_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // ADICIONAR NOVA RESIDÊNCIA
  function handleAdicionarUmaResidencia(territorioId: string) {
    adicionarUmaResidencia(territorioId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.add_house_success_message"),
            ToastAndroid.LONG
          );
          // Navega até a página abaixo
          navigation.replace("TerritorioResidencias", dados);
          // Apos salvar a pessoa, fecha o modal
          // setDialogNewPersonVisible(false);
        } else {
          ToastAndroid.show(
            t("components.header.add_house_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.add_house_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  // ADICIONAR VÁRIAS RESIDÊNCIAS
  function handleAdicionarVariasResidencias(
    territorioId: string,
    qtdInicial: number,
    qtdFinal: number
  ) {
    adicionarVariasResidencias(territorioId, qtdInicial, qtdFinal)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.add_many_houses_success_message"),
            ToastAndroid.LONG
          );
          // Navega até a página abaixo
          navigation.replace("TerritorioResidencias", dados);
          // Apos salvar a pessoa, fecha o modal
          // setDialogNewPersonVisible(false);
        } else {
          ToastAndroid.show(
            t("components.header.add_many_houses_error_message"),
            ToastAndroid.LONG
          );
        }
      })
      .catch((e) => {
        ToastAndroid.show(
          t("components.header.add_many_houses_error_message"),
          ToastAndroid.LONG
        );
      });
  }

  return (
    <Container>
      <DialogModal
        dialogVisibleProp={dialogNewPersonVisible}
        dialogTitle={t("components.header.dialogmodal_add_person_title")}
        dialogMessage={t(
          "components.header.dialogmodal_add_person_description"
        )}
        dialogFunction={(personName) => handleAdicionarPessoa(personName)}
        dialogCloseFunction={() => handleCancelDialogNewPerson()}
      />

      <DialogModal
        dialogVisibleProp={dialogNewTerritoryVisible}
        dialogTitle={t("components.header.dialogmodal_add_territory_title")}
        dialogMessage={t(
          "components.header.dialogmodal_add_territory_description"
        )}
        dialogFunction={(territorioNome) =>
          handleAdicionarTerritorio(territorioNome)
        }
        dialogCloseFunction={() => handleCancelDialogNewTerritory()}
      />

      <DialogModal
        dialogVisibleProp={dialogChangeNameTerritoryVisible}
        dialogValue={territoryData.nome}
        dialogTitle={t(
          "components.header.dialogmodal_edit_territory_name_title"
        )}
        dialogMessage={t(
          "components.header.dialogmodal_edit_territory_name_description"
        )}
        dialogFunction={(newName) =>
          handleEditarNomeTerritorio(newName, territoryData.territoryId)
        }
        dialogCloseFunction={() => handleCancelDialogChangeNameTerritory()}
      />

      <DialogModal
        dialogVisibleProp={dialogAddTerritoryHomeVisible}
        keyboardTypeNumberAddManyHouses
        dialogTitle={t("components.header.dialogmodal_add_many_houses_title")}
        dialogMessage={t(
          "components.header.dialogmodal_add_many_houses_description"
        )}
        dialogFunction={(qttInicial, qttFinal) =>
          handleAdicionarVariasResidencias(
            territoryData.territoryId,
            parseInt(qttInicial.replace(/[^0-9]/g, "")),
            parseInt((qttFinal ?? "0").replace(/[^0-9]/g, ""))
          )
        }
        dialogCloseFunction={() => handleCancelDialogTerritoryHome()}
      />

      <DialogModal
        dialogVisibleProp={dialogChangeHomeIdentifierVisible}
        dialogValue={territoryData.nome}
        dialogTitle={t(
          "components.header.dialogmodal_edit_territory_identificador_title"
        )}
        dialogMessage={t(
          "components.header.dialogmodal_edit_territory_identificador_description"
        )}
        dialogFunction={(newName) =>
          handleEditarIdentificadorResidencia(
            newName,
            territoryData.residenciaId,
            territoryData.territoryId
          )
        }
        dialogCloseFunction={() => handleCancelDialogChangeHomeIdentifier()}
      />

      <StyledStatusBar />

      {showGoBack && (
        <StyledButtonGoBack onPress={voltarAtras}>
          <StyledFeatherHeaderButtons name="arrow-left" size={30} />
        </StyledButtonGoBack>
      )}

      {showGoBackHome && (
        <StyledButtonGoBack onPress={voltarHome}>
          <StyledFeatherHeaderButtons name="arrow-left" size={30} />
        </StyledButtonGoBack>
      )}

      {showGoBackPersons && (
        <StyledButtonGoBack onPress={voltarPessoas}>
          <StyledFeatherHeaderButtons name="arrow-left" size={30} />
        </StyledButtonGoBack>
      )}

      {showGoBackReportDetails && (
        <StyledButtonGoBack onPress={navigateToRelatorios}>
          <StyledFeatherHeaderButtons name="arrow-left" size={30} />
        </StyledButtonGoBack>
      )}

      <ContainerTitleButtons>
        <Title
          ellipsizeMode="tail"
          numberOfLines={2}
          style={capitalize ? styles.titleCapitalize : styles.titleNone}
        >
          {title}
        </Title>

        <ContainerButtons>
          {isHomePage ? (
            <View style={styles.row}>
              <WrapperButton>
                <TouchableOpacity onPress={navigateToBackup}>
                  <StyledFeatherHeaderButtons
                    name="arrow-down-circle"
                    size={29}
                  />
                </TouchableOpacity>
              </WrapperButton>
              <WrapperButton>
                <TouchableOpacity onPress={navigateToAjuda}>
                  <StyledFeatherHeaderButtons name="help-circle" size={29} />
                </TouchableOpacity>
              </WrapperButton>
              <WrapperButton>
                <TouchableOpacity onPress={navigateToConfiguracoes}>
                  <StyledFeatherHeaderButtons name="settings" size={29} />
                </TouchableOpacity>
              </WrapperButton>
            </View>
          ) : null}

          {showContadorSave ? (
            <>
              <WrapperButton>
                <StyledButtonSave
                  onPress={() =>
                    /* Vai levar para o relatório do mês informado na hora de salvar */
                    handleSalvarNovoRelatorio(showContadorSave, "contador")
                  }
                >
                  <ButtonText>{t("words.save")}</ButtonText>
                  <StyledFeatherHeaderButtonsIcon
                    name="check-circle"
                    size={24}
                  />
                </StyledButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledButton
                  onPress={() => alertaCancelarNovoRelatorio("Home")}
                >
                  <StyledFeatherHeaderButtonsIconRed
                    name="x-square"
                    size={29}
                  />
                </StyledButton>
              </WrapperButton>
            </>
          ) : null}

          {showReportSave ? (
            <>
              <WrapperButton>
                <StyledButtonSave
                  onPress={() =>
                    /* Vai levar para o relatório do mês informado na hora de salvar */
                    handleEditarRelatorio(showReportSave)
                  }
                >
                  <ButtonText>{t("words.save")}</ButtonText>
                  <StyledFeatherHeaderButtonsIcon
                    name="check-circle"
                    size={24}
                  />
                </StyledButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledButtonDelete
                  onPress={() =>
                    alertaExclusaoRelatorioAtual(
                      showReportSave.id,
                      showReportSave.dia
                    )
                  }
                >
                  <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
                </StyledButtonDelete>
              </WrapperButton>
            </>
          ) : null}

          {showNewReportSave ? (
            <>
              <WrapperButton>
                <StyledButtonSave
                  onPress={() =>
                    /* Vai levar para o relatório do mês informado na hora de salvar */
                    handleSalvarNovoRelatorio(showNewReportSave, "relatorio")
                  }
                >
                  <ButtonText>{t("words.save")}</ButtonText>
                  <StyledFeatherHeaderButtonsIcon
                    name="check-circle"
                    size={24}
                  />
                </StyledButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledButton
                  onPress={() => alertaCancelarNovoRelatorio("voltar")}
                >
                  <StyledFeatherHeaderButtonsIconRed
                    name="x-square"
                    size={29}
                  />
                </StyledButton>
              </WrapperButton>
            </>
          ) : null}

          {showCancel ? (
            <WrapperButton>
              <StyledButton onPress={voltarAtras}>
                <StyledFeatherHeaderButtons name="x-square" size={29} />
              </StyledButton>
            </WrapperButton>
          ) : null}

          {showReportAdd ? (
            <WrapperButton>
              <TouchableOpacity
                onPress={() =>
                  navigation.push("RelatorioAdicionar", showReportAdd)
                }
              >
                <StyledFeatherHeaderButtons name="file-plus" size={29} />
              </TouchableOpacity>
            </WrapperButton>
          ) : null}

          {showReportSend ? (
            <WrapperButton>
              <View style={styles.menuWrapper}>
                <Menu
                  visible={addMenu}
                  onDismiss={closeAddMenu}
                  anchor={
                    <TouchableOpacity onPress={openAddMenu}>
                      <StyledIoniconsHeaderButtons
                        name="share-social"
                        size={29}
                      />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item
                    onPress={() => compartilharRelatorio(showReportSend)}
                    title={t("screens.relatorios.menu_month_report")}
                    leadingIcon="file-outline"
                  />
                  <Menu.Item
                    onPress={() => compartilharRelatorio(showReportSend, true)}
                    title={t("screens.relatorios.menu_month_report_with_hours")}
                    leadingIcon="file-clock"
                  />
                </Menu>
              </View>
            </WrapperButton>
          ) : null}

          {showAddNewPerson ? (
            <WrapperButton>
              <TouchableOpacity onPress={() => handleOpenDialogNewPerson(true)}>
                <StyledFeatherHeaderButtons name="user-plus" size={29} />
              </TouchableOpacity>
            </WrapperButton>
          ) : null}

          {showAddPersonVisit ? (
            <WrapperButton>
              <StyledButton
                onPress={() =>
                  navigation.navigate("PessoaNovaVisita", {
                    personId: showAddPersonVisit.personId,
                  })
                }
              >
                <StyledFeatherHeaderButtons name="plus-square" size={29} />
              </StyledButton>
            </WrapperButton>
          ) : null}

          {showAddHomeVisit ? (
            <WrapperButton>
              <StyledButton
                onPress={() =>
                  navigation.navigate("TerritorioResidenciaNovaVisita", {
                    residenciaId: showAddHomeVisit.residenciaId,
                    territoryId: showAddHomeVisit.territoryId,
                  })
                }
              >
                <StyledFeatherHeaderButtons name="plus-square" size={29} />
              </StyledButton>
            </WrapperButton>
          ) : null}

          {showEditHomeIdentifier ? (
            <WrapperButton>
              <StyledButton
                onPress={() => handleOpenDialogChangeHomeIdentifier(true)}
              >
                <StyledFeatherHeaderButtons name="edit-2" size={24} />
              </StyledButton>
            </WrapperButton>
          ) : null}

          {showDeletePerson ? (
            <WrapperButton>
              <StyledButtonDelete
                onPress={() => alertaExclusaoPessoa(showDeletePerson.personId)}
              >
                <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
              </StyledButtonDelete>
            </WrapperButton>
          ) : null}

          {showDeleteTerritoryHome ? (
            <WrapperButton>
              <StyledButtonDelete
                onPress={() =>
                  alertaExclusaoCasa(
                    showDeleteTerritoryHome.residenciaId,
                    showDeleteTerritoryHome.territoryId
                  )
                }
              >
                <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
              </StyledButtonDelete>
            </WrapperButton>
          ) : null}

          {showEditPersonVisit &&
          Object.keys(showEditPersonVisit).length !== 0 ? (
            <>
              <WrapperButton>
                <StyledButtonSave
                  onPress={() =>
                    /* Vai voltar para a página da pessoa na hora de salvar */
                    handleEditarVisitaFeita(showEditPersonVisit)
                  }
                >
                  <ButtonText>{t("words.save")}</ButtonText>
                  <StyledFeatherHeaderButtonsIcon
                    name="check-circle"
                    size={24}
                  />
                </StyledButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledButtonDelete
                  onPress={() =>
                    alertaDeletarVisitaPessoa(
                      showEditPersonVisit.idPessoa,
                      showEditPersonVisit.idVisita
                    )
                  }
                >
                  <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
                </StyledButtonDelete>
              </WrapperButton>
            </>
          ) : null}

          {showEditHomeVisit ? (
            <>
              <WrapperButton>
                <StyledButtonSave
                  onPress={() =>
                    /* Vai voltar para a página da pessoa na hora de salvar */
                    handleEditarVisitaCasa(showEditHomeVisit)
                  }
                >
                  <ButtonText>{t("words.save")}</ButtonText>
                  <StyledFeatherHeaderButtonsIcon
                    name="check-circle"
                    size={24}
                  />
                </StyledButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledButtonDelete
                  onPress={() =>
                    alertaDeletarVisitaCasa(
                      showEditHomeVisit.idVisita,
                      showEditHomeVisit.residenciaId,
                      showEditHomeVisit.territorioId
                    )
                  }
                >
                  <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
                </StyledButtonDelete>
              </WrapperButton>
            </>
          ) : null}

          {showEditTerritoryInfo ? (
            <>
              <WrapperButton>
                <StyledButtonSave
                  onPress={() =>
                    /* Vai voltar para a página da pessoa na hora de salvar */
                    handleEditarInformacoesTerritorio(showEditTerritoryInfo)
                  }
                >
                  <ButtonText>{t("words.save")}</ButtonText>
                  <StyledFeatherHeaderButtonsIcon
                    name="check-circle"
                    size={24}
                  />
                </StyledButtonSave>
              </WrapperButton>
            </>
          ) : null}

          {showNewPersonVisit ? (
            <>
              <WrapperButton>
                <StyledButtonSave
                  onPress={() =>
                    /* Vai voltar para a página da pessoa na hora de salvar */
                    handleAdicionarVisitaFeita(showNewPersonVisit)
                  }
                >
                  <ButtonText>{t("words.save")}</ButtonText>
                  <StyledFeatherHeaderButtonsIcon
                    name="check-circle"
                    size={24}
                  />
                </StyledButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledButton
                  onPress={() => alertaCancelarAdicaoVisitaPessoa("voltar")}
                >
                  <StyledFeatherHeaderButtonsIconRed
                    name="x-square"
                    size={29}
                  />
                </StyledButton>
              </WrapperButton>
            </>
          ) : null}

          {showNewHomeVisit ? (
            <>
              <WrapperButton>
                <StyledButtonSave
                  onPress={() =>
                    /* Vai voltar para a página da pessoa na hora de salvar */
                    handleAdicionarVisitaFeitaCasa(showNewHomeVisit)
                  }
                >
                  <ButtonText>{t("words.save")}</ButtonText>
                  <StyledFeatherHeaderButtonsIcon
                    name="check-circle"
                    size={24}
                  />
                </StyledButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledButton
                  onPress={() => alertaCancelarAdicaoVisitaCasa("voltar")}
                >
                  <StyledFeatherHeaderButtonsIconRed
                    name="x-square"
                    size={29}
                  />
                </StyledButton>
              </WrapperButton>
            </>
          ) : null}

          {showAddNewTerritory ? (
            <WrapperButton>
              <StyledButton onPress={() => handleOpenDialogNewTerritory(true)}>
                <StyledFeatherHeaderButtons name="plus-square" size={29} />
              </StyledButton>
            </WrapperButton>
          ) : null}

          {showOptionAddNewResidences ? (
            <WrapperButton>
              <View style={styles.menuWrapper}>
                <Menu
                  visible={addMenu}
                  onDismiss={closeAddMenu}
                  anchor={
                    <StyledButton onPress={openAddMenu}>
                      <StyledFeatherHeaderButtons
                        name="plus-square"
                        size={29}
                      />
                    </StyledButton>
                  }
                >
                  <Menu.Item
                    onPress={() =>
                      handleAdicionarUmaResidencia(territoryData.territoryId)
                    }
                    title={t("components.header.menu_item_add_one_house")}
                    leadingIcon="home"
                  />
                  <Menu.Item
                    onPress={() => handleOpenDialogTerritoryHome(true)}
                    title={t("components.header.menu_item_add_one_many_houses")}
                    leadingIcon="home-group"
                  />
                </Menu>
              </View>
            </WrapperButton>
          ) : null}

          {showChangeDisposition ? (
            <WrapperButton>
              <StyledButton
                onPress={() => handleChangeDisposition(showChangeDisposition)}
              >
                {showChangeDisposition.visualDisposition === "linhas" ? (
                  <StyledFeatherHeaderButtons name="grid" size={29} />
                ) : (
                  <StyledFeatherHeaderButtons name="list" size={29} />
                )}
              </StyledButton>
            </WrapperButton>
          ) : null}

          {showTerritoryMenu ? (
            <WrapperButton>
              <View style={styles.menuWrapper}>
                <Menu
                  visible={dotsMenu}
                  onDismiss={closeDotsMenu}
                  anchor={
                    <StyledButton onPress={openDotsMenu}>
                      <StyledFeatherHeaderButtons
                        name="more-vertical"
                        size={29}
                      />
                    </StyledButton>
                  }
                >
                  <Menu.Item
                    onPress={() =>
                      navigation.navigate("TerritorioInformacao", {
                        territorioId: territoryData.territoryId,
                      })
                    }
                    title={t("components.header.menu_item_infos")}
                    leadingIcon="information-outline"
                  />
                  <Menu.Item
                    onPress={() => handleOpenDialogChangeNameTerritory(true)}
                    title={t("components.header.menu_item_rename")}
                    leadingIcon="pencil-outline"
                  />
                  {/* <Menu.Item onPress={() => {}} title="Ordenar" icon="sort" /> */}
                  <Divider />
                  <Menu.Item
                    onPress={() =>
                      alertaExclusaoTerritorio(
                        territoryData.territoryId,
                        territoryData.nome
                      )
                    }
                    title={t("components.header.menu_item_remove")}
                    leadingIcon="trash-can-outline"
                    style={styles.menuDeleteItem}
                  />
                </Menu>
              </View>
            </WrapperButton>
          ) : null}
        </ContainerButtons>
      </ContainerTitleButtons>
    </Container>
  );
}
