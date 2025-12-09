import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale("es");

dayjs.updateLocale("es", {
  relativeTime: {
    future: "en %s",
    past: "hace %s",
    s: "unos segundos",
    m: "un minuto",
    mm: "%d min",
    h: "una hora",
    hh: "%d h",
    d: "un día",
    dd: "%d días",
    M: "un mes",
    MM: "%d meses",
    y: "un año",
    yy: "%d años",
  },
});

export function useRelativeTime(date) {
  return dayjs(date).fromNow();
}
