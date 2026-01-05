import i18next from "i18next";
import { v4 as uuidv4 } from "uuid";
import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../services/AsyncStorageMethods";
import {
  buscarAsyncStorageTjDroidIdioma,
  formatarLocale,
} from "../utils/utils";
// Sem este importacao a tela para
import momentLocales from "moment/min/moment-with-locales";

import { PeopleType } from "../types/People";
import { ReportCounterType } from "../types/ReportCounter";
import { MesesTrabalhadosType, ReportType } from "../types/Reports";
import minutes_to_hhmm from "../utils/minutes_to_hhmm";

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
      const appLocale = formatarLocale(appLanguage.language);
      const todosRelatorios = dados !== undefined ? dados : [];

      // Se o não existir nenhum relatório, adiciona o mês atual como opção
      if (todosRelatorios.length === 0) {
        todosRelatorios.push({
          mes_formatado: momentLocales(new Date())
            .locale(appLocale)
            .format("MMMM yy"),
          mes: momentLocales(new Date()).locale("pt").format("MMMM yy"),
          minutos_formatados: "0:00",
          minutos: 0,
          // data_MMMMyy: moment(new Date()).format("MMMM yy"),
          data_YYYYMMDD: parseInt(momentLocales(new Date()).format("YYYYMMDD")),
          data_YYYYMM: parseInt(momentLocales(new Date()).format("YYYYMM")),
          id: uuidv4(),
          data: momentLocales(
            momentLocales(new Date()).format("YYYY-MM-DD HH:mm")
          ).format(),
          colocacoes: 0,
          videosMostrados: 0,
          revisitas: 0,
          anotacoes: "",
          data_M: parseInt(momentLocales(new Date()).format("M")),
          data_yy: parseInt(momentLocales(new Date()).format("yy")),
        });
      }

      const todosOsAnos: number[] = [];
      const sectionsHeaders: SectionHeadersType[] = [];
      const nowMoment = momentLocales(new Date());
      const dataMesAtual = parseInt(nowMoment.format("YYYYMM"));
      const anoAtual = parseInt(nowMoment.format("yy"));
      const anosUsadosNosRelatoriosSet = new Set<number>();
      let dataPrimeiroRelatorio = Number.POSITIVE_INFINITY;
      let dataUltimoRelatorio = 0;

      // Soma os minutos de cada relatorio de cada mes e junta no mes
      const totaisMensais2: MonthTotalsType[] = [];
      for (const relatorio of todosRelatorios) {
        const relatorioMoment = momentLocales(relatorio.data);
        const dataYYYYMMDD = parseInt(relatorioMoment.format("YYYYMMDD"));
        const dataYYYYMM = parseInt(relatorioMoment.format("YYYYMM"));
        const dataM = parseInt(relatorioMoment.format("M"));
        const dataYY = parseInt(relatorioMoment.format("yy"));

        if (!Number.isNaN(dataYY)) {
          anosUsadosNosRelatoriosSet.add(dataYY);
        }
        if (!Number.isNaN(dataYYYYMM)) {
          if (dataYYYYMM < dataPrimeiroRelatorio) {
            dataPrimeiroRelatorio = dataYYYYMM;
          }
          if (dataYYYYMM > dataUltimoRelatorio) {
            dataUltimoRelatorio = dataYYYYMM;
          }
        }

        relatorioMoment.locale("pt");
        const dataMMMMyyPt = relatorioMoment.format("MMMM yy");
        const dataMMMMPt = relatorioMoment.format("MMMM");
        const mesPt = dataMMMMyyPt;
        const mesFormatado = relatorioMoment
          .locale(appLocale)
          .format("MMMM yy");

        totaisMensais2.push({
          data: relatorio.data,
          data_YYYYMMDD: dataYYYYMMDD,
          data_MMMMyy: dataMMMMyyPt,
          data_MMMM: dataMMMMPt,
          data_M: dataM,
          data_yy: dataYY,
          minutos: relatorio.minutos,
          mes_formatado: mesFormatado,
          mes: mesPt,
          minutos_formatados: minutes_to_hhmm(relatorio.minutos),
          data_YYYYMM: dataYYYYMM,
        });
      }

      if (dataPrimeiroRelatorio === Number.POSITIVE_INFINITY) {
        dataPrimeiroRelatorio = dataMesAtual;
        dataUltimoRelatorio = dataMesAtual;
      }

      if (dataMesAtual > dataUltimoRelatorio) {
        dataUltimoRelatorio = dataMesAtual;
      }

      if (anosUsadosNosRelatoriosSet.size === 0 && !Number.isNaN(anoAtual)) {
        anosUsadosNosRelatoriosSet.add(anoAtual);
      }

      const anosUsadosNosRelatorios = Array.from(
        anosUsadosNosRelatoriosSet
      ).sort();

      let anoMaisAntigo = anosUsadosNosRelatorios[0] ?? 0;
      let anoMaisRecente =
        anosUsadosNosRelatorios[anosUsadosNosRelatorios.length - 1] ?? 0;

      // Pega o ano anterior ao menor ano
      todosOsAnos.push(anoMaisAntigo - 1);

      // Pega todos os anos entre o menor -1 e o maior
      while (anoMaisAntigo <= anoMaisRecente) {
        todosOsAnos.push(anoMaisAntigo);
        anoMaisAntigo++;
      }

      // Seta as variaveis para serem resetados no final do loop
      let mesesDepoisDeSetembroAnoAtual: MonthTotalsType[] = [];
      let mesesAntesDeSetembroAnoSeguinte: MonthTotalsType[] = [];

      // Monta os anos de servico
      for (const ano of todosOsAnos) {
        // Busca os meses do ano corrente do loop
        const mesesDoAnoAtual: MonthTotalsType[] = [];
        const mesesDoAnoSeguinte: MonthTotalsType[] = [];

        for (const item of totaisMensais2) {
          if (item.data_yy === ano) {
            mesesDoAnoAtual.push(item);
            continue;
          }
          if (item.data_yy === ano + 1) {
            mesesDoAnoSeguinte.push(item);
          }
        }

        mesesDoAnoAtual.sort((a, b) => a.data_M - b.data_M);
        mesesDoAnoSeguinte.sort((a, b) => a.data_M - b.data_M);

        const mesesDoAnoAtualPorMes: Record<number, MonthTotalsType[]> = {};
        for (const item of mesesDoAnoAtual) {
          const bucket = mesesDoAnoAtualPorMes[item.data_M];
          if (bucket) {
            bucket.push(item);
          } else {
            mesesDoAnoAtualPorMes[item.data_M] = [item];
          }
        }

        const mesesDoAnoSeguintePorMes: Record<number, MonthTotalsType[]> = {};
        for (const item of mesesDoAnoSeguinte) {
          const bucket = mesesDoAnoSeguintePorMes[item.data_M];
          if (bucket) {
            bucket.push(item);
          } else {
            mesesDoAnoSeguintePorMes[item.data_M] = [item];
          }
        }

        // Faz a busca de cada mes
        for (let mesAtual = 1; mesAtual <= 12; mesAtual++) {
          // Filtra os meses do ano do for atual
          let mesesCorrentes = mesesDoAnoAtualPorMes[mesAtual];

          // Se não tem nada do mes adiciona um objeto vazio
          if (!mesesCorrentes || mesesCorrentes.length === 0) {
            const mesAtualLocal = `${ano}${
              mesAtual <= 9 ? `0${mesAtual}` : mesAtual
            }`;
            const mesAtualMoment = momentLocales(mesAtualLocal);
            const dataYYYYMMDD = parseInt(mesAtualMoment.format("YYYYMMDD"));
            const dataYYYYMM = parseInt(mesAtualMoment.format("YYYYMM"));
            const dataM = parseInt(mesAtualMoment.format("M"));
            const dataYY = parseInt(mesAtualMoment.format("yy"));

            mesAtualMoment.locale("pt");
            const mesAtualPt = mesAtualMoment.format("MMMM yy");
            const mesAtualMMMM = mesAtualMoment.format("MMMM");
            const mesAtualFormatado = mesAtualMoment
              .locale(appLocale)
              .format("MMMM yy");

            mesesCorrentes = [
              {
                data: mesAtualMoment.format(),
                mes_formatado: mesAtualFormatado,
                mes: mesAtualPt,
                minutos_formatados: "0:00",
                minutos: 0,
                data_YYYYMMDD: dataYYYYMMDD,
                data_YYYYMM: dataYYYYMM,
                data_M: dataM,
                data_yy: dataYY,
                data_MMMMyy: mesAtualPt,
                data_MMMM: mesAtualMMMM,
              },
            ];
          }

          // Pega o total de minutos daquele mês do ano
          let totalMinutosMes = mesesCorrentes.reduce((acc, curr) => {
            return (acc = acc + curr.minutos);
          }, 0);

          // Faz a separacao do ano de servico do ano atual
          const mesCorrenteData = mesesCorrentes[0].data;
          const mesCorrenteMoment = momentLocales(mesCorrenteData);
          const mesNome = mesCorrenteMoment.format("MM");

          if (
            mesNome === "09" ||
            mesNome === "10" ||
            mesNome === "11" ||
            mesNome === "12"
          ) {
            const dataYYYYMMDD = parseInt(
              mesCorrenteMoment.format("YYYYMMDD")
            );
            const dataYYYYMM = parseInt(mesCorrenteMoment.format("YYYYMM"));
            const dataM = parseInt(mesCorrenteMoment.format("M"));
            const dataYY = parseInt(mesCorrenteMoment.format("yy"));

            mesCorrenteMoment.locale("pt");
            const mesCorrentePt = mesCorrenteMoment.format("MMMM yy");
            const mesCorrenteMMMM = mesCorrenteMoment.format("MMMM");
            const mesCorrenteFormatado = mesCorrenteMoment
              .locale(appLocale)
              .format("MMMM yy");
            mesesDepoisDeSetembroAnoAtual.unshift({
              mes_formatado: mesCorrenteFormatado,
              mes: mesCorrentePt,
              minutos_formatados: minutes_to_hhmm(totalMinutosMes),
              data_YYYYMMDD: dataYYYYMMDD,
              data_YYYYMM: dataYYYYMM,
              minutos: totalMinutosMes,
              data: mesCorrenteData,
              data_M: dataM,
              data_yy: dataYY,
              data_MMMMyy: mesCorrentePt,
              data_MMMM: mesCorrenteMMMM,
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
          let mesesCorrentesAnoSeguinte = mesesDoAnoSeguintePorMes[mesAtual];

          // Se não tem nada do mes adiciona um objeto vazio
          if (
            !mesesCorrentesAnoSeguinte ||
            mesesCorrentesAnoSeguinte.length === 0
          ) {
            const mesAtualLocal = `${ano + 1}${
              mesAtual <= 9 ? `0${mesAtual}` : mesAtual
            }`;
            const mesAtualMoment = momentLocales(mesAtualLocal);
            const dataYYYYMMDD = parseInt(mesAtualMoment.format("YYYYMMDD"));
            const dataYYYYMM = parseInt(mesAtualMoment.format("YYYYMM"));
            const dataM = parseInt(mesAtualMoment.format("M"));
            const dataYY = parseInt(mesAtualMoment.format("yy"));

            mesAtualMoment.locale("pt");
            const mesAtualPt = mesAtualMoment.format("MMMM yy");
            const mesAtualMMMM = mesAtualMoment.format("MMMM");
            const mesAtualFormatado = mesAtualMoment
              .locale(appLocale)
              .format("MMMM yy");

            mesesCorrentesAnoSeguinte = [
              {
                data: mesAtualMoment.format(),
                mes_formatado: mesAtualFormatado,
                mes: mesAtualPt,
                minutos_formatados: "0:00",
                minutos: 0,
                data_YYYYMMDD: dataYYYYMMDD,
                data_YYYYMM: dataYYYYMM,
                data_M: dataM,
                data_yy: dataYY,
                data_MMMMyy: mesAtualPt,
                data_MMMM: mesAtualMMMM,
              },
            ];
          }

          // Pega o total de minutos daquele mês do ano
          let totalMinutosMesAnoSeguinte = mesesCorrentesAnoSeguinte.reduce(
            (acc, curr) => {
              return (acc = acc + curr.minutos);
            },
            0
          );

          // Faz a separacao do ano de servico do ano atual
          const mesCorrenteAnoSeguinteData =
            mesesCorrentesAnoSeguinte[0].data;
          const mesCorrenteAnoSeguinteMoment = momentLocales(
            mesCorrenteAnoSeguinteData
          );
          const mesAnoSeguinteNome =
            mesCorrenteAnoSeguinteMoment.format("MM");

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
            const dataYYYYMMDD = parseInt(
              mesCorrenteAnoSeguinteMoment.format("YYYYMMDD")
            );
            const dataYYYYMM = parseInt(
              mesCorrenteAnoSeguinteMoment.format("YYYYMM")
            );
            const dataM = parseInt(mesCorrenteAnoSeguinteMoment.format("M"));
            const dataYY = parseInt(mesCorrenteAnoSeguinteMoment.format("yy"));

            mesCorrenteAnoSeguinteMoment.locale("pt");
            const mesCorrenteAnoSeguintePt =
              mesCorrenteAnoSeguinteMoment.format("MMMM yy");
            const mesCorrenteAnoSeguinteMMMM =
              mesCorrenteAnoSeguinteMoment.format("MMMM");
            const mesCorrenteAnoSeguinteFormatado =
              mesCorrenteAnoSeguinteMoment
                .locale(appLocale)
                .format("MMMM yy");
            mesesAntesDeSetembroAnoSeguinte.unshift({
              mes_formatado: mesCorrenteAnoSeguinteFormatado,
              mes: mesCorrenteAnoSeguintePt,
              minutos_formatados: minutes_to_hhmm(totalMinutosMesAnoSeguinte),
              minutos: totalMinutosMesAnoSeguinte,
              data_YYYYMMDD: dataYYYYMMDD,
              data_YYYYMM: dataYYYYMM,
              data: mesCorrenteAnoSeguinteData,
              data_M: dataM,
              data_yy: dataYY,
              data_MMMMyy: mesCorrenteAnoSeguintePt,
              data_MMMM: mesCorrenteAnoSeguinteMMMM,
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
      }

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
        return (
          momentLocales(relatorio.data).locale("pt").format("MMMM yy") ===
          mesAno
        );
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
        const totalEstudosBiblicosEncontrados = [];
        for (const pessoa of todasPessoas) {
          const visitaEncontrada = pessoa.visitas.find((visita) => {
            return (
              visita.visita === 0 &&
              momentLocales(visita.data).locale("pt").format("MMMM yy") ===
                mesAno
            );
          });

          if (visitaEncontrada !== undefined) {
            totalEstudosBiblicosEncontrados.push(visitaEncontrada);
          }
        }
        totalEstudosBiblicos = totalEstudosBiblicosEncontrados;

        // // BUSCA OS ESTUDOS BÍBLICOS DO MÊS
        // for (const pessoa of todasPessoas) {
        //   for (const visita of pessoa.visitas) {
        //     todasVisitasPessoas.push(visita);
        //   }
        // }

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
            mesAno: momentLocales(atualRelatorio.data)
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

  const dataRelatorio = momentLocales(
    momentLocales(
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
            mesAno: momentLocales(novoRelatorio.data)
              .locale("pt")
              .format("MMMM yy") as string,
            mesAnoFormatado: momentLocales(novoRelatorio.data)
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

  const dataRelatorio = momentLocales(
    momentLocales(
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
            mesAno: momentLocales(dataRelatorio, "DD/MM/YYYY")
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
  if (momentLocales(new Date()).locale("pt").format("MMMM yy") === mes) {
    return 2;
  }

  return await buscarAsyncStorage("@tjdroid:relatorios").then(
    async (dados: ReportType[]) => {
      const todosRelatorios = dados;

      // Pega os relatorios do mes selecionado
      const todosRelatoriosMenosOExcluido = todosRelatorios.filter(
        (relatorio) => {
          return (
            momentLocales(relatorio.data).locale("pt").format("MMMM yy") !== mes
          );
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

// Busca se o mes trabalhado
export async function verificarSeMesTrabalhado(mesAno: string) {
  return await buscarAsyncStorage("@tjdroid:meses_trabalhados")
    .then(async (meses: MesesTrabalhadosType[]) => {
      // Pega os relatorios do mes selecionado
      const isRelatoriosMesExiste = Array.isArray(meses)
        ? meses.find((mes) => mes === mesAno)
        : false;
      return !!isRelatoriosMesExiste;
    })
    .catch(() => {
      return undefined;
    });
}

// Salva o mês trabalhado
export async function toggleSalvarMesTrabalhado(mesAno: string) {
  return await buscarAsyncStorage("@tjdroid:meses_trabalhados")
    .then(async (meses: MesesTrabalhadosType[]) => {
      const mesesTrabalhados = Array.isArray(meses) ? meses : [];
      // Pega os relatorios do mes selecionado
      const isRelatoriosMesExiste = mesesTrabalhados.find((mes) => {
        return mes === mesAno;
      });

      // Verifica se existe, remove
      if (!!isRelatoriosMesExiste) {
        const outrosMeses = mesesTrabalhados.filter((mes) => {
          return mes !== mesAno;
        });

        return await salvarAsyncStorage(
          outrosMeses,
          "@tjdroid:meses_trabalhados"
        )
          .then(async () => {
            return false;
          })
          .catch(() => {
            return undefined;
          });
      } else {
        return await salvarAsyncStorage(
          [...mesesTrabalhados, mesAno],
          "@tjdroid:meses_trabalhados"
        )
          .then(async () => {
            return true;
          })
          .catch(() => {
            return undefined;
          });
      }
    })
    .catch(() => {
      return undefined;
    });
}

