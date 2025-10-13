import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme';
import RootRoutes from './routes';
import {CssBaseline} from "@mui/material";

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {AuthProvider} from "./contexts/AuthProvider";

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
          <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthProvider>
                  <RootRoutes />
              </AuthProvider>
          </ThemeProvider>
          {/* 개발 환경에서만 DevTools 표시 */}
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
  );
};

export default App;