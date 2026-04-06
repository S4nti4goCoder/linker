import { useMutation } from "@tanstack/react-query";
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
