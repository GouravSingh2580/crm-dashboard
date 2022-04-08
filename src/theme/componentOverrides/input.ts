import { Components } from '@mui/material';

export const input: Components = {
  MuiInputLabel: {
    styleOverrides: {
      asterisk: {
        color: 'red',
      },
      root: {
        fontSize: '15px',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        padding: 0,
        input: {
          padding: '13px 12px 13px 12px',
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: {
        padding: '13px 12px 13px 12px',
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      inputRoot: {
        padding: '5px 8px 5px 6px',
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: '12px',
        lineHeight: '20px',
        fontWeight: 500,
        color: 'rgba(13, 34, 89, 0.7)',
        margin: '3px 1px 0 1px',
      },
    },
  },
};
