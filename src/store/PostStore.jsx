import { create } from "zustand";

export const usePostStore = create((set) => ({
  file: null,
  setFile: (p) => set({ file: p }),
}));
