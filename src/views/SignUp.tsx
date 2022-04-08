import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';

import { Routes } from '../fnRoutes';

const SignUp = () => {
  const history = useHistory();

  const { user, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!user) {
      loginWithRedirect({
        screen_hint: 'signup',
        // login_hint: CONFIG.suggestLoginUser ? '' : '',
        login_hint: '',
        redirectUri: `${window.location.origin}/postlogin`,
      });
    } else {
      history.push(Routes.HOME());
    }
  }, [user]);

  return <div />;
};

export default SignUp;
