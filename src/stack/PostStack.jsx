import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePostStore } from "../store/PostStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";

export const useInsertarPostMutate = () => {
  const { insertarPost, file, setStateForm, setFile } = usePostStore();
  const fechaActual = useFormattedDate();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["insertar post"],
    mutationFn: async (data) => {
      let type = "imagen";
      if (file && file.name) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "mp4" || ext === "mov" || ext === "webm") type = "video";
      }
      const p = {
        descripcion: data.descripcion,
        url: "-",
        fecha: fechaActual,
        id_usuario: dataUsuarioAuth?.id,
        type: type,
      };
      await insertarPost(p, file);
    },
    onError: (error) => toast.error("Error al publicar: " + error.message),
    onSuccess: () => {
      toast.success("¡Publicado!");
      setStateForm(false);
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["mostrar post"] });
    },
  });
};

export const useLikePostMutate = () => {
  const { likePost, itemSelect } = usePostStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  return useMutation({
    mutationKey: ["like post"],
    mutationFn: () =>
      likePost({ p_post_id: itemSelect?.id, p_user_id: dataUsuarioAuth?.id }),
    onError: (error) => toast.error("Error al dar like: " + error.message),
  });
};

export const useMostrarPostQuery = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mostrarPost } = usePostStore();
  const cant_pagina = 10;
  return useInfiniteQuery({
    queryKey: ["mostrar post", { id_usuario: dataUsuarioAuth?.id }],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await mostrarPost({
        id_usuario: dataUsuarioAuth?.id,
        desde: pageParam,
        hasta: cant_pagina,
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < cant_pagina) return undefined;
      return allPages.length * cant_pagina;
    },
    initialPageParam: 0,
  });
};

// ✅ NUEVO
export const useEditarPostMutate = (onClose) => {
  const { editarPost } = usePostStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["editar post"],
    mutationFn: (data) =>
      editarPost({ descripcion: data.descripcion, id: data.id }),
    onError: (error) => toast.error("Error al editar: " + error.message),
    onSuccess: () => {
      toast.success("¡Publicación editada!");
      queryClient.invalidateQueries({ queryKey: ["mostrar post"] });
      if (onClose) onClose();
    },
  });
};

export const useEliminarPostMutate = (onClose) => {
  const { eliminarPost } = usePostStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["eliminar post"],
    mutationFn: (id) => eliminarPost(id),
    onError: (error) => toast.error("Error al eliminar: " + error.message),
    onSuccess: () => {
      toast.success("¡Publicación eliminada!");
      queryClient.invalidateQueries({ queryKey: ["mostrar post"] });
      if (onClose) onClose();
    },
  });
};
