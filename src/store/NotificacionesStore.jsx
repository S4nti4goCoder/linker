import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useNotificacionesStore = create((set) => ({
  notificaciones: [],
  noLeidas: 0,

  obtenerNotificaciones: async (id_usuario) => {
    const { data, error } = await supabase
      .from("notificaciones")
      .select(`*, origen:id_usuario_origen(nombre, foto_perfil)`)
      .eq("id_usuario_destino", id_usuario)
      .order("fecha", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    const noLeidas = data.filter((n) => !n.leida).length;
    set({ notificaciones: data, noLeidas });
    return data;
  },

  marcarTodasLeidas: async (id_usuario) => {
    await supabase
      .from("notificaciones")
      .update({ leida: true })
      .eq("id_usuario_destino", id_usuario)
      .eq("leida", false);
    set((state) => ({
      notificaciones: state.notificaciones.map((n) => ({ ...n, leida: true })),
      noLeidas: 0,
    }));
  },

  agregarNotificacion: (notif) =>
    set((state) => ({
      notificaciones: [notif, ...state.notificaciones],
      noLeidas: state.noLeidas + 1,
    })),
}));