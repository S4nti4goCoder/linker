import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFormattedDate } from "../hooks/useFormattedDate";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";
import { useComentariosStore } from "../store/ComentariosStore";
import { usePostStore } from "../store/PostStore";
import { checkText, CONTENT_BLOCKED_MESSAGE } from "../utils/contentFilter";

export const useInsertarComentarioMutate = ({ setComentario }) => {
  const { insertarComentario } = useComentariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const { itemSelect } = usePostStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["insertar comentario"],
    mutationFn: (comentario) => {
      const textCheck = checkText(comentario);
      if (textCheck.blocked) throw new Error(CONTENT_BLOCKED_MESSAGE);

      return insertarComentario({
        comentario,
        fecha: getFormattedDate(),
        id_usuario: dataUsuarioAuth?.id,
        id_publicacion: itemSelect?.id,
      });
    },
    onError: (error) => {
      toast.error("Error al comentar: " + error.message);
    },
    onSuccess: () => {
      setComentario("");
      queryClient.invalidateQueries({
        queryKey: ["mostrar comentarios", { id_publicacion: itemSelect?.id }],
      });
    },
  });
};

export const useMostrarComentariosQuery = () => {
  const { mostrarComentarios } = useComentariosStore();
  const { itemSelect } = usePostStore();
  return useQuery({
    queryKey: ["mostrar comentarios", { id_publicacion: itemSelect?.id }],
    queryFn: () => mostrarComentarios({ id_publicacion: itemSelect?.id }),
    enabled: !!itemSelect?.id,
    staleTime: 0,
  });
};

export const useToggleLikeComentarioMutate = (id_comentario) => {
  const { toggleLikeComentario } = useComentariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle like comentario", id_comentario],
    mutationFn: () =>
      toggleLikeComentario({
        id_comentario,
        id_usuario: dataUsuarioAuth?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["likes comentario", id_comentario],
      });
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });
};

export const useObtenerLikesComentarioQuery = (id_comentario) => {
  const { obtenerLikesComentario } = useComentariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();

  return useQuery({
    queryKey: ["likes comentario", id_comentario],
    queryFn: () =>
      obtenerLikesComentario({
        id_comentario,
        id_usuario: dataUsuarioAuth?.id,
      }),
    enabled: !!id_comentario && !!dataUsuarioAuth?.id,
  });
};
