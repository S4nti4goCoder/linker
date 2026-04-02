import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRespuestasComentariosStore } from "../store/RespuestasComentariosStore";
import { getFormattedDate } from "../hooks/useFormattedDate";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";

export const useInsertarRespuestaComentarioMutate = () => {
  const {
    insertarRespuestaComentarios,
    setRespuesta,
    limpiarRespuestaActiva,
  } = useRespuestasComentariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["insertar respuesta a comentario"],
    mutationFn: ({ id_comentario, comentario }) =>
      insertarRespuestaComentarios({
        id_comentario,
        comentario,
        fecha: getFormattedDate(),
        id_usuario: dataUsuarioAuth?.id,
      }),
    onError: (error) => {
      toast.error("Error al insertar respuesta: " + error.message);
    },
    onSuccess: (_, { id_comentario }) => {
      toast.success("Respuesta enviada");
      setRespuesta("");
      limpiarRespuestaActiva();
      queryClient.invalidateQueries({
        queryKey: ["mostrar respuesta comentario", { id_comentario }],
      });
    },
  });
};

// ← Ahora recibe id_comentario como parámetro directo
export const useMostrarRespuestaComentariosQuery = (id_comentario) => {
  const { mostrarRespuestaAComentario } = useRespuestasComentariosStore();

  return useQuery({
    queryKey: ["mostrar respuesta comentario", { id_comentario }],
    queryFn: () => mostrarRespuestaAComentario({ id_comentario }),
    enabled: !!id_comentario,
    staleTime: 0,
  });
};