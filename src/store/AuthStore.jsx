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
}));

export const useSubscription = create((set) => {
  const store = {
    user: null,
    setUser: (user) => set({ user }),
  };
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      set({ user: session.user });
    }
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      set({ user: session.user });
    } else {
      set({ user: null });
    }
  });
  return store;
});
