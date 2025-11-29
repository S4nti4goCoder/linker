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
    if (error) {
      throw new Error(error.message);
    }
  },
  mostrarComentarios: async (p) => {
    const { data, error } = await supabase.rpc("comentarios_con_respuestas", p);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
}));
