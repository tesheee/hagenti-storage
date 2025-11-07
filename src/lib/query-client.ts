import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 минута кэша по умолчанию
      retry: 1, // Перезагрузка 1 раз при ошибке
    },
  },
});
