import { useAuth0 } from '@auth0/auth0-react';
import { AuthService } from 'services';
import { CONFIG } from 'config';
import { resetIdentity } from 'helpers/heap';

function useLogout() {
  const { logout: logoutAuth0 } = useAuth0();

  const logout = () => {
    AuthService.clearAllData();
    resetIdentity(); // reset heap identity
    logoutAuth0({
      returnTo: CONFIG.logoutUrl,
    });
  };

  return {
    logout,
  };
}

export default useLogout;
