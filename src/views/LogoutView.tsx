import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useLogout } from 'hooks';
import { useHistory } from 'react-router-dom';
import { AuthService } from 'services';
import { Routes } from '../fnRoutes';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: `0 ${theme.spacing(2)}`,
    textAlign: 'center',
  },
}));

const LogoutView = () => {
  const classes = useStyles();
  const { logout } = useLogout();
  const history = useHistory();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (AuthService.userToken()) {
      setShow(true);
      logout();
    } else {
      // if already coming from auth0 logout redirect
      history.push(Routes.LOGIN);
    }
  }, []);

  return (
    <div className={classes.root}>
      {show && <h2>You are getting logged out ...</h2>}
    </div>
  );
};

export default LogoutView;
