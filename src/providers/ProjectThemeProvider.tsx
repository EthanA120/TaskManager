import { createContext, useCallback, useState, useMemo, type ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface ThemeContextType {
  isDark: boolean;
  toggleMode: () => void;
}

const ProjectThemeContext = createContext<null | ThemeContextType>(null);

const lightPalette = {
  mode: "light" as const,
  primary: {
    main: "#1976d2", // Indigo 600
    glow: "#3896f4", // Indigo 400
  },
  secondary: {
    main: "#4c97d3", // Teal 500
  },
  background: {
    default: "#f8fafc", // Slate 50
    paper: "#ffffff",
  },
  text: {
    primary: "#1e293b", // Slate 800
    secondary: "#64748b", // Slate 500
  },
};

const darkPalette = {
  mode: "dark" as const,
  primary: {
    main: "#7a5db7", // Indigo 400
    glow: "#b99ff2", // Indigo 400
  },
  secondary: {
    main: "#ce93d8", // Teal 400
  },
  background: {
    default: "#0f172a", // Slate 900
    paper: "#1e293b", // Slate 800
  },
  text: {
    primary: "#e2e8f0", // Slate 200
    secondary: "#b5bac1", // Slate 400
  },
};

function ProjectThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const theme = useMemo(() =>
    createTheme({ palette: isDark ? darkPalette : lightPalette }),
  [isDark]);

  const toggleMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);
  return (
    <ProjectThemeContext.Provider value={{ isDark, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ProjectThemeContext.Provider>
  );
}

export { ProjectThemeProvider, ProjectThemeContext, type ThemeContextType };
