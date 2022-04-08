import { Components } from '@mui/material';

export const table: Components = {
  MuiTableContainer: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
  },
  MuiTable: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgba(13, 34, 89, 0.23)',
      },
      head: {
        backgroundColor: 'transparent',
        fontWeight: 700,
      },
      body: {
        backgroundColor: 'transparent',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      hover: {
        cursor: 'pointer',
      },
    },
  },
};
