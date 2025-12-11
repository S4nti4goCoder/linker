import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

const tabla = "respuestas_comentarios";

export const useRespuestasComentariosStore = create((set) => ({
  respuesta: "",
  setRespuesta: (p) => set({ respuesta: p }),
  respuestaActivaParaComentarioId: null,
  setRespuestaActiva: (p) => set({ respuestaActivaParaComentarioId: p }),
  limpiarRespuestaActiva: () => set({ respuestaActivaParaComentarioId: null }),
  insertarRespuestaComentarios: async (p) => {
    const { error } = await supabase.from(tabla).insert(p);
    if (error) throw new Error(error.message);
  },
  dataRespuestaComentario: null,
  mostrarRespuestaAComentario: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select(`*,usuarios(*)`)
      .eq("id_comentario", p.id_comentario);
    if (error) {
      throw new Error(error.message);
    }
    set({ dataRespuestaComentario: data });
    return data;
  },
}));
