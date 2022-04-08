import { createTheme, Theme } from '@mui/material/styles';
import React from 'react';
import { typography } from './typography';
import { palette } from './palette';
import { components } from './components';

/** override theme attribute * */
declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
  interface TypeText {
    primary: string;
    secondary: string;
    disabled: string;
    hint?: string;
  }
}
declare module '@mui/material/styles' {
  interface DefaultTheme extends Theme {}
  interface TypographyVariants {
    h1B: React.CSSProperties;
    h2B: React.CSSProperties;
    h3B: React.CSSProperties;
    h4B: React.CSSProperties;
    h5B: React.CSSProperties;
    h6B: React.CSSProperties;
    h7B: React.CSSProperties;
    h8B: React.CSSProperties;
    h9B: React.CSSProperties;
    subtitle1XL: React.CSSProperties;
    subtitle1L: React.CSSProperties;
    subtitle1LT: React.CSSProperties;
    subtitle1MB: React.CSSProperties;
    subtitle1M: React.CSSProperties;
    body1XL: React.CSSProperties;
    body1L: React.CSSProperties;
    body1M: React.CSSProperties;
    body1B: React.CSSProperties;
    body1S: React.CSSProperties;
    body2B: React.CSSProperties;
    body2S: React.CSSProperties;
    body3: React.CSSProperties;
    body3B: React.CSSProperties;
    body3S: React.CSSProperties;
    inputLabel: React.CSSProperties;
    helperText: React.CSSProperties;
    inputText: React.CSSProperties;
    tooltip: React.CSSProperties;
    menu: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    h1B: React.CSSProperties;
    h2B: React.CSSProperties;
    h3B: React.CSSProperties;
    h4B: React.CSSProperties;
    h5B: React.CSSProperties;
    h6B: React.CSSProperties;
    h7B: React.CSSProperties;
    h8B: React.CSSProperties;
    h9B: React.CSSProperties;
    subtitle1XL: React.CSSProperties;
    subtitle1L: React.CSSProperties;
    subtitle1LT: React.CSSProperties;
    subtitle1MB: React.CSSProperties;
    subtitle1M: React.CSSProperties;
    body1XL: React.CSSProperties;
    body1L: React.CSSProperties;
    body1M: React.CSSProperties;
    body1B: React.CSSProperties;
    body1S: React.CSSProperties;
    body2B: React.CSSProperties;
    body2S: React.CSSProperties;
    body3: React.CSSProperties;
    body3B: React.CSSProperties;
    body3S: React.CSSProperties;
    inputLabel: React.CSSProperties;
    helperText: React.CSSProperties;
    inputText: React.CSSProperties;
    tooltip: React.CSSProperties;
    menu: React.CSSProperties;
  }

  interface PaletteColor {
    background?: string;
    border?: string;
    textDark?: string;
    lightBg?: string;
    lightest?: string;
    lighter?: string;
    lightDark?: string;
    divider?: string;
  }
  interface SimplePaletteColorOptions {
    background?: string;
    border?: string;
    textDark?: string;
    lightBg?: string;
  }
  interface OtherOptions {
    stroke: string;
    divider: string;
    backdrop: string;
    background: string;
    snakebar: string;
    yellow: string;
    blue: string,
    backgroundNew: string,
    newOrange: string,
    newYellow: string,
    mint: string,
    newLightBlue: string,
  }
  interface Palette {
    others: OtherOptions;
    textHint: string;
    gray: PaletteColor;
    graylight: PaletteColor;
    blue: PaletteColor;
  }
  interface PaletteOptions {
    others: OtherOptions;
    textHint?: string;
    gray?: {
      main: string;
      lightest: string;
      lighter: string;
      lightDark: string;
      divider: string;
    };
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1B: true;
    h2B: true;
    h3B: true;
    h4B: true;
    h5B: true;
    h6B: true;
    h7B: true;
    h8B: true;
    h9B: true;
    subtitle1XL: true;
    subtitle1L: true;
    subtitle1LT: true;
    subtitle1MB: true;
    subtitle1M: true;
    body1XL: true;
    body1L: true;
    body1M: true;
    body1B: true;
    body1S: true;
    body2B: true;
    body2S: true;
    body3: true;
    body3B: true;
    body3S: true;
    inputLabel: true;
    helperText: true;
    inputText: true;
    tooltip: true;
    menu: true;
  }
}

export const theme = createTheme({
  typography,
  palette,
  components,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
});
