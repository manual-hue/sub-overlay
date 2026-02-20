import React from 'react';
import RootRoutes from './routes';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./features/auth/contexts/AuthProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5분
        },
    },
});

const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
              <RootRoutes />
          </AuthProvider>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
  );
};

export default App;
