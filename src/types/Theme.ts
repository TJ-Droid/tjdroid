import themes from "../themes";

// Get lists of themes available
export type ThemeColors = keyof typeof themes;

export type ThemeType = {
  statusbar_style: string;
  color: ThemeColorsAtributesType;
};

export type ThemeColorsAtributesType = {
  primary: string;
  primary_dark: string;
  primary_soft: string;

  bg: string;
  text: string;

  red: string;
  text_primary: string;
  text_secondary: string;
  white: string;

  black_translucent10: string;
  grey_translucent80: string;
  red_translucent40: string;

  statusbar_bg: string;
  header_bg: string;
  header_text: string;
  header_buttons_red: string;
  contador_stop_button: string;
  bg_list_divider: string;
  text_list_divider: string;
  home_button_bg: string;
  help_selected_bg: string;
  dialog_modal_bg: string;
};

export type ThemeConfiguracoesScreenType = {
  actualTheme: ThemeColors;
  darkMode: boolean;
};
