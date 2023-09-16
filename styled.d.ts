import "styled-components/native";
import { ThemeType } from "./src/types/Theme";

declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeType {}
}
