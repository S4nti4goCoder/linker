import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubcription } from "../store/AuthStore";
import { useUsuariosStore } from "../store/UsuariosStore";
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

export const useEditarPerfilMutate = (onClose) => {
  const { editarUsuarios, subirBanner, dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["editar perfil"],
    mutationFn: async ({ nombre, bio, instagram, twitter, website, fileFoto, fileBanner }) => {
      if (!nombre || nombre.trim().length < 3) {
        throw new Error("El nombre debe tener al menos 3 caracteres");
      }

      let p = {
        id: dataUsuarioAuth?.id,
        nombre: nombre.trim(),
        bio: bio?.trim() ?? "",
        instagram: instagram?.trim() ?? "",
        twitter: twitter?.trim() ?? "",
        website: website?.trim() ?? "",
      };

      // Subir banner si hay nuevo
      if (fileBanner && fileBanner.size !== undefined) {
        const bannerUrl = await subirBanner(dataUsuarioAuth?.id, fileBanner);
        p = { ...p, banner: bannerUrl };
      }

      await editarUsuarios(p, fileFoto ?? null);
    },
    onError: (error) => toast.error("Error al guardar: " + error.message),
    onSuccess: () => {
      toast.success("¡Perfil actualizado!");
      queryClient.invalidateQueries({ queryKey: ["mostrar user auth"] });
      queryClient.invalidateQueries({ queryKey: ["usuario por id", dataUsuarioAuth?.id] });
      if (onClose) onClose();
    },
  });
};

// Mantener compatibilidad con onboarding si lo usas
export const useEditarFotoUserMutate = (onClose) => {
  const { editarUsuarios, dataUsuarioAuth } = useUsuariosStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["editar foto user"],
    mutationFn: async (data) => {
      if (!data.nombre || data.nombre.trim().length < 3) {
        throw new Error("El nombre debe tener al menos 3 caracteres");
      }
      const p = { nombre: data.nombre, id: dataUsuarioAuth?.id };
      await editarUsuarios(p, data.file ?? null);
    },
    onError: (error) => toast.error("Error al guardar: " + error.message),
    onSuccess: () => {
      toast.success("¡Datos guardados!");
      queryClient.invalidateQueries({ queryKey: ["mostrar user auth"] });
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

export const useToggleSeguirMutate = (id_seguido) => {
  const { toggleSeguir, dataUsuarioAuth } = useUsuariosStore();
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
      queryClient.invalidateQueries({ queryKey: ["mostrar post"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar post publico"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar post seguidos"] });
    },
    onError: (error) => toast.error("Error: " + error.message),
  });
};

export const useEstadoSeguidorQuery = (id_seguido) => {
  const { obtenerEstadoSeguidor, dataUsuarioAuth } = useUsuariosStore();
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

export const useListarSeguidoresQuery = (id_usuario) => {
  const { listarSeguidores } = useUsuariosStore();
  return useQuery({
    queryKey: ["seguidores lista", id_usuario],
    queryFn: () => listarSeguidores(id_usuario),
    enabled: !!id_usuario,
  });
};

export const useListarSiguiendoQuery = (id_usuario) => {
  const { listarSiguiendo } = useUsuariosStore();
  return useQuery({
    queryKey: ["siguiendo lista", id_usuario],
    queryFn: () => listarSiguiendo(id_usuario),
    enabled: !!id_usuario,
  });
};

export const useUltimoAccesoQuery = (id) => {
  const { obtenerUltimoAcceso } = useUsuariosStore();
  return useQuery({
    queryKey: ["ultimo acceso", id],
    queryFn: () => obtenerUltimoAcceso(id),
    enabled: !!id,
    refetchInterval: 60_000,
  });
};

export const useObtenerUsuarioPorIdQuery = (id) => {
  const { obtenerUsuarioPorId } = useUsuariosStore();
  return useQuery({
    queryKey: ["usuario por id", id],
    queryFn: () => obtenerUsuarioPorId(id),
    enabled: !!id,
  });
};