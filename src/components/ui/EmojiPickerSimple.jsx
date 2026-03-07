import { useState } from "react";
import { Icon } from "@iconify/react";

const CATEGORIAS = [
  {
    icon: "mdi:emoticon-outline",
    label: "Smileys & Emotion",
    emojis: [
      "😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊",
      "😋","😎","😍","🥰","😘","😗","😙","😚","🙂","🤗",
      "🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥",
      "😮","🤐","😯","😪","😫","🥱","😴","😌","😛","😜",
      "😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","😷",
      "🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","💫",
      "🤯","🤠","🥳","🥸","😎","🤓","🧐","😭","😢","😤",
      "😡","🤬","😠","💀","👻","😈","👿","🤡","👹","👺",
    ],
  },
  {
    icon: "mdi:hand-wave-outline",
    label: "Gestos",
    emojis: [
      "👍","👎","👏","🙌","🤝","🫶","💪","🤞","✌️","🤙",
      "👈","👉","👆","👇","☝️","✋","🤚","🖐","🖖","👋",
      "🤟","🤘","🤙","💅","🫵","🫱","🫲","🫳","🫴","🙏",
    ],
  },
  {
    icon: "mdi:heart-outline",
    label: "Símbolos",
    emojis: [
      "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔",
      "❤️‍🔥","❤️‍🩹","💕","💞","💓","💗","💖","💘","💝","💟",
      "🔥","✨","💯","⭐","🌟","💫","⚡","🎉","🎊","🏆",
      "🎯","💡","🚀","🌈","☀️","🌙","🌊","💎","🔮","🪄",
    ],
  },
  {
    icon: "mdi:paw-outline",
    label: "Animales",
    emojis: [
      "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
      "🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧",
      "🐦","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝",
      "🐛","🦋","🐌","🐞","🐜","🦟","🦗","🦂","🐢","🐍",
    ],
  },
  {
    icon: "mdi:food-apple-outline",
    label: "Comida",
    emojis: [
      "🍕","🍔","🍟","🌭","🍿","🧂","🥓","🥚","🍳","🧇",
      "🥞","🧈","🍞","🥐","🥖","🫓","🥨","🥯","🧀","🥗",
      "🍜","🍝","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍘",
      "🍥","🥮","🍡","🧁","🍰","🎂","🍮","🍭","🍬","🍫",
      "🍩","🍪","🌰","🥜","🍯","🧃","🥤","🧋","☕","🍵",
    ],
  },
  {
    icon: "mdi:airplane-outline",
    label: "Viajes",
    emojis: [
      "🚗","🚕","🚙","🚌","🚎","🏎","🚓","🚑","🚒","🚐",
      "🛻","🚚","🚛","🚜","🏍","🛵","🚲","🛴","🛺","🚁",
      "✈️","🛸","🚀","🛶","⛵","🚤","🛥","🛳","⛴","🚢",
      "🗺","🗼","🗽","🗿","🏰","🏯","🏟","🎡","🎢","🎠",
    ],
  },
  {
    icon: "mdi:basketball-outline",
    label: "Actividades",
    emojis: [
      "⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱",
      "🏓","🏸","🏒","🥍","🏑","🏏","🪃","🥅","⛳","🪁",
      "🎣","🤿","🎽","🎿","🛷","🥌","🎯","🪀","🪆","🎮",
      "🎲","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎸",
    ],
  },
];

export const EmojiPickerSimple = ({ onEmojiClick, onClose }) => {
  const [categoriaActiva, setCategoriaActiva] = useState(0);

  return (
    <>
      <div className="fixed inset-0 z-60" onClick={onClose} />
      <div className="absolute bottom-10 right-0 z-70 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden w-72">
        {/* Categorías */}
        <div className="flex items-center gap-1 px-2 pt-2 pb-1 border-b border-neutral-700">
          {CATEGORIAS.map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCategoriaActiva(i)}
              className={`flex-1 flex items-center justify-center p-1.5 rounded-lg transition-colors cursor-pointer ${
                categoriaActiva === i
                  ? "bg-neutral-700 text-white"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
              title={cat.label}
            >
              <Icon icon={cat.icon} className="text-base" />
            </button>
          ))}
        </div>

        {/* Título categoría */}
        <div className="px-3 py-2">
          <span className="text-white font-semibold text-sm">
            {CATEGORIAS[categoriaActiva].label}
          </span>
        </div>

        {/* Emojis */}
        <div className="grid grid-cols-10 gap-0.5 px-2 pb-2 max-h-52 overflow-y-auto">
          {CATEGORIAS[categoriaActiva].emojis.map((emoji, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { onEmojiClick(emoji); onClose(); }}
              className="text-xl hover:bg-neutral-700 rounded-lg p-1 cursor-pointer transition-colors flex items-center justify-center"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};