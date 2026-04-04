import i18next from "i18next";
import moment from "moment";
import "moment/locale/pt-br";
import { v4 as uuidv4 } from "uuid";

import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../services/AsyncStorageMethods";
import {
  TerritoriesType,
  TerritoryDispositionType,
  TerritoryFloorType,
  TerritoryHomeType,
  TerritoryOrderingType,
} from "../types/Territories";
import { VisitDataType } from "../types/Visits";

const TERRITORIES_STORAGE_KEY = "@tjdroid:territorios";

export interface CustomTerritoriesType extends TerritoriesType {
  dataSelecionado?: string;
  dataTrabalhado?: string;
  titulo?: string;
  corVisita?: string;
  descNome?: string;
  descData?: string;
  descAnotacoes?: string;
  qtdVisitas?: number;
  andarIdSelecionado?: string;
  andarPosicaoSelecionada?: number;
  totalAndares?: number;
}

export interface TerritoryHomesInterface {
  corVisita: string;
  descAnotacoes: string;
  descData: string;
  descNome: string;
  id: string;
  titulo: string;
  qtdVisitas: number;
}

export interface TerritoryFloorResidencesInterface {
  id: string;
  posicao: number;
  residencias: TerritoryHomesInterface[];
}

export interface TerritoryResidencesByFloorInterface {
  territorioId: string;
  totalAndares: number;
  andares: TerritoryFloorResidencesInterface[];
}

export interface CustomSearchHomeVisitIterface {
  visita: VisitCustomSearchHomeVisitIterface;
  dataDate: Date;
  dataTime: Date;
}

export interface VisitCustomSearchHomeVisitIterface {
  idVisita: string;
  residenciaId: string;
  territorioId: string;
  data: string;
  dia: string;
  hora: string;
  colocacoes: number;
  videosMostrados: number;
  visita: number;
  anotacoes: string;
  idPessoa?: string;
}

export type SearchTerritoryInfoType = {
  observacoes?: string;
  dataSelecionado?: string;
  dataTrabalhado?: string;
  ultimaVisita?: string;
  id?: string;
  nome?: string;
  dataSelecionadoFormatada?: string;
  dataTrabalhadoFormatada?: string;
  ultimaVisitaFormatada?: string;
};

export type CustomSearchVisitType = {
  id: string;
  data: string;
  visita: string;
  visitaBgColor: string;
  visitaFontColor: string;
};

export interface CustomSearchHomeVisitsIterface {
  territorioId: string;
  id: string;
  nome: string;
  nomeMorador?: string;
  visitas?: CustomSearchVisitType[];
}

type ResidenceLocationType = {
  floorIndex: number;
  residenceIndex: number;
};

const buildLegacyFloorId = (territorioId: string, posicao: number) =>
  `${territorioId}-floor-${posicao}`;

const getSelectPickerOptions = () => [
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

const normalizeFloor = (
  territorioId: string,
  andar: TerritoryFloorType | undefined,
  fallbackPosicao: number,
): TerritoryFloorType => ({
  id: andar?.id ?? buildLegacyFloorId(territorioId, fallbackPosicao),
  posicao: andar?.posicao ?? fallbackPosicao,
  casas: Array.isArray(andar?.casas) ? andar.casas : [],
});

const normalizeTerritory = (territorio: TerritoriesType): TerritoriesType => {
  const legacyHomes = Array.isArray(territorio.casas) ? territorio.casas : [];
  const rawFloors =
    Array.isArray(territorio.andares) && territorio.andares.length > 0
      ? territorio.andares
      : [
          {
            id: buildLegacyFloorId(territorio.id, 1),
            posicao: 1,
            casas: legacyHomes,
          },
        ];

  const andares = rawFloors
    .map((andar, index) =>
      normalizeFloor(territorio.id, andar, andar?.posicao ?? index + 1),
    )
    .sort((a, b) => a.posicao - b.posicao);

  if (andares.length === 0) {
    andares.push({
      id: buildLegacyFloorId(territorio.id, 1),
      posicao: 1,
      casas: [],
    });
  }

  return {
    ...territorio,
    casas: andares[0].casas,
    andares,
  };
};

const normalizeTerritories = (dados?: TerritoriesType[]) =>
  (Array.isArray(dados) ? dados : []).map((territorio) =>
    normalizeTerritory(territorio),
  );

const saveNormalizedTerritories = async (dados: TerritoriesType[]) => {
  const normalized = normalizeTerritories(dados).map((territorio) => ({
    ...territorio,
    casas: territorio.andares?.[0]?.casas ?? [],
  }));

  return salvarAsyncStorage(normalized, TERRITORIES_STORAGE_KEY);
};

const buildTerritoryNavigationData = (
  territorio: TerritoriesType,
  andarIdSelecionado?: string,
) => {
  const andares = territorio.andares ?? [];
  const andarSelecionado =
    andares.find((andar) => andar.id === andarIdSelecionado) ?? andares[0];

  return {
    id: territorio.id,
    nome: territorio.nome,
    ordenacao: territorio.ordenacao,
    disposicao: territorio.disposicao,
    andarIdSelecionado: andarSelecionado?.id,
    andarPosicaoSelecionada: andarSelecionado?.posicao,
    totalAndares: andares.length,
  } as CustomTerritoriesType;
};

const findResidenceLocation = (
  territorio: TerritoriesType,
  residenciaId: string,
): ResidenceLocationType | undefined => {
  const andares = territorio.andares ?? [];

  for (let floorIndex = 0; floorIndex < andares.length; floorIndex++) {
    const residenceIndex = andares[floorIndex].casas.findIndex(
      (residencia) => residencia.id === residenciaId,
    );

    if (residenceIndex !== -1) {
      return { floorIndex, residenceIndex };
    }
  }

  return undefined;
};

const getFloorIndex = (territorio: TerritoriesType, andarId?: string) => {
  if (!andarId) {
    return 0;
  }

  const floorIndex =
    territorio.andares?.findIndex((andar) => andar.id === andarId) ?? -1;
  return floorIndex >= 0 ? floorIndex : 0;
};

const buildResidenceSummary = (
  residencia: TerritoryHomeType,
  territorioOrdenacao: TerritoryOrderingType,
) => {
  const selectPickerOptions = getSelectPickerOptions();
  const visitasOrdenadas = [...residencia.visitas].sort((a, b) =>
    moment(b.data)
      .format("YYYYMMDDHHmm")
      .localeCompare(moment(a.data).format("YYYYMMDDHHmm")),
  );
  const ultimaVisita = visitasOrdenadas[0];

  return {
    id: residencia.id,
    titulo:
      territorioOrdenacao === "nome" && residencia.nome !== ""
        ? residencia.nome
        : residencia.posicao.toString(),
    descNome: residencia.nomeMorador,
    corVisita:
      residencia.interessado === 0
        ? "#95959560"
        : ultimaVisita
          ? selectPickerOptions[ultimaVisita.visita].fontColor
          : "#f1f1f1",
    descData: ultimaVisita ? moment(ultimaVisita.data).format("DD/MM/YYYY") : "",
    descAnotacoes: ultimaVisita?.anotacoes ?? "",
    qtdVisitas: residencia.visitas.length,
  } as TerritoryHomesInterface;
};

export default async function buscarTerritorios() {
  return await buscarAsyncStorage(TERRITORIES_STORAGE_KEY)
    .then((dados: CustomTerritoriesType[]) => {
      const listaTerritorios: CustomTerritoriesType[] = [];
      const territoriosNormalizados = normalizeTerritories(dados);

      territoriosNormalizados.map((territorio) => {
        listaTerritorios.push({
          ...territorio,
          id: territorio.id,
          nome: territorio.nome,
          ordenacao: territorio.ordenacao,
          disposicao: territorio.disposicao,
          totalAndares: territorio.andares?.length ?? 1,
          dataSelecionado: moment(territorio.informacoes.dataSelecionado).format(
            "DD/MM/YYYY",
          ),
          dataTrabalhado: territorio.informacoes.dataTrabalhado
            ? moment(territorio.informacoes.dataTrabalhado).format("DD/MM/YYYY")
            : "--",
        });
      });

      return listaTerritorios;
    })
    .catch(() => {
      return undefined;
    });
}

export async function buscarTerritoriosResidencias(
  territorioId: string,
  territorioOrdenacao: TerritoryOrderingType,
) {
  return await buscarAsyncStorage(TERRITORIES_STORAGE_KEY)
    .then((dados: TerritoriesType[]) => {
      const territoriosNormalizados = normalizeTerritories(dados);
      const territorio = territoriosNormalizados.find(
        (territorioAtual) => territorioAtual.id === territorioId,
      );

      if (!territorio) {
        return undefined;
      }

      return {
        territorioId,
        totalAndares: territorio.andares?.length ?? 1,
        andares:
          territorio.andares?.map((andar) => ({
            id: andar.id,
            posicao: andar.posicao,
            residencias: andar.casas.map((residencia) =>
              buildResidenceSummary(residencia, territorioOrdenacao),
            ),
          })) ?? [],
      } as TerritoryResidencesByFloorInterface;
    })
    .catch(() => {
      return undefined;
    });
}

export async function buscarInformacoesTerritorio(territorioId: string) {
  return await buscarAsyncStorage(TERRITORIES_STORAGE_KEY)
    .then((dados: TerritoriesType[]) => {
      const todosTerritorios = normalizeTerritories(dados);
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return undefined;
      }

      const dadosTerritorio = todosTerritorios[indexTerritorio].informacoes;

      return {
        id: todosTerritorios[indexTerritorio].id,
        nome: todosTerritorios[indexTerritorio].nome,
        dataSelecionadoFormatada: moment(dadosTerritorio.dataSelecionado).format(
          "L",
        ),
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

export async function salvarInformacoesTerritorio(
  novosDados: SearchTerritoryInfoType,
) {
  const todosTerritorios = normalizeTerritories(
    await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
  );
  const indexTerritorio = todosTerritorios.findIndex(
    (territorio) => territorio.id === novosDados.id,
  );

  if (indexTerritorio === -1) {
    return false;
  }

  todosTerritorios[indexTerritorio].informacoes = {
    ...todosTerritorios[indexTerritorio].informacoes,
    dataSelecionado: novosDados.dataSelecionado ?? "",
    dataTrabalhado: novosDados.dataTrabalhado ?? "",
    observacoes: novosDados.observacoes ?? "",
  };

  return await saveNormalizedTerritories(todosTerritorios)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

export async function buscarVisitaResidencia(
  idVisita: string,
  residenciaId: string,
  territorioId: string,
) {
  return await buscarAsyncStorage(TERRITORIES_STORAGE_KEY)
    .then((dados: TerritoriesType[]) => {
      const todosTerritorios = normalizeTerritories(dados);
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return undefined;
      }

      const location = findResidenceLocation(
        todosTerritorios[indexTerritorio],
        residenciaId,
      );

      if (!location) {
        return undefined;
      }

      const dadosResidencia =
        todosTerritorios[indexTerritorio].andares?.[location.floorIndex].casas[
          location.residenceIndex
        ].visitas.find((visita) => visita.id === idVisita);

      if (!dadosResidencia) {
        return undefined;
      }

      return {
        visita: {
          idVisita,
          residenciaId,
          territorioId,
          data: dadosResidencia.data,
          dia: moment(dadosResidencia.data).format("L"),
          hora: moment(dadosResidencia.data).format("LT"),
          colocacoes: dadosResidencia.colocacoes,
          videosMostrados: dadosResidencia.videosMostrados,
          visita: dadosResidencia.visita,
          anotacoes: dadosResidencia.anotacoes,
        },
        dataDate: new Date(
          moment(dadosResidencia.data).add(1, "days").format("YYYY-MM-DD"),
        ),
        dataTime: new Date(moment(dadosResidencia.data).format()),
      } as CustomSearchHomeVisitIterface;
    })
    .catch(() => {
      return undefined;
    });
}

export async function salvarNovoTerritorio(territoryNewName: string) {
  const salvarTerritorio = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const territoryId = uuidv4();

      todosTerritorios.push({
        id: territoryId,
        nome: territoryNewName,
        ordenacao: "nome",
        disposicao: "linhas",
        informacoes: {
          observacoes: "",
          dataSelecionado: moment(moment().format("YYYY-MM-DD HH:mm")).format(),
          dataTrabalhado: "",
          ultimaVisita: "",
        },
        casas: [],
        andares: [
          {
            id: buildLegacyFloorId(territoryId, 1),
            posicao: 1,
            casas: [],
          },
        ],
      });

      return await saveNormalizedTerritories(todosTerritorios)
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

export async function adicionarUmAndar(territorioId: string) {
  const adicionarAndar = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return undefined;
      }

      const andares = todosTerritorios[indexTerritorio].andares ?? [];
      const ultimaPosicao = andares.length
        ? [...andares].sort((a, b) => a.posicao - b.posicao).slice(-1)[0]
            .posicao
        : 0;

      const novoAndar = {
        id: uuidv4(),
        posicao: ultimaPosicao + 1,
        casas: [],
      };

      andares.push(novoAndar);
      todosTerritorios[indexTerritorio].andares = andares;

      return await saveNormalizedTerritories(todosTerritorios)
        .then(() =>
          buildTerritoryNavigationData(
            todosTerritorios[indexTerritorio],
            novoAndar.id,
          ),
        )
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };

  return adicionarAndar();
}

export async function deletarUmAndar(
  territorioId: string,
  andarId?: string,
) {
  const excluirAndar = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1 || !andarId) {
        return undefined;
      }

      const andares = todosTerritorios[indexTerritorio].andares ?? [];

      if (andares.length <= 1) {
        return undefined;
      }

      const floorIndex = andares.findIndex((andar) => andar.id === andarId);

      if (floorIndex === -1) {
        return undefined;
      }

      const nextFloorIndex = floorIndex > 0 ? floorIndex - 1 : 0;

      andares.splice(floorIndex, 1);

      todosTerritorios[indexTerritorio].andares = andares
        .sort((a, b) => a.posicao - b.posicao)
        .map((andar, index) => ({
          ...andar,
          posicao: index + 1,
        }));

      const nextFloorId =
        todosTerritorios[indexTerritorio].andares?.[
          Math.min(
            nextFloorIndex,
            (todosTerritorios[indexTerritorio].andares?.length ?? 1) - 1,
          )
        ]?.id;

      return await saveNormalizedTerritories(todosTerritorios)
        .then(() =>
          buildTerritoryNavigationData(
            todosTerritorios[indexTerritorio],
            nextFloorId,
          ),
        )
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };

  return excluirAndar();
}

export async function adicionarUmaResidencia(
  territorioId: string,
  andarId?: string,
) {
  const adicionarResidencia = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return undefined;
      }

      const floorIndex = getFloorIndex(todosTerritorios[indexTerritorio], andarId);
      const casas =
        todosTerritorios[indexTerritorio].andares?.[floorIndex].casas ?? [];

      if (casas.length === 0) {
        casas.push({
          id: uuidv4(),
          nome: "1",
          nomeMorador: "",
          posicao: 1,
          interessado: 0,
          visitas: [],
        });
      } else {
        const ultimaResidencia = [...casas]
          .sort((a, b) => a.posicao - b.posicao)
          .slice(-1)[0];

        casas.push({
          id: uuidv4(),
          nome: `${ultimaResidencia.posicao + 1}`,
          nomeMorador: "",
          posicao: ultimaResidencia.posicao + 1,
          interessado: 0,
          visitas: [],
        });
      }

      return await saveNormalizedTerritories(todosTerritorios)
        .then(() =>
          buildTerritoryNavigationData(
            todosTerritorios[indexTerritorio],
            todosTerritorios[indexTerritorio].andares?.[floorIndex].id,
          ),
        )
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };

  return adicionarResidencia();
}

export async function adicionarVariasResidencias(
  territorioId: string,
  numeroInicial: number,
  numeroFinal: number,
  andarId?: string,
) {
  if (numeroFinal - numeroInicial < 0) {
    return undefined;
  }

  if (numeroFinal - numeroInicial > 100) {
    return undefined;
  }

  const adicionarResidencias = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return undefined;
      }

      const floorIndex = getFloorIndex(todosTerritorios[indexTerritorio], andarId);
      const casas =
        todosTerritorios[indexTerritorio].andares?.[floorIndex].casas ?? [];

      for (let i = numeroInicial; i <= numeroFinal; i++) {
        if (casas.length === 0) {
          casas.push({
            id: uuidv4(),
            nome: `${i}`,
            nomeMorador: "",
            posicao: 1,
            interessado: 0,
            visitas: [],
          });
        } else {
          const ultimaResidencia = [...casas]
            .sort((a, b) => a.posicao - b.posicao)
            .slice(-1)[0];

          casas.push({
            id: uuidv4(),
            nome: `${i}`,
            nomeMorador: "",
            posicao: ultimaResidencia.posicao + 1,
            interessado: 0,
            visitas: [],
          });
        }
      }

      return await saveNormalizedTerritories(todosTerritorios)
        .then(() =>
          buildTerritoryNavigationData(
            todosTerritorios[indexTerritorio],
            todosTerritorios[indexTerritorio].andares?.[floorIndex].id,
          ),
        )
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };

  return adicionarResidencias();
}

export async function editarNomeTerritorio(
  nomeTerritorio: string,
  territorioId: string,
) {
  const editarNome = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexEncontrado = todosTerritorios.findIndex(
        (item) => item.id === territorioId,
      );

      if (indexEncontrado === -1) {
        return false;
      }

      todosTerritorios[indexEncontrado].nome = nomeTerritorio;

      return await saveNormalizedTerritories(todosTerritorios)
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

export async function deletarTerritorio(territorioId: string) {
  const deletar = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (item) => item.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return false;
      }

      todosTerritorios.splice(indexTerritorio, 1);

      return await saveNormalizedTerritories(todosTerritorios)
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

  return deletar();
}

export async function alterarDisposicaoVisualTerritorio(novosDados: {
  visualDisposition: TerritoryDispositionType;
  id: string;
}) {
  const salvarAlteracao = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === novosDados.id,
      );

      if (indexTerritorio === -1) {
        return false;
      }

      todosTerritorios[indexTerritorio].disposicao =
        novosDados.visualDisposition;

      return await saveNormalizedTerritories(todosTerritorios)
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

export async function editarVisitaCasa(
  dadosVisita: VisitCustomSearchHomeVisitIterface,
) {
  const salvarEdicaoVisita = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === dadosVisita.territorioId,
      );

      if (indexTerritorio === -1) {
        return false;
      }

      const location = findResidenceLocation(
        todosTerritorios[indexTerritorio],
        dadosVisita.residenciaId,
      );

      if (!location) {
        return false;
      }

      const residencia =
        todosTerritorios[indexTerritorio].andares?.[location.floorIndex].casas[
          location.residenceIndex
        ];

      if (!residencia) {
        return false;
      }

      const indexVisita = residencia.visitas.findIndex(
        (visita) => visita.id === dadosVisita.idVisita,
      );

      if (indexVisita === -1) {
        return false;
      }

      residencia.visitas[indexVisita] = {
        id: dadosVisita.idVisita,
        colocacoes: dadosVisita.colocacoes,
        data: dadosVisita.data,
        visita: dadosVisita.visita,
        videosMostrados: dadosVisita.videosMostrados,
        anotacoes: dadosVisita.anotacoes,
      };

      const ultimaVisitaTerritorio =
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita;
      if (
        moment(dadosVisita.data).isAfter(ultimaVisitaTerritorio) ||
        ultimaVisitaTerritorio === ""
      ) {
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita =
          dadosVisita.data;
      }

      return await saveNormalizedTerritories(todosTerritorios)
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

export async function salvarVisitaCasa(dadosNovaVisita: VisitDataType) {
  const salvarNovaVisita = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === dadosNovaVisita.territoryId,
      );

      if (indexTerritorio === -1) {
        return undefined;
      }

      const location = findResidenceLocation(
        todosTerritorios[indexTerritorio],
        dadosNovaVisita.residenciaId ?? "",
      );

      if (!location) {
        return undefined;
      }

      const residencia =
        todosTerritorios[indexTerritorio].andares?.[location.floorIndex].casas[
          location.residenceIndex
        ];

      if (!residencia) {
        return undefined;
      }

      residencia.visitas.push({
        id: uuidv4(),
        data: dadosNovaVisita.data,
        colocacoes: dadosNovaVisita.colocacoes,
        visita: dadosNovaVisita.visita,
        anotacoes: dadosNovaVisita.anotacoes,
        videosMostrados: dadosNovaVisita.videosMostrados,
      });

      residencia.interessado = 1;

      const ultimaVisitaTerritorio =
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita;
      if (
        moment(dadosNovaVisita.data).isAfter(ultimaVisitaTerritorio) ||
        ultimaVisitaTerritorio === ""
      ) {
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita =
          dadosNovaVisita.data;
      }

      return await saveNormalizedTerritories(todosTerritorios)
        .then(() => {
          return {
            territoryId: dadosNovaVisita.territoryId,
            residenciaId: dadosNovaVisita.residenciaId,
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

export async function editarNomeCasa(
  casaNome: string,
  residenciaId: string,
  territorioId: string,
) {
  const editarNome = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return false;
      }

      const location = findResidenceLocation(
        todosTerritorios[indexTerritorio],
        residenciaId,
      );

      if (!location) {
        return false;
      }

      const residencia =
        todosTerritorios[indexTerritorio].andares?.[location.floorIndex].casas[
          location.residenceIndex
        ];

      if (!residencia) {
        return false;
      }

      residencia.nomeMorador = casaNome;

      return await saveNormalizedTerritories(todosTerritorios)
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

export async function editarNomeIdentificadorResidencia(
  novoIdenficador: string,
  residenciaId: string,
  territorioId: string,
) {
  const editarNome = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return false;
      }

      const location = findResidenceLocation(
        todosTerritorios[indexTerritorio],
        residenciaId,
      );

      if (!location) {
        return false;
      }

      const residencia =
        todosTerritorios[indexTerritorio].andares?.[location.floorIndex].casas[
          location.residenceIndex
        ];

      if (!residencia) {
        return false;
      }

      residencia.nome = novoIdenficador;

      return await saveNormalizedTerritories(todosTerritorios)
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

export async function excluirVisitaCasa(
  idVisita: string,
  residenciaId: string,
  territorioId: string,
) {
  const excluirVisita = async () => {
    try {
      const todosTerritorios = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = todosTerritorios.findIndex(
        (territorio) => territorio.id === territorioId,
      );

      if (indexTerritorio === -1) {
        return false;
      }

      const location = findResidenceLocation(
        todosTerritorios[indexTerritorio],
        residenciaId,
      );

      if (!location) {
        return false;
      }

      const residencia =
        todosTerritorios[indexTerritorio].andares?.[location.floorIndex].casas[
          location.residenceIndex
        ];

      if (!residencia) {
        return false;
      }

      const indexVisita = residencia.visitas.findIndex(
        (visita) => visita.id === idVisita,
      );

      if (indexVisita === -1) {
        return false;
      }

      residencia.visitas.splice(indexVisita, 1);

      if (residencia.visitas.length === 0) {
        residencia.interessado = 0;
      }

      return await saveNormalizedTerritories(todosTerritorios)
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

export async function buscarResidenciasVisitas(
  residenciaId: string,
  territoryId: string,
) {
  const selectPickerOptions = getSelectPickerOptions();

  const buscarVisitas = async () => {
    try {
      const territoriosTodos = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = territoriosTodos.findIndex(
        (territorio) => territorio.id === territoryId,
      );

      if (indexTerritorio === -1) {
        return undefined;
      }

      const location = findResidenceLocation(
        territoriosTodos[indexTerritorio],
        residenciaId,
      );

      if (!location) {
        return undefined;
      }

      const casa =
        territoriosTodos[indexTerritorio].andares?.[location.floorIndex].casas[
          location.residenceIndex
        ];

      if (!casa) {
        return undefined;
      }

      const listaVisitas: CustomSearchVisitType[] = [];
      const visitasOrdenadas = [...casa.visitas].sort(
        (a, b) =>
          parseInt(moment(b.data).format("YYYYMMDDHHmm")) -
          parseInt(moment(a.data).format("YYYYMMDDHHmm")),
      );

      visitasOrdenadas.map((visita) => {
        listaVisitas.push({
          id: visita.id,
          data: visita.data,
          visita: selectPickerOptions[visita.visita].label,
          visitaBgColor: selectPickerOptions[visita.visita].bgColor,
          visitaFontColor: selectPickerOptions[visita.visita].fontColor,
        });
      });

      return {
        territorioId: territoryId,
        id: casa.id,
        nome: casa.nome !== "" ? casa.nome : casa.posicao.toString(),
        nomeMorador:
          casa.nomeMorador !== ""
            ? casa.nomeMorador
            : i18next.t("controllers.territorioscontroller_empty_name"),
        visitas: [...listaVisitas],
      } as CustomSearchHomeVisitsIterface;
    } catch (error) {
      return undefined;
    }
  };

  return buscarVisitas();
}

export async function deletarResidenciaTerritorio(
  residenciaId: string,
  territoryId: string,
) {
  const excluirResidencia = async () => {
    try {
      const territoriosTodos = normalizeTerritories(
        await buscarAsyncStorage(TERRITORIES_STORAGE_KEY),
      );
      const indexTerritorio = territoriosTodos.findIndex(
        (territorio) => territorio.id === territoryId,
      );

      if (indexTerritorio === -1) {
        return undefined;
      }

      const location = findResidenceLocation(
        territoriosTodos[indexTerritorio],
        residenciaId,
      );

      if (!location) {
        return undefined;
      }

      territoriosTodos[indexTerritorio].andares?.[location.floorIndex].casas.splice(
        location.residenceIndex,
        1,
      );

      return await saveNormalizedTerritories(territoriosTodos)
        .then(() =>
          buildTerritoryNavigationData(
            territoriosTodos[indexTerritorio],
            territoriosTodos[indexTerritorio].andares?.[location.floorIndex].id,
          ),
        )
        .catch(() => {
          return undefined;
        });
    } catch (error) {
      return undefined;
    }
  };

  return excluirResidencia();
}
