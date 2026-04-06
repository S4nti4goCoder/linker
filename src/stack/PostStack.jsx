import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { usePostStore } from "../store/PostStore";
import { getFormattedDate } from "../hooks/useFormattedDate";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";
import { checkText, CONTENT_BLOCKED_MESSAGE } from "../utils/contentFilter";
import { checkImage, NSFW_BLOCKED_MESSAGE } from "../utils/nsfwDetector";

export const useInsertarPostMutate = () => {
  const { insertarPost, file, setStateForm, setFile } = usePostStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["insertar post"],
    mutationFn: async (data) => {
      // Filtro de texto +18
      const textCheck = checkText(data.descripcion);
      if (textCheck.blocked) throw new Error(CONTENT_BLOCKED_MESSAGE);

      // Filtro de imagen NSFW
      if (file && file.type?.startsWith("image/")) {
        const imgCheck = await checkImage(file);
        if (imgCheck.nsfw) throw new Error(NSFW_BLOCKED_MESSAGE);
      }

      const p = {
        descripcion: data.descripcion,
        url: "-",
        fecha: getFormattedDate(),
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

  const updatePostInPages = (oldData, postId, liked) => {
    if (!oldData?.pages) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page) =>
        page.map((post) =>
          post.id === postId
            ? {
                ...post,
                like_usuario_actual: liked,
                likes: post.likes + (liked ? 1 : -1),
              }
            : post
        )
      ),
    };
  };

  return useMutation({
    mutationKey: ["like post"],
    mutationFn: (item) =>
      likePost({ p_post_id: item?.id, p_user_id: dataUsuarioAuth?.id }),
    onMutate: async (item) => {
      const liked = !item.like_usuario_actual;
      const queryKeys = [
        ["mostrar post"],
        ["mostrar post publico"],
        ["mostrar post seguidos"],
      ];

      // Cancelar refetches en curso
      await Promise.all(
        queryKeys.map((key) => queryClient.cancelQueries({ queryKey: key }))
      );

      // Guardar estado anterior
      const previous = {};
      queryKeys.forEach((key) => {
        queryClient.setQueriesData({ queryKey: key }, (old) => {
          if (old?.pages) {
            previous[JSON.stringify(key)] = old;
            return updatePostInPages(old, item.id, liked);
          }
          return old;
        });
      });

      // Optimistic update en guardados (estructura plana)
      const guardadosKey = ["guardados"];
      queryClient.setQueriesData({ queryKey: guardadosKey }, (old) => {
        if (!Array.isArray(old)) return old;
        previous["guardados"] = old;
        return old.map((post) =>
          post.id === item.id
            ? { ...post, like_usuario_actual: liked, likes: post.likes + (liked ? 1 : -1) }
            : post
        );
      });

      return { previous };
    },
    onError: (error, item, context) => {
      // Revertir al estado anterior si falla
      if (context?.previous) {
        Object.entries(context.previous).forEach(([key, data]) => {
          if (key === "guardados") {
            queryClient.setQueriesData({ queryKey: ["guardados"] }, () => data);
          } else {
            queryClient.setQueriesData({ queryKey: JSON.parse(key) }, () => data);
          }
        });
      }
      toast.error("Error al dar like: " + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mostrar post"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar post publico"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar post seguidos"] });
      queryClient.invalidateQueries({ queryKey: ["guardados"] });
      queryClient.invalidateQueries({ queryKey: ["posts liked"] });
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
    mutationFn: async (data) => {
      const textCheck = checkText(data.descripcion);
      if (textCheck.blocked) throw new Error(CONTENT_BLOCKED_MESSAGE);

      if (data.file && data.file.type?.startsWith("image/")) {
        const imgCheck = await checkImage(data.file);
        if (imgCheck.nsfw) throw new Error(NSFW_BLOCKED_MESSAGE);
      }

      await editarPost({ descripcion: data.descripcion, id: data.id }, data.file);
    },
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

export const useMostrarPostsLikedQuery = (id_usuario) => {
  const { mostrarPostsLiked } = usePostStore();
  return useQuery({
    queryKey: ["posts liked", id_usuario],
    queryFn: () => mostrarPostsLiked(id_usuario),
    enabled: !!id_usuario,
  });
};