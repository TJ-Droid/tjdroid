import React, { useState } from "react";
import { Alert, View, Share, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BorderlessButton } from "react-native-gesture-handler";
import { Menu, Divider } from "react-native-paper";
import { useTranslation } from 'react-i18next';

import "react-native-get-random-values";
// import "moment/locale/pt-br";
import minutes_to_hhmm from "../../utils/minutes_to_hhmm";
import DialogModal from "../DialogModal";

import {
  editarRelatorio,
  salvarNovoRelatorio,
  deletarRelatorio,
} from "../../controllers/relatoriosController";
import {
  excluirVisita,
  salvarPessoa,
  editarVisita,
  salvarVisita,
  deletarPessoa,
} from "../../controllers/pessoasController";
import {
  salvarNovoTerritorio,
  alterarDisposicaoVisualTerritorio,
  editarNomeTerritorio,
  deletarTerritorio,
  adicionarUmaResidencia,
  adicionarVariasResidencias,
  deletarResidenciaTerritorio,
  salvarVisitaCasa,
  editarNomeIdentificadorResidencia,
  excluirVisitaCasa,
  editarVisitaCasa,
  salvarInformacoesTerritorio,
} from "../../controllers/territoriosController";

import {
  Container,
  ContainerTitleButtons,
  Title,
  ContainerButtons,
  WrapperButton,
  StyledFeatherHeaderButtons,
  ButtonText,
  StyledStatusBar,
  StyledBorderlessButton,
  StyledBorderlessButtonDelete,
  StyledBorderlessButtonSave,
  StyledFeatherHeaderButtonsIcon,
  StyledFeatherHeaderButtonsIconRed,
  StyledBorderlessButtonGoBack,
  StyledIoniconsHeaderButtons,
} from "./styles";

export default function Header({
  title,
  capitalize = true,
  showGoBack = false,
  showGoBackHome = false,
  showGoBackPersons = false,
  showGoBackReportDetails = false,
  isHomePage = false,
  showCancel = false,
  showContadorSave = false,
  showReportSave = false,
  showNewReportSave = false,
  showReportAdd = false,
  showReportSend = false,
  showAddNewPerson = false,
  showDeletePerson = false,
  showAddPersonVisit = false,
  showEditPersonVisit = false,
  showNewPersonVisit = false,
  showAddNewTerritory = false,
  showOptionAddNewResidences = false,
  showChangeDisposition = false,
  showChangeDispositionFunc = false,
  showTerritoryMenu = false,
  handleChangeTerritoryNameFunc = false,
  territoryData = {},
  showDeleteTerritoryHome = false,
  showAddHomeVisit = false,
  showEditHomeIdentifier = false,
  showNewHomeVisit = false,
  handleChangeHomeIdentifierFunc = false,
  showEditHomeVisit = false,
  showEditTerritoryInfo = false,
}) {

  const {t} = useTranslation();

  const navigation = useNavigation();

  const [addMenu, setAddMenu] = useState(false);
  const openAddMenu = () => setAddMenu(true);
  const closeAddMenu = () => setAddMenu(false);

  const [dotsMenu, setDotsMenu] = useState(false);
  const openDotsMenu = () => setDotsMenu(true);
  const closeDotsMenu = () => setDotsMenu(false);

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

  // Change disposition state
  const [visualDisposition, setVisualDisposition] = useState("");

  function voltarHome() {
    navigation.navigate("Home");
  }
  function voltarPessoas() {
    navigation.navigate("Pessoas");
  }
  function voltarAtras() {
    navigation.goBack();
  }

  // Dialog Open Function
  function handleOpenDialogNewPerson(boolVal) {
    setDialogNewPersonVisible(boolVal);
  }
  function handleOpenDialogNewTerritory(boolVal) {
    setDialogNewTerritoryVisible(boolVal);
  }
  function handleOpenDialogChangeNameTerritory(boolVal) {
    setDialogChangeNameTerritoryVisible(boolVal);
  }
  function handleOpenDialogChangeHomeIdentifier(boolVal) {
    setDialogChangeHomeIdentifierVisible(boolVal);
  }
  function handleOpenDialogTerritoryHome(boolVal) {
    setDialogAddTerritoryHomeVisible(boolVal);
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
  function compartilharRelatorio(relatorio) {
    const compartilhar = async () => {
      const {
        totalColocacoes,
        totalMinutos,
        totalRevisitas,
        totalVideosMostrados,
        totalEstudosBiblicos,
      } = relatorio.totaisDoMes;

      try {
        // Monta o texto para o compartilhamento
        // Capitaliza o mês do ano
        await Share.share({
          message: `${t("components.header.share_report_title")} ${relatorio.mesAnoFormatado.replace(/^\w/, (c) =>c.toUpperCase())}\n\n${t("components.header.share_report_hours")}: ${minutes_to_hhmm(totalMinutos)}\n${t("components.header.share_report_bible_studies")}: ${totalEstudosBiblicos} \n${t("components.header.share_report_revisits")}: ${totalRevisitas}\n${t("components.header.share_report_placements")}: ${totalColocacoes}\n${t("components.header.share_report_videos_showed")}: ${totalVideosMostrados}`,
        });
      } catch (e) {
        ToastAndroid.show(t("components.header.share_report_error_message"), ToastAndroid.LONG);
      }
    };
    compartilhar();
  }

  const alertaExclusaoPessoa = (pessoaId) =>
    Alert.alert(
      t("components.header.alert_delete_person_title"),
      t("components.header.alert_delete_person_description"),
      [
        {
          text: t("words.no"),
          onPress: () => {},
          style: "cancel",
        },
        { text: t("words.yes"), onPress: () => handleDeletarPessoa(pessoaId) },
      ],
      { cancelable: true }
    );

  const alertaExclusaoCasa = (residenciaId, territoryId) =>
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

  const alertaExclusaoRelatorioAtual = (idRelatorio, dataRelatorio) =>
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

  const alertaCancelarNovoRelatorio = (caminhoParaVoltar) =>
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

  const alertaDeletarVisitaPessoa = (idPessoa, idVisita) =>
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

  const alertaDeletarVisitaCasa = (idVisita, residenciaId, territorioId) =>
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

  const alertaCancelarAdicaoVisitaPessoa = (caminhoParaVoltar) =>
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

  const alertaCancelarAdicaoVisitaCasa = (caminhoParaVoltar) =>
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

  const alertaExclusaoTerritorio = (idTerritorio, nomeTerritorio) =>
    Alert.alert(
      t("components.header.alert_delete_territory_title"),
      t("components.header.alert_delete_territory_description", {nomeTerritorio}),
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
  function handleEditarRelatorio({ relatorio, minutos }) {
    editarRelatorio({ relatorio, minutos })
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          navigation.navigate("RelatorioMes", dados.mesAno);
        } else {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.report_edit_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(t("components.header.report_edit_error_message"), ToastAndroid.LONG);
      });
  }

  // Salvar Relatorio
  function handleSalvarNovoRelatorio({ relatorio, minutos }, origem) {
    salvarNovoRelatorio(relatorio, minutos)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.new_report_add_success_message"), ToastAndroid.SHORT);

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
        ToastAndroid.show(t("components.header.new_report_add_error_message"), ToastAndroid.LONG);
      });
  }

  // DELETAR RELATÓRIO
  function handleDeletarRelatorio(idRelatorio, dataRelatorio) {
    deletarRelatorio(idRelatorio, dataRelatorio)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(
            t("components.header.report_delete_success_message"),
            ToastAndroid.LONG
          );

          // Navega até a página abaixo
          navigation.navigate("RelatorioMes", dados);
        } else {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.report_delete_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        // Mensagem Toast
        ToastAndroid.show(t("components.header.report_delete_error_message"), ToastAndroid.LONG);
      });
  }

  // ADICIONAR NOVA PESSOA
  function handleAdicionarPessoa(personName) {
    salvarPessoa(personName)
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
  function handleDeletarPessoa(personId) {
    deletarPessoa(personId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.person_delete_success_message"), ToastAndroid.LONG);
          // Navega até a página abaixo
          navigation.replace("Pessoas");
        } else {
          ToastAndroid.show(t("components.header.person_delete_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        ToastAndroid.show(t("components.header.person_delete_error_message"), ToastAndroid.LONG);
      });
  }

  // DELETAR CASA
  function handleDeletarCasa(residenciaId, territoryId) {
    deletarResidenciaTerritorio(residenciaId, territoryId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.house_delete_success_message"), ToastAndroid.LONG);
          // Navega até a página abaixo
          navigation.goBack("TerritorioResidencias", dados);
        } else {
          ToastAndroid.show(t("components.header.house_delete_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        ToastAndroid.show(t("components.header.house_delete_error_message"), ToastAndroid.LONG);
      });
  }

  // DELETAR VISITA CASA
  function handleDeletarVisitaCasa(idVisita, residenciaId, territorioId) {
    excluirVisitaCasa(idVisita, residenciaId, territorioId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.house_visit_delete_success_message"), ToastAndroid.SHORT);
          // Navega até a página abaixo
          navigation.goBack();
        } else {
          ToastAndroid.show(t("components.header.house_visit_delete_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        ToastAndroid.show(t("components.header.house_visit_delete_error_message"), ToastAndroid.LONG);
      });
  }

  // DELETAR VISITA PESSOA
  function handleDeletarVisitaPessoa(idPessoa, idVisita) {
    excluirVisita(idPessoa, idVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.person_visit_success_message"), ToastAndroid.SHORT);
          // Navega até a página abaixo
          navigation.navigate("PessoaVisitas", dados);
        } else {
          ToastAndroid.show(t("components.header.person_visit_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        ToastAndroid.show(t("components.header.person_visit_error_message"), ToastAndroid.LONG);
      });
  }

  // EDITAR UMA VISITA FEITA
  function handleEditarVisitaFeita(dadosVisita) {
    editarVisita(dadosVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          navigation.navigate("PessoaVisitas", dados);
        } else {
          ToastAndroid.show(t("components.header.person_edit_visit_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        ToastAndroid.show(t("components.header.person_edit_visit_error_message"), ToastAndroid.LONG);
      });
  }

  // EDITAR UMA VISITA FEITA CASA
  function handleEditarVisitaCasa(dadosVisita) {
    editarVisitaCasa(dadosVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          navigation.goBack();
        } else {
          ToastAndroid.show(t("components.header.house_edit_visit_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        ToastAndroid.show(t("components.header.house_edit_visit_error_message"), ToastAndroid.LONG);
      });
  }

  // EDITAR INFORMAÇÕES DO TERRITORIO
  function handleEditarInformacoesTerritorio(dadosTerritorio) {
    salvarInformacoesTerritorio(dadosTerritorio)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          navigation.goBack();
        } else {
          ToastAndroid.show(t("components.header.territory_edit_infos_error_message"), ToastAndroid.LONG);
        }
      })
      .catch((e) => {
        ToastAndroid.show(t("components.header.territory_edit_infos_error_message"), ToastAndroid.LONG);
      });
  }

  // ADICIONAR VISITA DA PESSOA
  function handleAdicionarVisitaFeita(dadosNovaVisita) {
    salvarVisita(dadosNovaVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.person_add_visit_success_message"), ToastAndroid.SHORT);
          // Navega até a página abaixo
          navigation.navigate("PessoaVisitas", dados);
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
  function handleAdicionarVisitaFeitaCasa(dadosNovaVisita) {
    salvarVisitaCasa(dadosNovaVisita)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.house_add_visit_success_message"), ToastAndroid.SHORT);
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
  function handleAdicionarTerritorio(territorioNome) {
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
  function handleChangeDisposition(novosDados) {
    // Trata os dados alterando entre caixas e linhas
    novosDados.visualDisposition =
      novosDados.visualDisposition === "linhas" ? "caixas" : "linhas";

    // Seta o estado para mudar o icone na barra
    setVisualDisposition(novosDados.visualDisposition);

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
          ToastAndroid.show(t("components.header.change_territories_disposition_error_message"), ToastAndroid.SHORT);
        }
      })
      .catch((e) => {
        ToastAndroid.show(t("components.header.change_territories_disposition_error_message"), ToastAndroid.SHORT);
      });
  }

  // ADICIONAR NOVO TERRITÓRIO
  function handleEditarNomeTerritorio(territorioNome, territorioId) {
    editarNomeTerritorio(territorioNome, territorioId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.territory_edit_name_succes_message"), ToastAndroid.LONG);

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
    newIdentifier,
    residenciaId,
    territoryId
  ) {
    editarNomeIdentificadorResidencia(newIdentifier, residenciaId, territoryId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.territory_edit_identificator_succes_message"), ToastAndroid.LONG);

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
        ToastAndroid.show(t("components.header.territory_edit_identificator_error_message"), ToastAndroid.LONG);
      });
  }

  // ADICIONAR NOVA RESIDÊNCIA
  function handleAdicionarUmaResidencia(territorioId) {
    adicionarUmaResidencia(territorioId)
      .then((dados) => {
        // Trata o retorno
        if (dados) {
          // Mensagem Toast
          ToastAndroid.show(t("components.header.add_house_success_message"), ToastAndroid.LONG);
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
  function handleAdicionarVariasResidencias(territorioId, qtd) {
    adicionarVariasResidencias(territorioId, qtd)
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
    <Container elevation={5}>
      <DialogModal
        dialogVisibleProp={dialogNewPersonVisible}
        dialogTitle={t("components.header.dialogmodal_add_person_title")}
        dialogMessage={t("components.header.dialogmodal_add_person_description")}
        dialogFunction={(personName) => handleAdicionarPessoa(personName)}
        dialogCloseFunction={() => handleCancelDialogNewPerson()}
      />

      <DialogModal
        dialogVisibleProp={dialogNewTerritoryVisible}
        dialogTitle={t("components.header.dialogmodal_add_territory_title")}
        dialogMessage={t("components.header.dialogmodal_add_territory_description")}
        dialogFunction={(territorioNome) =>
          handleAdicionarTerritorio(territorioNome)
        }
        dialogCloseFunction={() => handleCancelDialogNewTerritory()}
      />

      <DialogModal
        dialogVisibleProp={dialogChangeNameTerritoryVisible}
        dialogValue={territoryData.nome}
        dialogTitle={t("components.header.dialogmodal_edit_territory_name_title")}
        dialogMessage={t("components.header.dialogmodal_edit_territory_name_description")}
        dialogFunction={(newName) =>
          handleEditarNomeTerritorio(newName, territoryData.id)
        }
        dialogCloseFunction={() => handleCancelDialogChangeNameTerritory()}
      />

      <DialogModal
        dialogVisibleProp={dialogAddTerritoryHomeVisible}
        keyboardTypeNumber
        dialogTitle={t("components.header.dialogmodal_add_many_houses_title")}
        dialogMessage={t("components.header.dialogmodal_add_many_houses_description")}
        dialogFunction={(qttToAdd) =>
          handleAdicionarVariasResidencias(territoryData.id, qttToAdd)
        }
        dialogCloseFunction={() => handleCancelDialogTerritoryHome()}
      />

      <DialogModal
        dialogVisibleProp={dialogChangeHomeIdentifierVisible}
        dialogValue={territoryData.nome}
        dialogTitle={t("components.header.dialogmodal_edit_territory_identificador_title")}
        dialogMessage={t("components.header.dialogmodal_edit_territory_identificador_description")}
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
        <StyledBorderlessButtonGoBack
          onPress={() => {
            voltarAtras();
          }}
        >
          <StyledFeatherHeaderButtons name="arrow-left" size={30} />
        </StyledBorderlessButtonGoBack>
      )}

      {showGoBackHome && (
        <StyledBorderlessButtonGoBack onPress={() => voltarHome()}>
          <StyledFeatherHeaderButtons name="arrow-left" size={30} />
        </StyledBorderlessButtonGoBack>
      )}

      {showGoBackPersons && (
        <StyledBorderlessButtonGoBack onPress={() => voltarPessoas()}>
          <StyledFeatherHeaderButtons name="arrow-left" size={30} />
        </StyledBorderlessButtonGoBack>
      )}

      {showGoBackReportDetails && (
        <StyledBorderlessButtonGoBack
          onPress={() => {
            navigation.navigate("Relatorios");
          }}
        >
          <StyledFeatherHeaderButtons name="arrow-left" size={30} />
        </StyledBorderlessButtonGoBack>
      )}

      <ContainerTitleButtons>
        <Title tail numberOfLines={2} style={capitalize}>
          {title}
        </Title>

        <ContainerButtons>
          {isHomePage ? (
            <View style={{ flexDirection: "row" }}>
              <WrapperButton>
                <BorderlessButton onPress={() => navigation.navigate("Backup")}>
                  <StyledFeatherHeaderButtons name="arrow-down-circle" size={29} />
                </BorderlessButton>
              </WrapperButton>
              <WrapperButton>
                <BorderlessButton onPress={() => navigation.navigate("Ajuda")}>
                  <StyledFeatherHeaderButtons name="help-circle" size={29} />
                </BorderlessButton>
              </WrapperButton>
              <WrapperButton>
                <BorderlessButton
                  onPress={() => navigation.navigate("Configuracoes")}
                >
                  <StyledFeatherHeaderButtons name="settings" size={29} />
                </BorderlessButton>
              </WrapperButton>
            </View>
          ) : (
            <View></View>
          )}

          {showContadorSave ? (
            <>
              <WrapperButton>
                <StyledBorderlessButtonSave
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
                </StyledBorderlessButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledBorderlessButton
                  onPress={() => alertaCancelarNovoRelatorio("Home")}
                >
                  <StyledFeatherHeaderButtonsIconRed
                    name="x-square"
                    size={29}
                  />
                </StyledBorderlessButton>
              </WrapperButton>
            </>
          ) : (
            <View></View>
          )}

          {showReportSave ? (
            <>
              <WrapperButton>
                <StyledBorderlessButtonSave
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
                </StyledBorderlessButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledBorderlessButtonDelete
                  onPress={() =>
                    alertaExclusaoRelatorioAtual(
                      showReportSave.relatorio.id,
                      showReportSave.relatorio.dia
                    )
                  }
                >
                  <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
                </StyledBorderlessButtonDelete>
              </WrapperButton>
            </>
          ) : (
            <View></View>
          )}

          {showNewReportSave ? (
            <>
              <WrapperButton>
                <StyledBorderlessButtonSave
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
                </StyledBorderlessButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledBorderlessButton
                  onPress={() => alertaCancelarNovoRelatorio("voltar")}
                >
                  <StyledFeatherHeaderButtonsIconRed
                    name="x-square"
                    size={29}
                  />
                </StyledBorderlessButton>
              </WrapperButton>
            </>
          ) : (
            <View></View>
          )}

          {showCancel ? (
            <WrapperButton>
              <StyledBorderlessButton onPress={() => voltarAtras()}>
                <StyledFeatherHeaderButtons name="x-square" size={29} />
              </StyledBorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showReportAdd ? (
            <WrapperButton>
              <BorderlessButton
                onPress={() =>
                  navigation.push("RelatorioAdicionar", showReportAdd)
                }
              >
                <StyledFeatherHeaderButtons name="file-plus" size={29} />
              </BorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showReportSend ? (
            <WrapperButton>
              <BorderlessButton
                onPress={() => compartilharRelatorio(showReportSend)}
              >
                <StyledIoniconsHeaderButtons name="share-social" size={29} />
              </BorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showAddNewPerson ? (
            <WrapperButton>
              <BorderlessButton onPress={() => handleOpenDialogNewPerson(true)}>
                <StyledFeatherHeaderButtons name="user-plus" size={29} />
              </BorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showAddPersonVisit ? (
            <WrapperButton>
              <StyledBorderlessButton
                onPress={() =>
                  navigation.navigate("PessoaNovaVisita", {
                    personId: showAddPersonVisit.personId,
                  })
                }
              >
                <StyledFeatherHeaderButtons name="plus-square" size={29} />
              </StyledBorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showAddHomeVisit ? (
            <WrapperButton>
              <StyledBorderlessButton
                onPress={() =>
                  navigation.navigate("TerritorioResidenciaNovaVisita", {
                    residenciaId: showAddHomeVisit.residenciaId,
                    territoryId: showAddHomeVisit.territoryId,
                  })
                }
              >
                <StyledFeatherHeaderButtons name="plus-square" size={29} />
              </StyledBorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showEditHomeIdentifier ? (
            <WrapperButton>
              <StyledBorderlessButton
                onPress={() => handleOpenDialogChangeHomeIdentifier(true)}
              >
                <StyledFeatherHeaderButtons name="edit-2" size={24} />
              </StyledBorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showDeletePerson ? (
            <WrapperButton>
              <StyledBorderlessButtonDelete
                onPress={() => alertaExclusaoPessoa(showDeletePerson.personId)}
              >
                <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
              </StyledBorderlessButtonDelete>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showDeleteTerritoryHome ? (
            <WrapperButton>
              <StyledBorderlessButtonDelete
                onPress={() =>
                  alertaExclusaoCasa(
                    showDeleteTerritoryHome.residenciaId,
                    showDeleteTerritoryHome.territoryId
                  )
                }
              >
                <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
              </StyledBorderlessButtonDelete>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showEditPersonVisit ? (
            <>
              <WrapperButton>
                <StyledBorderlessButtonSave
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
                </StyledBorderlessButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledBorderlessButtonDelete
                  onPress={() =>
                    alertaDeletarVisitaPessoa(
                      showEditPersonVisit.idPessoa,
                      showEditPersonVisit.idVisita
                    )
                  }
                >
                  <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
                </StyledBorderlessButtonDelete>
              </WrapperButton>
            </>
          ) : (
            <View></View>
          )}

          {showEditHomeVisit ? (
            <>
              <WrapperButton>
                <StyledBorderlessButtonSave
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
                </StyledBorderlessButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledBorderlessButtonDelete
                  onPress={() =>
                    alertaDeletarVisitaCasa(
                      showEditHomeVisit.idVisita,
                      showEditHomeVisit.residenciaId,
                      showEditHomeVisit.territorioId
                    )
                  }
                >
                  <StyledFeatherHeaderButtonsIconRed name="trash-2" size={29} />
                </StyledBorderlessButtonDelete>
              </WrapperButton>
            </>
          ) : (
            <View></View>
          )}

          {showEditTerritoryInfo ? (
            <>
              <WrapperButton>
                <StyledBorderlessButtonSave
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
                </StyledBorderlessButtonSave>
              </WrapperButton>
            </>
          ) : (
            <View></View>
          )}

          {showNewPersonVisit ? (
            <>
              <WrapperButton>
                <StyledBorderlessButtonSave
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
                </StyledBorderlessButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledBorderlessButton
                  onPress={() => alertaCancelarAdicaoVisitaPessoa("voltar")}
                >
                  <StyledFeatherHeaderButtonsIconRed
                    name="x-square"
                    size={29}
                  />
                </StyledBorderlessButton>
              </WrapperButton>
            </>
          ) : (
            <View></View>
          )}

          {showNewHomeVisit ? (
            <>
              <WrapperButton>
                <StyledBorderlessButtonSave
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
                </StyledBorderlessButtonSave>
              </WrapperButton>
              <WrapperButton>
                <StyledBorderlessButton
                  onPress={() => alertaCancelarAdicaoVisitaCasa("voltar")}
                >
                  <StyledFeatherHeaderButtonsIconRed
                    name="x-square"
                    size={29}
                  />
                </StyledBorderlessButton>
              </WrapperButton>
            </>
          ) : (
            <View></View>
          )}

          {showAddNewTerritory ? (
            <WrapperButton>
              <StyledBorderlessButton
                onPress={() => handleOpenDialogNewTerritory(true)}
              >
                <StyledFeatherHeaderButtons name="plus-square" size={29} />
              </StyledBorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showOptionAddNewResidences ? (
            <WrapperButton>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Menu
                  visible={addMenu}
                  onDismiss={closeAddMenu}
                  anchor={
                    <StyledBorderlessButton onPress={openAddMenu}>
                      <StyledFeatherHeaderButtons
                        name="plus-square"
                        size={29}
                      />
                    </StyledBorderlessButton>
                  }
                >
                  <Menu.Item
                    onPress={() =>
                      handleAdicionarUmaResidencia(territoryData.id)
                    }
                    title={t("components.header.menu_item_add_one_house")}
                    icon="home"
                  />
                  <Menu.Item
                    onPress={() => handleOpenDialogTerritoryHome(true)}
                    title={t("components.header.menu_item_add_one_many_houses")}
                    icon="home-group"
                  />
                </Menu>
              </View>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showChangeDisposition ? (
            <WrapperButton>
              <StyledBorderlessButton
                onPress={() => handleChangeDisposition(showChangeDisposition)}
              >
                {showChangeDisposition.visualDisposition === "linhas" ? (
                  <StyledFeatherHeaderButtons name="grid" size={29} />
                ) : (
                  <StyledFeatherHeaderButtons name="list" size={29} />
                )}
              </StyledBorderlessButton>
            </WrapperButton>
          ) : (
            <View></View>
          )}

          {showTerritoryMenu ? (
            <WrapperButton>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Menu
                  visible={dotsMenu}
                  onDismiss={closeDotsMenu}
                  anchor={
                    <StyledBorderlessButton onPress={openDotsMenu}>
                      <StyledFeatherHeaderButtons
                        name="more-vertical"
                        size={29}
                      />
                    </StyledBorderlessButton>
                  }
                >
                  <Menu.Item
                    onPress={() =>
                      navigation.navigate(
                        "TerritorioInformacao",
                        territoryData.id
                      )
                    }
                    title={t("components.header.menu_item_infos")}
                    icon="information-outline"
                  />
                  <Menu.Item
                    onPress={() => handleOpenDialogChangeNameTerritory(true)}
                    title={t("components.header.menu_item_rename")}
                    icon="pencil-outline"
                  />
                  {/* <Menu.Item onPress={() => {}} title="Ordenar" icon="sort" /> */}
                  <Divider />
                  <Menu.Item
                    onPress={() =>
                      alertaExclusaoTerritorio(
                        territoryData.id,
                        territoryData.nome
                      )
                    }
                    title={t("components.header.menu_item_remove")}
                    icon="trash-can-outline"
                    style={{ backgroundColor: "#F8D8D8" }}
                  />
                </Menu>
              </View>
            </WrapperButton>
          ) : (
            <View></View>
          )}
        </ContainerButtons>
      </ContainerTitleButtons>
    </Container>
  );
}
