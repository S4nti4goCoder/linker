import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
import { getValidatedExt } from "../utils/validation";
import { subirArchivoR2 } from "../utils/r2";

const tabla = "usuarios";

const subirOReemplazarFotoPerfil = async (id, file) => {
  const ext = file.type === "image/webp" ? "webp" : getValidatedExt(file.name);
  const ruta = `usuarios/${id}.${ext}`;
  return await subirArchivoR2(ruta, file);
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

  subirBanner: async (id, file) => {
    const ext = file.type === "image/webp" ? "webp" : getValidatedExt(file.name);
    const ruta = `banners/${id}.${ext}`;
    return await subirArchivoR2(ruta, file);
  },

  contarUsuariosTodos: async () => {
    const { count, error } = await supabase
      .from(tabla)
      .select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return count;
  },

  obtenerUltimoAcceso: async (id) => {
    const { data, error } = await supabase
      .from(tabla)
      .select("ultimo_acceso")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.ultimo_acceso;
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
    const [resSeguidores, resSiguiendo] = await Promise.all([
      supabase
        .from("seguidores")
        .select("*", { count: "exact", head: true })
        .eq("id_seguido", id_usuario),
      supabase
        .from("seguidores")
        .select("*", { count: "exact", head: true })
        .eq("id_seguidor", id_usuario),
    ]);
    if (resSeguidores.error) throw new Error(resSeguidores.error.message);
    if (resSiguiendo.error) throw new Error(resSiguiendo.error.message);
    return { seguidores: resSeguidores.count, siguiendo: resSiguiendo.count };
  },

  listarSeguidores: async (id_usuario) => {
    const { data, error } = await supabase.rpc("listar_seguidores", {
      _id_usuario: id_usuario,
    });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  listarSiguiendo: async (id_usuario) => {
    const { data, error } = await supabase.rpc("listar_siguiendo", {
      _id_usuario: id_usuario,
    });
    if (error) throw new Error(error.message);
    return data ?? [];
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