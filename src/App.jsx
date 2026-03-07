import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyRoutes } from "./routers/router";
import { useThemeStore } from "./store/ThemeStore";
import { useEffect } from "react";
import { FormPost } from "./components/Forms/FormPost";
import { usePostStore } from "./store/PostStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
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
    <QueryClientProvider client={queryClient}>
      {stateForm && <FormPost />}
      <MyRoutes />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;