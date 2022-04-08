import { Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

export const PageTitle = withStyles((theme) => ({
  root: {
    fontWeight: 200,
    fontSize: '34px',
    lineHeight: '1.2em',
    color: theme.palette.text.secondary,
  },
}))(Typography) as typeof Typography;
