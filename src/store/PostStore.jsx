import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

const tabla = "publicaciones";

const inferirTipo = (filename) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  return ["mp4", "mov", "webm"].includes(ext) ? "video" : "imagen";
};

const construirRuta = (carpeta, id, filename) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  return `${carpeta}/${id}.${ext}`;
};

const subirArchivo = async (carpeta, id, file) => {
  const ruta = construirRuta(carpeta, id, file.name);
  const { data, error } = await supabase.storage
    .from("archivos")
    .upload(ruta, file, { cacheControl: "3600", upsert: true });
  if (error) throw new Error(error.message);
  if (data) {
    const { data: urlimagen } = await supabase.storage
      .from("archivos")
      .getPublicUrl(ruta);
    return { publicUrl: urlimagen.publicUrl, type: inferirTipo(file.name) };
  }
};

const InsertarPost = async (p, file) => {
  const { data, error } = await supabase
    .from(tabla)
    .insert(p)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (file) {
    const resultado = await subirArchivo("publicaciones", data.id, file);
    await EditarPublicacion({
      url: resultado.publicUrl,
      type: resultado.type,
      id: data.id,
    });
  }
};

const EditarPublicacion = async (p) => {
  const { error } = await supabase.from(tabla).update(p).eq("id", p.id);
  if (error) throw new Error(error.message);
};

export const usePostStore = create((set) => ({
  itemSelect: null,
  setItemSelect: (p) => set({ itemSelect: p }),
  file: null,
  setFile: (p) => set({ file: p }),
  stateImage: false,
  setStateImage: () => set((state) => ({ stateImage: !state.stateImage })),
  stateForm: false,
  setStateForm: (val) =>
    set((state) => ({
      stateForm: val !== undefined ? val : !state.stateForm,
    })),

  insertarPost: async (p, file) => {
    await InsertarPost(p, file);
  },

  mostrarPost: async (p) => {
    const { data, error } = await supabase
      .rpc("publicaciones_con_detalles", {
        _id_usuario: p.id_usuario,
        _id_autor: p.id_autor ?? null,
      })
      .range(p.desde, p.desde + p.hasta - 1);
    if (error) throw new Error(error.message);
    return data; // ← sin set({ dataPost }) — era estado muerto
  },

  mostrarPostSeguidos: async (p) => {
    const { data, error } = await supabase.rpc("publicaciones_seguidos", {
      _id_usuario: p.id_usuario,
      _ids_autores: p.ids_autores,
      _desde: p.desde,
      _hasta: p.hasta,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  likePost: async (p) => {
    const { error } = await supabase.rpc("toggle_like", p);
    if (error) throw new Error(error.message);
  },

  editarPost: async (p, file) => {
    if (file) {
      const resultado = await subirArchivo("publicaciones", p.id, file);
      p = { ...p, url: resultado.publicUrl, type: resultado.type };
    }
    await EditarPublicacion(p);
  },

  eliminarPost: async (id) => {
    const { error } = await supabase.from(tabla).delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
}));
