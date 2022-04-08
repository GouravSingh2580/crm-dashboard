import { Components } from '@mui/material';
import { MAIN_COLOR } from 'theme/constant';

export const list: Components = {
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: MAIN_COLOR,
        opacity: 0.7,
      },
    },
  },
  MuiListItemSecondaryAction: {
    styleOverrides: {
      root: {
        svg: {
          color: MAIN_COLOR,
          opacity: 0.7,
        },
      },
    },
  },
};
