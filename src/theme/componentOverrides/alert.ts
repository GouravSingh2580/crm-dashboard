import { MAIN_COLOR, SECONDARY_COLOR } from 'theme/constant';
import { Components } from '@mui/material';

export const alert: Components = {
  MuiAlert: {
    styleOverrides: {
      filledInfo: {
        backgroundColor: `${MAIN_COLOR}`,
      },
      filledSuccess: {
        backgroundColor: `${SECONDARY_COLOR}`,
      },
    },
  },
};
