import { useRef, useState } from "react";
import { usePostStore } from "../store/PostStore";
import imageCompression from "browser-image-compression";
import { Icon } from "@iconify/react";

export const useImageSelector = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFiletype] = useState("");
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { setFile: setFilePost } = usePostStore();

  const openFileSelector = () => fileInputRef.current?.click();

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
      if (sizeMB > 2) { alert("El archivo supera el límite de 8MB"); return; }
      try {
        const options = { maxSizeMB: sizeMB > 1 ? 0.1 : 0.2, maxWidthOrHeight: 1920, useWebWorker: true };
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

  const removeImage = () => {
    setFile(null); setFileUrl(""); setFiletype("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver  = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    await handleImageChange({ target: { files: [droppedFile] } });
  };

  return {
    file, fileUrl, fileType, fileInputRef,
    handleImageChange, openFileSelector, removeImage,
    isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop,
  };
};

export const useImageSelectorEdit = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFiletype] = useState("");
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFileSelector = () => fileInputRef.current?.click();

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
      if (sizeMB > 2) { alert("El archivo supera el límite de 8MB"); return; }
      try {
        const options = { maxSizeMB: sizeMB > 1 ? 0.1 : 0.2, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(selectedFile, options);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => setFileUrl(reader.result);
        setFile(compressedFile);
        setFiletype("image");
      } catch (error) {
        console.log("Error al comprimir la imagen:", error);
        alert("Error al procesar la imagen.");
      }
    } else {
      const videoUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setFileUrl(videoUrl);
      setFiletype("video");
    }
  };

  const removeFile = () => {
    setFile(null); setFileUrl(""); setFiletype("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver  = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDrop = async (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    await handleImageChange({ target: { files: [droppedFile] } });
  };

  return {
    file, fileUrl, fileType, fileInputRef,
    handleImageChange, openFileSelector, removeFile,
    isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop,
  };
};

export const ImageSelector = () => {
  const { setStateImage } = usePostStore();
  const {
    fileUrl, fileType, fileInputRef,
    handleImageChange, openFileSelector, removeImage,
    isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop,
  } = useImageSelector();

  return (
    <section className="relative w-full max-w-md bg-[#242526] rounded-lg shadow-xl overflow-hidden">
      <header className="relative h-12 flex items-center justify-center border-b border-gray-700">
        <h2 className="text-white font-medium">Agregar fotos/videos</h2>
        <button
          onClick={setStateImage}
          className="absolute right-4 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          <Icon icon="mdi:close" className="text-xl" />
        </button>
      </header>
      <main
        className={`p-8 flex flex-col items-center justify-center min-h-60 transition-colors duration-300 ${
          isDragging ? "bg-[#3a3b3c]" : "bg-[#242526]"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {fileUrl ? (
          <div className="relative inline-block group">
            {fileType === "image" ? (
              <img src={fileUrl} className="w-full max-w-[280px] max-h-[280px] rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
            ) : (
              <video controls src={fileUrl} className="w-full max-w-[280px] max-h-[280px] rounded-lg object-contain" />
            )}
            <button onClick={removeImage} type="button" className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-60 rounded-full border-none cursor-pointer flex items-center justify-center transition duration-300 opacity-0 group-hover:opacity-100 hover:bg-opacity-80">
              <Icon icon="mdi:close" className="text-white text-lg" />
            </button>
            <button type="button" onClick={openFileSelector} className="absolute bottom-2 right-2 w-8 h-8 bg-black bg-opacity-60 rounded-full border-none cursor-pointer flex items-center justify-center transition duration-300 opacity-0 group-hover:opacity-100 hover:bg-opacity-80">
              <Icon icon="lets-icons:edit-fill" className="text-white text-lg" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#3a3b3c] flex items-center justify-center mb-4">
              <Icon icon="mdi:video-image" className="text-3xl text-[#e4e6eb]" />
            </div>
            <h3 className="text-white text-lg font-medium mb-1">Agregar fotos/videos</h3>
            <p className="text-gray-400 text-sm">o arrastra y suelta</p>
            <button onClick={openFileSelector} className="mt-6 px-4 py-2 bg-[#3a3b3c] text-white rounded-lg hover:bg-[#4a4b4c] transition-colors duration-200">
              Seleccionar archivos
            </button>
          </>
        )}
      </main>
      <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
    </section>
  );
};

export const ImageSelectorEdit = ({ onFileSelect, onRemove }) => {
  const {
    fileUrl, fileType, fileInputRef,
    handleImageChange: baseHandleChange, openFileSelector, removeFile,
    isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop,
  } = useImageSelectorEdit();

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (onFileSelect) onFileSelect(selectedFile);
    await baseHandleChange(e);
  };

  const handleRemove = () => {
    removeFile();
    if (onRemove) onRemove();
  };

  return (
    <div
      className={`rounded-lg border-2 border-dashed transition-colors duration-300 ${
        isDragging ? "border-primary bg-primary/10" : "border-gray-600"
      } p-4`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {fileUrl ? (
        <div className="relative inline-block group w-full">
          {fileType === "image" ? (
            <img src={fileUrl} className="w-full max-h-[200px] rounded-lg object-contain" />
          ) : (
            <video controls src={fileUrl} className="w-full max-h-[200px] rounded-lg object-contain" />
          )}
          <button onClick={handleRemove} type="button" className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-60 rounded-full cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Icon icon="mdi:close" className="text-white text-lg" />
          </button>
          <button type="button" onClick={openFileSelector} className="absolute bottom-2 right-2 w-8 h-8 bg-black bg-opacity-60 rounded-full cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Icon icon="lets-icons:edit-fill" className="text-white text-lg" />
          </button>
        </div>
      ) : (
        <button onClick={openFileSelector} type="button" className="w-full flex flex-col items-center gap-2 py-4 text-gray-400 hover:text-gray-300 cursor-pointer">
          <Icon icon="mdi:image-plus" className="text-3xl" />
          <span className="text-sm">Agregar foto o video</span>
        </button>
      )}
      <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleChange} className="hidden" />
    </div>
  );
};