import { Icon } from "@iconify/react";
import { usePostStore } from "../../../store/PostStore";

export const BtnNewPost = () => {
  const { setStateForm } = usePostStore();
  return (
    <button
      onClick={() => setStateForm(true)}
      className="mt-2 flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-4 rounded-full hover:bg-primary/90 transition-all cursor-pointer w-full"
    >
      <Icon icon="mdi:plus" width={20} height={20} />
      <span className="hidden sm:block">NUEVA PUBLICACIÓN</span>
    </button>
  );
};
