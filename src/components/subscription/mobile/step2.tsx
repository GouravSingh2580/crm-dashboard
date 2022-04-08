import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Checkbox, CircularProgress } from '@mui/material';
import { Plan } from '../../../services/subscription';
import { SubscriptionState } from '../../../states';
import Pricing from './pricing';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 800,
    fontSize: '28px',
    lineHeight: '20px',
    color: theme.palette.yellow.dark,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  centerAlignedContainerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    fontSize: '14px',
    lineHeight: '16px',
    color: theme.palette.white.light,
    fontWeight: 200,
  },
  divider: {
    background: theme.palette.gray.divider,
    margin: theme.spacing(3, 0),
  },
  icons: {
    marginTop: '80px',
    color: theme.palette.white.main,
  },
  optoutBlock: {
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    padding: '24px',
    justifyContent: 'space-between',
    marginTop: '24px',
    height: '120px',
    marginBottom: '32px',
    flexDirection: 'column',
  },
  button: {
    background: 'white',
    border: '1px solid #317E4F',
    color: '#317E4F',
  },
  loader: {
    marginLeft: theme.spacing(2),
  },
}));

interface IStep2 {
  plans: Plan[];
  onJoin: (plan: Plan) => void;
  isLoading: boolean;
}

const Step2 = ({ plans, onJoin, isLoading }: IStep2) => {
  const classes = useStyles();
  const [isChecked, setIsChecked] = useState(false);
  const subscriptionState = useHookstate(SubscriptionState);
  const isSoleProp = subscriptionState.isSoleProp.value;

  return (
    <>
      <Pricing plans={plans} onJoin={onJoin} hideFooter isLoading={isLoading} />
      {isSoleProp && (
        <>
          <div className={classes.title}>Not Ready to Decide?</div>
          <div className={classes.label}>
            Don’t worry, you can opt out of a plan for now. In the future, if
            you decide to go with a plan, you can simply upgrade it in your
            account.
          </div>
          <div className={classes.optoutBlock}>
            <div className={classes.centerAlignedContainerRow}>
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                data-testid="opt-out-checkbox"
              />
              <div>I would like to opt out of a plan for now.</div>
            </div>
            <Button
              type="button"
              size="medium"
              variant="contained"
              className={classes.button}
              disableElevation
              disabled={!isChecked || isLoading}
              onClick={() => onJoin(null)}
            >
              Confirm
              {isLoading && (
                <CircularProgress className={classes.loader} size={20} />
              )}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Step2;
