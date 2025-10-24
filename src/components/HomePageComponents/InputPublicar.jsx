import { Icon } from "@iconify/react";

export const InputPublicar = () => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
      <input
        value={""}
        placeholder="Escribir nueva publicación..."
        className="w-full p-2 rounded focus:outline-none placeholder-gray-500"
      />
      <div className="flex gap-4 mt-2 text-gray-400">
        <Icon icon="mdi:image-outline" className="text-2xl" />
        <Icon icon="mdi:format-list-bulleted" className="text-2xl" />
        <Icon icon="mdi:gif" className="text-2xl" />
        <Icon icon="mdi:format-text" className="text-2xl" />
      </div>
    </div>
  );
};
