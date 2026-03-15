import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME = {
  dark: {
    bg:           '#0a0a0a',
    bgDeep:       '#000000',
    cardBg:       '#111111',
    cardBorder:   '#2a2a2a',
    accent:       '#ffffff',
    accentHover:  '#e0e0e0',
    highlight:    '#ff4d4d',
    magenta:      '#ff4d4d',
    almond:       '#cccccc',
    textPrimary:  '#ffffff',
    textMuted:    '#aaaaaa',
    textSubtle:   '#555555',
    barTrack:     '#1a1a1a',
    inputBg:      '#1a1a1a',
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
    textMuted:    '#4a5568',
    textSubtle:   '#718096',
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