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
      const p = { nombre: data.nombre, id: dataUsuarioAuth?.id };
      await editarUsuarios(p, dataUsuarioAuth?.foto_perfil, file);
    },
    onError: (error) => toast.error("Error al guardar: " + error.message),
    onSuccess: () => {
      toast.success("¡Datos guardados!");
      queryClient.invalidateQueries({ queryKey: ["mostrar user auth"] });
      setFile([]);
      setFileUrl("-");
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

export const useBuscarUsuariosQuery = (query) => {
  const { buscarUsuarios } = useUsuariosStore();
  return useQuery({
    queryKey: ["buscar usuarios", query],
    queryFn: () => buscarUsuarios(query),
    enabled: query.trim().length >= 2,
  });
};

// ✅ NUEVO - seguidores
export const useToggleSeguirMutate = (id_seguido) => {
  const { toggleSeguir } = useUsuariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle seguir", id_seguido],
    mutationFn: () =>
      toggleSeguir({
        id_seguidor: dataUsuarioAuth?.id,
        id_seguido,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estado seguidor", id_seguido] });
      queryClient.invalidateQueries({ queryKey: ["conteo seguidores", id_seguido] });
      queryClient.invalidateQueries({ queryKey: ["seguidos", dataUsuarioAuth?.id] });
    },
    onError: (error) => toast.error("Error: " + error.message),
  });
};

export const useEstadoSeguidorQuery = (id_seguido) => {
  const { obtenerEstadoSeguidor } = useUsuariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();

  return useQuery({
    queryKey: ["estado seguidor", id_seguido],
    queryFn: () =>
      obtenerEstadoSeguidor({
        id_seguidor: dataUsuarioAuth?.id,
        id_seguido,
      }),
    enabled: !!id_seguido && !!dataUsuarioAuth?.id,
  });
};

export const useConteoSeguidoresQuery = (id_usuario) => {
  const { obtenerConteoSeguidores } = useUsuariosStore();
  return useQuery({
    queryKey: ["conteo seguidores", id_usuario],
    queryFn: () => obtenerConteoSeguidores(id_usuario),
    enabled: !!id_usuario,
  });
};

export const useSeguidosQuery = (id_seguidor) => {
  const { obtenerSeguidos } = useUsuariosStore();
  return useQuery({
    queryKey: ["seguidos", id_seguidor],
    queryFn: () => obtenerSeguidos(id_seguidor),
    enabled: !!id_seguidor,
  });
};