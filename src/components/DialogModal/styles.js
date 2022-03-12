import styled from "styled-components/native";
import Dialog from "react-native-dialog";

export const StyledDialogContainer = styled(Dialog.Container).attrs(({ theme }) => ({
  contentStyle: {
    backgroundColor: `${theme.color.dialog_modal_bg}`,
    borderWidth: 1,
    borderColor: `${theme.color.primary}40`,
  },
}))``;

export const StyledDialogTitle = styled(Dialog.Title)`
  font-size: 22px;
  color: ${({ theme }) => theme.color.primary_dark};
  font-weight: bold;
`;

export const StyledDialogInput = styled(Dialog.Input).attrs(({ theme }) => ({
  wrapperStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderColor: `${theme.color.text_secondary}40`,
  },
}))`
  color: ${({ theme }) => theme.color.text_primary};
  font-size: 18px;
`;

export const StyledDialogDescription = styled(Dialog.Description)`
  color: ${({ theme }) => theme.color.text_secondary}70;
  font-size: 18px;
`;

export const StyledDialogDescriptionErrorMessage = styled(Dialog.Description)`
  color: ${({ theme }) => theme.color.red}90;
`;

export const StyledDialogButtonCancel = styled(Dialog.Button)`
  font-size: 15px;
  border-radius: 4px;
  color: ${({ theme }) => theme.color.primary_dark};
  background-color: ${({ theme }) => theme.color.primary_dark}30;
  margin-right: 10px;
`;

export const StyledDialogButtonOk = styled(Dialog.Button)`
  font-size: 15px;
  border-radius: 4px;
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.primary_dark};
  margin-right: 10px;
`;

export const TextsContainer = styled.View`
  margin: -20px 10px 10px 10px;
`;

export const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
