import { Icon } from "@iconify/react";
import { usePostStore } from "../../../store/PostStore";

export const BtnNewPost = () => {
  const { setStateForm } = usePostStore();
  return (
    <button
      onClick={() => setStateForm(true)}
      className="mt-3 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-full hover:bg-primary/85 hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer w-full"
    >
      <Icon icon="mdi:plus" width={20} height={20} />
      <span className="hidden sm:block text-sm">Publicar</span>
    </button>
  );
};
