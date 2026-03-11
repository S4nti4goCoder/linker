import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useMensajesStore = create((set) => ({
  // ── Estado ──────────────────────────────────────
  conversacionActiva: null,
  setConversacionActiva: (conv) => set({ conversacionActiva: conv }),

  // ── Conversaciones ───────────────────────────────
  obtenerOCrearConversacion: async ({ id_usuario_a, id_usuario_b }) => {
    const { data, error } = await supabase.rpc("obtener_o_crear_conversacion", {
      p_usuario_a: id_usuario_a,
      p_usuario_b: id_usuario_b,
    });
    if (error) throw new Error(error.message);
    return data; // uuid de la conversación
  },

  listarConversaciones: async (id_usuario) => {
    const { data, error } = await supabase.rpc("mis_conversaciones", {
      p_id_usuario: id_usuario,
    });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  // ── Mensajes ─────────────────────────────────────
  obtenerMensajes: async (id_conversacion) => {
    const { data, error } = await supabase
      .from("mensajes")
      .select("*")
      .eq("id_conversacion", id_conversacion)
      .order("fecha", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  enviarMensaje: async ({ id_conversacion, id_emisor, contenido }) => {
    const { error } = await supabase.from("mensajes").insert({
      id_conversacion,
      id_emisor,
      contenido: contenido.trim(),
    });
    if (error) throw new Error(error.message);
  },

  marcarMensajesLeidos: async ({ id_conversacion, id_receptor }) => {
    await supabase
      .from("mensajes")
      .update({ leido: true })
      .eq("id_conversacion", id_conversacion)
      .neq("id_emisor", id_receptor)
      .eq("leido", false);
  },
}));