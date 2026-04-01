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
      const p = {
        descripcion: data.descripcion,
        url: "-",
        fecha: fechaActual,
        id_usuario: dataUsuarioAuth?.id,
        type: "imagen",
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
  const { likePost } = usePostStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["like post"],
    mutationFn: (item) =>
      likePost({ p_post_id: item?.id, p_user_id: dataUsuarioAuth?.id }),
    onError: (error) => toast.error("Error al dar like: " + error.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mostrar post"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar post publico"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar post seguidos"] });
      queryClient.invalidateQueries({ queryKey: ["guardados"] });
    },
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
    enabled: !!dataUsuarioAuth?.id,
  });
};

export const useEditarPostMutate = (onClose) => {
  const { editarPost } = usePostStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["editar post"],
    mutationFn: (data) =>
      editarPost({ descripcion: data.descripcion, id: data.id }, data.file),
    onError: (error) => toast.error("Error al editar: " + error.message),
    onSuccess: () => {
      toast.success("¡Publicación editada!");
      queryClient.invalidateQueries({ queryKey: ["mostrar post"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar post publico"] });
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
      queryClient.invalidateQueries({ queryKey: ["mostrar post publico"] });
      if (onClose) onClose();
    },
  });
};

export const useMostrarPostPublicoQuery = (id_autor) => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mostrarPost } = usePostStore();
  const cant_pagina = 10;
  return useInfiniteQuery({
    queryKey: ["mostrar post publico", { id_autor }],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await mostrarPost({
        id_usuario: dataUsuarioAuth?.id,
        id_autor,
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
    enabled: !!id_autor && !!dataUsuarioAuth?.id,
  });
};

export const useMostrarPostSeguidosQuery = (ids_seguidos) => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mostrarPostSeguidos } = usePostStore();
  const cant_pagina = 10;

  return useInfiniteQuery({
    queryKey: ["mostrar post seguidos", ids_seguidos],
    queryFn: async ({ pageParam = 0 }) => {
      if (!ids_seguidos || ids_seguidos.length === 0) return [];
      return await mostrarPostSeguidos({
        id_usuario: dataUsuarioAuth?.id,
        ids_autores: ids_seguidos,
        desde: pageParam,
        hasta: cant_pagina,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < cant_pagina) return undefined;
      return allPages.length * cant_pagina;
    },
    initialPageParam: 0,
    enabled: !!dataUsuarioAuth?.id && !!ids_seguidos,
  });
};