import RNFS, {
  DocumentDirectoryPath,
  DownloadDirectoryPath,
} from "react-native-fs";
import i18next from "i18next";
import { zip, unzip } from "react-native-zip-archive";

import {
  PermissionsAndroid,
  ToastAndroid,
  Alert,
  Platform,
} from "react-native";
import * as Device from "expo-device";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { format } from "date-fns";
import { analyticsCustomEvent } from "../services/AnalyticsCustomEvents";
import {
  buscarAsyncStorage,
  salvarAsyncStorage,
} from "../services/AsyncStorageMethods";

// CONSTANTES
const BACKUP_PATH = DocumentDirectoryPath;
const BACKUP_PATH_DOWNLOAD = DownloadDirectoryPath;
const BACKUP_FOLDER_NAME = "backuptjdroid";

// GUARDA TEMPORARIAMENTE O CAMINHO DO ARQUIVO ZIPADO
let ARQUIVO_ZIPADO_PATH_TEMP = "";

// Cria o nome do .zip com a data de hoje e nome do dispositivo (sem espaços)
const generateActualDateTimeBackupZipName = () => {
  return `tjdroid-backup-${format(new Date(), "dd-MM-yyyy-HH-mm-ss")}_${(
    Device.modelName || ""
  ).replace(/\s/g, "")}`;
};

// Função que dispara um alert de erro
function simpleAlert(title = null, errorMessage = null) {
  Alert.alert(
    `${title ? title : i18next.t("controllers.backupcontroller_alert_title")}`,
    `${
      errorMessage
        ? `${errorMessage}`
        : i18next.t("controllers.backupcontroller_alert_message")
    } `,
    [
      {
        text: i18next.t("words.ok"),
        onPress: () => {},
        style: "cancel",
      },
    ],
    { cancelable: true }
  );
}

// Função que dispara um alert de erro
function errorAlert(errorMessage = null) {
  Alert.alert(
    `${i18next.t("controllers.backupcontroller_alert_error_title")} ❌`,
    `${
      errorMessage
        ? i18next.t("controllers.backupcontroller_alert_error_message_1", {
            errorMessage,
          })
        : i18next.t("controllers.backupcontroller_alert_error_message_2")
    } `,
    [
      {
        text: i18next.t("words.ok"),
        onPress: () => {},
        style: "cancel",
      },
    ],
    { cancelable: true }
  );
}

// Função para gerar o .zip manual
export async function generateManualBackup() {
  getPermissionWhiteExternalStorage().then((permissionResponse) => {
    // Confere se o usuario permitiu salvar nos Downloads
    if (permissionResponse)
      createBackupFolder()
        .then(() => {
          createJsonFileFromAsyncStorage("relatorios")
            .then(() => {
              createJsonFileFromAsyncStorage("territorios")
                .then(() => {
                  createJsonFileFromAsyncStorage("pessoas")
                    .then(() => {
                      createJsonFileFromAsyncStorage("config")
                        .then(() => {
                          createJsonFileFromAsyncStorage("meses_trabalhados")
                            .then(() => {
                              // Zipa a pasta criada acima e gera o .zip
                              zipBackupFolder()
                                .then(() => {
                                  // Exclui a pasta do backup
                                  deleteBackupFolder()
                                    .then(() => {
                                      // Mensagem Toast
                                      ToastAndroid.show(
                                        `${i18next.t(
                                          "controllers.backupcontroller_toast_backup_generate_success"
                                        )} 👏`,
                                        ToastAndroid.SHORT
                                      );

                                      shareBackupFile()
                                        .then(() => {
                                          // processo concluido!
                                        })
                                        .catch((err) => {
                                          // console.log("120-shareBackupFile:",err);
                                        });
                                    })
                                    .catch((err) => {
                                      // console.log("118-deleteBackupFolder:",err);
                                    });
                                })
                                .catch((err) => {
                                  // console.log("117-zipBackupFolder:",err);
                                });
                            })
                            .catch((err) => {
                              // console.log("107-config:",err);
                            });
                        })
                        .catch((err) => {
                          // console.log("107-config:",err);
                        });
                    })
                    .catch((err) => {
                      // console.log("108-pessoas:",err);
                    });
                })
                .catch((err) => {
                  // console.log("109-territorios:",err);
                });
            })
            .catch((err) => {
              // console.log("110-relatorios:",err);
            });
        })
        .catch((err) => {
          // console.log("111-createBackupFolder:",err);
        });
  });

  // Adiciona o evento ao Analytics
  await analyticsCustomEvent("backupmanual_gerar");
}

// Função restaurar o .zip do backup manual
export async function restoreManualBackup() {
  await DocumentPicker.getDocumentAsync({
    type: "application/zip",
    multiple: false,
  }).then((result) => {
    if (result.canceled) {
      // console.log("Nenhum documento selecionado!");
      return;
    }

    if (result.assets.length === 1) {
      // Passos para restaurar o backup
      createBackupFolder()
        .then((cbfResponse) => {
          if (cbfResponse)
            unzipBackupFolderURI(result.assets[0].uri).then((unzipResponse) => {
              if (unzipResponse)
                restoreBackupToAsyncStorage().then(() => {
                  ToastAndroid.show(
                    `${i18next.t(
                      "controllers.backupcontroller_toast_backup_restore_success"
                    )} 👏`,
                    ToastAndroid.LONG
                  );
                });
            });
        })
        .catch((err) => {
          // console.log("101:", err);
        });
    }
  });

  // Adiciona o evento ao Analytics
  await analyticsCustomEvent("backupmanual_restaurar");
}

// Abre o Expo Share para a pessoa poder salvar o arquivo arquivo onde desejar logo de cara
export const shareBackupFile = async () => {
  const response = await Sharing.isAvailableAsync();
  if (response) {
    // Continua com o Expo Sharing
    await Sharing.shareAsync(`file:///${ARQUIVO_ZIPADO_PATH_TEMP}`, {
      dialogTitle: i18next.t("controllers.backupcontroller_share_file"),
    });
  }
  // Se não foi possivel, finaliza o processo
};

// Permissão para pedir o acesso a pasta Downloads
export const getPermissionWhiteExternalStorage = async () => {
  if (parseInt(`${Platform.Version}`) >= 33) {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    // console.log("Permissão garantida!");
    return true;
  } else {
    simpleAlert(
      null,
      i18next.t("controllers.backupcontroller_alert_backup_save_permission")
    );
    return false;
  }
};

// Função para criar a pasta do backup
export const createBackupFolder = async () => {
  //Criar a pasta (A propria lib verifica se ja existe uma pasta com o memso nome e não cria uma nova)
  return await RNFS.mkdir(`${BACKUP_PATH}/${BACKUP_FOLDER_NAME}`)
    .then(() => {
      // console.log("Pasta Criada!");
      return true;
    })
    .catch((err) => {
      errorAlert();
      // console.log("Erro - Pasta não foi criada: ", err);
      return false;
    });
};

// Função para criar cada arquivo json
export const createJsonFileFromAsyncStorage = async (
  nomeArquivoStorage: string
) => {
  const pathJsonFile = `${BACKUP_PATH}/${BACKUP_FOLDER_NAME}/${nomeArquivoStorage}.json`;

  const response = await buscarAsyncStorage(`@tjdroid:${nomeArquivoStorage}`);
  const normalized =
    response !== undefined && response !== null && response !== false
      ? response
      : [];

  // Cria o arquivo json
  return await RNFS.writeFile(
    pathJsonFile,
    JSON.stringify(
      // Busca os dados do AsyncStorage correspondente
      normalized
    ),
    "utf8"
  )
    .then((success) => {
      // console.log(`Arquivo ${nomeArquivoStorage} criado!`);
    })
    .catch((err) => {
      // Alert de erro
      errorAlert(err);
      // console.log("Erro ao criar arquivo json: ", err.message);
      return false;
    });
};

// Função para zippar a pasta com os json
export const zipBackupFolder = async () => {
  const sourcePath = `${BACKUP_PATH}/${BACKUP_FOLDER_NAME}`;
  const targetPath = `${BACKUP_PATH_DOWNLOAD}/${generateActualDateTimeBackupZipName()}.zip`;

  return await zip(sourcePath, targetPath)
    .then((path) => {
      // console.log(`zip completed at ${path}`);
      ARQUIVO_ZIPADO_PATH_TEMP = path;
      return true;
    })
    .catch((err) => {
      // Alert de erro
      errorAlert(
        i18next.t("controllers.backupcontroller_alert_backup_zip_folder_error")
      );
      // console.log("Houve um erro ao zipar a pasta, tente de novo");
      // console.error(err);
      return false;
    });
};

// Função para deszippar o backup - local informado
export const unzipBackupFolderURI = async (uri: string) => {
  const sourcePath = uri;
  const targetPath = `${BACKUP_PATH}/${BACKUP_FOLDER_NAME}`;
  const charset = "UTF-8";
  // charset possible values: UTF-8, GBK, US-ASCII and so on. If none was passed, default value is UTF-8

  return await unzip(sourcePath, targetPath, charset)
    .then((path) => {
      // console.log(`Unzip completed at ${path}`);
      return true;
    })
    .catch((err) => {
      errorAlert(
        i18next.t("controllers.backupcontroller_alert_backup_file_invalid")
      );
      return false;
    });
};

// // Função para deszippar o backup
// export const unzipBackupFolder = async () => {
//   const sourcePath = `${BACKUP_PATH}/${BACKUP_FOLDER_NAME}/${generateActualDateTimeBackupZipName()}.zip`;
//   const targetPath = `${BACKUP_PATH}/${BACKUP_FOLDER_NAME}`;
//   const charset = "UTF-8";
//   // charset possible values: UTF-8, GBK, US-ASCII and so on. If none was passed, default value is UTF-8

//   return await unzip(sourcePath, targetPath, charset)
//     .then((path) => {
//       // console.log(`Unzip completed at ${path}`);
//     })
//     .catch((err) => {
//       errorAlert(
//         i18next.t("controllers.backupcontroller_alert_backup_unzip_error")
//       );
//       return false;
//     });
// };

// Função para deletar arquivos, zips e pastas
export const deleteFile = async (nomeArquivoStorage = "", extensao = "") => {
  const path = `${BACKUP_PATH}/${BACKUP_FOLDER_NAME}/${nomeArquivoStorage}${extensao}`;
  return await RNFS.unlink(path)
    .then(() => {
      // console.log("Arquivos .json deletados!");
    })
    // `unlink` will throw an error, if the item to unlink does not exist
    .catch((err) => {
      // console.log(err.message);
    });
};

// Função para deletar arquivos, zips e pastas
export const deleteBackupFolder = async () => {
  const path = `${BACKUP_PATH}/${BACKUP_FOLDER_NAME}`;
  return await RNFS.unlink(path)
    .then(() => {
      // console.log("Pasta deletada!");
    })
    // `unlink` will throw an error, if the item to unlink does not exist
    .catch((err) => {
      // console.log(err.message);
    });
};

// Função que está listando as pastas do backup e restaurando o backup para o asyncstorage
export async function restoreBackupToAsyncStorage() {
  // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  return RNFS.readDir(`${BACKUP_PATH}/${BACKUP_FOLDER_NAME}`)
    .then(async (statResult) => {
      // Percorre todos os arquivos salvos, 4 ao todo
      statResult.map((result) => {
        if (result.name === "relatorios.json") {
          RNFS.readFile(result.path, "utf8")
            .then(async (result) => {
              // AQUI VAI RESTAURAR O BACKUP NO ASYNCSTORAGE
              const parsed = JSON.parse(result);
              await salvarAsyncStorage(
                parsed === null ? [] : parsed,
                "@tjdroid:relatorios"
              );
            })
            .catch((err) => {
              // console.log("102:",err);
              errorAlert(
                i18next.t(
                  "controllers.backupcontroller_alert_backup_restore_error"
                )
              );
            });
        }

        if (result.name === "territorios.json") {
          RNFS.readFile(result.path, "utf8")
            .then(async (result) => {
              // AQUI VAI RESTAURAR O BACKUP NO ASYNCSTORAGE
              const parsed = JSON.parse(result);
              await salvarAsyncStorage(
                parsed === null ? [] : parsed,
                "@tjdroid:territorios"
              );
            })
            .catch((err) => {
              // console.log("102:",err);
              errorAlert(
                i18next.t(
                  "controllers.backupcontroller_alert_backup_restore_error"
                )
              );
            });
        }

        if (result.name === "pessoas.json") {
          RNFS.readFile(result.path, "utf8")
            .then(async (result) => {
              // AQUI VAI RESTAURAR O BACKUP NO ASYNCSTORAGE
              const parsed = JSON.parse(result);
              await salvarAsyncStorage(
                parsed === null ? [] : parsed,
                "@tjdroid:pessoas"
              );
            })
            .catch((err) => {
              // console.log("102:",err);
              errorAlert(
                i18next.t(
                  "controllers.backupcontroller_alert_backup_restore_error"
                )
              );
            });
        }

        if (result.name === "config.json") {
          RNFS.readFile(result.path, "utf8")
            .then(async (result) => {
              // AQUI VAI RESTAURAR O BACKUP NO ASYNCSTORAGE
              const parsed = JSON.parse(result);
              await salvarAsyncStorage(
                {
                  ...(parsed ?? {}),
                  isRelatorioSimplificado: true,
                },
                "@tjdroid:config"
              );
            })
            .catch((err) => {
              // console.log("102:",err);
              errorAlert(
                i18next.t(
                  "controllers.backupcontroller_alert_backup_restore_error"
                )
              );
            });
        }

        if (result.name === "meses_trabalhados.json") {
          RNFS.readFile(result.path, "utf8")
            .then(async (result) => {
              // AQUI VAI RESTAURAR O BACKUP NO ASYNCSTORAGE
              const parsed = JSON.parse(result);
              await salvarAsyncStorage(
                parsed === null ? [] : parsed,
                "@tjdroid:meses_trabalhados"
              );
            })
            .catch((err) => {
              // console.log("102:",err);
              errorAlert(
                i18next.t(
                  "controllers.backupcontroller_alert_backup_restore_error"
                )
              );
            });
        }
      });
    })
    .catch((err) => {
      // SETAR UM ALERT DE ERRO
      errorAlert(
        i18next.t("controllers.backupcontroller_alert_backup_restore_error")
      );
      // console.log("Erro ao restaurar os dados #1: ", err.message, err.code);
      return false;
    });
}

// Script para fazer o upload para o Drive-Dropbox futuramente

// export function uploadBackupZip() {
//   var uploadUrl = "https://hookb.in/G9X3lpX10ytE2xPP2kKM"; // For testing purposes, go to http://requestb.in/ and create your own link
//   // create an array of objects of the files you want to upload
//   var files = [
//     {
//       name: BACKUP_ZIP_NAME,
//       filename: `${BACKUP_ZIP_NAME}.zip`,
//       filepath: `${BACKUP_PATH}/${BACKUP_FOLDER_NAME}/${BACKUP_ZIP_NAME}.zip`,
//       filetype: "application/zip",
//     },
//   ];

//   var uploadBegin = (response) => {
//     var jobId = response.jobId;
//     console.log("UPLOAD HAS BEGUN! JobId: " + jobId);
//   };

//   var uploadProgress = (response) => {
//     var percentageDone = Math.floor(
//       (response.totalBytesSent / response.totalBytesExpectedToSend) * 100
//     );
//     console.log("UPLOAD IS " + percentageDone + "% DONE!");

//     // // Mostra a percentagem de 10 em 10
//     // if (percentageDone % 10 === 0) {
//     //   setProgressMessage(
//     //     "Subindo para o Google Drive: " + percentageDone + "%"
//     //   );
//     // }
//   };

//   // upload files
//   RNFS.uploadFiles({
//     toUrl: uploadUrl,
//     files: files,
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//     },
//     fields: {
//       hello: "world",
//     },
//     begin: uploadBegin,
//     progress: uploadProgress,
//   }).promise.then((response) => {
//     if (response.statusCode == 200) {
//       console.log("BACKUP UPLOADED!");
//       // setProgressMessage("FILES UPLOADED!"); // response.statusCode, response.headers, response.body
//     } else {
//       console.log("SERVER ERROR");
//     }
//   });
// }
