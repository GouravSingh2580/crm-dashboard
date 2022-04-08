import { useEffect, useState } from 'react';
import { marked } from 'marked';
import {
  Button, Card, CardContent, CardActions, Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Redirect } from 'react-router-dom';
import { Routes } from '../fnRoutes';
import { CONSTANTS } from '../constants/common';
import { AuthService, UsersService } from '../services';
import { Loading } from '../components/common';
import { ReactComponent as Logo } from '../icons/logo-text.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    backgroundColor: '#F2F3F6',
    height: '100vh',
    overflowY: 'auto',
    '& ::-webkit-scrollbar': {
      width: '5px',
    },
    '& ::-webkit-scrollbar-track': {
      background: '#F2F3F6',
      borderRadius: '80px',
    },
    '& ::-webkit-scrollbar-thumb': {
      background: 'rgba(0, 0, 0, 0.12)',
      borderRadius: '80px',
    },
  },
  logo: {
    color: theme.palette.primary.main,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(4),
    height: '20px',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(6),
      height: 'auto',
    },
  },
  card: {
    maxWidth: '588px',
    margin: '0 24px',
    padding: '20px',
    [theme.breakpoints.up('sm')]: {
      padding: '60px 50px 60px 60px',
      margin: '0 auto',
      marginBottom: theme.spacing(20),
    },
    borderRadius: '12px',
    boxSizing: 'border-box',
    boxShadow: '0px 3px 1px - 2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)',
  },
  title: {
    color: '#1F3161',
    textAlign: 'center',
    fontFamily: 'Telegraf',
    fontWeight: 800,
    fontSize: '20px',
    lineHeight: 1.2,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      fontSize: '34px',
      marginBottom: theme.spacing(6),
    },
  },
  cardContent: {
    padding: 0,
    height: '57vh',
    overflow: 'hidden auto',
    textAlign: 'left',
    paddingRight: '12px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0, 0, 0, 0.12) #F2F3F6',
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing(3),
      height: '42vh',
    },
    '& article': {
      marginTop: '-18px',
    },
    '& p': {
      fontSize: '14px',
      lineHeight: '150%',
      textAlign: 'justify',
      letterSpacing: '0.15px',
      [theme.breakpoints.up('sm')]: {
        fontSize: '16px',
      },
    },
    '& h1 ': {
      fontSize: '14px',
      lineHeight: '160%',
      letterSpacing: '0.15px',
      margin: '16px 0',
      [theme.breakpoints.up('sm')]: {
        fontSize: '20px',
      },
    },
    '& h2': {
      fontSize: '14px',
      lineHeight: '160%',
      letterSpacing: '0.15px',
      margin: '14px 0',
      [theme.breakpoints.up('sm')]: {
        fontSize: '16px',
      },
    },
    '& h3, h4 h5, h6': {
      fontSize: '14px',
      lineHeight: '160%',
      letterSpacing: '0.15px',
      fontWeight: 500,
      margin: '12px 0',
      [theme.breakpoints.up('sm')]: {
        fontSize: '16px',
      },
    },
  },
  cardFooter: {
    position: 'relative',
    height: '48px',
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(4),
      marginBottom: 0,
      justifyContent: 'flex-end',
    },
  },
  buttonAccept: {
    padding: '11px 22px',
  },
}));

const TermsAndConditions = () => {
  const classes = useStyles();
  const [markdown, setMarkdown] = useState('');
  const [userConsent, setUserConsent] = useState({
    updating: false,
    updateCompleted: false,
  });

  const acceptTermsAndConditions = async () => {
    setUserConsent({
      ...userConsent,
      updating: true,
    });
    const currentUser = await UsersService.getCurrentUser();
    await UsersService.updateUserById(currentUser.id, {
      lastAcceptedVersion: CONSTANTS.TERM_AND_CONDITION_VERSION,
    });
    if (await AuthService.refresh()) {
      setUserConsent({
        ...userConsent,
        updateCompleted: true,
      });
    }
  };

  useEffect(() => {
    const documentVersion = CONSTANTS.TERM_AND_CONDITION_VERSION;
    import(`../markdown/terms/${documentVersion}.md`)
      .then((res) => {
        fetch(res.default)
          .then((response) => response.text())
          .then((text) => setMarkdown(marked(text)));
      });
    return () => {
      // cleanup
    };
  }, []);

  return (
    <div className={classes.root}>
      <Logo className={classes.logo} />
      <Card className={classes.card}>
        <Typography variant="h4" component="h1" className={classes.title}>
          Terms and Conditions
        </Typography>
        <CardContent className={classes.cardContent}>
          {/* eslint-disable-next-line react/no-danger */}
          <article dangerouslySetInnerHTML={{ __html: markdown }} />
        </CardContent>
        <CardActions className={classes.cardFooter}>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={() => acceptTermsAndConditions()}
            data-testid="t-and-c-user-consent"
            size="large"
            className={classes.buttonAccept}
          >
            Accept and Continue
          </Button>
        </CardActions>
      </Card>
      {userConsent.updating && <Loading />}
      {userConsent.updateCompleted && <Redirect to={Routes.HOME()} />}
    </div>
  );
};

export default TermsAndConditions;
