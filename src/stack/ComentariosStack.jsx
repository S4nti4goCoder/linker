import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRespuestasComentariosStore } from "../store/RespuestasComentariosStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";
import { useComentariosStore } from "../store/ComentariosStore";
import { usePostStore } from "../store/PostStore";

export const useInsertarComentarioMutate = ({ comentario, setComentario }) => {
  const { insertarComentario } = useComentariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const { itemSelect } = usePostStore();
  const fechaActual = useFormattedDate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["insertar comentario"],
    mutationFn: () =>
      insertarComentario({
        comentario,
        fecha: fechaActual,
        id_usuario: dataUsuarioAuth?.id,
        id_publicacion: itemSelect?.id,
      }),
    onError: (error) => {
      toast.error("Error al comentar: " + error.message);
    },
    onSuccess: () => {
      setComentario("");
      queryClient.invalidateQueries({ queryKey: ["mostrar comentarios"] });
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
  });
};

export const useInsertarRespuestaComentarioMutate = () => {
  const {
    insertarRespuestaComentarios,
    respuestaActivaParaComentarioId,
    respuesta,
    setRespuesta,
    limpiarRespuestaActiva,
  } = useRespuestasComentariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const fechaActual = useFormattedDate();
  return useMutation({
    mutationKey: ["insertar respuesta a comentario"],
    mutationFn: () =>
      insertarRespuestaComentarios({
        id_comentario: respuestaActivaParaComentarioId,
        comentario: respuesta,
        fecha: fechaActual,
        id_usuario: dataUsuarioAuth?.id,
      }),
    onError: (error) => {
      toast.error("Error al insertar respuesta: " + error.message);
    },
    onSuccess: () => {
      toast.success("Respuesta enviada");
      setRespuesta("");
      limpiarRespuestaActiva();
    },
  });
};

export const useMostrarRespuestaComentariosQuery = () => {
  const { mostrarRespuestaAComentario } = useRespuestasComentariosStore();
  const { itemSelect } = useComentariosStore();
  return useQuery({
    queryKey: [
      "mostrar respuesta comentario",
      { id_comentario: itemSelect?.id },
    ],
    queryFn: () =>
      mostrarRespuestaAComentario({ id_comentario: itemSelect?.id }),
    enabled: !!itemSelect,
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