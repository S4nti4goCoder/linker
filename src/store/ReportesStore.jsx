import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useReportesStore = create(() => ({
  reportarPublicacion: async ({ id_publicacion, id_usuario, motivo }) => {
    const { error } = await supabase.from("reportes").insert({
      id_publicacion,
      id_usuario,
      motivo,
    });
    if (error) throw new Error(error.message);
  },
}));
