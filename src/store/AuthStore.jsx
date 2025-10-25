import { create } from "zustand";

export const useAuthStore = create((set) => ({
  credenciales: null,
  setCredenciales: (p) => set({ credenciales: p }),
  crearUserYLogin: async (p) => {
    const { data } = await supabase.auth.signUp({
      email: "",
      password: "",
    });
  },
}));
