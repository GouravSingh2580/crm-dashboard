import { useState } from 'react';
import cx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  List,
  ListItem,
  Drawer,
  Button,
  useMediaQuery,
  Theme,
  ButtonBase,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Routes } from '../../../fnRoutes';
import { MENU_ITEMS } from './constant';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuContainer: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(4),
    fontSize: '28px',
    fontWeight: '700',
    color: theme.palette.primary.main,
    display: 'flex',
    flexGrow: 1,
  },
  menuItem: {
    marginRight: theme.spacing(4),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
  tab: {
    opacity: '60%',
  },
  activeTab: {
    opacity: '100%',
  },
  header: {
    background: '#F8F5F2',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      boxShadow: 'none',
    },
  },
  active: {
    textDecoration: 'underline',
  },
  list: {
    width: 250,
  },
  listItem: {
    marginRight: theme.spacing(4),
    marginTop: theme.spacing(4),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
}));

export const Header = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor: 'right', open: boolean) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ [anchor]: open });
  };
  const isActiveTab = (url: string) => pathname.includes(url);

  const list = () => (
    <ButtonBase
      className={classes.list}
      onClick={toggleDrawer('right', false)}
      onKeyDown={toggleDrawer('right', false)}
    >
      <List>
        {MENU_ITEMS.map((item) => (
          <ListItem button key={item.label}>
            <a
              key={item.id}
              className={cx(classes.listItem, {
                [classes.active]: isActiveTab(item.id),
              })}
              href={item.url}
            >
              {item.label}
            </a>
          </ListItem>
        ))}
      </List>
    </ButtonBase>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.header}>
        <Toolbar>
          <div className={classes.logo}>
            <a href={Routes.HOME()}>
              Formations
            </a>
          </div>
          {!isSmallScreen ? (
            <div className={classes.menuContainer}>
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.id}
                  className={cx(classes.menuItem, {
                    [classes.active]: isActiveTab(item.id),
                  })}
                  href={item.url}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : (
            <>
              <Button onClick={toggleDrawer('right', true)}>
                <MoreVertIcon />
              </Button>

              <Drawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer('right', false)}
              >
                {list()}
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
