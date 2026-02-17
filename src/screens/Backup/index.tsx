import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { useThemeContext } from "../../contexts/Theme";
import {
  generateManualBackup,
  restoreManualBackup,
} from "../../controllers/backupController";
import { carregarConfiguracoes } from "../../controllers/configuracoesController";
import { getStorageTypeLabel } from "../../services/AsyncStorageMethods";
import themes from "../../themes";
import { ThemeColors } from "../../types/Theme";

import {
  Container,
  ItemList,
  ItemListColumn,
  ItemListSpaceBetween,
  ItemListTextDescription,
  ItemListTextTitle,
  ItemListTitleSpace,
  SectionDivider,
  SectionDividerText,
  StyledFeatherButtonLeftIcon,
  StyledFeatherButtonLeftOverlay,
  StyledFeatherButtonText,
  StyledFeatherButtonWrapper,
  StyledStorageTypeIcon,
  StyledZipIcon,
} from "./styles";

export default function Backup() {
  const { t } = useTranslation();
  const { setActualTheme } = useThemeContext();
  const storageTypeLabel = getStorageTypeLabel();

  const applyRestoredTheme = async () => {
    if (!setActualTheme) {
      return;
    }

    const configs = await carregarConfiguracoes();
    if (!configs || Array.isArray(configs)) {
      setActualTheme(themes.azulEscuroDefault);
      return;
    }

    if (configs.darkMode) {
      setActualTheme(themes.darkMode);
      return;
    }

    const themeKey = configs.actualTheme as ThemeColors;
    setActualTheme(themes[themeKey] ?? themes.azulEscuroDefault);
  };

  const handleRestoreBackup = async () => {
    const restored = await restoreManualBackup();
    if (restored) {
      await applyRestoredTheme();
    }
  };
  return (
    <Container>
      {/* <SectionDivider>
        <SectionDividerIconWrapper>
          <StyledIconGoogleDrive />
        </SectionDividerIconWrapper>
        <SectionDividerText>Backup no Google Drive</SectionDividerText>
      </SectionDivider>

      <ItemList>
        <ItemListSpaceBetween>
          <TouchableOpacity activeOpacity={0.8} onPress={() => console.log("Restaurar Drive")}>
            <StyledFeatherButtonWrapper bgColor="#C16C21" marginBottom="0px">
              <StyledFeatherButtonLeftOverlay>
                <StyledFeatherButtonLeftIcon name="download-cloud"/>
              </StyledFeatherButtonLeftOverlay>
              <StyledFeatherButtonText>Restaurar</StyledFeatherButtonText>
            </StyledFeatherButtonWrapper>
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.8} onPress={() => console.log("Fazer backup Drive")}>
            <StyledFeatherButtonWrapper bgColor="#B48D17" marginBottom="0px">
              <StyledFeatherButtonLeftOverlay>
                <StyledFeatherButtonLeftIcon name="upload-cloud"/>
              </StyledFeatherButtonLeftOverlay>
              <StyledFeatherButtonText>Fazer backup</StyledFeatherButtonText>
            </StyledFeatherButtonWrapper>
          </TouchableOpacity>
        </ItemListSpaceBetween>
      </ItemList>

      <ItemList>
        <ItemListSpaceBetween>
          <ItemListTitleSpace>
            <ItemListTextTitleCentered>
              Último backup no Google Drive:
            </ItemListTextTitleCentered>
            <ItemListTextDescriptionCentered>
              19 de novembro de 2020, às 10:35:58
            </ItemListTextDescriptionCentered>
          </ItemListTitleSpace>
        </ItemListSpaceBetween>
      </ItemList>

      <SectionDivider>
        <SectionDividerText>Configurações Google Drive</SectionDividerText>
      </SectionDivider>

      <ItemList>
        <ItemListSpaceBetween>
          <ItemListTitleSpace>
            <ItemListTextTitle>
              Cópia de segurança automática?
            </ItemListTextTitle>
            <ItemListTextDescription>
            Cria uma cópia de segurança no seu Google Drive automaticamente após cada sessão de serviço iniciado e finalizado pelo cronômetro.
            </ItemListTextDescription>
          </ItemListTitleSpace>

          <Switch
            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            trackColor={{ false: "#767577", true: "#94EB8C" }}
            thumbColor={isAutomaticBackupCopy ? "#42B240" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(t) => setIsAutomaticBackupCopy((t) => !t)}
            value={isAutomaticBackupCopy}
          />
        </ItemListSpaceBetween>
      </ItemList>

      <ItemList>
        <ItemListSpaceBetween>
          <ItemListTitleSpace>
            <ItemListTextTitle>Conectar ao Google Drive</ItemListTextTitle>
            <ItemListTextDescription>
              Entre na sua conta do Google Drive e começe a sincronizar seus
              backups.
            </ItemListTextDescription>
          </ItemListTitleSpace>
        </ItemListSpaceBetween>
      </ItemList> */}

      <SectionDivider>
        <SectionDividerText adjustsFontSizeToFit numberOfLines={1}>
          {t("screens.backup.manual_backup")}
        </SectionDividerText>
        <StyledZipIcon allowFontScaling={false}>.zip</StyledZipIcon>
        <StyledStorageTypeIcon allowFontScaling={false}>
          {storageTypeLabel}
        </StyledStorageTypeIcon>
      </SectionDivider>

      <ItemListColumn>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ width: "100%" }}
          onPress={() => generateManualBackup()}
        >
          <StyledFeatherButtonWrapper bgColor="#2186B1" marginBottom="10px">
            <StyledFeatherButtonLeftOverlay>
              <StyledFeatherButtonLeftIcon name="package" />
            </StyledFeatherButtonLeftOverlay>
            <StyledFeatherButtonText adjustsFontSizeToFit>
              {t("screens.backup.generate_backup")} .zip
            </StyledFeatherButtonText>
          </StyledFeatherButtonWrapper>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{ width: "100%" }}
          onPress={handleRestoreBackup}
        >
          <StyledFeatherButtonWrapper bgColor="#195734" marginBottom="0px">
            <StyledFeatherButtonLeftOverlay>
              <StyledFeatherButtonLeftIcon name="arrow-down-circle" />
            </StyledFeatherButtonLeftOverlay>
            <StyledFeatherButtonText adjustsFontSizeToFit>
              {t("screens.backup.restore_backup")} .zip
            </StyledFeatherButtonText>
          </StyledFeatherButtonWrapper>
        </TouchableOpacity>
      </ItemListColumn>

      <ItemList>
        <ItemListSpaceBetween>
          <ItemListTitleSpace>
            <ItemListTextTitle>
              {t("screens.backup.how_manual_backup_works")}
            </ItemListTextTitle>
            <ItemListTextDescription>
              {t("screens.backup.how_manual_backup_works_description")}
            </ItemListTextDescription>
          </ItemListTitleSpace>
        </ItemListSpaceBetween>
      </ItemList>
    </Container>
  );
}
