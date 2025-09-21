import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Actions
      login: (userData) => {
        if (userData.accessToken) {
          localStorage.setItem("accessToken", userData.accessToken);
        }
        if (userData.refreshToken) {
          localStorage.setItem("refreshToken", userData.refreshToken);
        }

        set({
          user: userData.user || userData,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      updateTokens: (tokens) => {
        if (tokens.accessToken) {
          localStorage.setItem("accessToken", tokens.accessToken);
        }
        if (tokens.refreshToken) {
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }

        set((state) => ({
          accessToken: tokens.accessToken || state.accessToken,
          refreshToken: tokens.refreshToken || state.refreshToken,
        }));
      },

      // Getters
      getUser: () => get().user,
      getToken: () => get().accessToken,
      getRefreshToken: () => get().refreshToken,
      isLoggedIn: () => get().isAuthenticated,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
