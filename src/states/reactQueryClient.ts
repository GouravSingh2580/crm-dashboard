import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      // The time in milliseconds after data is considered stale
      staleTime: 1000 * 60 * 5,
      // The time in milliseconds that unused/inactive cache data remains in memory
      cacheTime: 1000 * 60 * 5,
    },
  },
});

/**
 * @deprecated use named export instead
 */
export default queryClient;
