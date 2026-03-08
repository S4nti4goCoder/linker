import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

const tabla = "comentarios";

export const useComentariosStore = create((set) => ({
  showModal: false,
  setShowModal: () => set((state) => ({ showModal: !state.showModal })),
  itemSelect: null,
  setItemSelect: (p) => {
    set({ itemSelect: p });
  },
  insertarComentario: async (p) => {
    const { error } = await supabase.from(tabla).insert(p);
    if (error) throw new Error(error.message);
  },
  mostrarComentarios: async (p) => {
    const { data, error } = await supabase.rpc("comentarios_con_respuestas", p);
    if (error) throw new Error(error.message);
    return data;
  },
  // ✅ NUEVO
  toggleLikeComentario: async ({ id_comentario, id_usuario }) => {
    const { error } = await supabase.rpc("toggle_like_comentario", {
      p_comentario_id: id_comentario,
      p_user_id: id_usuario,
    });
    if (error) throw new Error(error.message);
  },
  obtenerLikesComentario: async ({ id_comentario, id_usuario }) => {
    const { count, error: countError } = await supabase
      .from("likes_comentarios")
      .select("*", { count: "exact", head: true })
      .eq("id_comentario", id_comentario);
    if (countError) throw new Error(countError.message);

    const { data, error: likedError } = await supabase
      .from("likes_comentarios")
      .select("id")
      .eq("id_comentario", id_comentario)
      .eq("id_usuario", id_usuario)
      .maybeSingle();
    if (likedError) throw new Error(likedError.message);

    return { count, liked: !!data };
  },
}));