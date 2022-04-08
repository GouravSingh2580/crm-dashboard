import makeStyles from '@mui/styles/makeStyles';
import { Divider as Separator } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(4, 0),
  },
}));

export const FormationsDivider = () => {
  const classes = useStyles();
  return <Separator className={classes.divider} />;
};
