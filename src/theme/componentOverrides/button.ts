import { alpha, Components } from '@mui/material';

export const button: Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'inherit',
        fontWeight: 700,
      },
    },
    variants: [
      {
        props: { size: 'large' },
        style: {
          paddingTop: '10px',
          paddingBottom: '6px',
        },
      },
      {
        props: { size: 'medium' },
        style: {
          paddingTop: '6px',
          paddingBottom: '4px',
        },
      },
      {
        props: {
          variant: 'outlined',
          color: 'secondary',
        },
        style: {
          '&:hover': {
            backgroundColor: alpha('#79BD7B', 0.18),
          },
        },
      },
    ],
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        textTransform: 'inherit',
        fontWeight: 'inherit',
        fontFamily: 'inherit',
        fontSize: 'inherit',
      },
    },
  },
};
