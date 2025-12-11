import { useMutation } from "@tanstack/react-query";
import { useRespuestasComentariosStore } from "../store/RespuestasComentariosStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";

export const useInsertarRespuestaComentarioMutate = () => {
  const {
    insertarRespuestaComentarios,
    respuestaActivaParaComentarioId,
    respuesta,
    setRespuesta,
  } = useRespuestasComentariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const fechaActual = useFormattedDate;
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
