import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useReportesStore } from "../store/ReportesStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";

export const useReportarPostMutate = () => {
  const { reportarPublicacion } = useReportesStore();
  const { dataUsuarioAuth } = useUsuariosStore();

  return useMutation({
    mutationKey: ["reportar post"],
    mutationFn: ({ id_publicacion, motivo }) =>
      reportarPublicacion({
        id_publicacion,
        id_usuario: dataUsuarioAuth.id,
        motivo,
      }),
    onSuccess: () => toast.success("Reporte enviado. Revisaremos el contenido."),
    onError: () => toast.error("No se pudo enviar el reporte"),
  });
};

export const useReportesPendientesQuery = (enabled = true) => {
  const { obtenerReportesPendientes } = useReportesStore();
  return useQuery({
    queryKey: ["reportes-pendientes"],
    queryFn: obtenerReportesPendientes,
    enabled,
  });
};

export const useDescartarReporteMutate = () => {
  const { marcarRevisado } = useReportesStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["descartar reporte"],
    mutationFn: (id) => marcarRevisado(id),
    onSuccess: () => {
      toast.success("Reporte descartado");
      queryClient.invalidateQueries({ queryKey: ["reportes-pendientes"] });
    },
  });
};

export const useUsuariosBaneadosQuery = () => {
  const { obtenerUsuariosBaneados } = useReportesStore();
  return useQuery({
    queryKey: ["usuarios-baneados"],
    queryFn: obtenerUsuariosBaneados,
  });
};

export const useDesbanearUsuarioMutate = () => {
  const { desbanearUsuario } = useReportesStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["desbanear usuario"],
    mutationFn: (id) => desbanearUsuario(id),
    onSuccess: () => {
      toast.success("Usuario desbaneado");
      queryClient.invalidateQueries({ queryKey: ["usuarios-baneados"] });
      queryClient.invalidateQueries({ queryKey: ["admin-log"] });
    },
  });
};

export const useBanearUsuarioMutate = () => {
  const { banearUsuario } = useReportesStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["banear usuario"],
    mutationFn: (id) => banearUsuario(id),
    onSuccess: () => {
      toast.success("Usuario baneado");
      queryClient.invalidateQueries({ queryKey: ["usuarios-baneados"] });
      queryClient.invalidateQueries({ queryKey: ["admin-log"] });
    },
  });
};

// ── Apelaciones ──────────────────────────────────
export const useEnviarApelacionMutate = () => {
  const { enviarApelacion } = useReportesStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["enviar apelacion"],
    mutationFn: ({ id_usuario, motivo }) => enviarApelacion({ id_usuario, motivo }),
    onSuccess: () => {
      toast.success("Apelación enviada");
      queryClient.invalidateQueries({ queryKey: ["mi-apelacion"] });
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useMiApelacionQuery = (id_usuario) => {
  const { obtenerMiApelacion } = useReportesStore();
  return useQuery({
    queryKey: ["mi-apelacion", id_usuario],
    queryFn: () => obtenerMiApelacion(id_usuario),
    enabled: !!id_usuario,
  });
};

export const useApelacionesPendientesQuery = (enabled = true) => {
  const { obtenerApelacionesPendientes } = useReportesStore();
  return useQuery({
    queryKey: ["apelaciones-pendientes"],
    queryFn: obtenerApelacionesPendientes,
    enabled,
  });
};

export const useResolverApelacionMutate = () => {
  const { resolverApelacion } = useReportesStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["resolver apelacion"],
    mutationFn: ({ id, estado, respuesta_admin, id_usuario }) =>
      resolverApelacion({ id, estado, respuesta_admin, id_usuario }),
    onSuccess: () => {
      toast.success("Apelación resuelta");
      queryClient.invalidateQueries({ queryKey: ["apelaciones-pendientes"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios-baneados"] });
      queryClient.invalidateQueries({ queryKey: ["admin-log"] });
    },
  });
};

export const useStorageUsageQuery = () => {
  const { obtenerUsoStorage } = useReportesStore();
  return useQuery({
    queryKey: ["storage-usage"],
    queryFn: obtenerUsoStorage,
    staleTime: 1000 * 60 * 10,
  });
};

export const useAdminLogQuery = () => {
  const { obtenerAdminLog } = useReportesStore();
  return useQuery({
    queryKey: ["admin-log"],
    queryFn: obtenerAdminLog,
  });
};

export const useEliminarPublicacionReportadaMutate = () => {
  const { eliminarPublicacionReportada } = useReportesStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["eliminar publicacion reportada"],
    mutationFn: ({ id_reporte, id_publicacion, id_autor, motivo }) =>
      eliminarPublicacionReportada({ id_reporte, id_publicacion, id_autor, motivo }),
    onSuccess: (result) => {
      if (result?.baneado) {
        toast.success("Publicación eliminada y usuario baneado");
      } else {
        toast.success(`Publicación eliminada — Strike ${result?.strikes}/3`);
      }
      queryClient.invalidateQueries({ queryKey: ["reportes-pendientes"] });
      queryClient.invalidateQueries({ queryKey: ["mostrar post"] });
      queryClient.invalidateQueries({ queryKey: ["admin-log"] });
    },
  });
};
