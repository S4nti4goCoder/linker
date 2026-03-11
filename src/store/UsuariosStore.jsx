import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

const tabla = "usuarios";

const subirOReemplazarFotoPerfil = async (id, file) => {
  const ext = file.name?.split(".").pop()?.toLowerCase() || "jpg";
  const ruta = `usuarios/${id}.${ext}`;
  const { error } = await supabase.storage
    .from("archivos")
    .upload(ruta, file, { cacheControl: "0", upsert: true });
  if (error) throw new Error(error.message);
  const { data: urlData } = supabase.storage
    .from("archivos")
    .getPublicUrl(ruta);
  return urlData.publicUrl;
};

export const useUsuariosStore = create((set) => ({
  dataUsuarioAuth: null,

  mostrarUsuarioAuth: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select()
      .eq("id_auth", p.id_auth)
      .maybeSingle();
    if (error) throw new Error(error.message);
    set({ dataUsuarioAuth: data });
    return data;
  },

  editarUsuarios: async (p, file) => {
    // Si hay nueva foto de perfil, subirla primero
    if (file && file.size !== undefined) {
      const publicUrl = await subirOReemplazarFotoPerfil(p.id, file);
      p = { ...p, foto_perfil: publicUrl };
    }
    const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
    if (error) throw new Error(error.message);
  },

  // Subir banner
  subirBanner: async (id, file) => {
    const ext = file.name?.split(".").pop()?.toLowerCase() || "jpg";
    const ruta = `banners/${id}.${ext}`;
    const { error } = await supabase.storage
      .from("archivos")
      .upload(ruta, file, { cacheControl: "0", upsert: true });
    if (error) throw new Error(error.message);
    const { data: urlData } = supabase.storage
      .from("archivos")
      .getPublicUrl(ruta);
    return urlData.publicUrl;
  },

  contarUsuariosTodos: async () => {
    const { count, error } = await supabase
      .from(tabla)
      .select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return count;
  },

  obtenerUsuarioPorId: async (id) => {
    const { data, error } = await supabase
      .from(tabla)
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },

  buscarUsuarios: async (query) => {
    const { data, error } = await supabase
      .from(tabla)
      .select("id, nombre, foto_perfil")
      .ilike("nombre", `%${query}%`)
      .order("nombre")
      .limit(10);
    if (error) throw new Error(error.message);
    return data;
  },

  toggleSeguir: async ({ id_seguidor, id_seguido }) => {
    const { error } = await supabase.rpc("toggle_seguir", {
      p_seguidor: id_seguidor,
      p_seguido: id_seguido,
    });
    if (error) throw new Error(error.message);
  },

  obtenerEstadoSeguidor: async ({ id_seguidor, id_seguido }) => {
    const { data, error } = await supabase
      .from("seguidores")
      .select("id")
      .eq("id_seguidor", id_seguidor)
      .eq("id_seguido", id_seguido)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { siguiendo: !!data };
  },

  obtenerConteoSeguidores: async (id_usuario) => {
    const [{ count: seguidores }, { count: siguiendo }] = await Promise.all([
      supabase
        .from("seguidores")
        .select("*", { count: "exact", head: true })
        .eq("id_seguido", id_usuario),
      supabase
        .from("seguidores")
        .select("*", { count: "exact", head: true })
        .eq("id_seguidor", id_usuario),
    ]);
    return { seguidores, siguiendo };
  },

  obtenerSeguidos: async (id_seguidor) => {
    const { data, error } = await supabase
      .from("seguidores")
      .select("id_seguido")
      .eq("id_seguidor", id_seguidor);
    if (error) throw new Error(error.message);
    return data?.map((s) => s.id_seguido) ?? [];
  },
}));