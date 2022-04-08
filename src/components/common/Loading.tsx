import { CircularProgress, Backdrop } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: Math.max(theme.zIndex.drawer, theme.zIndex.modal) + 1,
    color: '#fff',
  },
}));

export const Loading = () => {
  const classes = useStyles();

  return (
    <Backdrop open className={classes.backdrop} data-testid="loading">
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
