import { Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Title } from './Title';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
}));

export const PasswordAndSecurity = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <Title text="Password and Security" />
    </Paper>
  );
};
