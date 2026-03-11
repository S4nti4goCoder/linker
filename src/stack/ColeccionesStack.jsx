import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useColeccionesStore } from "../store/ColeccionesStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";

// Verificar si un post está guardado
export const useVerificarGuardadoQuery = (id_post) => {
  const { verificarGuardado } = useColeccionesStore();
  const { dataUsuarioAuth } = useUsuariosStore();

  return useQuery({
    queryKey: ["guardado", id_post, dataUsuarioAuth?.id],
    queryFn: () =>
      verificarGuardado({
        id_usuario: dataUsuarioAuth.id,
        id_post,
      }),
    enabled: !!id_post && !!dataUsuarioAuth?.id,
    staleTime: 1000 * 60,
  });
};

// Toggle guardar/desguardar
export const useToggleGuardadoMutate = (id_post) => {
  const { toggleGuardado } = useColeccionesStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle guardado", id_post],
    mutationFn: () =>
      toggleGuardado({
        id_usuario: dataUsuarioAuth.id,
        id_post,
      }),
    onSuccess: (guardado) => {
      // Actualiza el estado local sin refetch
      queryClient.setQueryData(
        ["guardado", id_post, dataUsuarioAuth?.id],
        guardado,
      );
      // Invalida la lista de guardados
      queryClient.invalidateQueries({
        queryKey: ["guardados", dataUsuarioAuth?.id],
      });
      toast.success(guardado ? "Post guardado" : "Post eliminado de guardados");
    },
    onError: () => toast.error("No se pudo guardar el post"),
  });
};

// Listar todos los guardados del usuario
export const useListarGuardadosQuery = () => {
  const { listarGuardados } = useColeccionesStore();
  const { dataUsuarioAuth } = useUsuariosStore();

  return useQuery({
    queryKey: ["guardados", dataUsuarioAuth?.id],
    queryFn: () => listarGuardados(dataUsuarioAuth.id),
    enabled: !!dataUsuarioAuth?.id,
    staleTime: 0,
  });
};
