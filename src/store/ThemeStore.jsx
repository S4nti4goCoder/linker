import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      setTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          // Solo actualiza el estado, App.jsx se encarga del DOM
          return { theme: newTheme };
        }),
    }),
    {
      name: "theme-storage-linker",
    },
  ),
);
