import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME = {
  dark: {
    bg:           '#2a3040',
    bgDeep:       '#1e2535',
    cardBg:       '#373F51',
    cardBorder:   '#4a5568',
    accent:       '#008DD5',
    accentHover:  '#0077b5',
    highlight:    '#F56476',
    magenta:      '#E43F6F',
    almond:       '#DFBBB1',
    textPrimary:  '#f0ede8',
    textMuted:    '#9aa5b4',
    textSubtle:   '#5a6478',
    barTrack:     '#2a3040',
    inputBg:      '#2a3040',
  },
  light: {
    bg:           '#f5f0ee',
    bgDeep:       '#ede8e5',
    cardBg:       '#ffffff',
    cardBorder:   '#e8ddd8',
    accent:       '#008DD5',
    accentHover:  '#0077b5',
    highlight:    '#F56476',
    magenta:      '#E43F6F',
    almond:       '#DFBBB1',
    textPrimary:  '#1e2535',
    textMuted:    '#6b7280',
    textSubtle:   '#b0aaa6',
    barTrack:     '#ede8e5',
    inputBg:      '#ffffff',
  }
};

const ThemeContext2 = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('expensioTheme');
    return saved ? saved === 'dark' : true;
  });

  const theme = dark ? THEME.dark : THEME.light;

  useEffect(() => {
    localStorage.setItem('expensioTheme', dark ? 'dark' : 'light');
    document.body.style.background = theme.bg;
    document.body.style.color = theme.textPrimary;
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d), theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}