import { v4 as uuidv4 } from "uuid";
import i18next from "i18next";
import moment from "moment";
import "moment/locale/pt-br";

// importa as opcoes para o SelectPicker para as opções de de tipos visitas
import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../services/AsyncStorageMethods";

import { PeopleType } from "../types/People";
import { VisitDataType } from "../types/Visits";

export type BuscarPessoasType = {
  id: string;
  nome: string;
  qtdVisitas: number;
  ultimaVisita: string;
  ultimaVisitaData: string;
  visitaBgColor: string;
  visitaFontColor: string;
};

export type BuscarVisitasPessoaType = {
  id: string;
  nome: string;
  visitas: CustomVisitsType[];
};

export type CustomVisitsType = {
  id: string;
  data: string;
  colocacoes: number;
  visita: number;
  anotacoes: string;
  videosMostrados: number;
  visitaBgColor: string;
  visitaFontColor: string;
  visitaLabel: string;
};

export type SalvarVisitaType = {
  anotacoes: string;
  colocacoes: number;
  data: string;
  dia: string;
  hora: string;
  idPessoa: string;
  videosMostrados: number;
  visita: number;
  idVisita?: string;
};

// Busca pessoas para a pagina PESSOAS
export default async function buscarPessoas() {
  const SELECT_PICKER_OPTIONS = [
    {
      value: 0,
      bgColor: "#5e913430",
      fontColor: "#5e9134",
      label: i18next.t("selectpickeroptions.bible_studies"),
    },
    {
      value: 1,
      bgColor: "#7346ad30",
      fontColor: "#7346ad",
      label: i18next.t("selectpickeroptions.revisit"),
    },
    {
      value: 2,
      bgColor: "#25467c30",
      fontColor: "#25467c",
      label: i18next.t("selectpickeroptions.second_visit"),
    },
    {
      value: 3,
      bgColor: "#4a6da730",
      fontColor: "#4a6da7",
      label: i18next.t("selectpickeroptions.first_visit"),
    },
    {
      value: 4,
      bgColor: "#d7754930",
      fontColor: "#d77549",
      label: i18next.t("selectpickeroptions.absentee"),
    },
    {
      value: 5,
      bgColor: "#c33f5530",
      fontColor: "#c33f55",
      label: i18next.t("selectpickeroptions.refused"),
    },
  ];

  return await buscarAsyncStorage("@tjdroid:pessoas")
    .then((dados: PeopleType[]) => {
      // Faz a verificação para remover a mensagem de erro ao acessar a primeira vez
      if (dados === undefined) {
        return [];
      }

      const listaPessoas: BuscarPessoasType[] = [];

      dados.map((pessoa) => {
        let ultimaVisitaFeitaDescricao = "";
        let visitaBgColor = "";
        let visitaFontColor = "";
        let ultimaVisitaFeitaData = "";

        // Verifica se existe visitas para obter a data da visita mais recente
        if (pessoa.visitas.length !== 0) {
          let datasOrdenadas = pessoa.visitas.sort((a, b) => {
            return (
              parseInt(moment(b.data).format("YYYYMMDDHHmm")) -
              parseInt(moment(a.data).format("YYYYMMDDHHmm"))
            );
          });

          // Substitui o valor da visita pelo label
          ultimaVisitaFeitaDescricao =
            SELECT_PICKER_OPTIONS[datasOrdenadas[0].visita].label;
          visitaBgColor =
            SELECT_PICKER_OPTIONS[datasOrdenadas[0].visita].bgColor;
          visitaFontColor =
            SELECT_PICKER_OPTIONS[datasOrdenadas[0].visita].fontColor;

          ultimaVisitaFeitaData = moment(datasOrdenadas[0].data).format(
            "DD/MM/YYYY"
          );
        } else {
          ultimaVisitaFeitaDescricao = "";
          ultimaVisitaFeitaData = "01/01/0001";
        }

        listaPessoas.push({
          id: pessoa.id,
          nome: pessoa.nome,
          qtdVisitas: pessoa.visitas.length,
          ultimaVisitaData: ultimaVisitaFeitaData,
          ultimaVisita: ultimaVisitaFeitaDescricao,
          visitaBgColor,
          visitaFontColor,
        });
      });

      // Retorna a lista de pessoas ordenadas pela data
      // As datas mais recentes aparecem em primeiro
      return listaPessoas.sort((a, b) => {
        return moment(b.ultimaVisitaData, "DD/MM/YYYY")
          .format("YYYYMMDD")
          .localeCompare(
            moment(a.ultimaVisitaData, "DD/MM/YYYY").format("YYYYMMDD")
          );
      });
    })
    .catch((error) => {
      return undefined;
    });
}

// Busca pessoas para a pagina VISITAS PESSOAS
export async function buscarVisitasPessoa(idPessoa: string) {
  const SELECT_PICKER_OPTIONS = [
    {
      value: 0,
      bgColor: "#5e913430",
      fontColor: "#5e9134",
      label: i18next.t("selectpickeroptions.bible_studies"),
    },
    {
      value: 1,
      bgColor: "#7346ad30",
      fontColor: "#7346ad",
      label: i18next.t("selectpickeroptions.revisit"),
    },
    {
      value: 2,
      bgColor: "#25467c30",
      fontColor: "#25467c",
      label: i18next.t("selectpickeroptions.second_visit"),
    },
    {
      value: 3,
      bgColor: "#4a6da730",
      fontColor: "#4a6da7",
      label: i18next.t("selectpickeroptions.first_visit"),
    },
    {
      value: 4,
      bgColor: "#d7754930",
      fontColor: "#d77549",
      label: i18next.t("selectpickeroptions.absentee"),
    },
    {
      value: 5,
      bgColor: "#c33f5530",
      fontColor: "#c33f55",
      label: i18next.t("selectpickeroptions.refused"),
    },
  ];

  return await buscarAsyncStorage("@tjdroid:pessoas")
    .then((dados: BuscarVisitasPessoaType[]) => {
      const dadosPessoa: BuscarVisitasPessoaType | undefined = dados.find(
        (pessoa) => {
          return pessoa.id === idPessoa;
        }
      );

      // Substitui o valor do select pelo label e adicionar as cores das visitas
      dadosPessoa?.visitas.forEach((visita) => {
        visita.visitaBgColor = SELECT_PICKER_OPTIONS[visita.visita].bgColor;
        visita.visitaFontColor = SELECT_PICKER_OPTIONS[visita.visita].fontColor;
        visita.visitaLabel = SELECT_PICKER_OPTIONS[visita.visita].label;
      });

      // Retorna a lista de visitas da pessoa ordenadas pela data
      // As datas mais recentes aparecem em primeiro
      const visitas = dadosPessoa?.visitas.sort((a, b) => {
        return (
          parseInt(moment(b.data).format("YYYYMMDDHHmm")) -
          parseInt(moment(a.data).format("YYYYMMDDHHmm"))
        );
      });

      return {
        id: dadosPessoa?.id,
        nome: dadosPessoa?.nome,
        visitas,
      } as BuscarVisitasPessoaType;
    })
    .catch((error) => {
      return undefined;
    });
}

// Busca pessoas para a pagina DETALHE VISITA PESSOA
export async function buscarVisitaPessoa(idPessoa: string, visitaId: string) {
  return await buscarAsyncStorage("@tjdroid:pessoas")
    .then((dados: PeopleType[]) => {
      let dadosPessoa = dados.find((pessoa) => {
        return pessoa.id === idPessoa;
      });

      const dadosPessoaFinded = dadosPessoa?.visitas.find((visita) => {
        return visita.id === visitaId;
      });

      // Retorna a lista de visitas da pessoa ordenadas pela data
      // As datas mais recentes aparecem em primeiro
      return {
        // visita: {
        idPessoa: idPessoa,
        idVisita: dadosPessoaFinded?.id,
        data: dadosPessoaFinded?.data,
        dia: moment(dadosPessoaFinded?.data).format("L"),
        hora: moment(dadosPessoaFinded?.data).format("LT"),
        colocacoes: dadosPessoaFinded?.colocacoes,
        videosMostrados: dadosPessoaFinded?.videosMostrados,
        visita: dadosPessoaFinded?.visita,
        anotacoes: dadosPessoaFinded?.anotacoes,
        // },
        // dataDate: new Date(moment(dados.data).add(1, 'days').format('YYYY-MM-DD')),
        // dataTime: new Date(moment(dados.data).format())
      } as VisitDataType;
    })
    .catch((error) => {
      return undefined;
    });
}

// SALVAR NOVA PESSOA
export async function salvarPessoa(personNewName: string) {
  const salvarNovaPessoa = async () => {
    try {
      let todasPessoas: PeopleType[] = await buscarAsyncStorage(
        "@tjdroid:pessoas"
      );

      todasPessoas.push({
        id: uuidv4(),
        nome: personNewName,
        visitas: [],
      });

      return await salvarAsyncStorage(todasPessoas, "@tjdroid:pessoas")
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    } catch (error) {
      return false;
    }
  };
  return salvarNovaPessoa();
}

// Funcao para trocar nome da pessoa
export async function editarNomePessoa(pessoaNome: string, idPessoa: string) {
  const editarNomePessoa = async () => {
    try {
      let todasPessoas: PeopleType[] = await buscarAsyncStorage(
        "@tjdroid:pessoas"
      );

      let indexEncontrado = todasPessoas.findIndex(
        (item) => item.id == idPessoa
      );
      todasPessoas[indexEncontrado].nome = pessoaNome;

      return await salvarAsyncStorage(todasPessoas, "@tjdroid:pessoas")
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    } catch (e) {
      return false;
    }
  };

  return editarNomePessoa();
}

// DELETAR PESSOA
export async function deletarPessoa(personId: string) {
  // Se a validacao ocorrer continua o script
  const deletarPessoa = async () => {
    try {
      let todasPessoas: PeopleType[] = await buscarAsyncStorage(
        "@tjdroid:pessoas"
      );

      let indexPessoa = todasPessoas.findIndex((item) => item.id === personId);
      todasPessoas.splice(indexPessoa, 1);

      return await salvarAsyncStorage(todasPessoas, "@tjdroid:pessoas")
        .then(() => {
          return true;
        })
        .catch((error) => {
          return false;
        });
    } catch (error) {
      return false;
    }
  };
  return deletarPessoa();
}

// EDITAR VISITA FEITA
export async function editarVisita(dadosVisita: VisitDataType) {
  const salvarEdicaoVisita = async () => {
    try {
      let todasPessoas: PeopleType[] = await buscarAsyncStorage(
        "@tjdroid:pessoas"
      );

      let indexPessoa = todasPessoas.findIndex(
        (pessoa) => pessoa.id === dadosVisita.idPessoa
      );
      let indexVisita = todasPessoas[indexPessoa].visitas.findIndex(
        (visita) => visita.id === dadosVisita.idVisita
      );

      todasPessoas[indexPessoa].visitas[indexVisita] = {
        id: dadosVisita.idVisita,
        colocacoes: dadosVisita.colocacoes,
        data: dadosVisita.data,
        visita: dadosVisita.visita,
        videosMostrados: dadosVisita.videosMostrados,
        anotacoes: dadosVisita.anotacoes,
      };

      return await salvarAsyncStorage(todasPessoas, "@tjdroid:pessoas")
        .then(() => {
          return { idPessoa: dadosVisita.idPessoa };
        })
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };
  return salvarEdicaoVisita();
}

// ADICIONAR VISITA
export async function salvarVisita(dadosNovaVisita: SalvarVisitaType) {
  const salvarNovaVisita = async () => {
    try {
      let todasPessoas: PeopleType[] = await buscarAsyncStorage(
        "@tjdroid:pessoas"
      );

      let indexPessoa = todasPessoas.findIndex(
        (pessoa) => pessoa.id === dadosNovaVisita.idPessoa
      );

      todasPessoas[indexPessoa].visitas.push({
        id: uuidv4(),
        data: dadosNovaVisita.data,
        colocacoes: dadosNovaVisita.colocacoes,
        visita: dadosNovaVisita.visita,
        anotacoes: dadosNovaVisita.anotacoes,
        videosMostrados: dadosNovaVisita.videosMostrados,
      });

      return await salvarAsyncStorage(todasPessoas, "@tjdroid:pessoas")
        .then(() => {
          return { idPessoa: dadosNovaVisita.idPessoa };
        })
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };
  return salvarNovaVisita();
}

// EXCLUIR Visita
export async function excluirVisita(idPessoa: string, idVisita: string) {
  const excluirVisita = async () => {
    try {
      let pessoasTodos: PeopleType[] = await buscarAsyncStorage(
        "@tjdroid:pessoas"
      );

      let indexPessoa = pessoasTodos.findIndex(
        (pessoa) => pessoa.id == idPessoa
      );
      let indexVisita = pessoasTodos[indexPessoa].visitas.findIndex(
        (visita) => visita.id == idVisita
      );
      pessoasTodos[indexPessoa].visitas.splice(indexVisita, 1);

      return await salvarAsyncStorage(pessoasTodos, "@tjdroid:pessoas")
        .then(() => {
          return { idPessoa: idPessoa };
        })
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };
  return excluirVisita();
}
