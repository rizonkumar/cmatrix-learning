import { useEffect } from "react";
import useThemeStore from "../store/themeStore";

const useTheme = () => {
  const { theme, setTheme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    console.log("useTheme hook initialized");
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme-storage");
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        if (parsedTheme.state?.theme) {
          console.log("Loading saved theme:", parsedTheme.state.theme);
          setTheme(parsedTheme.state.theme);
        }
      } catch (error) {
        console.error("Error parsing saved theme:", error);
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      console.log(
        "No saved theme, using system preference:",
        prefersDark ? "dark" : "light"
      );
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [setTheme]);

  return {
    theme,
    toggleTheme: useThemeStore.getState().toggleTheme,
    isDark: theme === "dark",
  };
};

export default useTheme;
