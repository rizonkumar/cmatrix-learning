import { useEffect } from 'react';
import useThemeStore from '../store/themeStore';

const useTheme = () => {
  const { theme, setTheme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      const parsedTheme = JSON.parse(savedTheme);
      if (parsedTheme.state?.theme) {
        setTheme(parsedTheme.state.theme);
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [setTheme]);

  return {
    theme,
    toggleTheme: useThemeStore.getState().toggleTheme,
    isDark: theme === 'dark'
  };
};

export default useTheme;
