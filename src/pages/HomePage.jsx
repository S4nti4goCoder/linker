import { Toaster } from "sonner";
import { FormPost } from "../components/Forms/FormPost";
import { HeaderSticky } from "../components/HomePageComponents/HeaderSticky";
import { InputPublicar } from "../components/HomePageComponents/InputPublicar";
import { PublicacionCard } from "../components/HomePageComponents/PublicacionCard";
import { usePostStore } from "../store/PostStore";
import { useMostrarPostQuery } from "../stack/PostStack";
import { useEffect, useRef } from "react";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";
import { useSupabaseSubscription } from "../hooks/useSupabaseSubscription";
import { ComentarioModal } from "../components/HomePageComponents/ComentarioModal";
import { useComentariosStore } from "../store/ComentariosStore";
import { useMostrarRespuestaComentariosQuery } from "../stack/RespuestasComentariosStack";
import { FormActualizarPerfil } from "../components/Forms/FormActualizarPerfil";

export const HomePage = () => {
  const { stateForm, setStateForm, itemSelect } = usePostStore();
  const { showModal } = useComentariosStore();
  const { data: dataRespuestaComentario } =
    useMostrarRespuestaComentariosQuery();
  const {
    data: dataPost,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPost,
  } = useMostrarPostQuery();
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    const handleScroll = () => {
      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useSupabaseSubscription({
    channelName: "public:publicaciones",
    options: { event: "*", schema: "public", table: "publicaciones" },
    queryKey: ["mostrar post"],
  });

  useSupabaseSubscription({
    channelName: "public:comentarios",
    options: { event: "*", schema: "public", table: "comentarios" },
    queryKey: ["mostrar comentarios"],
  });

  useSupabaseSubscription({
    channelName: "public:respuestas_comentarios",
    options: { event: "*", schema: "public", table: "respuestas_comentarios" },
    queryKey: ["mostrar respuesta comentario"],
  });

  return (
    <main className="flex min-h-screen bg-white dark:bg-bg-dark max-w-[1200px] mx-auto">
      <FormActualizarPerfil />
      <Toaster position="top-left" />
      {stateForm && <FormPost />}
      <section className="flex flex-col w-full h-screen">
        <article className="flex flex-col h-screen overflow-hidden border border-gray-200 border-t-0 border-b-0 dark:border-gray-600">
          <HeaderSticky position="top-left" />
          <div ref={scrollRef} className="overflow-y-auto">
            <InputPublicar />
            {dataPost?.pages?.map((page, pageIndex) =>
              page?.map((item, index) => (
                <PublicacionCard key={`${pageIndex}-${index}`} item={item} />
              ))
            )}
            {isFetchingNextPage && <SpinnerLocal />}
          </div>
        </article>
        <article>Sidebar derecho</article>
      </section>
      {showModal && <ComentarioModal />}
    </main>
  );
};
