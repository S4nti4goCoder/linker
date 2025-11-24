import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { usePostStore } from "../store/PostStore";
import { useFormattedDate } from "../hooks/useFormattedDate";
import { useUsuariosStore } from "../store/UsuariosStore";
import { toast } from "sonner";

export const useInsertarPostMutate = () => {
  const { insertarPost, file, setStateForm, setFile } = usePostStore();
  const fechaActual = useFormattedDate();
  const { dataUsuarioAuth } = useUsuariosStore();
  return useMutation({
    mutationKey: ["insertar post"],
    mutationFn: async (data) => {
      let type = "imagen";
      if (file && file.name) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "mp4") type = "video";
      }
      const p = {
        descripcion: data.descripcion,
        url: "-",
        fecha: fechaActual,
        id_usuario: dataUsuarioAuth?.id,
        type: type,
      };
      await insertarPost(p, file);
    },
    onError: (error) => {
      toast.error("Error al insertar post: " + error.message);
    },
    onSuccess: () => {
      toast.success("Publicado");
      setStateForm(false);
      setFile(null);
    },
  });
};

export const useMostrarPostQuery = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mostrarPost } = usePostStore();
  const cant_pagina = 10;
  return useInfiniteQuery({
    queryKey: ["mostrar post", { id_usuario: dataUsuarioAuth?.id }],
    queryFn: async ({ pageParam = 0 }) => {
      const data = mostrarPost({
        id_usuario: dataUsuarioAuth?.id,
        desde: pageParam,
        hasta: cant_pagina,
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < cant_pagina) return undefined;
      return allPages.length * cant_pagina;
    },
    initialPageParam: 0,
  });
};
