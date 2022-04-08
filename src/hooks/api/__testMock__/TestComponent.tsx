import { QueryClient, QueryClientProvider } from 'react-query';
import { PropsWithChildren, ReactNode } from 'react';

export const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
export const warpQueryClientProvider = (Component: ReactNode) => (
  <QueryClientProvider client={mockedQueryClient}>
    {Component}
  </QueryClientProvider>
);

export const QueryWrapper = ({ children }: PropsWithChildren<{}>) => (
  <QueryClientProvider client={mockedQueryClient}>
    {children}
  </QueryClientProvider>
);

export const createQueryWrapper = () => ({ children }: any) => (
  <QueryWrapper>
    {children}
  </QueryWrapper>
);

export default createQueryWrapper;
