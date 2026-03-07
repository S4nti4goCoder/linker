import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubcription } from "../store/AuthStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useGlobalStore } from "../store/GlobalStore";
import { toast } from "sonner";

export const useMostrarUsuarioAuthQuery = () => {
  const { mostrarUsuarioAuth } = useUsuariosStore();
  const { user } = useSubcription();
  return useQuery({
    queryKey: ["mostrar user auth"],
    queryFn: () => mostrarUsuarioAuth({ id_auth: user?.id }),
    enabled: !!user?.id,
  });
};

export const useEditarFotoUserMutate = (onClose) => {
  const { file, setFile, setFileUrl } = useGlobalStore();
  const { editarUsuarios, dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["editar foto user"],
    mutationFn: async (data) => {
      if (!data.nombre || data.nombre.trim().length < 3) {
        throw new Error("El nombre debe tener al menos 3 caracteres");
      }
      const p = {
        nombre: data.nombre,
        id: dataUsuarioAuth?.id,
      };
      await editarUsuarios(p, dataUsuarioAuth?.foto_perfil, file);
    },
    onError: (error) => {
      toast.error("Error al guardar: " + error.message);
    },
    onSuccess: () => {
      toast.success("¡Datos guardados!");
      // Sintaxis correcta para TanStack Query v5
      queryClient.invalidateQueries({ queryKey: ["mostrar user auth"] });
      // Limpiar el file del store
      setFile([]);
      setFileUrl("-");
      // Cerrar el form si viene del perfil
      if (onClose) onClose();
    },
  });
};

export const useContarUsuariosTodosQuery = () => {
  const { contarUsuariosTodos } = useUsuariosStore();
  return useQuery({
    queryKey: ["contar usuarios todos"],
    queryFn: contarUsuariosTodos,
  });
};
