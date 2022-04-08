import { PaletteOptions } from '@mui/material';
import { MAIN_COLOR, SECONDARY_COLOR } from './constant';

export const palette: PaletteOptions = {
  textHint: 'rgba(13, 34, 89, 0.5)',
  text: {
    primary: MAIN_COLOR,
    secondary: 'rgba(13, 34, 89, 0.7)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  primary: {
    main: MAIN_COLOR,
    dark: '#172447',
    light: '#26428B',
    background: 'linear-gradient(0deg, rgba(13, 34, 89, 0.1), rgba(13, 34, 89, 0.1)), #FFFFFF',
    border: 'rgba(13, 34, 89, 0.5)',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: SECONDARY_COLOR,
    dark: '#36B73A',
    light: '#9EF2A1',
    background: 'linear-gradient(0deg, rgba(121, 189, 123, 0.18), rgba(121, 189, 123, 0.18)), #FFFFFF',
    border: 'rgba(112, 189, 114, 0.72)',
    contrastText: '#172447',
  },
  success: {
    main: '#317E4F',
    dark: '#27633E',
    light: '#3B965E',
    textDark: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), #317E4F',
    lightBg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #317E4F',
    border: 'rgba(49, 126, 79, 0.5)',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#1A73E8',
    dark: '#0F55B0',
    light: '#4493FB',
    textDark: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), #1A73E8',
    lightBg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #2196F3',
    border: 'rgba(26, 115, 232, 0.5)',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF9800',
    dark: '#C77700',
    light: '#FFB547',
    textDark: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), #FF9800',
    lightBg: '#FFF1C6',
    border: 'rgba(255, 152, 0, 0.5)',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  error: {
    main: '#E81C0D',
    dark: '#D10808',
    light: '#FF3C2E',
    textDark: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), #E81C0D',
    lightBg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #E81C0D',
    border: 'rgba(232, 28, 13, 0.4)',
    contrastText: '#FFFFFF',
  },
  others: {
    stroke: 'rgba(13, 34, 89, 0.23)',
    divider: '#E0E0E0',
    backdrop: 'rgba(13, 34, 89, 0.6)',
    background: '#F2F3F6',
    snakebar: 'rgba(70, 83, 86, 1)',
    yellow: '#FFC700',
    blue: '#4A7BFB',
    backgroundNew: '#F5F6FA',
    newOrange: '#FEB26C',
    newYellow: '#FEDF6C',
    mint: '#D8EE98',
    newLightBlue: '#A8CEDB'
  },
  // Todo - these custom color not in design system should be removed.
  // @ts-ignore
  onboardingBackground: {
    main: '#F2F3F6',
  },
  khaki: {
    main: '#E2E98B',
  },
  oasis: {
    main: '#FDE4C1',
  },
  spray: {
    main: '#8CE6ED',
  },
  gradient: {
    main: 'linear-gradient(180deg, #FCE4C0 0%, #EAF5EF 100%)',
  },
  gray: {
    main: '#757575',
    lightest: '#999999',
    lighter: '#979797',
    lightDark: '#f9f9f9',
    divider: '#BDBDBD',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#EEEEEE',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#9E9E9E',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  graylight: {
    main: 'rgba(0, 0, 0, 0.54)',
  },
  blue: {
    light: 'rgba(49, 126, 79, 0.08)',
    main: '#2196F3',
    lightest: '#F5F6FA',
  },
  black: {
    light: '#404040',
    lighter: 'rgba(0, 0, 0, 0.54)',
    main: 'rgba(0, 0, 0, 0.87)',
  },
  white: {
    light: 'rgba(255, 255, 255, 1)',
    main: '#fff',
    dark: '#E0E0E0',
  },
  border: {
    gray: '#cdcdcd',
  },
  yellow: {
    main: '#FFC700',
    light: '#FEDF6C',
    dark: 'rgba(253, 228, 193, 1)',
  },
};
