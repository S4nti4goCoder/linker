import { create } from "zustand";

export const usePostStore = create((set) => ({
  file: null,
  setFile: (p) => set({ file: p }),
  stateImage: false,
  setStateImage: () => {
    set((state) => ({ stateImage: !state.stateImage }));
  },
  stateForm: false,
  setStateForm: () => {
    set((state) => ({ stateForm: !state.stateForm }));
  },
}));
