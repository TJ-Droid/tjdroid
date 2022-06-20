import 'styled-components';
import { ThemeType } from './src/types/Theme';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}