import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';

import { Documents as DocumentsComponent } from '../components/documents';
import useUserData from '../hooks/useUserData';
import useLoading from '../hooks/useLoading';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
    padding: theme.spacing(4, 15),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(4),
    },
  },
  title: {
    margin: theme.spacing(4, 0),
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const Documents = () => {
  const classes = useStyles();
  const { data: userData, isLoading } = useUserData();
  const loadingAnimation = useLoading(isLoading);

  return (
    <main className={classes.content}>
      <Typography className={classes.title} variant="h4" component="h4">
        Documents
      </Typography>

      {isLoading ? (
        loadingAnimation
      ) : (
        <DocumentsComponent
          companyId={userData?.company?.id || ''}
          accountId={userData?.userInfo?.accountId || ''}
        />
      )}
    </main>
  );
};

export default Documents;
