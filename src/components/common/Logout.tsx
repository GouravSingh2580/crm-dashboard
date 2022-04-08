import { Button } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useLogout } from '../../hooks';

export const Logout = () => {
  const { logout } = useLogout();

  return (
    <Button
      sx={{ ml: '2%' }}
      onClick={logout}
      data-testid="logout"
      variant="outlined"
      startIcon={<ExitToAppIcon />}
    >
      Log Out
    </Button>
  );
};
