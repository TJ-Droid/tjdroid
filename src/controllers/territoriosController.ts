import { v4 as uuidv4 } from "uuid";
import i18next from "i18next";
import moment from "moment";
import "moment/locale/pt-br";

// importa as opcoes para o SelectPicker para as opções de de tipos visitas
import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../services/AsyncStorageMethods";
import {
  TerritorioType,
  TerritoryDispositionType,
  TerritorioCasaType,
  TerritoryOrderingType,
} from "../types/Territories";
import { VisitDataType } from "../types/Visits";

export interface CustomTerritoriesType extends TerritorioType {
  dataSelecionado?: string;
  dataTrabalhado?: string;
  titulo?: string;
  corVisita?: string;
  descNome?: string;
  descData?: string;
  descAnotacoes?: string;
  qtdVisitas?: number;
  swipeCurrentID?: number;
}

export interface CustomTerritoryHomeType extends TerritorioCasaType {}

export interface TerritoryGrupoInterface {
  idPredio: string;
  casas: TerritoryCasaInterface[];
}
export interface TerritoryCasaInterface extends TerritorioCasaType {
  corVisita: string;
  descAnotacoes: string;
  descData: string;
  descNome: string;
  titulo: string;
  qtdVisitas: number;
}

export interface CustomSearchHomeVisitIterface {
  visita: VisitCustomSearchHomeVisitIterface;
  dataDate: Date;
  dataTime: Date;
}

export interface VisitCustomSearchHomeVisitIterface {
  idVisita: string;
  idCasa: string;
  idTerritorio: string;
  idPredio: string;
  idPessoa?: string;
  data: string;
  dia: string;
  hora: string;
  colocacoes: number;
  videosMostrados: number;
  visita: number;
  anotacoes: string;
}

export type SearchTerritoryInfoType = {
  observacoes?: string;
  dataSelecionado?: string;
  dataTrabalhado?: string;
  ultimaVisita?: string;
  idTerritorio?: string;
  nome?: string;
  dataSelecionadoFormatada?: string;
  dataTrabalhadoFormatada?: string;
  ultimaVisitaFormatada?: string;
};

export type CustomSearchVisitType = {
  idVisita: string;
  data: string;
  visita: string;
  visitaBgColor: string;
  visitaFontColor: string;
};

export interface CustomSearchHomeVisitsIterface {
  idTerritorio: string;
  idPredio: string;
  idCasa: string;
  nome: string;
  nomeMorador?: string;
  visitas?: CustomSearchVisitType[];
}

// Busca pessoas para a pagina TERRITÓRIOS
export default async function buscarTerritorios() {
  return await buscarAsyncStorage("@tjdroid:territorios")
    .then((dados: CustomTerritoriesType[]) => {
      const listaTerritorios: CustomTerritoriesType[] = [];

      // Passa a vez se for undefined, isso acontece na primeira vez aberto
      if (dados !== undefined) {
        dados.map((territorio) => {
          listaTerritorios.push({
            ...territorio,
            idTerritorio: territorio.idTerritorio,
            nome: territorio.nome,
            ordenacao: territorio.ordenacao,
            disposicao: territorio.disposicao,
            dataSelecionado: moment(
              territorio.informacoes.dataSelecionado
            ).format("DD/MM/YYYY"),
            dataTrabalhado: territorio.informacoes.dataTrabalhado
              ? moment(territorio.informacoes.dataTrabalhado).format(
                  "DD/MM/YYYY"
                )
              : "--",
          });
        });
      }

      // Retorna a lista de territorios
      return listaTerritorios;
    })
    .catch(() => {
      return undefined;
    });
}

// Busca pessoas para a pagina TERRITÓRIOS CASAS
export async function buscarTerritoriosGrupos(
  idTerritorio: string,
  territorioOrdenacao: TerritoryOrderingType
) {
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
      bgColor: "#c33f5530",
      fontColor: "#c33f55",
      label: i18next.t("selectpickeroptions.absentee"),
    },
  ];

  return await buscarAsyncStorage("@tjdroid:territorios")
    .then((dados: TerritorioType[]) => {
      const listaTerritoriosGrupos: TerritoryGrupoInterface[] = [];

      const territorioSelecionado = dados.find((territorio) => {
        return territorio.idTerritorio === idTerritorio;
      });

      territorioSelecionado &&
        territorioSelecionado.predio.map((predio) =>
          listaTerritoriosGrupos.push({
            ...predio,
            casas: [
              ...predio.casas.map((casa) => ({
                // listaTerritoriosGrupos.push({
                ...casa,
                titulo:
                  territorioOrdenacao === "nome" && casa.nome !== ""
                    ? casa.nome
                    : casa.posicao.toString(),
                descNome: casa.nomeMorador,
                corVisita:
                  casa.interessado === 0
                    ? "#95959570"
                    : casa.visitas.length !== 0
                    ? SELECT_PICKER_OPTIONS[
                        casa.visitas.sort((a, b) => {
                          return moment(b.data)
                            .format("YYYYMMDDHHmm")
                            .localeCompare(
                              moment(a.data).format("YYYYMMDDHHmm")
                            );
                        })[0].visita
                      ].fontColor
                    : "#f1f1f1",

                descData:
                  casa.visitas.length !== 0
                    ? moment(
                        casa.visitas.sort((a, b) => {
                          return moment(b.data)
                            .format("YYYYMMDDHHmm")
                            .localeCompare(
                              moment(a.data).format("YYYYMMDDHHmm")
                            );
                        })[0].data
                      ).format("DD/MM/YYYY")
                    : "",

                descAnotacoes:
                  casa.visitas.length !== 0
                    ? casa.visitas.sort((a, b) => {
                        return moment(b.data)
                          .format("YYYYMMDDHHmm")
                          .localeCompare(moment(a.data).format("YYYYMMDDHHmm"));
                      })[0].anotacoes
                    : "",

                qtdVisitas: casa.visitas.length,
                // });
              })),
            ],
          })
        );

      return listaTerritoriosGrupos;
    })
    .catch(() => {
      return undefined;
    });
}

// Busca Informações de um território
export async function buscarInformacoesTerritorio(idTerritorio: string) {
  return await buscarAsyncStorage("@tjdroid:territorios")
    .then((dados: TerritorioType[]) => {
      let todosTerritorios = dados;
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      let dadosTerritorio = todosTerritorios[indexTerritorio].informacoes;

      // Retorna a lista de visitas da pessoa ordenadas pela data
      // As datas mais recentes aparecem em primeiro
      return {
        idTerritorio: todosTerritorios[indexTerritorio].idTerritorio,
        nome: todosTerritorios[indexTerritorio].nome,
        dataSelecionadoFormatada: moment(
          dadosTerritorio.dataSelecionado
        ).format("L"),
        dataTrabalhadoFormatada:
          dadosTerritorio.dataTrabalhado !== ""
            ? moment(dadosTerritorio.dataTrabalhado).format("L")
            : "",
        ultimaVisitaFormatada:
          dadosTerritorio.ultimaVisita !== ""
            ? moment(dadosTerritorio.ultimaVisita).format("L")
            : "",
        ...dadosTerritorio,
      } as SearchTerritoryInfoType;
    })
    .catch(() => {
      return undefined;
    });
}

// Salva Informações de um território
export async function salvarInformacoesTerritorio(
  novosDados: SearchTerritoryInfoType
) {
  let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
    "@tjdroid:territorios"
  );
  let indexTerritorio = todosTerritorios.findIndex(
    (territorio) => territorio.idTerritorio === novosDados.idTerritorio
  );

  todosTerritorios[indexTerritorio].informacoes = {
    ...todosTerritorios[indexTerritorio].informacoes,
    dataSelecionado: novosDados.dataSelecionado ?? "",
    dataTrabalhado: novosDados.dataTrabalhado ?? "",
    observacoes: novosDados.observacoes ?? "",
  };

  return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

// SALVAR NOVO TERRITORIO
export async function salvarNovoTerritorio(territoryNewName: string) {
  const salvarTerritorio = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      todosTerritorios.push({
        idTerritorio: uuidv4(),
        nome: territoryNewName,
        ordenacao: "nome", // No momento, usado apenas como identificador interno
        disposicao: "linhas",
        informacoes: {
          observacoes: "",
          dataSelecionado: moment(moment().format("YYYY-MM-DD HH:mm")).format(),
          dataTrabalhado: "",
          ultimaVisita: "",
        },
        predio: [
          {
            idPredio: uuidv4(),
            posicao: 1,
            casas: [],
          },
        ],
      });

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
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
  return salvarTerritorio();
}

// ADICIONAR UM TERRITORIO
export async function adicionarUmaResidencia(
  idTerritorio: string,
  idPredio: "novo" | string
) {
  const adicionarResidencia = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      // Busca o index do territorio que queremos
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      let indexPredio = 0;

      // Se for novo, adiciona um novo predio
      if (idPredio === "novo") {
        const tempID = uuidv4();

        const posicaoUltimoGrupo =
          todosTerritorios[indexTerritorio].predio[
            todosTerritorios[indexTerritorio].predio.length - 1
          ].posicao;

        todosTerritorios[indexTerritorio].predio = [
          ...todosTerritorios[indexTerritorio].predio,
          { idPredio: tempID, casas: [], posicao: posicaoUltimoGrupo + 1 },
        ];

        // Busca o index do predio que queremos
        indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
          (predio) => predio.idPredio === tempID
        );
      } else {
        // Busca o index do predio que queremos
        indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
          (predio) => predio.idPredio === idPredio
        );
      }

      // Se não tiver nenhuma residência, adiciona o primeiro, se não, busca pelo último e adiciona mais um
      if (
        todosTerritorios[indexTerritorio].predio[indexPredio].casas.length === 0
      ) {
        // Adiciona Uma Residencia
        todosTerritorios[indexTerritorio].predio[indexPredio].casas.push({
          idCasa: uuidv4(),
          nome: `${1}`,
          nomeMorador: "",
          posicao: 1,
          interessado: 0,
          visitas: [],
        });
      } else {
        // Pega a última residencia para poder pegar sua posição
        let ultimaResidencia = todosTerritorios[indexTerritorio].predio[
          indexPredio
        ].casas
          .sort((a, b) => a.posicao - b.posicao)
          .slice(-1);

        // Adiciona Uma Residencia
        todosTerritorios[indexTerritorio].predio[indexPredio].casas.push({
          idCasa: uuidv4(),
          nome: `${ultimaResidencia[0].posicao + 1}`,
          nomeMorador: "",
          posicao: ultimaResidencia[0].posicao + 1,
          interessado: 0,
          visitas: [],
        });
      }

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
        .then(() => {
          // Retorna estes dados para poder voltar e atualizar a tela de casas
          return {
            idTerritorio: todosTerritorios[indexTerritorio].idTerritorio,
            nome: todosTerritorios[indexTerritorio].nome,
            ordenacao: todosTerritorios[indexTerritorio].ordenacao,
            disposicao: todosTerritorios[indexTerritorio].disposicao,
          } as CustomTerritoriesType;
        })
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };
  return adicionarResidencia();
}

// ADICIONAR UM TERRITORIO
export async function adicionarVariasResidencias(
  idTerritorio: string,
  idPredio: "novo" | string,
  numeroInicial: number,
  numeroFinal: number
) {
  // Validacoes adicionais
  if (numeroFinal - numeroInicial < 0) {
    return undefined;
  }

  if (numeroFinal - numeroInicial > 100) {
    return undefined;
  }

  const adicionarVariasResidencias = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      // Busca o index do territorio que queremos
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      let indexPredio = 0;

      // Se for novo, adiciona um novo predio
      if (idPredio === "novo") {
        const tempID = uuidv4();

        const posicaoUltimoGrupo =
          todosTerritorios[indexTerritorio].predio[
            todosTerritorios[indexTerritorio].predio.length - 1
          ].posicao;

        todosTerritorios[indexTerritorio].predio = [
          ...todosTerritorios[indexTerritorio].predio,
          { idPredio: tempID, casas: [], posicao: posicaoUltimoGrupo + 1 },
        ];

        // Busca o index do predio que queremos
        indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
          (predio) => predio.idPredio === tempID
        );
      } else {
        // Busca o index do predio que queremos
        indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
          (predio) => predio.idPredio === idPredio
        );
      }

      for (let i = numeroInicial; i <= numeroFinal; i++) {
        // Se não tiver nenhuma residência, adiciona o primeiro, se não, busca pelo último e adiciona mais um
        if (
          todosTerritorios[indexTerritorio].predio[indexPredio].casas.length ===
          0
        ) {
          // Adiciona Uma Residencia
          todosTerritorios[indexTerritorio].predio[indexPredio].casas.push({
            idCasa: uuidv4(),
            nome: `${i}`,
            nomeMorador: "",
            posicao: 1,
            interessado: 0,
            visitas: [],
          });
        } else {
          // Pega a última residencia para poder pegar sua posição
          let ultimaResidencia = todosTerritorios[indexTerritorio].predio[
            indexPredio
          ].casas
            .sort((a, b) => a.posicao - b.posicao)
            .slice(-1);

          // Adiciona Uma Residencia
          todosTerritorios[indexTerritorio].predio[indexPredio].casas.push({
            idCasa: uuidv4(),
            nome: `${i}`,
            nomeMorador: "",
            posicao: ultimaResidencia[0].posicao + 1,
            interessado: 0,
            visitas: [],
          });
        }
      }

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
        .then(() => {
          // Retorna estes dados para poder voltar e atualizar a tela de casas
          return {
            idTerritorio: todosTerritorios[indexTerritorio].idTerritorio,
            nome: todosTerritorios[indexTerritorio].nome,
            ordenacao: todosTerritorios[indexTerritorio].ordenacao,
            disposicao: todosTerritorios[indexTerritorio].disposicao,
          } as CustomTerritoriesType;
        })
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };
  return adicionarVariasResidencias();
}

// Funcao para trocar nome da pessoa
export async function editarNomeTerritorio(
  nomeTerritorio: string,
  idTerritorio: string
) {
  const editarNome = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      let indexEncontrado = todosTerritorios.findIndex(
        (item) => item.idTerritorio == idTerritorio
      );
      todosTerritorios[indexEncontrado].nome = nomeTerritorio;

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
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

  return editarNome();
}

// DELETAR TERRITÓRIO
export async function deletarTerritorio(idTerritorio: string) {
  // Se a validacao ocorrer continua o script
  const deletar = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      let indexTerritorio = todosTerritorios.findIndex(
        (item) => item.idTerritorio === idTerritorio
      );
      todosTerritorios.splice(indexTerritorio, 1);

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
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
  return deletar();
}

// EDITAR A DISPOSIÇÃO VISUAL DE UM TERRITÓRIO
export async function alterarDisposicaoVisualTerritorio(novosDados: {
  visualDisposition: TerritoryDispositionType;
  idTerritorio: string;
}) {
  const salvarAlteracao = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      // Busca o index do territorio que queremos alterar os dados
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === novosDados.idTerritorio
      );

      // Altera a disposição
      todosTerritorios[indexTerritorio].disposicao =
        novosDados.visualDisposition;

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
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
  return salvarAlteracao();
}

// Busca pessoas para a pagina EDITAR VISITA
export async function buscarVisitaResidencia(
  idVisita: string,
  idCasa: string,
  idTerritorio: string,
  idPredio: string
) {
  return await buscarAsyncStorage("@tjdroid:territorios")
    .then((dados: TerritorioType[]) => {
      let todosTerritorios = dados;
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      // Busca o index do predio que queremos
      let indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
        (predio) => predio.idPredio === idPredio
      );

      let indexResidencia = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas.findIndex((residencia) => residencia.idCasa === idCasa);

      let indexVisita = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas[indexResidencia].visitas.findIndex(
        (visita) => visita.idVisita == idVisita
      );

      let dadosResidencia =
        todosTerritorios[indexTerritorio].predio[indexPredio].casas[
          indexResidencia
        ].visitas[indexVisita];

      // Retorna a lista de visitas da pessoa ordenadas pela data
      // As datas mais recentes aparecem em primeiro
      return {
        visita: {
          idVisita: idVisita,
          idCasa: idCasa,
          idTerritorio: idTerritorio,
          idPredio: idPredio,
          data: dadosResidencia.data,
          dia: moment(dadosResidencia.data).format("L"),
          hora: moment(dadosResidencia.data).format("LT"),
          colocacoes: dadosResidencia.colocacoes,
          videosMostrados: dadosResidencia.videosMostrados,
          visita: dadosResidencia.visita,
          anotacoes: dadosResidencia.anotacoes,
        },
        dataDate: new Date(
          moment(dadosResidencia.data).add(1, "days").format("YYYY-MM-DD")
        ),
        dataTime: new Date(moment(dadosResidencia.data).format()),
      } as CustomSearchHomeVisitIterface;
    })
    .catch(() => {
      return undefined;
    });
}

// EDITAR VISITA FEITA
export async function editarVisitaCasa(
  dadosVisita: VisitCustomSearchHomeVisitIterface
) {
  const salvarEdicaoVisita = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === dadosVisita.idTerritorio
      );

      // Busca o index do predio que queremos
      let indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
        (predio) => predio.idPredio === dadosVisita.idPredio
      );

      let indexResidencia = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas.findIndex(
        (residencia) => residencia.idCasa === dadosVisita.idCasa
      );
      let indexVisita = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas[indexResidencia].visitas.findIndex(
        (visita) => visita.idVisita == dadosVisita.idVisita
      );

      todosTerritorios[indexTerritorio].predio[indexPredio].casas[
        indexResidencia
      ].visitas[indexVisita] = {
        idVisita: dadosVisita.idVisita,
        colocacoes: dadosVisita.colocacoes,
        data: dadosVisita.data,
        visita: dadosVisita.visita,
        videosMostrados: dadosVisita.videosMostrados,
        anotacoes: dadosVisita.anotacoes,
      };

      // Verifica a ultima visita informada é mais recente que a já existente
      let ultimaVisitaTerritorio =
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita;
      if (
        moment(dadosVisita.data).isAfter(ultimaVisitaTerritorio) ||
        ultimaVisitaTerritorio === ""
      ) {
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita =
          dadosVisita.data;
      }

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
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
  return salvarEdicaoVisita();
}

// ADICIONAR VISITA CASA
export async function salvarVisitaCasa(dadosNovaVisita: VisitDataType) {
  const salvarNovaVisita = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === dadosNovaVisita.idTerritorio
      );

      // Busca o index do predio que queremos
      let indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
        (predio) => predio.idPredio === dadosNovaVisita.idPredio
      );

      let indexResidencia = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas.findIndex(
        (residencia) => residencia.idCasa === dadosNovaVisita.idCasa
      );

      todosTerritorios[indexTerritorio].predio[indexPredio].casas[
        indexResidencia
      ].visitas.push({
        idVisita: uuidv4(),
        data: dadosNovaVisita.data,
        colocacoes: dadosNovaVisita.colocacoes,
        visita: dadosNovaVisita.visita,
        anotacoes: dadosNovaVisita.anotacoes,
        videosMostrados: dadosNovaVisita.videosMostrados,
      });

      // Seto 1, por que se teve uma visita adicionada, a pessoa é interessada
      todosTerritorios[indexTerritorio].predio[indexPredio].casas[
        indexResidencia
      ].interessado = 1;

      // Verifica a ultima visita informada é mais recente que a já existente
      let ultimaVisitaTerritorio =
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita;
      if (
        moment(dadosNovaVisita.data).isAfter(ultimaVisitaTerritorio) ||
        ultimaVisitaTerritorio === ""
      ) {
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita =
          dadosNovaVisita.data;
      }

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
        .then(() => {
          return {
            idTerritorio: dadosNovaVisita.idTerritorio,
            idCasa: dadosNovaVisita.idCasa,
          };
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

// Editar nome da casa
export async function editarNomeCasa(
  casaNome: string,
  idCasa: string,
  idTerritorio: string,
  idPredio: string
) {
  const editarNome = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      // Busca o index do predio que queremos
      let indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
        (predio) => predio.idPredio === idPredio
      );

      let indexResidencia = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas.findIndex((residencia) => residencia.idCasa === idCasa);

      todosTerritorios[indexTerritorio].predio[indexPredio].casas[
        indexResidencia
      ].nomeMorador = casaNome;

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
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

  return editarNome();
}

// Editar nome da do identificador da casa
export async function editarNomeIdentificadorResidencia(
  novoIdenficador: string,
  idCasa: string,
  idTerritorio: string,
  idPredio: string
) {
  const editarNome = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      // Busca o index do predio que queremos
      let indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
        (predio) => predio.idPredio === idPredio
      );

      let indexResidencia = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas.findIndex((residencia) => residencia.idCasa === idCasa);

      todosTerritorios[indexTerritorio].predio[indexPredio].casas[
        indexResidencia
      ].nome = novoIdenficador;

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
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

  return editarNome();
}

// EXCLUIR Visita Casa
export async function excluirVisitaCasa(
  idVisita: string,
  idCasa: string,
  idTerritorio: string,
  idPredio: string
) {
  const excluirVisita = async () => {
    try {
      let todosTerritorios: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );
      let indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      // Busca o index do predio que queremos
      let indexPredio = todosTerritorios[indexTerritorio].predio.findIndex(
        (predio) => predio.idPredio === idPredio
      );

      let indexResidencia = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas.findIndex((residencia) => residencia.idCasa === idCasa);
      let indexVisita = todosTerritorios[indexTerritorio].predio[
        indexPredio
      ].casas[indexResidencia].visitas.findIndex(
        (visita) => visita.idVisita == idVisita
      );

      todosTerritorios[indexTerritorio].predio[indexPredio].casas[
        indexResidencia
      ].visitas.splice(indexVisita, 1);

      // Se a Casa ficar sem nenhuma visita, seta o interesse para 0
      if (
        todosTerritorios[indexTerritorio].predio[indexPredio].casas[
          indexResidencia
        ].visitas.length === 0
      ) {
        todosTerritorios[indexTerritorio].predio[indexPredio].casas[
          indexResidencia
        ].interessado = 0;
      }

      return await salvarAsyncStorage(todosTerritorios, "@tjdroid:territorios")
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
  return excluirVisita();
}

// BUSCAR Visitas Residência
export async function buscarResidenciasVisitas(
  idCasa: string,
  idTerritorio: string,
  idPredio: string
) {
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
      bgColor: "#c33f5530",
      fontColor: "#c33f55",
      label: i18next.t("selectpickeroptions.absentee"),
    },
  ];

  const buscarVisitas = async () => {
    try {
      let territoriosTodos: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      let indexTerritorio = territoriosTodos.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      // Busca o index do predio que queremos
      let indexPredio = territoriosTodos[indexTerritorio].predio.findIndex(
        (predio) => predio.idPredio === idPredio
      );

      let indexResidencia = territoriosTodos[indexTerritorio].predio[
        indexPredio
      ].casas.findIndex((residencia) => residencia.idCasa === idCasa);
      let casas =
        territoriosTodos[indexTerritorio].predio[indexPredio].casas[
          indexResidencia
        ];

      const listaVisitas: CustomSearchVisitType[] = [];

      // Ordena as visitas decrescente
      let visitasOrdenadas = casas.visitas.sort((a, b) => {
        return (
          parseInt(moment(b.data).format("YYYYMMDDHHmm")) -
          parseInt(moment(a.data).format("YYYYMMDDHHmm"))
        );
      });

      // Faz o map para montar os dados das visitas
      visitasOrdenadas.map((visita) => {
        let visitaBgColor = "";
        let visitaFontColor = "";
        let visitaLabel = "";

        visitaBgColor = SELECT_PICKER_OPTIONS[visita.visita].bgColor;
        visitaFontColor = SELECT_PICKER_OPTIONS[visita.visita].fontColor;
        visitaLabel = SELECT_PICKER_OPTIONS[visita.visita].label;

        listaVisitas.push({
          idVisita: visita.idVisita,
          data: visita.data,
          visita: visitaLabel,
          visitaBgColor,
          visitaFontColor,
        });
      });

      return {
        idTerritorio: idTerritorio,
        idPredio: idPredio,
        idCasa: casas.idCasa,
        nome: casas.nome !== "" ? casas.nome : casas.posicao,
        nomeMorador:
          casas.nomeMorador !== ""
            ? casas.nomeMorador
            : i18next.t("controllers.territorioscontroller_empty_name"),
        visitas: [...listaVisitas],
      } as CustomSearchHomeVisitsIterface;
    } catch (error) {
      return undefined;
    }
  };
  return buscarVisitas();
}

// EXCLUIR Residência
export async function deletarResidenciaTerritorio(
  idCasa: string,
  idTerritorio: string,
  idPredio: string
) {
  const excluirResidencia = async () => {
    try {
      let territoriosTodos: TerritorioType[] = await buscarAsyncStorage(
        "@tjdroid:territorios"
      );

      let indexTerritorio = territoriosTodos.findIndex(
        (territorio) => territorio.idTerritorio === idTerritorio
      );

      // Busca o index do predio que queremos
      let indexPredio = territoriosTodos[indexTerritorio].predio.findIndex(
        (predio) => predio.idPredio === idPredio
      );

      let indexVisita = territoriosTodos[indexTerritorio].predio[
        indexPredio
      ].casas.findIndex((residencia) => residencia.idCasa == idCasa);

      territoriosTodos[indexTerritorio].predio[indexPredio].casas.splice(
        indexVisita,
        1
      );

      return await salvarAsyncStorage(territoriosTodos, "@tjdroid:territorios")
        .then(() => {
          return {
            idTerritorio: territoriosTodos[indexTerritorio].idTerritorio,
            nome: territoriosTodos[indexTerritorio].nome,
            ordenacao: territoriosTodos[indexTerritorio].ordenacao,
            disposicao: territoriosTodos[indexTerritorio].disposicao,
          };
        })
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };
  return excluirResidencia();
}
