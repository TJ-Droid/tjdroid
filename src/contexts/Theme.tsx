import React, { createContext, useContext, useState } from "react";
import themes from "../themes";
import { ThemeType } from "../types/Theme";

type ThemeContextType = {
  actualTheme?: ThemeType;
  setActualTheme?: (theme: ThemeType) => void;
  children?: React.ReactNode;
};

const ThemeContext = createContext<ThemeContextType>({
  actualTheme: themes.azulEscuroDefault,
  setActualTheme: () => {},
});

const ThemeContextProvider: React.FC<ThemeContextType> = ({ children }) => {
  const [actualTheme, setActualTheme] = useState<ThemeType>();

  return (
    <ThemeContext.Provider value={{ actualTheme, setActualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

export function useThemeContext() {
  return useContext(ThemeContext);
}
