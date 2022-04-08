import { Components } from '@mui/material';
import { SECONDARY_COLOR, MAIN_COLOR } from 'theme/constant';

export const stepper: Components = {
  MuiStepIcon: {
    styleOverrides: {
      root: {
        '&.Mui-completed': {
          color: SECONDARY_COLOR,
        },
        '&.Mui-active': {
          color: MAIN_COLOR,
        },
      },
    },
  },
  MuiStepper: {
    styleOverrides: {
      horizontal: {
        paddingBottom: '16px',
        overflowX: 'auto',
        overflowY: 'hidden',
      },
    },
  },
  MuiStepConnector: {
    styleOverrides: {
      line: {
        minHeight: '56px',
      },
    },
  },
};
