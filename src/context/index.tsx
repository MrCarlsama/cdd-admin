import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
