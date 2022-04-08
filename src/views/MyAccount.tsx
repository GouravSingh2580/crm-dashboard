import { Container, Typography, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlainLayout } from '../layouts';
import { PersonalInfo, CurrentPackage } from '../components/myAccount';

const useStyles = makeStyles((theme) => ({
  content: {
    margin: theme.spacing(4, 'auto'),
  },
  title: {
    fontWeight: 800,
    paddingBottom: theme.spacing(5),
  },
  paper: {},
  secondColumn: {
    paddingBottom: theme.spacing(2),
  },
}));

const MyAccount = () => {
  const classes = useStyles();
  return (
    <PlainLayout>
      <Container maxWidth="lg" component="main" className={classes.content}>
        <Typography variant="h4" component="h4" className={classes.title}>
          Accounts section
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <PersonalInfo />
          </Grid>
          <Grid item xs={12} md={6} direction="column">
            <Grid item xs={12} className={classes.secondColumn}>
              <CurrentPackage />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </PlainLayout>
  );
};

export default MyAccount;
