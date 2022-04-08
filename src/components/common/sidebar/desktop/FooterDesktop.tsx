import { useState } from 'react';
import withStyles from '@mui/styles/withStyles';
import {
  List,
  Menu,
  MenuItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Theme,
  IconButton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { Routes } from 'fnRoutes';
import { useAccount } from 'hooks/api/useAccounts';
import { useCurrentUser } from '../../../../hooks/api';
import { ManagerInfoDesktop } from './ManagerInfoDesktop';
import { useSidebarOpen } from './sidebarContext';

const FooterMenuItem = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '.MuiListItemIcon-root': {
      minWidth: '50px',
    },
  },
}))(ListItemButton) as typeof ListItemButton;
const MenuItemText = withStyles((theme: Theme) => ({
  primary: {
    ...theme.typography.body2S,
  },
}))(ListItemText);
const SubMenuItem = withStyles((theme: Theme) => ({
  root: {
    ...theme.typography.body2S,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))(MenuItem) as typeof MenuItem;

interface Props {
  logoutUser: () => void;
}

export const FooterDesktop = ({ logoutUser }: Props) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const { currentUser } = useCurrentUser();

  const handleClick = (event: { currentTarget: EventTarget }) => {
    if (!anchorEl) {
      setAnchorEl(event.currentTarget as Element);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path: string) => {
    setAnchorEl(null);
    history.push(path);
  };
  const { account } = useAccount(currentUser?.accountId);
  const name = get(currentUser, 'name.first', 'Customer');
  const showManagerInfo =
    currentUser?.role === 'Customer' && account?.csm?.name;
  const sidebarOpen = useSidebarOpen();
  const hideStyle = !sidebarOpen ? { opacity: 'none' } : {};

  return (
    <div>
      <List>
        {showManagerInfo && currentUser && sidebarOpen && (
          <ManagerInfoDesktop
            customerName={currentUser.name}
            account={account}
          />
        )}
        <FooterMenuItem sx={{ paddingTop: 3, paddingBottom: 3 }}>
          <ListItemIcon aria-label="profile">
            <AccountCircleIcon fontSize="medium" />
          </ListItemIcon>
          <MenuItemText sx={hideStyle}>{name}</MenuItemText>
          <ListItemSecondaryAction sx={!sidebarOpen ? { display: 'none' } : {}}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <SubMenuItem onClick={() => navigateTo(Routes.MY_ACCOUNT)}>
                <ListItemIcon aria-label="my account">
                  <AccountCircleIcon />
                </ListItemIcon>
                <MenuItemText>My Account</MenuItemText>
              </SubMenuItem>
              <SubMenuItem
                onClick={handleClose}
                component="a"
                href="mailto:team@formationscorp.com"
              >
                <ListItemIcon aria-label="contact support">
                  <EmailIcon />
                </ListItemIcon>
                <MenuItemText>Contact Support</MenuItemText>
              </SubMenuItem>
            </Menu>
          </ListItemSecondaryAction>
        </FooterMenuItem>
        <FooterMenuItem
          component="a"
          href="https://learn.formationscorp.com/"
          target="_blank"
        >
          <ListItemIcon>
            <HelpOutlineIcon fontSize="medium" />
          </ListItemIcon>
          <MenuItemText sx={hideStyle}>
            Help Center
          </MenuItemText>
        </FooterMenuItem>
        <FooterMenuItem onClick={logoutUser}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="medium" />
          </ListItemIcon>
          <MenuItemText sx={hideStyle}>
            Log out
          </MenuItemText>
        </FooterMenuItem>
      </List>
    </div>
  );
};
