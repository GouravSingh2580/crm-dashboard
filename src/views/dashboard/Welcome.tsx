import { useEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useMediaQuery, Typography, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import cx from 'clsx';

import { AccountService } from 'services';
import IncorporationImage from 'icons/incorporation.png';
import { logForDataMissing } from 'helpers/businessHealth';
import { CustomizedDialogs as WelcomePopup } from '../welcome-popup';
import useUserData from '../../hooks/useUserData';
import { Loading } from '../../components/common';
import { Routes } from '../../fnRoutes';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: theme.palette.primary.background,
    width: '100%',
    height: '100vh',
  },
  container: {
    maxWidth: '1155px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px',
  },
  notificationContainer: {
    background: theme.palette.secondary.background,
    padding: theme.spacing(3, 4),
    borderLeft: `6px solid ${theme.palette.secondary.main}`,
  },
  notificationHeading: {
    fontSize: '16px',
    fontWeight: '700',
    color: theme.palette.secondary.light,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  notificationSubHeading: {
    fontSize: '16px',
    fontWeight: '400',
    color: theme.palette.grey[900],
  },
  content: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    color: theme.palette.grey[900],
  },
  stepperContainer: {
    background: 'none',
    padding: theme.spacing(3, 0),
  },
  stepContainer: {
    background: theme.palette.primary.contrastText,
    padding: theme.spacing(3),
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  headingStep: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '20px',
    fontWeight: '700',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12px',
    width: '32px',
    height: '32px',
  },
  headingText: {
    color: theme.palette.primary.main,
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '32px',
  },
  space: {
    marginBottom: theme.spacing(3),
  },
  stepNotifcation: {
    background: theme.palette.primary.background,
    padding: theme.spacing(3, 4),
  },
  stepNotifcationLabel: {
    fontSize: '18px',
    color: theme.palette.primary.main,
  },
  bold: {
    fontWeight: '700',
  },
  normal: {
    fontWeight: '400',
  },
  stepContentContainer: {
    paddingRight: theme.spacing(4),
  },
  desc: {
    background: theme.palette.primary.main,
    borderRadius: '64px',
    color: theme.palette.primary.contrastText,
    fontSize: '12px',
    fontWeight: '500',
    marginLeft: theme.spacing(3),
    padding: '2px 8px',
  },
  icon: {
    fontSize: '16px',
    marginRight: '4px',
  },
  questionsContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  link: {
    color: theme.palette.secondary.light,
    textDecoration: 'underline',
  },
  welcome: {
    margin: theme.spacing(4, 0),
    fontWeight: 'bold',
  },
}));

const Welcome = () => {
  // Redirect to onboarding or subscription if not completed
  const history = useHistory();
  const { data: userData, isLoading, remove } = useUserData();
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  useEffect(() => {
    const check = async () => {
      if (userData) {
        const accountResp = await AccountService.getAccount(
          userData.userInfo.accountId || '',
        );
        if (accountResp.status.label === 'NEW') {
          if (!userData.isEntityFilled()) {
            // remove user Data caching becuse user doesn't have company yet
            remove();
            // redirect to old onboarding for entity select
            history.push(Routes.ENTITY_SELECTION);
          } else {
            // redirect to new progress tracker
            logForDataMissing(userData); // log if user data is not complete
            history.push(`${Routes.PROGRESS_TRACKER}/`);
          }
        }
      }
    };
    check();
  }, [userData]);

  const classes = useStyles();
  const location = useLocation();

  const { pathname, state } = location;
  const { showPopup } = (state ?? {}) as { showPopup?: any };

  const [open, setOpen] = useState(!!showPopup);

  const onClose = () => {
    setOpen(false);
    // @ts-ignore
    const newState = { ...state, showPopup: false };
    history.replace(pathname, newState);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <Typography className={classes.welcome} variant="h4" component="h4">
          Welcome!
        </Typography>
        <div className={cx(classes.notificationContainer, classes.space)}>
          <div className={classes.notificationSubHeading}>
            Now that you have kicked off your onboarding process, your customer
            success manager will reach out to you with any additional
            information needed and update you on the progress.
          </div>
        </div>
        <div className={cx(classes.questionsContainer, classes.space)}>
          <img
            style={{ width: isSmallScreen ? '100%' : 'auto' }}
            src={IncorporationImage}
            alt="incorporation"
          />
          <div className={classes.stepContainer}>
            <div className={classes.space}>
              <div className={cx(classes.stepNotifcationLabel, classes.bold)}>
                🤔 Questions?{' '}
              </div>
              <p className={classes.content}>
                Check out our{' '}
                <a
                  className={classes.link}
                  href="https://learn.formationscorp.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Knowledge Base
                </a>{' '}
                for answers to folks’ most common questions.{' '}
              </p>
              <p className={classes.content}>
                If you’re experiencing any technical issues with this site,
                please{' '}
                <a
                  className={classes.link}
                  href="mailto:customers@formationscorp.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  email us
                </a>
                .
              </p>
            </div>
            <div className={classes.space}>
              <div className={cx(classes.stepNotifcationLabel, classes.bold)}>
                📄 Storing Documents Securely{' '}
              </div>
              <p className={classes.content}>
                All files related to the formation of your LLC will be saved
                here in your{' '}
                <Link className={classes.link} to={Routes.DOCUMENTS}>
                  Documents
                </Link>
                . You can upload documents related to the ongoing maintenance of
                your business here to keep everything in an accessible and
                secure location.
              </p>
            </div>
            <div>
              <div className={cx(classes.stepNotifcationLabel, classes.bold)}>
                🔎 Exploring S-Corp{' '}
              </div>
              <p className={classes.content}>
                <a
                  className={classes.link}
                  href="https://formationscorp.com/blog/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore the benefits
                </a>{' '}
                of transitioning your LLC to an S-Corp -- the best structure for
                most self-employed. When you’re ready to level up, we’re here to
                help!
              </p>
            </div>
          </div>
        </div>
        <WelcomePopup open={open} onClose={onClose} />
      </div>
    </div>
  );
};

export default Welcome;
