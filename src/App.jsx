import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyRoutes } from "./routers/router";
import { useThemeStore } from "./store/ThemeStore";
import { useEffect } from "react";
import { FormPost } from "./components/Forms/FormPost";
import { usePostStore } from "./store/PostStore";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  const { theme } = useThemeStore();
  const { stateForm } = usePostStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-left" richColors />
        {stateForm && <FormPost />}
        <MyRoutes />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
