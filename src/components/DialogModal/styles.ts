import Dialog from "react-native-dialog";
import styled from "styled-components/native";

export const StyledDialogContainer = styled(Dialog.Container).attrs(
  ({ theme, contentStyle }) => ({
    contentStyle: [
      {
        backgroundColor: `${theme.color.dialog_modal_bg}`,
        borderWidth: 1,
        borderColor: `${theme.color.primary}40`,
      },
      contentStyle,
    ],
  })
)``;

export const StyledDialogTitle = styled(Dialog.Title)`
  font-size: 22px;
  color: ${({ theme }) => theme.color.primary_dark};
  font-weight: bold;
`;

export const StyledDialogInput1 = styled(Dialog.Input).attrs(({ theme }) => ({
  wrapperStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingTop: 6,
    lineHeight: 30,
    borderColor: `${theme.color.text_secondary}40`,
  },
  paddingTop: 6,
}))`
  color: ${({ theme }) => theme.color.text_primary};
  font-size: 18px;
`;

export const StyledDialogInput2 = styled(Dialog.Input).attrs(({ theme }) => ({
  wrapperStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingTop: 6,
    lineHeight: 30,
    borderColor: `${theme.color.text_secondary}40`,
    flex: 1,
  },
  paddingTop: 6,
}))`
  color: ${({ theme }) => theme.color.text_primary};
  font-size: 18px;
`;

export const StyledDialogInput3 = styled(Dialog.Input).attrs(({ theme }) => ({
  wrapperStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingTop: 6,
    lineHeight: 30,
    borderColor: `${theme.color.text_secondary}40`,
    flex: 1,
  },
  paddingTop: 6,
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
