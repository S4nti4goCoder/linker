import * as nsfwjs from "nsfwjs";

let model = null;

const loadModel = async () => {
  if (!model) {
    model = await nsfwjs.load();
  }
  return model;
};

/**
 * Analiza una imagen (File o Blob) y retorna si es NSFW.
 * Retorna { nsfw: boolean, category: string | null }
 */
export const checkImage = async (file) => {
  try {
    const img = new Image();
    const url = URL.createObjectURL(file);

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    const nsfwModel = await loadModel();
    const predictions = await nsfwModel.classify(img);
    URL.revokeObjectURL(url);

    // Categorías NSFW: Porn, Hentai, Sexy
    const nsfw = predictions.find(
      (p) =>
        (p.className === "Porn" && p.probability > 0.6) ||
        (p.className === "Hentai" && p.probability > 0.6) ||
        (p.className === "Sexy" && p.probability > 0.8)
    );

    return {
      nsfw: !!nsfw,
      category: nsfw?.className || null,
    };
  } catch {
    // Si falla la detección, permitir el contenido
    return { nsfw: false, category: null };
  }
};

export const NSFW_BLOCKED_MESSAGE =
  "La imagen fue bloqueada porque contiene contenido inapropiado. LinKer prohíbe contenido +18.";
