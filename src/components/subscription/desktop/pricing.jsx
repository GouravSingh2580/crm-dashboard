import { useRef, useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Divider } from '@mui/material';
import { useHookstate } from '@hookstate/core';
import image from 'icons/pricing.png';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Plan } from 'services/subscription';
import Step1 from './step1';
import Step2 from './step2';
import NeedHelp from './needHelp';
import { SubscriptionState } from '../../../states';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '1155px',
    margin: '0 auto',
    padding: '0 16px',
  },
  centerAlignedContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  centerAlignedContainerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: theme.spacing(11),
  },
  title: {
    fontWeight: 800,
    color: theme.palette.primary.main,
  },
  desc: {
    marginTop: theme.spacing(2),
    fontSize: '20px',
    color: theme.palette.black.main,
    marginBottom: theme.spacing(3),
    width: '60%',
  },
  pricingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    background: theme.palette.secondary.main,
    minHeight: '300px',
    alignItems: 'center',
    fontFamily: 'Telegraf',
    paddingTop: theme.spacing(4),
    position: 'relative',
  },
  stepTitle: {
    fontWeight: 800,
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
  },
  pricingBlock: {
    padding: theme.spacing(3, 0),
  },
  whiteFont: {
    color: theme.palette.white.main,
  },
  divider: {
    background: theme.palette.gray.divider,
    margin: theme.spacing(3, 0),
  },
  icons: {
    marginTop: '80px',
    color: theme.palette.white.main,
  },
  image: {
    position: 'absolute',
    top: '-204px',
    right: '5%',
  },
}));

interface IPricing {
  plans: Plan[];
  onJoin: (plan: Plan) => void;
  isLoading: boolean;
}

const Pricing = ({ plans, onJoin, isLoading }: IPricing) => {
  const classes = useStyles();
  const myRef = useRef(null);
  const [hideSection, setHiddenSection] = useState('step2');
  const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  const subscriptionState = useHookstate(SubscriptionState);
  const isSoleProp = subscriptionState.isSoleProp.value;

  useEffect(() => {
    if (!isSoleProp) {
      setHiddenSection('');
    }
  }, [isSoleProp]);

  const ToggleIcons = ({
    condition,
    step,
  }: {
    condition: boolean;
    step: string;
  }) => (
    <div
      tabIndex="0"
      role="button"
      onClick={() => setHiddenSection(hideSection === step ? null : step)}
      onKeyDown={() => setHiddenSection(hideSection === step ? null : step)}
    >
      {condition ? (
        <ArrowDownIcon
          data-testid={`down-${step}`}
          className={classes.icons}
        />
      ) : (
        <ArrowUpIcon data-testid={`up-${step}`} className={classes.icons} />
      )}
    </div>
  );

  return (
    <div>
      <div className={classes.titleContainer}>
        <div className={classes.container}>
          <Typography
            variant="h3"
            className={classes.title}
            component="h3"
            data-testid="subscription-heading"
          >
            Get Incorporated & Start Saving
          </Typography>
          <div className={classes.desc}>
            We make it easy to incorporate, simplify your financial life, and
            start saving. Just pick the plan that fits your needs and we’ll get
            you set up!
          </div>
        </div>
      </div>
      <div className={classes.pricingContainer}>
        <div className={classes.container}>
          <img src={image} className={classes.image} alt="result" />
          <div className={classes.pricingBlock}>
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
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
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
        </div>
      </div>
      <NeedHelp />
    </div>
  );
};

export default Pricing;
