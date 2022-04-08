import { MAIN_COLOR } from 'theme/constant';
import { Components } from '@mui/material';

export const tab: Components = {
  MuiTabs: {
    styleOverrides: {
      scroller: {
        borderBottom: `1px solid ${MAIN_COLOR}`,
      },
    },
  },
};
