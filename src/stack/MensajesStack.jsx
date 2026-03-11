import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMensajesStore } from "../store/MensajesStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";

// Listar todas las conversaciones del usuario autenticado
export const useListarConversacionesQuery = () => {
  const { listarConversaciones } = useMensajesStore();
  const { dataUsuarioAuth } = useUsuariosStore();

  return useQuery({
    queryKey: ["conversaciones", dataUsuarioAuth?.id],
    queryFn: () => listarConversaciones(dataUsuarioAuth.id),
    enabled: !!dataUsuarioAuth?.id,
    staleTime: 0,
  });
};

// Obtener mensajes de una conversación
export const useObtenerMensajesQuery = (id_conversacion) => {
  const { obtenerMensajes } = useMensajesStore();

  return useQuery({
    queryKey: ["mensajes", id_conversacion],
    queryFn: () => obtenerMensajes(id_conversacion),
    enabled: !!id_conversacion,
    staleTime: 0,
  });
};

// Obtener o crear una conversación (navegar al chat)
export const useAbrirConversacionMutate = () => {
  const { obtenerOCrearConversacion, setConversacionActiva } = useMensajesStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["abrir conversacion"],
    mutationFn: (id_otro_usuario) =>
      obtenerOCrearConversacion({
        id_usuario_a: dataUsuarioAuth.id,
        id_usuario_b: id_otro_usuario,
      }),
    onSuccess: (id_conversacion, id_otro_usuario) => {
      setConversacionActiva(id_conversacion);
      queryClient.invalidateQueries({ queryKey: ["conversaciones"] });
    },
    onError: (error) => {
      if (error.message.includes("seguimiento mutuo")) {
        toast.error("Necesitan seguirse mutuamente para chatear");
      } else {
        toast.error("No se pudo abrir la conversación");
      }
    },
  });
};

// Enviar un mensaje
export const useEnviarMensajeMutate = (id_conversacion) => {
  const { enviarMensaje } = useMensajesStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["enviar mensaje", id_conversacion],
    mutationFn: (contenido) =>
      enviarMensaje({
        id_conversacion,
        id_emisor: dataUsuarioAuth.id,
        contenido,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes", id_conversacion] });
      queryClient.invalidateQueries({ queryKey: ["conversaciones"] });
    },
    onError: () => toast.error("No se pudo enviar el mensaje"),
  });
};