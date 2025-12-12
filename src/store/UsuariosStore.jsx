import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

const tabla = "usuarios";

const editarUsuarios = async (p, fileold, filenew) => {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
  if (filenew !== "-" && filenew.size !== undefined) {
    if (fileold != "-") {
      await editarFileStorage(p.id, filenew);
    } else {
      const dataImagen = await subirArchivo(p.id, filenew);
      const peditar = {
        foto_perfil: dataImagen.publicUrl,
        id: p.id,
      };
      await editarFotoUser(peditar);
    }
  }
};

const editarFotoUser = async (p) => {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) {
    throw new Error(error.message);
  }
};

const subirArchivo = async (id, file) => {
  const ruta = "usuarios/" + id;
  const { data, error } = await supabase.storage
    .from("archivos")
    .upload(ruta, file, {
      cacheControl: "0",
      upsert: true,
    });
  if (error) {
    throw new Error(error.message);
  }
  if (data) {
    const { data: urlimagen } = await supabase.storage
      .from("archivos")
      .getPublicUrl(ruta);
    return urlimagen;
  }
};

const editarFileStorage = async (id, file) => {
  const ruta = "usuarios/" + id;
  await supabase.storage.from("imagenes").update(ruta, file, {
    cacheControl: "0",
    upsert: true,
  });
};

export const useUsuariosStore = create((set) => ({
  dataUsuarioAuth: null,
  mostrarUsuarioAuth: async (p) => {
    const { data, error } = await supabase
      .from(tabla)
      .select()
      .eq("id_auth", p.id_auth)
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    set({ dataUsuarioAuth: data });
    return data;
  },
  editarUsuarios: async (p, fileold, filenew) => {
    await editarUsuarios(p, fileold, filenew);
  },
  contarUsuariosTodos: async () => {
    const { count, error } = await supabase
      .from(tabla)
      .select("*", { count: "exact", head: true });
    if (error) {
      throw new Error(error.message);
    }
    return count;
  },
}));