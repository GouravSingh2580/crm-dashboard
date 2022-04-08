import { useState, useEffect, PropsWithChildren } from 'react';
import cx from 'clsx';
import { Link, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton, Menu, MenuItem } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useFlags } from 'hooks/useFeatureFlag';
import { IAction } from 'components/common/sidebar/constant';
import { Routes } from 'fnRoutes';
import { filterEnabledActions } from '../helpers';

const useStyles = makeStyles((theme) => ({
  text: {
    fontSize: theme.typography.body3.fontSize,
    color: theme.palette.text.primary,
    marginLeft: '5px',
    marginRight: theme.spacing(3),
  },
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    borderTop: `1px solid ${theme.palette.grey[500]}`,
    paddingBottom: theme.spacing(1),
  },
  icon: {
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIcon: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  menuIcon: {
    color: theme.palette.secondary.main,
  },
  action: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
  },
}));

interface Props {
  logoutUser: () => void;
  actions: IAction[];
}

export const SideBarMobile = ({
  children,
  actions,
  logoutUser,
}: PropsWithChildren<Props>) => {
  const classes = useStyles();
  const [activeIcon, setActiveIcon] = useState('');
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleClick = (event: { currentTarget: EventTarget }) => {
    setActiveIcon('menu');
    setAnchorEl(event.currentTarget as Element);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (window) {
      const icon = window.location.pathname.split('/')[2];
      setActiveIcon(icon);
    }
  }, []);

  const menu = (
    <div role="button">
      <IconButton
        className={cx(classes.icon, {
          [classes.activeIcon]: activeIcon === 'menu',
        })}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        data-testid="mobile-mi-menu"
        size="large"
      >
        <MenuIcon />
      </IconButton>
    </div>
  );

  const flags = useFlags();
  const enabledActions = filterEnabledActions(actions, flags);

  return (
    <div>
      <main>{children}</main>
      <BottomNavigation
        showLabels={false}
        className={classes.stickToBottom}
        data-testid="mobile-navigation"
      >
        {enabledActions.map((action) => {
          const { id, Icon, path } = action as IAction;
          const iconWrap = (
            <IconButton
              className={cx(classes.icon, {
                [classes.activeIcon]: activeIcon === id,
              })}
              onClick={() => setActiveIcon(id)}
              data-testid={`mobile-mi-${id}`}
            >
              <Icon />
            </IconButton>
          );
          return (
            <BottomNavigationAction
              icon={iconWrap}
              component={Link}
              to={path}
            />
          );
        })}
        <BottomNavigationAction icon={menu} component="div" />
      </BottomNavigation>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={handleClose}
          component="a"
          href="https://learn.formationscorp.com/"
          target="_blank"
        >
          <div className={classes.action}>
            <IconButton
              className={classes.menuIcon}
              aria-label="help"
              size="large"
            >
              <HelpOutlineIcon />
            </IconButton>
            <div className={classes.text}>Help Center</div>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div className={classes.action}>
            <IconButton
              className={classes.menuIcon}
              aria-label="my aacount"
              size="large"
              onClick={() => history.push(Routes.MY_ACCOUNT)}
            >
              <AccountCircleIcon />
            </IconButton>
            <div className={classes.text}>My Account</div>
          </div>
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="mailto:team@formations.corp"
          target="_blank"
        >
          <div className={classes.action}>
            <IconButton
              className={classes.menuIcon}
              aria-label="contact support"
              size="large"
            >
              <MailOutlineIcon />
            </IconButton>
            <div className={classes.text}>Contact Support</div>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div className={classes.action}>
            <IconButton
              className={classes.menuIcon}
              aria-label="logout"
              size="large"
              onClick={logoutUser}
            >
              <ExitToAppIcon />
            </IconButton>
            <div className={classes.text}>Log Out</div>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};
