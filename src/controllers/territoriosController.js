import { v4 as uuidv4 } from "uuid";
import i18next from 'i18next';
import moment from "moment";
import "moment/locale/pt-br";

// importa as opcoes para o SelectPicker para as opções de de tipos visitas
import { buscarAsyncStorage, salvarAsyncStorage } from "../services/AsyncStorageMethods";

// Busca pessoas para a pagina TERRITÓRIOS
export default async function buscarTerritorios() {
  return await buscarAsyncStorage('@tjdroid:territorios')
    .then((dados) => {
      const listaTerritorios = [];

      // Passa a vez se for undefined, isso acontece na primeira vez aberto
      if(dados !== undefined) {

        dados.map((territorio) => {
          listaTerritorios.push({
            id: territorio.id,
            nome: territorio.nome,
            ordenacao: territorio.ordenacao,
            disposicao: territorio.disposicao,
            dataSelecionado: moment(
              territorio.informacoes.dataSelecionado
            ).format("DD/MM/YYYY"),
            dataTrabalhado: territorio.informacoes.dataTrabalhado
              ? moment(territorio.informacoes.dataTrabalhado).format("DD/MM/YYYY")
              : "--",
          });
        });
      }

      // Retorna a lista de territorios
      return listaTerritorios;
    })
    .catch(() => {
      return false;
    });
}

// Busca pessoas para a pagina TERRITÓRIOS CASAS
export async function buscarTerritoriosResidencias(territorioId, territorioOrdenacao) {

  const SELECT_PICKER_OPTIONS = [
    { "value": 0, "bgColor":"#5e913430" , "fontColor":"#5e9134", "label": i18next.t("selectpickeroptions.bible_studies") },
    { "value": 1, "bgColor":"#7346ad30" , "fontColor":"#7346ad", "label": i18next.t("selectpickeroptions.revisit") },
    { "value": 2, "bgColor":"#25467c30" , "fontColor":"#25467c", "label": i18next.t("selectpickeroptions.second_visit") },
    { "value": 3, "bgColor":"#4a6da730" , "fontColor":"#4a6da7", "label": i18next.t("selectpickeroptions.first_visit") },
    { "value": 4, "bgColor":"#c33f5530" , "fontColor":"#c33f55", "label": i18next.t("selectpickeroptions.absentee") }
  ]

  return await buscarAsyncStorage('@tjdroid:territorios')
    .then((dados) => {

      const listaTerritorios = [];

      const territorio = dados.find((territorio) => {
        return territorio.id === territorioId;
      });

      territorio.casas.map((residencia) => {
        
        listaTerritorios.push({
          id: residencia.id,
          titulo: territorioOrdenacao === 'nome' && residencia.nome !== '' ? residencia.nome : residencia.posicao,
          descNome: residencia.nomeMorador,
          corVisita: residencia.interessado === 0 ? '#95959560' : residencia.visitas.length !== 0 ? SELECT_PICKER_OPTIONS[(residencia.visitas.sort((a,b) => {return moment(b.data).format('YYYYMMDDHHmm').localeCompare(moment(a.data).format('YYYYMMDDHHmm'));}))[0].visita].fontColor : '#f1f1f1',
          
          descData: residencia.visitas.length !== 0 ? moment((residencia.visitas.sort((a,b) => {return moment(b.data).format('YYYYMMDDHHmm').localeCompare(moment(a.data).format('YYYYMMDDHHmm'));}))[0].data).format('DD/MM/YYYY') : '',
          
          descAnotacoes: residencia.visitas.length !== 0 ? (residencia.visitas.sort((a,b) => {return moment(b.data).format('YYYYMMDDHHmm').localeCompare(moment(a.data).format('YYYYMMDDHHmm'));}))[0].anotacoes : '',

          qtdVisitas: residencia.visitas.length,
        });
      })

      return (listaTerritorios);
    })
    .catch(() => {
      return false;
    });
}

// Busca Informações de um território
export async function buscarInformacoesTerritorio(territorioId) {

  return await buscarAsyncStorage('@tjdroid:territorios')
    .then((dados) => {

      let todosTerritorios = dados;
      let indexTerritorio = todosTerritorios.findIndex((territorio) => territorio.id === territorioId);

      let dadosTerritorio = todosTerritorios[indexTerritorio].informacoes;

      // Retorna a lista de visitas da pessoa ordenadas pela data
      // As datas mais recentes aparecem em primeiro
      return ({
        id: todosTerritorios[indexTerritorio].id,
        nome: todosTerritorios[indexTerritorio].nome,
        dataSelecionadoFormatada: moment(dadosTerritorio.dataSelecionado).format('L'),
        dataTrabalhadoFormatada: dadosTerritorio.dataTrabalhado !== '' ? moment(dadosTerritorio.dataTrabalhado).format('L') : '',
        ultimaVisitaFormatada: dadosTerritorio.ultimaVisita !== '' ? moment(dadosTerritorio.ultimaVisita).format('L') : '',
        ...dadosTerritorio
      })
    })
    .catch(() => {
      return false;
    });
}

// Salva Informações de um território
export async function salvarInformacoesTerritorio(novosDados) {

  let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');
  let indexTerritorio = todosTerritorios.findIndex((territorio) => territorio.id === novosDados.id);

  todosTerritorios[indexTerritorio].informacoes = {
    ...todosTerritorios[indexTerritorio].informacoes,
    dataSelecionado: novosDados.dataSelecionado,
    dataTrabalhado: novosDados.dataTrabalhado,
    observacoes: novosDados.observacoes,
  };

  return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
  .then(() => {
    return true
  })
  .catch(() => {
    return false;
  });
}

// Busca pessoas para a pagina EDITAR VISITA
export async function buscarVisitaResidencia(idVisita, residenciaId, territorioId) {

  return await buscarAsyncStorage('@tjdroid:territorios')
    .then((dados) => {

      let todosTerritorios = dados;
      let indexTerritorio = todosTerritorios.findIndex((territorio) => territorio.id === territorioId);
      let indexResidencia = todosTerritorios[indexTerritorio].casas.findIndex(residencia => residencia.id === residenciaId);
      let indexVisita = todosTerritorios[indexTerritorio].casas[indexResidencia].visitas.findIndex(visita => visita.id == idVisita);

      let dadosResidencia = todosTerritorios[indexTerritorio].casas[indexResidencia].visitas[indexVisita];

      // Retorna a lista de visitas da pessoa ordenadas pela data
      // As datas mais recentes aparecem em primeiro
      return ({
        visita: {
          idVisita: idVisita,
          residenciaId: residenciaId,
          territorioId: territorioId,
          data: dadosResidencia.data,
          dia: moment(dadosResidencia.data).format('L'),
          hora: moment(dadosResidencia.data).format('LT'),
          colocacoes: dadosResidencia.colocacoes,
          videosMostrados: dadosResidencia.videosMostrados,
          visita: dadosResidencia.visita,
          anotacoes: dadosResidencia.anotacoes
        },
        dataDate: new Date(moment(dadosResidencia.data).add(1, 'days').format('YYYY-MM-DD')),
        dataTime: new Date(moment(dadosResidencia.data).format())
      })

    })
    .catch(() => {
      return false;
    });
}

// SALVAR NOVO TERRITORIO
export async function salvarNovoTerritorio(territorioNome) {
  const salvarTerritorio = async (territorioNovoNome) => {
    try {
      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');

      todosTerritorios.push({
        id: uuidv4(),
        nome: territorioNovoNome,
        ordenacao: "nome", // No momento, usado apenas como identificador interno
        disposicao: "linhas",
        informacoes: {
          observacoes: "",
          dataSelecionado: moment(moment().format("YYYY-MM-DD HH:mm")).format(),
          dataTrabalhado: "",
          ultimaVisita: "",
        },
        casas: [],
      });

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
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
  return salvarTerritorio(territorioNome);
}

// ADICIONAR UM TERRITORIO
export async function adicionarUmaResidencia(territorioId) {
  const adicionarResidencia = async (territorioId) => {
    try {
      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');

      // Busca o index do territorio que queremos 
      let indexTerritorio = todosTerritorios.findIndex(territorio => territorio.id === territorioId );
      
      // Se não tiver nenhuma residência, adiciona o primeiro, se não, busca pelo último e adiciona mais um
      if(todosTerritorios[indexTerritorio].casas.length === 0){

        // Adiciona Uma Residencia
        todosTerritorios[indexTerritorio].casas.push({
          "id": uuidv4(),
          "nome": `${1}`,
          "nomeMorador": "",
          "posicao": 1,
          "interessado": 0,
          "visitas": []
        });

      } else {

        // Pega a última residencia para poder pegar sua posição
        let ultimaResidencia = todosTerritorios[indexTerritorio].casas.sort((a,b) => a.posicao-b.posicao).slice(-1);

        // Adiciona Uma Residencia
        todosTerritorios[indexTerritorio].casas.push({
          "id": uuidv4(),
          "nome": `${ultimaResidencia[0].posicao + 1}`,
          "nomeMorador": "",
          "posicao": ultimaResidencia[0].posicao + 1,
          "interessado": 0,
          "visitas": []
        });
      }

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
      .then(() => {
        // Retorna estes dados para poder voltar e atualizar a tela de casas
        return {
          id: todosTerritorios[indexTerritorio].id,
          nome: todosTerritorios[indexTerritorio].nome,
          ordenacao: todosTerritorios[indexTerritorio].ordenacao,
          disposicao: todosTerritorios[indexTerritorio].disposicao,
        };
      })
      .catch(() => {
        return false;
      });

    } catch (error) {
      return false;
    }
  }
  return adicionarResidencia(territorioId);
}

// ADICIONAR UM TERRITORIO
export async function adicionarVariasResidencias(territorioId, qtd) {
  const adicionarVariasResidencias = async (territorioId) => {
    try {
      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');

      // Busca o index do territorio que queremos 
      let indexTerritorio = todosTerritorios.findIndex(territorio => territorio.id === territorioId );
      
      for (let i = 1; i <= qtd; i++) {
        
        // Se não tiver nenhuma residência, adiciona o primeiro, se não, busca pelo último e adiciona mais um
        if(todosTerritorios[indexTerritorio].casas.length === 0){
  
          // Adiciona Uma Residencia
          todosTerritorios[indexTerritorio].casas.push({
            "id": uuidv4(),
            "nome": `${1}`,
            "nomeMorador": "",
            "posicao": 1,
            "interessado": 0,
            "visitas": []
          });
  
        } else {
  
          // Pega a última residencia para poder pegar sua posição
          let ultimaResidencia = todosTerritorios[indexTerritorio].casas.sort((a,b) => a.posicao-b.posicao).slice(-1);
  
          // Adiciona Uma Residencia
          todosTerritorios[indexTerritorio].casas.push({
            "id": uuidv4(),
            "nome": `${ultimaResidencia[0].posicao + 1}`,
            "nomeMorador": "",
            "posicao": ultimaResidencia[0].posicao + 1,
            "interessado": 0,
            "visitas": []
          });
        }
        
      }


      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
      .then(() => {
        // Retorna estes dados para poder voltar e atualizar a tela de casas
        return {
          id: todosTerritorios[indexTerritorio].id,
          nome: todosTerritorios[indexTerritorio].nome,
          ordenacao: todosTerritorios[indexTerritorio].ordenacao,
          disposicao: todosTerritorios[indexTerritorio].disposicao,
        };
      })
      .catch(() => {
        return false;
      });

    } catch (error) {
      return false;
    }
  }
  return adicionarVariasResidencias(territorioId);
}

// Funcao para trocar nome da pessoa
export async function editarNomeTerritorio(nomeTerritorio, territorioId){

  const editarNome = async (nomeTerritorio) => {
    try {

      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');

      let indexEncontrado = todosTerritorios.findIndex(x => x.id == territorioId);
      todosTerritorios[indexEncontrado].nome = nomeTerritorio;

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
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

  return editarNome(nomeTerritorio);
}

// DELETAR TERRITÓRIO
export async function deletarTerritorio(territorioId) {
  // Se a validacao ocorrer continua o script
  const deletar = async () => {
    try {
      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');

      let indexTerritorio = todosTerritorios.findIndex(
        (x) => x.id === territorioId
      );
      todosTerritorios.splice(indexTerritorio, 1);

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
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
  return deletar(territorioId);
}

// EDITAR A DISPOSIÇÃO VISUAL DE UM TERRITÓRIO
export async function alterarDisposicaoVisualTerritorio(novosDados) {

  const salvarAlteracao = async (novosDados) => {
    try {
      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');

      // Busca o index do territorio que queremos alterar os dados
      let indexTerritorio = todosTerritorios.findIndex(territorio => territorio.id === novosDados.id );
      
      // Altera a disposição
      todosTerritorios[indexTerritorio].disposicao = novosDados.visualDisposition;
      
      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
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
  return salvarAlteracao(novosDados);
}

// EDITAR VISITA FEITA
export async function editarVisitaCasa(dadosVisita) {

  const salvarEdicaoVisita = async (dadosVisita) => {
    try {

      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');
      let indexTerritorio = todosTerritorios.findIndex((territorio) => territorio.id === dadosVisita.territorioId);
      let indexResidencia = todosTerritorios[indexTerritorio].casas.findIndex(residencia => residencia.id === dadosVisita.residenciaId);
      let indexVisita = todosTerritorios[indexTerritorio].casas[indexResidencia].visitas.findIndex(visita => visita.id == dadosVisita.idVisita);

      todosTerritorios[indexTerritorio].casas[indexResidencia].visitas[indexVisita] = {
        id: dadosVisita.idVisita,
        colocacoes: dadosVisita.colocacoes,
        data: dadosVisita.data,
        visita: dadosVisita.visita,
        videosMostrados: dadosVisita.videosMostrados,
        anotacoes: dadosVisita.anotacoes,
      };

      // Verifica a ultima visita informada é mais recente que a já existente
      let ultimaVisitaTerritorio = todosTerritorios[indexTerritorio].informacoes.ultimaVisita;
      if(moment(dadosVisita.data).isAfter(ultimaVisitaTerritorio) || ultimaVisitaTerritorio === ''){
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita = dadosVisita.data;
      }

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
      .then(() => {
        return true
      })
      .catch(() => {
        return false;
      });

    } catch (error) {
      return false;
    }
  };
  return salvarEdicaoVisita(dadosVisita);
}

// ADICIONAR VISITA CASA
export async function salvarVisitaCasa(dadosNovaVisita) {

  const salvarNovaVisita = async (dadosNovaVisita) => {
    try {
      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');

      let indexTerritorio = todosTerritorios.findIndex((territorio) => territorio.id === dadosNovaVisita.territoryId)
      let indexResidencia = todosTerritorios[indexTerritorio].casas.findIndex(residencia => residencia.id === dadosNovaVisita.residenciaId);

      todosTerritorios[indexTerritorio].casas[indexResidencia].visitas.push({
        id: uuidv4(),
        data: dadosNovaVisita.data,
        colocacoes: dadosNovaVisita.colocacoes,
        visita: dadosNovaVisita.visita,
        anotacoes: dadosNovaVisita.anotacoes,
        videosMostrados: dadosNovaVisita.videosMostrados
      });

      // Seto 1, por que se teve uma visita adicionada, a pessoa é interessada
      todosTerritorios[indexTerritorio].casas[indexResidencia].interessado = 1;

      // Verifica a ultima visita informada é mais recente que a já existente
      let ultimaVisitaTerritorio = todosTerritorios[indexTerritorio].informacoes.ultimaVisita;
      if(moment(dadosNovaVisita.data).isAfter(ultimaVisitaTerritorio) || ultimaVisitaTerritorio === ''){
        todosTerritorios[indexTerritorio].informacoes.ultimaVisita = dadosNovaVisita.data;
      }

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
      .then(() => {
        return { territoryId: dadosNovaVisita.territoryId, residenciaId: dadosNovaVisita.residenciaId }
      })
      .catch(() => {
        return false;
      });

    } catch (error) {
      return false;
    }
  };
  return salvarNovaVisita(dadosNovaVisita);
}

// Editar nome da casa
export async function editarNomeCasa(casaNome, residenciaId, territorioId){

  const editarNome = async (casaNome, residenciaId, territorioId) => {
    try {

      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');
      let indexTerritorio = todosTerritorios.findIndex((territorio) => territorio.id === territorioId);
      let indexResidencia = todosTerritorios[indexTerritorio].casas.findIndex(residencia => residencia.id === residenciaId);

      todosTerritorios[indexTerritorio].casas[indexResidencia].nomeMorador = casaNome;

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
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

  return editarNome(casaNome, residenciaId, territorioId);
}

// Editar nome da do identificador da casa
export async function editarNomeIdentificadorResidencia(novoIdenficador, residenciaId, territorioId){
  const editarNome = async (novoIdenficador, residenciaId, territorioId) => {
    try {

      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');
      let indexTerritorio = todosTerritorios.findIndex((territorio) => territorio.id === territorioId);
      let indexResidencia = todosTerritorios[indexTerritorio].casas.findIndex(residencia => residencia.id === residenciaId);

      todosTerritorios[indexTerritorio].casas[indexResidencia].nome = novoIdenficador;

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
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

  return editarNome(novoIdenficador, residenciaId, territorioId);
}

// EXCLUIR Visita Casa
export async function excluirVisitaCasa(idVisita, residenciaId, territorioId) {

  const excluirVisita = async (idVisita, residenciaId, territorioId) => {
    try {

      let todosTerritorios = await buscarAsyncStorage('@tjdroid:territorios');
      let indexTerritorio = todosTerritorios.findIndex((territorio) => territorio.id === territorioId);
      let indexResidencia = todosTerritorios[indexTerritorio].casas.findIndex(residencia => residencia.id === residenciaId);
      let indexVisita = todosTerritorios[indexTerritorio].casas[indexResidencia].visitas.findIndex(visita => visita.id == idVisita);

      todosTerritorios[indexTerritorio].casas[indexResidencia].visitas.splice(indexVisita, 1);

      // Se a Casa ficar sem nenhuma visita, seta o interesse para 0
      if(todosTerritorios[indexTerritorio].casas[indexResidencia].visitas.length === 0){
        todosTerritorios[indexTerritorio].casas[indexResidencia].interessado = 0;
      }

      return await salvarAsyncStorage(todosTerritorios, '@tjdroid:territorios')
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
  return excluirVisita(idVisita, residenciaId, territorioId);
}

// BUSCAR Visitas Residência
export async function buscarResidenciasVisitas(residenciaId, territoryId) {

  const SELECT_PICKER_OPTIONS = [
    { "value": 0, "bgColor":"#5e913430" , "fontColor":"#5e9134", "label": i18next.t("selectpickeroptions.bible_studies") },
    { "value": 1, "bgColor":"#7346ad30" , "fontColor":"#7346ad", "label": i18next.t("selectpickeroptions.revisit") },
    { "value": 2, "bgColor":"#25467c30" , "fontColor":"#25467c", "label": i18next.t("selectpickeroptions.second_visit") },
    { "value": 3, "bgColor":"#4a6da730" , "fontColor":"#4a6da7", "label": i18next.t("selectpickeroptions.first_visit") },
    { "value": 4, "bgColor":"#c33f5530" , "fontColor":"#c33f55", "label": i18next.t("selectpickeroptions.absentee") }
  ]

  const buscarVisitas = async (residenciaId, territoryId) => {
    try {
      let territoriosTodos = await buscarAsyncStorage('@tjdroid:territorios');

      let indexTerritorio = territoriosTodos.findIndex(territorio => territorio.id === territoryId);
      let indexResidencia = territoriosTodos[indexTerritorio].casas.findIndex(residencia => residencia.id === residenciaId);
      let casas = territoriosTodos[indexTerritorio].casas[indexResidencia];

      const listaVisitas = [];

      // Ordena as visitas decrescente
      let visitasOrdenadas = casas.visitas.sort((a,b) => {
        return moment(b.data).format('YYYYMMDDHHmm') - moment(a.data).format('YYYYMMDDHHmm')
      })

      // Faz o map para montar os dados das visitas
      visitasOrdenadas.map((visita) => {
        let visitaBgColor = '';
        let visitaFontColor = '';
        let visitaLabel = '';

        visitaBgColor = SELECT_PICKER_OPTIONS[visita.visita].bgColor;
        visitaFontColor = SELECT_PICKER_OPTIONS[visita.visita].fontColor;
        visitaLabel = SELECT_PICKER_OPTIONS[visita.visita].label;

        listaVisitas.push({
          id: visita.id,
          data: visita.data,
          visita: visitaLabel,
          visitaBgColor,
          visitaFontColor
        });
      })
      
      return{
        territorioId: territoryId,
        id: casas.id,
        nome: casas.nome !== "" ? casas.nome : casas.posicao,
        nomeMorador: casas.nomeMorador !== "" ? casas.nomeMorador : i18next.t("controllers.territorioscontroller_empty_name"),
        visitas: [
          ...listaVisitas
        ]
      };

    } catch (error) {
      return false;
    }
  };
  return buscarVisitas(residenciaId, territoryId);
}

// EXCLUIR Residência
export async function deletarResidenciaTerritorio(residenciaId, territoryId) {

  const excluirResidencia = async (residenciaId, territoryId) => {
    try {
      let territoriosTodos = await buscarAsyncStorage('@tjdroid:territorios');

      let indexTerritorio = territoriosTodos.findIndex(territorio => territorio.id === territoryId);
      let indexVisita = territoriosTodos[indexTerritorio].casas.findIndex(residencia => residencia.id == residenciaId);

      territoriosTodos[indexTerritorio].casas.splice(indexVisita, 1);

      return await salvarAsyncStorage(territoriosTodos, '@tjdroid:territorios')
      .then(() => {
        return {
          id: territoriosTodos[indexTerritorio].id, 
          nome: territoriosTodos[indexTerritorio].nome, 
          ordenacao: territoriosTodos[indexTerritorio].ordenacao, 
          disposicao: territoriosTodos[indexTerritorio].disposicao};
      })
      .catch(() => {
        return false;
      });

    } catch (error) {
      return false;
    }
  };
  return excluirResidencia(residenciaId, territoryId);
}
