import { Icon } from "@iconify/react";
import { useRef } from "react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

export const ImageSelectorFoto = ({ onFileChange, fileUrl }) => {
  const fileInputRef = useRef(null);

  const openFileSelector = () => fileInputRef.current.click();

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes.");
      return;
    }
    try {
      const options = {
        maxSizeMB: selectedFile.size > 1024 * 1024 ? 0.1 : 0.2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };
      const compressedFile = await imageCompression(selectedFile, options);
      const baseName = (compressedFile.name || "image").replace(/\.[^.]+$/, "");
      const webpFile = new File(
        [compressedFile],
        `${baseName}.webp`,
        { type: "image/webp" }
      );
      const fileReader = new FileReader();
      fileReader.readAsDataURL(webpFile);
      fileReader.onload = () => {
        onFileChange(webpFile, fileReader.result);
      };
    } catch (error) {
      toast.error("Error al comprimir la imagen.");
    }
  };

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
        <button
          onClick={openFileSelector}
          className="absolute top-2 left-14 w-7 h-7 bg-neutral-800 hover:bg-neutral-600 text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
        >
          <Icon icon="lets-icons:edit-fill" className="text-[18px]" />
        </button>
        <input
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/*"
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};
