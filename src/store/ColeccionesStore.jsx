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
    const { data: guardados, error: errorGuardados } = await supabase
      .from("guardados")
      .select("id_post")
      .eq("id_usuario", id_usuario)
      .order("fecha", { ascending: false });

    if (errorGuardados) throw new Error(errorGuardados.message);
    if (!guardados || guardados.length === 0) return [];

    const idsPost = guardados.map((g) => g.id_post);

    const { data: posts, error: errorPosts } = await supabase.rpc(
      "publicaciones_con_detalles",
      {
        _id_usuario: id_usuario,
        _id_autor: null,
      },
    );
    if (errorPosts) throw new Error(errorPosts.message);

    const postMap = new Map((posts ?? []).map((p) => [p.id, p]));
    return idsPost.map((id) => postMap.get(id)).filter(Boolean);
  },
}));
