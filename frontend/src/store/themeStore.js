import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",

      // Actions
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        console.log(`Toggling theme from ${currentTheme} to ${newTheme}`);
        set({ theme: newTheme });

        // Apply theme to document
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
          console.log("Dark mode applied, dark class added to document");
        } else {
          document.documentElement.classList.remove("dark");
          console.log("Light mode applied, dark class removed from document");
        }
      },

      setTheme: (theme) => {
        set({ theme });
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
          console.log("Dark mode applied, dark class added to document");
        } else {
          document.documentElement.classList.remove("dark");
          console.log("Light mode applied, dark class removed from document");
        }
      },

      // Getters
      getTheme: () => get().theme,
      isDark: () => get().theme === "dark",
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useThemeStore;
