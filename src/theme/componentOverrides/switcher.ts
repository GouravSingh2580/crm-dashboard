import { Components } from '@mui/material';
import { SECONDARY_COLOR } from 'theme/constant';

export const switcher: Components = {
  MuiSwitch: {
    styleOverrides: {
      root: {
        '&.Mui-completed': {
          color: SECONDARY_COLOR,
        },
        '&.Mui-active': {
          color: '#FF9800',
        },
      },
    },
  },
};
