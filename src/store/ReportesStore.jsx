import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
import { CREATOR_ID } from "../utils/creator";

const MAX_STRIKES = 3;

const MENSAJES_STRIKE = {
  1: "Tu publicación fue eliminada por infringir las normas de la comunidad. Este es tu primer aviso (1/3).",
  2: "Tu publicación fue eliminada nuevamente. Este es tu segundo aviso (2/3). Un aviso más y tu cuenta será suspendida.",
  3: "Tu cuenta ha sido suspendida por infracciones repetidas a las normas de la comunidad.",
};

export const useReportesStore = create(() => ({
  reportarPublicacion: async ({ id_publicacion, id_usuario, motivo }) => {
    const { error } = await supabase.from("reportes").insert({
      id_publicacion,
      id_usuario,
      motivo,
    });
    if (error) throw new Error(error.message);
  },

  obtenerReportesPendientes: async () => {
    const { data, error } = await supabase
      .from("reportes")
      .select("*, publicaciones(id, descripcion, url, type, id_usuario, usuarios(nombre, foto_perfil, strikes)), usuarios!reportes_id_usuario_fkey(nombre)")
      .eq("revisado", false)
      .order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  marcarRevisado: async (id) => {
    const { error } = await supabase
      .from("reportes")
      .update({ revisado: true })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  obtenerUsuariosBaneados: async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, foto_perfil, strikes, baneado")
      .eq("baneado", true)
      .order("nombre");
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  desbanearUsuario: async (id) => {
    const { error } = await supabase
      .from("usuarios")
      .update({ baneado: false, strikes: 0 })
      .eq("id", id);
    if (error) throw new Error(error.message);

    await supabase.from("admin_log").insert({
      id_usuario: id,
      accion: "desbaneo",
      detalle: "Usuario desbaneado y strikes reseteados a 0",
    });
  },

  banearUsuario: async (id) => {
    const { error } = await supabase
      .from("usuarios")
      .update({ baneado: true, strikes: 3 })
      .eq("id", id);
    if (error) throw new Error(error.message);

    await supabase.from("notificaciones").insert({
      id_usuario_destino: id,
      id_usuario_origen: CREATOR_ID,
      tipo: "advertencia",
      mensaje: "Tu cuenta ha sido suspendida por el administrador por infringir las normas de la comunidad.",
    });

    await supabase.from("admin_log").insert({
      id_usuario: id,
      accion: "baneo_manual",
      detalle: "Usuario baneado manualmente por el administrador",
    });
  },

  // ── Apelaciones ──────────────────────────────────
  enviarApelacion: async ({ id_usuario, motivo }) => {
    const { error } = await supabase.from("apelaciones").insert({
      id_usuario,
      motivo,
    });
    if (error) {
      if (error.code === "23505") throw new Error("Ya tienes una apelación pendiente");
      throw new Error(error.message);
    }
  },

  obtenerMiApelacion: async (id_usuario) => {
    const { data, error } = await supabase
      .from("apelaciones")
      .select("*")
      .eq("id_usuario", id_usuario)
      .order("fecha", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },

  obtenerApelacionesPendientes: async () => {
    const { data, error } = await supabase
      .from("apelaciones")
      .select("*, usuarios(id, nombre, foto_perfil, strikes)")
      .eq("estado", "pendiente")
      .order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  resolverApelacion: async ({ id, estado, respuesta_admin, id_usuario }) => {
    const { error } = await supabase
      .from("apelaciones")
      .update({ estado, respuesta_admin })
      .eq("id", id);
    if (error) throw new Error(error.message);

    if (estado === "aceptada") {
      await supabase
        .from("usuarios")
        .update({ baneado: false, strikes: 0 })
        .eq("id", id_usuario);
    }

    await supabase.from("admin_log").insert({
      id_usuario,
      accion: estado === "aceptada" ? "apelacion_aceptada" : "apelacion_rechazada",
      detalle: estado === "aceptada"
        ? `Apelación aceptada — usuario desbaneado${respuesta_admin ? `. Respuesta: ${respuesta_admin}` : ""}`
        : `Apelación rechazada — ban definitivo. Respuesta: ${respuesta_admin || "Sin respuesta"}`,
    });

    // Notificar al usuario
    const mensaje = estado === "aceptada"
      ? "Tu apelación fue aceptada. Tu cuenta ha sido restaurada. Por favor, respeta las normas de la comunidad."
      : `Tu apelación fue rechazada. ${respuesta_admin || "El ban es definitivo."}`;

    await supabase.from("notificaciones").insert({
      id_usuario_destino: id_usuario,
      id_usuario_origen: CREATOR_ID,
      tipo: "advertencia",
      mensaje,
    });
  },

  obtenerUsoStorage: async () => {
    const carpetas = ["publicaciones", "usuarios", "banners"];
    let totalBytes = 0;
    let totalArchivos = 0;
    const detalle = {};

    for (const carpeta of carpetas) {
      const { data } = await supabase.storage.from("archivos").list(carpeta, { limit: 1000 });
      const archivos = data?.filter((f) => f.name !== ".emptyFolderPlaceholder") ?? [];
      const bytes = archivos.reduce((sum, f) => sum + (f.metadata?.size ?? 0), 0);
      detalle[carpeta] = { archivos: archivos.length, bytes };
      totalBytes += bytes;
      totalArchivos += archivos.length;
    }

    return { totalBytes, totalArchivos, detalle };
  },

  obtenerAdminLog: async () => {
    const { data, error } = await supabase
      .from("admin_log")
      .select("*, usuarios(nombre, foto_perfil)")
      .order("fecha", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  buscarUsuarioAdmin: async (query) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, foto_perfil, strikes, baneado")
      .neq("id", 1)
      .ilike("nombre", `%${query}%`)
      .order("nombre")
      .limit(10);
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  eliminarPublicacionReportada: async ({ id_reporte, id_publicacion, id_autor, motivo }) => {
    // 1. Obtener strikes actuales del autor y URL del archivo
    const [{ data: usuario, error: e1 }, { data: post }] = await Promise.all([
      supabase.from("usuarios").select("strikes").eq("id", id_autor).maybeSingle(),
      supabase.from("publicaciones").select("url").eq("id", id_publicacion).maybeSingle(),
    ]);
    if (e1) throw new Error("Error al obtener usuario: " + e1.message);

    const nuevoStrikes = (usuario?.strikes ?? 0) + 1;

    // 2. Eliminar la publicación
    const { error: e2 } = await supabase.from("publicaciones").delete().eq("id", id_publicacion);
    if (e2) throw new Error("Error al eliminar publicación: " + e2.message);

    // 2.1 Eliminar archivo del storage
    if (post?.url && post.url !== "-") {
      const ruta = post.url.split("/archivos/")[1];
      if (ruta) await supabase.storage.from("archivos").remove([ruta]);
    }

    // 3. Marcar reporte como revisado
    const { error: e3 } = await supabase.from("reportes").update({ revisado: true }).eq("id", id_reporte);
    if (e3) throw new Error("Error al marcar reporte: " + e3.message);

    // 4. Sumar strike al usuario
    const { error: e4 } = await supabase
      .from("usuarios")
      .update({
        strikes: nuevoStrikes,
        ...(nuevoStrikes >= MAX_STRIKES ? { baneado: true } : {}),
      })
      .eq("id", id_autor);
    if (e4) throw new Error("Error al actualizar strikes: " + e4.message);

    // 5. Enviar notificación al autor
    const mensaje = MENSAJES_STRIKE[Math.min(nuevoStrikes, MAX_STRIKES)];
    const { error: e5 } = await supabase.from("notificaciones").insert({
      id_usuario_destino: id_autor,
      id_usuario_origen: CREATOR_ID,
      tipo: "advertencia",
      mensaje: `${mensaje} Motivo: ${motivo}`,
    });
    if (e5) throw new Error("Error al enviar notificación: " + e5.message);

    // 6. Registrar en log
    const baneado = nuevoStrikes >= MAX_STRIKES;
    await supabase.from("admin_log").insert({
      id_usuario: id_autor,
      accion: baneado ? "strike_y_baneo" : "strike",
      detalle: `Strike ${nuevoStrikes}/3. Motivo: ${motivo}${baneado ? " — Usuario baneado automáticamente" : ""}`,
    });

    return { strikes: nuevoStrikes, baneado };
  },
}));
