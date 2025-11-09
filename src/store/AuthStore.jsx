import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useAuthStore = create((set) => ({
  credenciales: null,
  setCredenciales: (p) => set({ credenciales: p }),
  crearUserYLogin: async (p) => {
    const { data } = await supabase.auth.signUp({
      email: p.email,
      password: p.password,
    });
    return data.user;
  },
  cerrarSesion: async () => {
    await supabase.auth.signOut();
  }
}));

export const useSubcription = create((set) => {
  const store = {
    user: null,
  };
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      set({ user: session.user });
      console.log("user", session.user);
    }
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      set({ user: session.user });
    } else {
      set({ user: null });
      console.log("user", session.user);
    }
  });
  return store;
});
