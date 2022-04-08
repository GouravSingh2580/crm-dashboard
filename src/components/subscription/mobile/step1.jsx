import {
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CheckIcon from '@mui/icons-material/Check';
import { useHookstate } from '@hookstate/core';

import { SubscriptionState } from '../../../states';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: '800',
    lineHeight: '41.99px',
    color: theme.palette.white.light,
    marginBottom: theme.spacing(2),
  },
  centerAlignedContainerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  desc: {
    marginTop: theme.spacing(2),
    fontSize: '20px',
    color: theme.palette.black.main,
    marginBottom: theme.spacing(3),
    width: '800px',
  },
  stepTitle: {
    fontWeight: '800',
    fontSize: '28px',
    lineHeight: '20px',
    color: theme.palette.yellow.dark,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(9),
  },
  label: {
    fontSize: '14px',
    lineHeight: '16px',
    color: theme.palette.white.light,
    fontWeight: 'normal',
  },
  whiteFont: {
    color: theme.palette.white.main,
  },
  divider: {
    background: theme.palette.gray.divider,
    margin: theme.spacing(3, 0),
  },
  button: {
    background: theme.palette.white.main,
    color: theme.palette.secondary.main,
    fontWeight: 'normal',
  },
  loader: {
    marginLeft: theme.spacing(2),
  },
}));

interface IStep1 {
  setHiddenSection: () => void;
  executeScroll: () => void;
  isLoading: boolean;
}

const Step1 = ({ setHiddenSection, executeScroll, isLoading }: IStep1) => {
  const classes = useStyles();
  const subscriptionState = useHookstate(SubscriptionState);
  const isSoleProp = subscriptionState.isSoleProp.value;

  return !isSoleProp ? (
    <Typography variant="h5" className={classes.title} component="h4">
      You are already incorporated
      <div className={classes.label}>
        You saved $199 incorporation charge, hooray!
      </div>
      <Divider variant="middle" className={classes.divider} />
    </Typography>
  ) : (
    <>
      <div className={classes.centerAlignedContainerRow}>
        <div style={{ marginRight: '32px' }}>
          <Typography variant="h3" className={classes.whiteFont}>
            $199
          </Typography>
          <div className={classes.label}>(One time fee)</div>
        </div>
        <div>
          <div className={classes.centerAlignedContainerRow}>
            <CheckIcon className={classes.whiteFont} />
            <div className={classes.label}>One-time LLC Formation</div>
          </div>
          <div className={classes.centerAlignedContainerRow}>
            <CheckIcon className={classes.whiteFont} />
            <div className={classes.label}>Business Bank Account Creation</div>
          </div>
          <div className={classes.centerAlignedContainerRow}>
            <CheckIcon className={classes.whiteFont} />
            <div className={classes.label}>Articles of Incorporation</div>
          </div>
        </div>
      </div>
      <Divider variant="middle" className={classes.divider} />
      <div
        className={classes.centerAlignedContainerRow}
        style={{ marginBottom: '32px' }}
      >
        <Button
          type="button"
          size="medium"
          variant="contained"
          className={classes.button}
          disableElevation
          disabled={isLoading}
          onClick={() => {
            subscriptionState.shouldIncorporate.set(true);
            setHiddenSection('step1');
          }}
          data-testid="incorporate-me"
        >
          Incorporate Me
          {isLoading && (
            <CircularProgress className={classes.loader} size={20} />
          )}
        </Button>
        {!isSoleProp && (
          <Button
            type="button"
            size="medium"
            variant="outlined"
            className={classes.whiteFont}
            style={{
              marginLeft: '16px',
              border: '1px solid white',
              fontWeight: 'normal',
            }}
            disableElevation
            disabled={isLoading}
            onClick={() => {
              subscriptionState.shouldIncorporate.set(false);
              setHiddenSection('step1');
              setTimeout(executeScroll, 400);
            }}
          >
            I Am Already Incorporated
            {isLoading && (
              <CircularProgress className={classes.loader} size={20} />
            )}
          </Button>
        )}
      </div>
    </>
  );
};

export default Step1;
