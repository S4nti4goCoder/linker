import { Icon } from "@iconify/react";

export const ImageSelectorFoto = ({ fileUrl = "-" }) => {
  return (
    <div className="text-center mb-5">
      <div className="relative inline-block">
        <img
          src={
            fileUrl !== "-" ? fileUrl : "https://i.ibb.co/39y0kysq/subir.png"
          }
          alt="imagen select"
          className="w-20 h-20 rounded-lg object-cover transition-transform duration-300 hover:scale-105"
        />
        <button className="absolute top-2 left-14 w-7 h-7 bg-neutral-800 hover:bg-neutral-600 text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer">
          <Icon icon="lets-icons:edit-fill" className="text-[18px]" />
        </button>
        <input
          accept="image/jpeg, image/png,/*"
          type="file"
          className="hidden"
        />
      </div>
    </div>
  );
};
