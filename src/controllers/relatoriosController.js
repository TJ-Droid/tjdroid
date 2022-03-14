import { v4 as uuidv4 } from "uuid";
import i18next from 'i18next';
import { buscarAsyncStorage, salvarAsyncStorage } from "../services/AsyncStorageMethods";
import { buscarAsyncStorageTjDroidIdioma, formatarLocale } from "../utils/utils";

import moment from 'moment/min/moment-with-locales';
import minutes_to_hhmm from "../utils/minutes_to_hhmm";

// Busca os relatorios e monta os anos de servico para a pagina PESSOAS
export default async function buscarAnosServico() {
  return await buscarAsyncStorage('@tjdroid:relatorios')
    .then(async (dados) => {
      
      // Busca o idioma salvo no AsyncStorage
      const appLanguage = await buscarAsyncStorageTjDroidIdioma();

      const todosRelatorios = dados !== undefined ? dados : [];
      
      // Se o não existir nenhum relatório, adiciona o mês atual como opção
      if (todosRelatorios.length === 0) {
        todosRelatorios.push({
          mes_formatado: moment(new Date()).locale(formatarLocale(appLanguage.language)).format("MMMM yy"),
          mes: moment(new Date()).locale("pt").format("MMMM yy"),
          minutos_formatados: '0:00',
          minutos: 0,
          // data_MMMMyy: moment(new Date()).format("MMMM yy"),
          data_YYYYMMDD: parseInt(moment(new Date()).format("YYYYMMDD")),
          data_YYYYMM: parseInt(moment(new Date()).format("YYYYMM")),
        })
      }

      const todosAnos = [];
      const todosOsAnos = [];
      const sectionsHeaders = [];

      let relatoriosOrdenados = todosRelatorios.sort((a,b) => parseInt(moment(a.data).format("YYYYMMDD")) - parseInt(moment(b.data).format("YYYYMMDD")));

      // Pega o primeiro e ultimo item do array de anos
      let dataPrimeiroRelatorio = moment(([...relatoriosOrdenados].shift()).data).format("YYYYMM");
      let dataUltimoRelatorio = moment(([...relatoriosOrdenados].pop()).data).format("YYYYMM");
      
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
      let anosUsadosNosRelatorios = todosAnos.filter((elem, index, self) =>
        self.findIndex((t) => { return t === elem; }) === index
      );

      // Ordena a lista de anos
      anosUsadosNosRelatorios.sort();

      // Pega o primeiro e ultimo item do array de anos
      let anoMaisAntigo = [...anosUsadosNosRelatorios].shift();
      let anoMaisRecente = [...anosUsadosNosRelatorios].pop();

      // Pega o ano anterior ao menor ano
      todosOsAnos.push(anoMaisAntigo - 1);

      // Pega todos os anos entre o menor -1 e o maior
      while (anoMaisAntigo <= anoMaisRecente) {
        todosOsAnos.push(anoMaisAntigo);
        anoMaisAntigo++;
      }

      // Soma os minutos de cada relatorio de cada mes e junta no mes
      const totaisMensais2 = todosRelatorios.map((relatorio) => {
        return {
          data: relatorio.data,
          data_YYYYMMDD: moment(relatorio.data).format("YYYYMMDD"),
          data_MMMMyy: moment(relatorio.data).locale("pt").format("MMMM yy"),
          data_MMMM: moment(relatorio.data).locale("pt").format("MMMM"),
          data_M: parseInt(moment(relatorio.data).format("M")),
          data_yy: parseInt(moment(relatorio.data).format("yy")),
          minutos: relatorio.minutos,
        };
      });

      // Seta as variaveis para serem resetados no final do loop
      let mesesDepoisDeSetembroAnoAtual = [];
      let mesesAntesDeSetembroAnoSeguinte = [];

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
          .sort((a,b) => a.data_M - b.data_M);

        // Busca os meses do proximo ano corrente do loop
        let mesesDoAnoSeguinte = totaisMensais2
          .filter((item) => {
            return item.data_yy === (ano + 1);
          })
          .map((item) => {
            return item;
          })
          .sort((a,b) => a.data_M - b.data_M);

        // Faz a busca de cada mes
        for (let mesAtual = 1; mesAtual <= 12; mesAtual++) {
          
          // Filtra os meses do ano do for atual
          let mesesCorrentes = mesesDoAnoAtual.filter((mes) => {
            return mes.data_M === mesAtual;
          })

          // Se não tem nada do mes adiciona um objeto vazio
          if (mesesCorrentes.length === 0) {
            mesesCorrentes.push({
              data: moment(`${ano}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).format(),
              mes_formatado: moment(`${ano}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).locale(formatarLocale(appLanguage.language)).format("MMMM yy"),
              mes: moment(`${ano}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).locale("pt").format("MMMM yy"),
              minutos_formatados: '0:00',
              minutos: 0,
              data_YYYYMMDD: parseInt(moment(`${ano}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).format("YYYYMMDD")),
              data_YYYYMM: parseInt(moment(`${ano}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).format("YYYYMM")),
            });
          }

          // Pega o total de minutos daquele mês do ano
          let totalMinutosMes = mesesCorrentes.reduce((acc, curr) => {
            return (acc = acc + curr.minutos);
          }, 0)

          // Faz a separacao do ano de servico do ano atual 
          const mesNome = moment(mesesCorrentes[0].data).format("MM");

          if (
            mesNome === '09' ||
            mesNome === '10' ||
            mesNome === '11' ||
            mesNome === '12'
          ) {
            mesesDepoisDeSetembroAnoAtual.unshift({
              mes_formatado: moment(mesesCorrentes[0].data).locale(formatarLocale(appLanguage.language)).format("MMMM yy"),
              mes: moment(mesesCorrentes[0].data).locale("pt").format("MMMM yy"),
              minutos_formatados: minutes_to_hhmm(totalMinutosMes),
              minutos: totalMinutosMes,
              data_YYYYMMDD: parseInt(moment(mesesCorrentes[0].data).format("YYYYMMDD")),
              data_YYYYMM: parseInt(moment(mesesCorrentes[0].data).format("YYYYMM")),
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
          })

          // Se não tem nada do mes adiciona um objeto vazio
          if (mesesCorrentesAnoSeguinte.length === 0) {
            
            mesesCorrentesAnoSeguinte.push({
              data: moment(`${ano+1}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).format(),
              mes_formatado: moment(`${ano+1}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).locale(formatarLocale(appLanguage.language)).format("MMMM yy"),
              mes: moment(`${ano+1}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).locale("pt").format("MMMM yy"),
              minutos_formatados: '0:00',
              minutos: 0,
              data_YYYYMMDD: parseInt(moment(`${ano+1}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).format("YYYYMMDD")),
              data_YYYYMM: parseInt(moment(`${ano+1}${mesAtual <= 9 ? `0${mesAtual}` : mesAtual}`).format("YYYYMM")),
            });
          }

          // Pega o total de minutos daquele mês do ano
          let totalMinutosMesAnoSeguinte = mesesCorrentesAnoSeguinte.reduce((acc, curr) => {
            return (acc = acc + curr.minutos);
          }, 0)

          // Faz a separacao do ano de servico do ano atual 
          const mesAnoSeguinteNome = moment(mesesCorrentesAnoSeguinte[0].data).format("MM");

          if (
            mesAnoSeguinteNome === '09' ||
            mesAnoSeguinteNome === '10' ||
            mesAnoSeguinteNome === '11' ||
            mesAnoSeguinteNome === '12'
          ) {
            // mesesDepoisDeSetembroAnoSeguinte.unshift({
            //   mes: moment(mesesCorrentesAnoSeguinte[0].data).locale("pt").format("MMMM yy"),
            //   minutos_formatados: minutes_to_hhmm(totalMinutosMesAnoSeguinte),
            //   minutos: totalMinutosMesAnoSeguinte,
            //   data_YYYYMMDD: moment(mesesCorrentesAnoSeguinte[0].data).format("YYYYMMDD"),
            // });
          } else {
            mesesAntesDeSetembroAnoSeguinte.unshift({
              mes_formatado: moment(mesesCorrentesAnoSeguinte[0].data).locale(formatarLocale(appLanguage.language)).format("MMMM yy"),
              mes: moment(mesesCorrentesAnoSeguinte[0].data).locale("pt").format("MMMM yy"),
              minutos_formatados: minutes_to_hhmm(totalMinutosMesAnoSeguinte),
              minutos: totalMinutosMesAnoSeguinte,
              data_YYYYMMDD: parseInt(moment(mesesCorrentesAnoSeguinte[0].data).format("YYYYMMDD")),
              data_YYYYMM: parseInt(moment(mesesCorrentesAnoSeguinte[0].data).format("YYYYMM")),
            });
          }
        }
        
        // Monta o ano de servico atual
        let anoDeServicoMontado = mesesDepoisDeSetembroAnoAtual.concat(
          mesesAntesDeSetembroAnoSeguinte
        );
        
        // Limpa os meses antes do primeiro e do ultimo relatorio
        anoDeServicoMontado = anoDeServicoMontado.filter((mes) => {
          return mes.data_YYYYMM >= dataPrimeiroRelatorio && mes.data_YYYYMM <= dataUltimoRelatorio
        })

        // Ordena os meses do ano de servico
        anoDeServicoMontado.sort((a, b) => b.data_YYYYMMDD - a.data_YYYYMMDD);

        // Se nao tiver nenhum dado do ano de servico, nao adiciona na secao
        if (anoDeServicoMontado.length !== 0) {
          const totalHorasAnoServico = anoDeServicoMontado.reduce((acc, curr) => {
            return (acc = acc + curr.minutos);
          },0);

          // unshift adiciona array no comeco, o contrario do push()
          sectionsHeaders.unshift({
            title: `${ano}/${ano + 1} ${i18next.t("controllers.relatorioscontroller_service_year")} • ${minutes_to_hhmm(totalHorasAnoServico)}`,
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
      return false;
    });
}

// Busca os relatorios do mes selecionado para a página Relatório Mês
export async function buscarDadosMesAnoServico(mesAno) {
  
  return await buscarAsyncStorage('@tjdroid:relatorios')
    .then(async (dados) => {
      
      const todosRelatorios = dados;

      // Pega os relatorios do mes selecionado
      const relatoriosDoMes = todosRelatorios.filter((relatorio) => {
        return moment(relatorio.data).locale("pt").format("MMMM yy") === mesAno;
      });

      // Ordena os relatorio do mes selecionado por ordem descrescente
      relatoriosDoMes.sort((a,b) => b.data.localeCompare(a.data));

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
      const todasPessoas = await buscarAsyncStorage('@tjdroid:pessoas') ?? [];
      // const todasPessoas2 = todasPessoas ?? [];
      let totalEstudosBiblicos = [];
      // let todasVisitasPessoas = [];
      
      if (todasPessoas.length !== 0) {

        // BUSCA OS ESTUDOS BÍBLICOS DO MÊS
        totalEstudosBiblicos = todasPessoas.map((pessoa) => {
          return pessoa.visitas.find((visita) => {
            return visita.visita === 0 && moment(visita.data).locale("pt").format("MMMM yy") === mesAno;
          })
        }).filter(v => v !== undefined);
        
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
      };
    })
    .catch(() => {
      return false;
    });
}

// Editar Relatorio
export async function editarRelatorio({ relatorio, minutos }) {
  
  const editarRelatorio = async (atualRelatorio) => {
    try {

      let todosRelatorios = await buscarAsyncStorage('@tjdroid:relatorios');
      let indexEncontrado = todosRelatorios.findIndex(x => x.id == relatorio.id);
      todosRelatorios[indexEncontrado] = atualRelatorio;

      return await salvarAsyncStorage(todosRelatorios, '@tjdroid:relatorios')
      .then(() => {
        return { mesAno: moment(atualRelatorio.data).locale("pt").format("MMMM yy")}
      })
      .catch(() => {
        return false;
      });

    } catch (e) {
      return false;
    }
  };
  
  const dataRelatorio = moment(moment(`${relatorio.dia} ${relatorio.hora}`,"DD/MM/YYYY HH:mm",true).format("YYYY-MM-DD HH:mm")).format();
    
  const atualRelatorio = {
    id: relatorio.id,
    data: dataRelatorio,
    minutos,
    colocacoes: relatorio.colocacoes,
    videosMostrados: relatorio.videosMostrados,
    revisitas: relatorio.revisitas,
    anotacoes: relatorio.observacoes,
  };

  return editarRelatorio(atualRelatorio);
}

// Salvar Novo Relatorio
export async function salvarNovoRelatorio(relatorio, minutos) {

  const salvarRelatorio = async (novoRelatorio) => {
    try {
      let todosRelatorios = await buscarAsyncStorage('@tjdroid:relatorios');
      
      // Verifica se não existe nenhum relatório ainda e adicionar o primeiro como array
      // Se já existir, da um push normal
      if (!todosRelatorios) {
        await salvarAsyncStorage([novoRelatorio], '@tjdroid:relatorios');
        todosRelatorios = [novoRelatorio];
      } else {
        todosRelatorios.push(novoRelatorio);
      }
      
      return await salvarAsyncStorage(todosRelatorios, '@tjdroid:relatorios')
      .then( async () => {
      
        // Busca o idioma salvo no AsyncStorage
        const appLanguage = await buscarAsyncStorageTjDroidIdioma(); 
        
        return { 
          mesAno: moment(novoRelatorio.data).locale("pt").format("MMMM yy") ,
          mesAnoFormatado: moment(novoRelatorio.data).locale(formatarLocale(appLanguage.language)).format("MMMM yy") 
        }
      })
      .catch(() => {
        return false;
      });

    } catch (e) {
      return false;
    }
  };
  
  const dataRelatorio = moment(moment(`${relatorio.dia} ${relatorio.hora}`,"DD/MM/YYYY HH:mm",true).format("YYYY-MM-DD HH:mm")).format();

  const novoRelatorio = {
    id: uuidv4(),
    data: dataRelatorio,
    minutos,
    colocacoes: relatorio.colocacoes,
    videosMostrados: relatorio.videosMostrados,
    revisitas: relatorio.revisitas,
    anotacoes: relatorio.observacoes,
  };

  return salvarRelatorio(novoRelatorio);
}

// DELETAR RELATÓRIO
export async function deletarRelatorio(idRelatorio, dataRelatorio) {
  
  const excluirRelatorio = async (idRelatorio) => {
    try {

      let todosRelatorios = await buscarAsyncStorage('@tjdroid:relatorios');
      
      let indexEncontrado = todosRelatorios.findIndex(x => x.id == idRelatorio);
      todosRelatorios.splice(indexEncontrado, 1);

      return await salvarAsyncStorage(todosRelatorios, '@tjdroid:relatorios')
      .then(() => {
        return { mesAno: moment(dataRelatorio, 'DD/MM/YYYY').locale("pt").format("MMMM yy") }
      })
      .catch(() => {
        return false;
      });

    } catch (e) {
      return false;
    }
  };
  return excluirRelatorio(idRelatorio);
}
