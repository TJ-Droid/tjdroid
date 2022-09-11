import { v4 as uuidv4 } from "uuid";
import i18next from "i18next";
import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../services/AsyncStorageMethods";
import {
  buscarAsyncStorageTjDroidIdioma,
  formatarLocale,
} from "../utils/utils";
// Sem este importacao a tela para
import moment from "moment/min/moment-with-locales";

import minutes_to_hhmm from "../utils/minutes_to_hhmm";
import { ReportType } from "../types/Reports";
import { PeopleType } from "../types/People";
import { ReportCounterType } from "../types/ReportCounter";

interface CustomReportType extends ReportType {
  mes_formatado: string;
  mes: string;
  minutos_formatados: string;
  data_YYYYMMDD: number;
  data_YYYYMM: number;

  data_MMMMyy?: string;
  data_MMMM?: string;
  data_M: number;
  data_yy: number;
  minutos: number;
}

export type MonthTotalsType = {
  data: string;
  data_YYYYMMDD: number;
  data_MMMMyy: string;
  data_MMMM: string;
  data_M: number;
  data_yy: number;
  minutos: number;
  mes_formatado: string;
  mes: string;
  minutos_formatados: string;
  data_YYYYMM: number;
};

export type SectionHeadersType = {
  data: MonthTotalsType[];
  title: string;
};

export type SelectedMonthServiceDataType = {
  relatoriosDoMes: ReportType[];
  totalMinutos: number;
  totalRevisitas: number;
  totalColocacoes: number;
  totalVideosMostrados: number;
  totalEstudosBiblicos: number;
};

// Busca os relatorios e monta os anos de servico para a pagina PESSOAS
export default async function buscarAnosServico() {
  return await buscarAsyncStorage("@tjdroid:relatorios")
    .then(async (dados: CustomReportType[]) => {
      // Busca o idioma salvo no AsyncStorage
      const appLanguage = await buscarAsyncStorageTjDroidIdioma();
      const todosRelatorios = dados !== undefined ? dados : [];

      // Se o não existir nenhum relatório, adiciona o mês atual como opção
      if (todosRelatorios.length === 0) {
        todosRelatorios.push({
          mes_formatado: moment(new Date())
            .locale(formatarLocale(appLanguage.language))
            .format("MMMM yy"),
          mes: moment(new Date()).locale("pt").format("MMMM yy"),
          minutos_formatados: "0:00",
          minutos: 0,
          // data_MMMMyy: moment(new Date()).format("MMMM yy"),
          data_YYYYMMDD: parseInt(moment(new Date()).format("YYYYMMDD")),
          data_YYYYMM: parseInt(moment(new Date()).format("YYYYMM")),
          id: uuidv4(),
          data: moment(moment(new Date()).format("YYYY-MM-DD HH:mm")).format(),
          colocacoes: 0,
          videosMostrados: 0,
          revisitas: 0,
          anotacoes: "",
          data_M: parseInt(moment(new Date()).format("M")),
          data_yy: parseInt(moment(new Date()).format("yy")),
        });
      }

      const todosAnos: number[] = [];
      const todosOsAnos: number[] = [];
      const sectionsHeaders: SectionHeadersType[] = [];

      let relatoriosOrdenados = todosRelatorios.sort(
        (a, b) =>
          parseInt(moment(a.data).format("YYYYMMDD")) -
          parseInt(moment(b.data).format("YYYYMMDD"))
      );

      // Pega o primeiro e ultimo item do array de anos
      let dataPrimeiroRelatorio: number = parseInt(
        moment([...relatoriosOrdenados].shift()?.data).format("YYYYMM")
      );
      let dataUltimoRelatorio: number = parseInt(
        moment([...relatoriosOrdenados].pop()?.data).format("YYYYMM")
      );

      // Verifica se precisa adicionar o mes atual ou nao ao relatorio
      let existeDataMesAtual = parseInt(moment(new Date()).format("YYYYMM"));
      if (existeDataMesAtual > dataUltimoRelatorio) {
        dataUltimoRelatorio = existeDataMesAtual;
      }

      // Busca os anos do relatórios
      todosRelatorios.map((relatorio) => {
        todosAnos.push(parseInt(moment(relatorio.data).format("yy")));
      });

      // Verifica todos os anos do relatorio e separa os unicos
      let anosUsadosNosRelatorios = todosAnos.filter(
        (elem, index, self) =>
          self.findIndex((t) => {
            return t === elem;
          }) === index
      );

      // Ordena a lista de anos
      anosUsadosNosRelatorios.sort();

      // Pega o primeiro e ultimo item do array de anos
      let anoMaisAntigo = [...anosUsadosNosRelatorios].shift() ?? 0;
      let anoMaisRecente = [...anosUsadosNosRelatorios].pop() ?? 0;

      // Pega o ano anterior ao menor ano
      todosOsAnos.push(anoMaisAntigo - 1);

      // Pega todos os anos entre o menor -1 e o maior
      while (anoMaisAntigo <= anoMaisRecente) {
        todosOsAnos.push(anoMaisAntigo);
        anoMaisAntigo++;
      }

      // Soma os minutos de cada relatorio de cada mes e junta no mes
      const totaisMensais2: MonthTotalsType[] = todosRelatorios.map(
        (relatorio) => {
          return {
            data: relatorio.data,
            data_YYYYMMDD: parseInt(moment(relatorio.data).format("YYYYMMDD")),
            data_MMMMyy: moment(relatorio.data).locale("pt").format("MMMM yy"),
            data_MMMM: moment(relatorio.data).locale("pt").format("MMMM"),
            data_M: parseInt(moment(relatorio.data).format("M")),
            data_yy: parseInt(moment(relatorio.data).format("yy")),
            minutos: relatorio.minutos,
            mes_formatado: moment(relatorio.data)
              .locale(formatarLocale(appLanguage.language))
              .format("MMMM yy"),
            mes: moment(relatorio.data).locale("pt").format("MMMM yy"),
            minutos_formatados: minutes_to_hhmm(relatorio.minutos),
            data_YYYYMM: parseInt(moment(relatorio.data).format("YYYYMM")),
          };
        }
      );

      // Seta as variaveis para serem resetados no final do loop
      let mesesDepoisDeSetembroAnoAtual: MonthTotalsType[] = [];
      let mesesAntesDeSetembroAnoSeguinte: MonthTotalsType[] = [];

      // Monta os anos de servico
      todosOsAnos.map((ano) => {
        // Busca os meses do ano corrente do loop
        let mesesDoAnoAtual = totaisMensais2
          .filter((item) => {
            return item.data_yy === ano;
          })
          .map((item) => {
            return item;
          })
          .sort((a, b) => a.data_M - b.data_M);

        // Busca os meses do proximo ano corrente do loop
        let mesesDoAnoSeguinte = totaisMensais2
          .filter((item) => {
            return item.data_yy === ano + 1;
          })
          .map((item) => {
            return item;
          })
          .sort((a, b) => a.data_M - b.data_M);

        // Faz a busca de cada mes
        for (let mesAtual = 1; mesAtual <= 12; mesAtual++) {
          // Filtra os meses do ano do for atual
          let mesesCorrentes = mesesDoAnoAtual.filter((mes) => {
            return mes.data_M === mesAtual;
          });

          // Se não tem nada do mes adiciona um objeto vazio
          if (mesesCorrentes.length === 0) {
            const mesAtualLocal = `${ano}${
              mesAtual <= 9 ? `0${mesAtual}` : mesAtual
            }`;

            mesesCorrentes.push({
              data: moment(mesAtualLocal).format(),
              mes_formatado: moment(mesAtualLocal)
                .locale(formatarLocale(appLanguage.language))
                .format("MMMM yy"),
              mes: moment(mesAtualLocal).locale("pt").format("MMMM yy"),
              minutos_formatados: "0:00",
              minutos: 0,
              data_YYYYMMDD: parseInt(moment(mesAtualLocal).format("YYYYMMDD")),
              data_YYYYMM: parseInt(moment(mesAtualLocal).format("YYYYMM")),
              data_M: parseInt(moment(mesAtualLocal).format("M")),
              data_yy: parseInt(moment(mesAtualLocal).format("yy")),
              data_MMMMyy: moment(mesAtualLocal).locale("pt").format("MMMM yy"),
              data_MMMM: moment(mesAtualLocal).locale("pt").format("MMMM"),
            });
          }

          // Pega o total de minutos daquele mês do ano
          let totalMinutosMes = mesesCorrentes.reduce((acc, curr) => {
            return (acc = acc + curr.minutos);
          }, 0);

          // Faz a separacao do ano de servico do ano atual
          const mesNome = moment(mesesCorrentes[0].data).format("MM");

          if (
            mesNome === "09" ||
            mesNome === "10" ||
            mesNome === "11" ||
            mesNome === "12"
          ) {
            const mesCorrenteData = mesesCorrentes[0].data;
            mesesDepoisDeSetembroAnoAtual.unshift({
              mes_formatado: moment(mesCorrenteData)
                .locale(formatarLocale(appLanguage.language))
                .format("MMMM yy"),
              mes: moment(mesCorrenteData).locale("pt").format("MMMM yy"),
              minutos_formatados: minutes_to_hhmm(totalMinutosMes),
              data_YYYYMMDD: parseInt(
                moment(mesCorrenteData).format("YYYYMMDD")
              ),
              data_YYYYMM: parseInt(moment(mesCorrenteData).format("YYYYMM")),
              minutos: totalMinutosMes,
              data: mesCorrenteData,
              data_M: parseInt(moment(mesCorrenteData).format("M")),
              data_yy: parseInt(moment(mesCorrenteData).format("yy")),
              data_MMMMyy: moment(mesCorrenteData)
                .locale("pt")
                .format("MMMM yy"),
              data_MMMM: moment(mesCorrenteData).locale("pt").format("MMMM"),
            });
          } else {
            // mesesAntesDeSetembroAnoAtual.unshift({
            //   mes: moment(mesesCorrentes[0].data).locale("pt").format("MMMM yy"),
            //   minutos_formatados: minutes_to_hhmm(totalMinutosMes),
            //   minutos: totalMinutosMes,
            //   data_YYYYMMDD: moment(mesesCorrentes[0].data).format("YYYYMMDD"),
            // });
          }

          // Filtra os meses do ano do for atual
          let mesesCorrentesAnoSeguinte = mesesDoAnoSeguinte.filter((mes) => {
            return mes.data_M === mesAtual;
          });

          // Se não tem nada do mes adiciona um objeto vazio
          if (mesesCorrentesAnoSeguinte.length === 0) {
            const mesAtualLocal = `${ano + 1}${
              mesAtual <= 9 ? `0${mesAtual}` : mesAtual
            }`;
            mesesCorrentesAnoSeguinte.push({
              data: moment(mesAtualLocal).format(),
              mes_formatado: moment(mesAtualLocal)
                .locale(formatarLocale(appLanguage.language))
                .format("MMMM yy"),
              mes: moment(mesAtualLocal).locale("pt").format("MMMM yy"),
              minutos_formatados: "0:00",
              minutos: 0,
              data_YYYYMMDD: parseInt(moment(mesAtualLocal).format("YYYYMMDD")),
              data_YYYYMM: parseInt(moment(mesAtualLocal).format("YYYYMM")),
              data_M: parseInt(moment(mesAtualLocal).format("M")),
              data_yy: parseInt(moment(mesAtualLocal).format("yy")),
              data_MMMMyy: moment(mesAtualLocal).locale("pt").format("MMMM yy"),
              data_MMMM: moment(mesAtualLocal).locale("pt").format("MMMM"),
            });
          }

          // Pega o total de minutos daquele mês do ano
          let totalMinutosMesAnoSeguinte = mesesCorrentesAnoSeguinte.reduce(
            (acc, curr) => {
              return (acc = acc + curr.minutos);
            },
            0
          );

          // Faz a separacao do ano de servico do ano atual
          const mesAnoSeguinteNome = moment(
            mesesCorrentesAnoSeguinte[0].data
          ).format("MM");

          if (
            mesAnoSeguinteNome === "09" ||
            mesAnoSeguinteNome === "10" ||
            mesAnoSeguinteNome === "11" ||
            mesAnoSeguinteNome === "12"
          ) {
            // mesesDepoisDeSetembroAnoSeguinte.unshift({
            //   mes: moment(mesesCorrentesAnoSeguinte[0].data).locale("pt").format("MMMM yy"),
            //   minutos_formatados: minutes_to_hhmm(totalMinutosMesAnoSeguinte),
            //   minutos: totalMinutosMesAnoSeguinte,
            //   data_YYYYMMDD: moment(mesesCorrentesAnoSeguinte[0].data).format("YYYYMMDD"),
            // });
          } else {
            const mesCorrenteAnoSeguinteData =
              mesesCorrentesAnoSeguinte[0].data;
            mesesAntesDeSetembroAnoSeguinte.unshift({
              mes_formatado: moment(mesCorrenteAnoSeguinteData)
                .locale(formatarLocale(appLanguage.language))
                .format("MMMM yy"),
              mes: moment(mesCorrenteAnoSeguinteData)
                .locale("pt")
                .format("MMMM yy"),
              minutos_formatados: minutes_to_hhmm(totalMinutosMesAnoSeguinte),
              minutos: totalMinutosMesAnoSeguinte,
              data_YYYYMMDD: parseInt(
                moment(mesCorrenteAnoSeguinteData).format("YYYYMMDD")
              ),
              data_YYYYMM: parseInt(
                moment(mesCorrenteAnoSeguinteData).format("YYYYMM")
              ),
              data: mesCorrenteAnoSeguinteData,
              data_M: parseInt(moment(mesCorrenteAnoSeguinteData).format("M")),
              data_yy: parseInt(
                moment(mesCorrenteAnoSeguinteData).format("yy")
              ),
              data_MMMMyy: moment(mesCorrenteAnoSeguinteData)
                .locale("pt")
                .format("MMMM yy"),
              data_MMMM: moment(mesCorrenteAnoSeguinteData)
                .locale("pt")
                .format("MMMM"),
            });
          }
        }

        // Monta o ano de servico atual
        let anoDeServicoMontado = mesesDepoisDeSetembroAnoAtual.concat(
          mesesAntesDeSetembroAnoSeguinte
        );

        // Limpa os meses antes do primeiro e do ultimo relatorio
        anoDeServicoMontado = anoDeServicoMontado.filter((mes) => {
          return (
            mes.data_YYYYMM >= dataPrimeiroRelatorio &&
            mes.data_YYYYMM <= dataUltimoRelatorio
          );
        });

        // Ordena os meses do ano de servico
        anoDeServicoMontado.sort((a, b) => b.data_YYYYMMDD - a.data_YYYYMMDD);

        // Se nao tiver nenhum dado do ano de servico, nao adiciona na secao
        if (anoDeServicoMontado.length !== 0) {
          const totalHorasAnoServico = anoDeServicoMontado.reduce(
            (acc, curr) => {
              return (acc = acc + (curr.minutos ?? 0));
            },
            0
          );

          // unshift adiciona array no comeco, o contrario do push()
          sectionsHeaders.unshift({
            title: `${ano}/${ano + 1} ${i18next.t(
              "controllers.relatorioscontroller_service_year"
            )} • ${minutes_to_hhmm(totalHorasAnoServico)}`,
            data: anoDeServicoMontado,
          });
        }

        // Reseta as variaveis abaixo
        mesesAntesDeSetembroAnoSeguinte = [];
        mesesDepoisDeSetembroAnoAtual = [];
      });

      // Retorna os anos de serviço
      return sectionsHeaders;
    })
    .catch(() => {
      return undefined;
    });
}

// Busca os relatorios do mes selecionado para a página Relatório Mês
export async function buscarDadosMesAnoServico(mesAno: string) {
  return await buscarAsyncStorage("@tjdroid:relatorios")
    .then(async (dados: ReportType[]) => {
      const todosRelatorios = dados;

      // Pega os relatorios do mes selecionado
      const relatoriosDoMes = todosRelatorios.filter((relatorio) => {
        return moment(relatorio.data).locale("pt").format("MMMM yy") === mesAno;
      });

      // Ordena os relatorio do mes selecionado por ordem descrescente
      relatoriosDoMes.sort((a, b) => b.data.localeCompare(a.data));

      // Pega o total de horas
      const totalMinutos = relatoriosDoMes.reduce((acc, curr) => {
        return (acc = acc + curr.minutos);
      }, 0);

      // Pega o total de revisitas
      const totalRevisitas = relatoriosDoMes.reduce((acc, curr) => {
        return (acc = acc + curr.revisitas);
      }, 0);

      // Pega o total de colocacoes
      const totalColocacoes = relatoriosDoMes.reduce((acc, curr) => {
        return (acc = acc + curr.colocacoes);
      }, 0);

      // Pega o total de videos mostrados
      const totalVideosMostrados = relatoriosDoMes.reduce((acc, curr) => {
        return (acc = acc + curr.videosMostrados);
      }, 0);

      // Busca as pessoas
      const todasPessoas: PeopleType[] =
        (await buscarAsyncStorage("@tjdroid:pessoas")) ?? [];
      // const todasPessoas2 = todasPessoas ?? [];
      let totalEstudosBiblicos = [];
      // let todasVisitasPessoas = [];

      if (todasPessoas.length !== 0) {
        // BUSCA OS ESTUDOS BÍBLICOS DO MÊS
        totalEstudosBiblicos = todasPessoas
          .map((pessoa) => {
            return pessoa.visitas.find((visita) => {
              return (
                visita.visita === 0 &&
                moment(visita.data).locale("pt").format("MMMM yy") === mesAno
              );
            });
          })
          .filter((v) => v !== undefined);

        // // BUSCA OS ESTUDOS BÍBLICOS DO MÊS
        // todasPessoas.map((pessoa) => {
        //   return pessoa.visitas.map((visita) => {
        //     todasVisitasPessoas.push(visita);
        //   })
        // });

        // // Pega todas os estudos bíblicos do mes selecionado
        // totalEstudosBiblicos = todasVisitasPessoas.filter((visita) => {
        //   return moment(visita.data).locale("pt").format("MMMM yy") === mesAno && visita.visita === 0;
        // });
      }

      // Retorna os totais do mês
      return {
        relatoriosDoMes,
        totalMinutos,
        totalRevisitas,
        totalColocacoes,
        totalVideosMostrados,
        totalEstudosBiblicos: totalEstudosBiblicos.length,
      } as SelectedMonthServiceDataType;
    })
    .catch(() => {
      return undefined;
    });
}

// Editar Relatorio
export async function editarRelatorio(relatorio: ReportCounterType) {
  const editarRelatorio = async (atualRelatorio: ReportType) => {
    try {
      let todosRelatorios: ReportType[] = await buscarAsyncStorage(
        "@tjdroid:relatorios"
      );
      let indexEncontrado = todosRelatorios.findIndex(
        (item) => item.id == relatorio.id
      );
      todosRelatorios[indexEncontrado] = atualRelatorio;

      return await salvarAsyncStorage(todosRelatorios, "@tjdroid:relatorios")
        .then(() => {
          return {
            mesAno: moment(atualRelatorio.data)
              .locale("pt")
              .format("MMMM yy") as string,
          };
        })
        .catch(() => {
          return { mesAno: undefined };
        });
    } catch (e) {
      return { mesAno: undefined };
    }
  };

  const dataRelatorio = moment(
    moment(
      `${relatorio.dia} ${relatorio.hora}`,
      "DD/MM/YYYY HH:mm",
      true
    ).format("YYYY-MM-DD HH:mm")
  ).format();

  const atualRelatorio = {
    id: relatorio.id,
    data: dataRelatorio,
    minutos: relatorio.minutos,
    colocacoes: relatorio.colocacoes,
    videosMostrados: relatorio.videosMostrados,
    revisitas: relatorio.revisitas,
    anotacoes: relatorio.observacoes,
  };

  return editarRelatorio(atualRelatorio);
}

// Salvar Novo Relatorio
export async function salvarNovoRelatorio(relatorio: ReportCounterType) {
  const salvarRelatorio = async (novoRelatorio: ReportType) => {
    try {
      let todosRelatorios = await buscarAsyncStorage("@tjdroid:relatorios");

      // Verifica se não existe nenhum relatório ainda e adicionar o primeiro como array
      // Se já existir, da um push normal
      if (!todosRelatorios) {
        await salvarAsyncStorage([novoRelatorio], "@tjdroid:relatorios");
        todosRelatorios = [novoRelatorio];
      } else {
        todosRelatorios.push(novoRelatorio);
      }

      return await salvarAsyncStorage(todosRelatorios, "@tjdroid:relatorios")
        .then(async () => {
          // Busca o idioma salvo no AsyncStorage
          const appLanguage = await buscarAsyncStorageTjDroidIdioma();

          return {
            mesAno: moment(novoRelatorio.data)
              .locale("pt")
              .format("MMMM yy") as string,
            mesAnoFormatado: moment(novoRelatorio.data)
              .locale(formatarLocale(appLanguage.language))
              .format("MMMM yy") as string,
          };
        })
        .catch(() => {
          return {
            mesAno: undefined,
            mesAnoFormatado: undefined,
          };
        });
    } catch (e) {
      return {
        mesAno: undefined,
        mesAnoFormatado: undefined,
      };
    }
  };

  const dataRelatorio = moment(
    moment(
      `${relatorio.dia} ${relatorio.hora}`,
      "DD/MM/YYYY HH:mm",
      true
    ).format("YYYY-MM-DD HH:mm")
  ).format();

  const novoRelatorio = {
    id: uuidv4(),
    data: dataRelatorio,
    minutos: relatorio.minutos,
    colocacoes: relatorio.colocacoes,
    videosMostrados: relatorio.videosMostrados,
    revisitas: relatorio.revisitas,
    anotacoes: relatorio.observacoes,
  };

  return salvarRelatorio(novoRelatorio);
}

// DELETAR RELATÓRIO
export async function deletarRelatorio(
  idRelatorio: string,
  dataRelatorio: string
) {
  const excluirRelatorio = async (idRelatorio: string) => {
    try {
      let todosRelatorios: ReportType[] = await buscarAsyncStorage(
        "@tjdroid:relatorios"
      );

      let indexEncontrado = todosRelatorios.findIndex(
        (item) => item.id == idRelatorio
      );
      todosRelatorios.splice(indexEncontrado, 1);

      return await salvarAsyncStorage(todosRelatorios, "@tjdroid:relatorios")
        .then(() => {
          return {
            mesAno: moment(dataRelatorio, "DD/MM/YYYY")
              .locale("pt")
              .format("MMMM yy"),
          };
        })
        .catch(() => {
          return {
            mesAno: undefined,
          };
        });
    } catch (e) {
      return {
        mesAno: undefined,
      };
    }
  };
  return excluirRelatorio(idRelatorio);
}

// DELETAR RELATÓRIO MÊS
export async function deletarRelatorioMes(mes: string) {
  // Verifica se o usuário está tentando excluir os relatório do mês atual e retorna um erro
  if (moment(new Date()).locale("pt").format("MMMM yy") === mes) {
    return 2;
  }

  return await buscarAsyncStorage("@tjdroid:relatorios").then(
    async (dados: ReportType[]) => {
      const todosRelatorios = dados;

      // Pega os relatorios do mes selecionado
      const todosRelatoriosMenosOExcluido = todosRelatorios.filter(
        (relatorio) => {
          return moment(relatorio.data).locale("pt").format("MMMM yy") !== mes;
        }
      );

      return await salvarAsyncStorage(
        todosRelatoriosMenosOExcluido,
        "@tjdroid:relatorios"
      )
        .then(async () => {
          return 1;
        })
        .catch(() => {
          return false;
        });
    }
  );
}
