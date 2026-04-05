import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useAuthStore = create((set) => ({
  credenciales: null,
  setCredenciales: (p) => set({ credenciales: p }),

  // LOGIN con email/password existente
  iniciarSesion: async (p) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.email,
      password: p.password,
    });
    if (error) throw new Error(error.message);
    return data.user;
  },

  // REGISTRO nueva cuenta
  crearCuenta: async (p) => {
    const { data, error } = await supabase.auth.signUp({
      email: p.email,
      password: p.password,
    });
    if (error) throw new Error(error.message);
    return data.user;
  },

  // RESET PASSWORD por email
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    });
    if (error) throw new Error(error.message);
  },

  loginConGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw new Error(error.message);
  },

  cerrarSesion: async () => {
    await supabase.auth.signOut();
  },
}));

export const useSubcription = create((set) => {
  const store = { user: null, loading: true };

  supabase.auth.getSession().then(({ data: { session } }) => {
    set({ user: session?.user ?? null, loading: false });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    set({ user: session?.user ?? null, loading: false });
  });

  return store;
});
