import { Components } from '@mui/material';

export const accordion: Components = {
  MuiAccordion: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        border: '1px solid rgba(13, 34, 89, 0.23)',
        boxSizing: 'border-box',
        borderRadius: '5px',
        marginBottom: '24px',
        '@media (min-width:768px)': {
          padding: '20px 24px',
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      expandIconWrapper: {
        margin: '20px 0',
      },
      content: {
        margin: '20px 0',
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
      },
    },
  },
};
