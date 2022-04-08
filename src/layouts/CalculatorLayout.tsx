import { Container, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Header, Footer, Logout } from 'components/common';
import { ReactComponent as Logo } from 'icons/logo-text.svg';
import { ReactNode } from 'react';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.onboardingBackground.main,
    },
  },
  container: {
    minWidth: '320px',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(6, 0, 4, 0),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(12, 0, 8, 0),
    },
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
  },
  logo: {
    color: theme.palette.primary.main,
  },
  box: {
    backgroundColor: '#FFFFFF',
    padding: theme.spacing(8),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    },
    boxShadow:
      '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(5),
    cursor: 'pointer',
  },
  backButtonText: {
    marginLeft: theme.spacing(1),
  },
}));

interface CalculatorProps {
  children: ReactNode
  header: boolean
  footer: boolean
  showLogo: boolean
  showLogout: boolean
}

export const CalculatorLayout = ({
  children,
  header = false,
  footer = false,
  showLogo = true,
  showLogout = false,
}: CalculatorProps) => {
  const classes = useStyles();

  return (
    <div id="page">
      {header ? (
        <div>
          <Header />
        </div>
      ) : null}

      <Container className={classes.container} component="main" maxWidth="sm">
        {showLogo ? (
          <div className={classes.titleContainer}>
            <Logo className={classes.logo} />
          </div>
        ) : null}

        <Box className={classes.box}>{children}</Box>
      </Container>
      {footer ? <Footer /> : null}
      {showLogout && <Logout />}
    </div>
  );
};
