import { useEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Divider } from '@mui/material';
import { useHookstate } from '@hookstate/core';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SubscriptionState } from '../../../states';
import Header from './header';
import Step1 from './step1';
import Step2 from './step2';
import NeedHelp from './needHelp';
import { Plan } from '../../../services/subscription';

const useStyles = makeStyles((theme) => ({
  pricingContainer: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.secondary.main,
    padding: theme.spacing(4, 2),
  },
  stepTitle: {
    fontWeight: '800',
    fontSize: '20px',
    lineHeight: '20px',
    color: theme.palette.yellow.dark,
  },
  centerAlignedContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  divider: {
    background: theme.palette.gray.divider,
    margin: theme.spacing(3, 0),
  },
  centerAlignedContainerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  icons: {
    color: theme.palette.white.main,
  },
}));

interface ISubscription {
  plans: Plan[];
  onJoin: (plan: Plan) => void;
  isLoading: boolean;
}

const Subscription = ({ plans, onJoin, isLoading } : ISubscription) => {
  const classes = useStyles();
  const myRef = useRef(null);
  const [hideSection, setHiddenSection] = useState('step2');
  const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const subscriptionState = useHookstate(SubscriptionState);
  const isSoleProp = subscriptionState.isSoleProp.value;

  useEffect(() => {
    if (!isSoleProp) {
      setHiddenSection(null);
    }
  }, [isSoleProp]);

  const ToggleIcons = ({ condition, step }: { condition: boolean, step: string }) => (
    <div
      role="button"
      tabIndex="0"
      onClick={() => setHiddenSection(hideSection === step ? null : step)}
      onKeyDown={() => setHiddenSection(hideSection === step ? null : step)}
    >
      {condition ? (
        <ArrowDownIcon className={classes.icons} />
      ) : (
        <ArrowUpIcon className={classes.icons} />
      )}
    </div>
  );
  return (
    <div>
      <Header />
      <div className={classes.pricingContainer}>
        <div
          className={classes.centerAlignedContainerRow}
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div className={classes.stepTitle}>Step 1 - Incorporate</div>
          <ToggleIcons condition={hideSection === 'step1'} step="step1" />
        </div>
        <Divider variant="middle" className={classes.divider} />
        {hideSection !== 'step1' && (
          <Step1
            executeScroll={executeScroll}
            setHiddenSection={setHiddenSection}
            isLoading={isLoading}
          />
        )}
        <div>
          <div
            className={classes.centerAlignedContainerRow}
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div className={classes.stepTitle}>Step 2 - Choose a plan</div>
            <ToggleIcons condition={hideSection === 'step2'} step="step2" />
          </div>
          <Divider variant="middle" className={classes.divider} />
          <div ref={myRef}>
            {hideSection !== 'step2' && (
              <Step2 plans={plans} onJoin={onJoin} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
      <NeedHelp />
    </div>
  );
};

export default Subscription;
