import makeStyles from '@mui/styles/makeStyles';
import MuiDrawer from '@mui/material/Drawer';
import MuiIconButton from '@mui/material/IconButton';
import { IAction } from 'components/common/sidebar/constant';
import { PropsWithChildren, useState } from 'react';
import { alpha, Box } from '@mui/material';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { HeaderDesktop } from './HeaderDesktop';
import { FooterDesktop } from './FooterDesktop';
import { getSidebarContextProvider, setSidebarOpen, useSidebarOpen } from './sidebarContext';
import { AuthService } from '../../../../services';

const drawerWidth = 240;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(10)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(11)} + 1px)`,
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    width: drawerWidth,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: alpha(theme.palette.secondary.contrastText, 0.03),
  },
}));

interface Props {
  actions: IAction[];
  logoutUser: () => void;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      justifyContent: 'space-between',
      backgroundColor: alpha(theme.palette.secondary.contrastText, 0.03),
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': {
      ...closedMixin(theme),
      justifyContent: 'space-between',
      backgroundColor: alpha(theme.palette.secondary.contrastText, 0.03),
    },
  }),
}));
const ExpandButton = styled(MuiIconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50px',
  transform: 'translate(-50%, 0)',
  background: '#fff',
  zIndex: 1300,
  boxShadow:
    '0px 2px 1px -1px rgba(13, 34, 89, 0.1), 0px 1px 1px rgba(13, 34, 89, 0.14), 0px 1px 3px rgba(13, 34, 89, 0.12)',
  '&:hover': {
    background: '#fff',
  },
  transition: theme.transitions.create('left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));
const ExpandIcon = styled(ArrowForwardIosIcon)(({ theme }) => ({
  transition: theme.transitions.create('transform', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export const SideBarDesktop = ({
  children,
  actions,
  logoutUser,
}: PropsWithChildren<Props>) => {
  const classes = useStyles();
  const isAdmin = AuthService.isAdmin(); // we set expand button for admin only as customer has more complex menu items
  const defaultSidebarOpen = useSidebarOpen();
  const [open, setOpen] = useState<boolean>(defaultSidebarOpen);
  const Provider = getSidebarContextProvider();
  const toggleSidebar = () => {
    setOpen(!open);
    setSidebarOpen(!open)
  };

  return (
    <Provider value={open}>
      <div className={classes.container}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          {isAdmin && (
            <ExpandButton
              aria-label={open ? 'Collapse' : 'Expand'}
              sx={{
                left: open ? '240px' : '88px',
              }}
              onClick={toggleSidebar}
            >
              <ExpandIcon
                sx={{
                  transform: open ? 'rotate(180deg)' : 'none',
                }}
              />
            </ExpandButton>
          )}
          <Drawer variant="permanent" open={open}>
            <HeaderDesktop actions={actions} />
            <FooterDesktop logoutUser={logoutUser} />
          </Drawer>
          <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
        </Box>
      </div>
    </Provider>
  );
};
