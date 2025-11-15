import { useRef, useState } from "react";
import { usePostStore } from "../store/PostStore";
import imageCompression from "browser-image-compression";

export const useImageSelector = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFiletype] = useState("");
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { setFile: setFilePost } = usePostStore();
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const sizeMB = selectedFile.size / (1024 * 1024);
    const type = selectedFile.type;
    if (!type.startsWith("image/") && !type.startsWith("video/")) {
      alert("Solo se permiten imágenes o videos.");
      return;
    }
    if (type.startsWith("image/")) {
      if (sizeMB > 2) {
        alert("El archivo supera el límite de 8MB");
        return;
      }
      try {
        const options = {
          maxSizeMB: sizeMB > 1 ? 0.1 : 0.2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(selectedFile, options);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => setFileUrl(reader.result);
        setFile(compressedFile);
        setFilePost(compressedFile);
        setFiletype("image");
      } catch (error) {
        console.log("Error al comprimir la imagen:", error);
        alert("Error al procesar la imagen.");
      }
    } else {
      const videoUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setFilePost(selectedFile);
      setFileUrl(videoUrl);
      setFiletype("video");
    }
  };
  return file, fileUrl, fileType, fileInputRef, handleImageChange;
};

export const ImageSelector = () => {
  const { file, fileUrl, fileType, fileInputRef, handleImageChange } =
    useImageSelector();
  return (
    <div>
      imagen,video
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onClick={handleImageChange}
      />
    </div>
  );
};
