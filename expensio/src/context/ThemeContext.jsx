import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const THEME = {
  dark: {
    bg: "#1a1a1a", // dark grey page background
    bgDeep: "#131313", // slightly darker
    cardBg: "#2d2d2d", // medium grey cards — like Google Keep
    cardBorder: "#3a3a3a", // subtle border
    accent: "#ffffff", // white accent
    accentHover: "#e0e0e0",
    highlight: "#ff5555", // red for delete/alert
    magenta: "#ff5555",
    almond: "#aaaaaa",
    textPrimary: "#ffffff", // pure white text
    textMuted: "#aaaaaa", // grey muted text
    textSubtle: "#666666", // very muted
    barTrack: "#444444", // track for progress bar
    inputBg: "#2d2d2d", // same as card
    navBg: "#1f1f1f", // slightly lighter than deepest black
    navBorder: "#333333",
    monthCardBg: "#2d2d2d", // grey cards like Google Keep
    monthCardText: "#ffffff", // white text
    monthCardBorder: "#3a3a3a", // subtle border
    monthCardMuted: "#888888", // muted grey
  },
  light: {
    bg: "#ffffff",
    bgDeep: "#f5f5f5",
    cardBg: "#ffffff",
    cardBorder: "#e8e8e8",
    accent: "#000000",
    accentHover: "#222222",
    highlight: "#ff4444",
    magenta: "#ff4444",
    almond: "#555555",
    textPrimary: "#000000",
    textMuted: "#555555",
    textSubtle: "#aaaaaa",
    barTrack: "#f0f0f0",
    inputBg: "#ffffff",
    navBg: "#000000", // ← black navbar in light mode
    navBorder: "#000000",
    monthCardBg: "#ffffff",
    monthCardText: "#000000",
    monthCardBorder: "#e0e0e0",
    monthCardMuted: "#888888",
  },
};

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("expensioTheme");
    return saved ? saved === "dark" : true;
  });

  const theme = dark ? THEME.dark : THEME.light;

  useEffect(() => {
    localStorage.setItem("expensioTheme", dark ? "dark" : "light");
    document.body.style.background = theme.bg;
    document.body.style.color = theme.textPrimary;
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{ dark, toggle: () => setDark((d) => !d), theme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
