import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  file: [],
  setFile: (p) => set({ file: p }),
  fileUrl: "-",
  setFileUrl: (p) => set({ fileUrl: p }),
}));
