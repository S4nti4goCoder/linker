import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useColeccionesStore = create(() => ({
  // Toggle guardar/desguardar un post
  toggleGuardado: async ({ id_usuario, id_post }) => {
    const { data, error } = await supabase.rpc("toggle_guardado", {
      p_id_usuario: id_usuario,
      p_id_post: id_post,
    });
    if (error) throw new Error(error.message);
    return data; // true = guardado, false = desguardado
  },

  // Verificar si un post está guardado
  verificarGuardado: async ({ id_usuario, id_post }) => {
    const { data, error } = await supabase.rpc("post_guardado_por_usuario", {
      p_id_usuario: id_usuario,
      p_id_post: id_post,
    });
    if (error) throw new Error(error.message);
    return data; // boolean
  },

  // Listar todos los posts guardados del usuario
  listarGuardados: async (id_usuario) => {
    const { data, error } = await supabase
      .from("guardados")
      .select(
        `
        id,
        fecha,
        publicaciones (
          id,
          descripcion,
          url,
          type,
          fecha,
          likes,
          id_usuario,
          usuarios (
            id,
            nombre,
            foto_perfil
          )
        )
      `,
      )
      .eq("id_usuario", id_usuario)
      .order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },
}));
