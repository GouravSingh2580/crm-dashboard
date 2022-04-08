import makeStyles from '@mui/styles/makeStyles';
import {
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useHookstate } from '@hookstate/core';

import { SubscriptionState } from 'states';

const useStyles = makeStyles(({ palette, spacing }) => ({
  title: {
    fontWeight: 800,
    color: palette.white.light,
  },
  centerAlignedContainerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  desc: {
    marginTop: spacing(2),
    fontSize: '20px',
    color: palette.black.main,
    marginBottom: spacing(3),
    width: '800px',
  },
  stepTitle: {
    fontWeight: 800,
    fontSize: '28px',
    lineHeight: '20px',
    color: palette.yellow.dark,
    marginBottom: spacing(2),
    marginTop: spacing(9),
  },
  label: {
    fontSize: '16px',
    lineHeight: '16px',
    color: palette.white.light,
    marginLeft: spacing(1),
  },
  whiteFont: {
    color: palette.white.main,
  },
  divider: {
    background: palette.gray.divider,
    margin: spacing(3, 0),
  },
  button: {
    background: palette.white.main,
    color: palette.secondary.main,
    fontWeight: 'normal',
  },
  loader: {
    marginLeft: spacing(2),
  },
}));

interface IStep1 {
  setHiddenSection: (val: string) => void;
  executeScroll: () => void;
  isLoading: boolean;
}

const Step1 = ({ setHiddenSection, executeScroll, isLoading }: IStep1) => {
  const classes = useStyles();
  const subscriptionState = useHookstate(SubscriptionState);
  const isSoleProp = subscriptionState.isSoleProp.value;

  return !isSoleProp ? (
    <Typography
      variant="h4"
      className={classes.title}
      component="h4"
      data-testid="already-incorporated"
    >
      You are already incorporated
      <div className={classes.label}>
        You saved $199 incorporation charge, hooray!
      </div>
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
      <div className={classes.centerAlignedContainerRow}>
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
