import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useColeccionesStore = create(() => ({
  toggleGuardado: async ({ id_usuario, id_post }) => {
    const { data, error } = await supabase.rpc("toggle_guardado", {
      p_id_usuario: id_usuario,
      p_id_post: id_post,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  verificarGuardado: async ({ id_usuario, id_post }) => {
    const { data, error } = await supabase.rpc("post_guardado_por_usuario", {
      p_id_usuario: id_usuario,
      p_id_post: id_post,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  listarGuardados: async (id_usuario) => {
    const { data, error } = await supabase.rpc("publicaciones_guardadas", {
      _id_usuario: id_usuario,
    });
    if (error) throw new Error(error.message);
    return data ?? [];
  },
}));
