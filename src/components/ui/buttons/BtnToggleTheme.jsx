import { Icon } from "@iconify/react";
import { useThemeStore } from "../../../store/ThemeStore";

export const BtnToggleTheme = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <button
      className="flex items-center gap-3 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all justify-center sm:justify-start cursor-pointer w-full"
      onClick={setTheme}
    >
      <Icon
        icon={theme === "light" ? "mdi:weather-sunny" : "mdi:weather-night"}
        width={22}
        height={22}
      />
      <span className="hidden sm:block text-sm font-medium">
        {theme === "light" ? "Modo oscuro" : "Modo claro"}
      </span>
    </button>
  );
};
