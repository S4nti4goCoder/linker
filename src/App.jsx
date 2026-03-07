import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyRoutes } from "./routers/router";
import { useThemeStore } from "./store/ThemeStore";
import { useState } from "react";

// Crear el QueryClient FUERA del componente
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30, // 30 segundos antes de considerar datos viejos
    },
  },
});

function App() {
  const { theme } = useThemeStore();
  document.documentElement.classList.toggle("dark", theme === "dark");

  return (
    <QueryClientProvider client={queryClient}>
      <MyRoutes />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
