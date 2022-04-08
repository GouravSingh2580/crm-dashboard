import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { theme } from 'theme';

// eslint-disable-next-line max-len
export const wrapThemeProvider = (Component: ReactNode) => (
  <ThemeProvider theme={theme}>{Component}</ThemeProvider>
);

export const MockTheme = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

