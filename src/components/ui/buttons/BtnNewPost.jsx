import { Icon } from "@iconify/react";

export const BtnNewPost = () => {
  return (
    <button className="mt-4 flex justify-center bg-primary hover:bg-primary/90 font-semibold p-2 px-4 rounded-full items-center gap-2 transition cursor-pointer">
      <Icon icon="ic:baseline-add" width={20} height={20} />
      <span className="hidden sm:block">NUEVA PUBLICACIÓN</span>
    </button>
  );
};
