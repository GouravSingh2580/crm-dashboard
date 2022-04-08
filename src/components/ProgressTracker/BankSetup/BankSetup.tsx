import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Stepper,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useReducer, useState } from 'react';
import { useCurrentUser } from 'hooks/api';
import makeStyles from '@mui/styles/makeStyles';
import {
  IAccount,
  ProgressTrackerGroupRequest,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'services/account';
import {
  useCurrentAccount,
  useUpdateAccountProgress,
} from 'hooks/api/useAccounts';
import queryClient from 'states/reactQueryClient';
import { useCurrentCompany } from 'hooks/api/useCompanies';
import { Company } from 'services/companies';
import { FormationsStep } from 'components/FormationsStep';
import { BankSelection } from './BankSelection';
import { DocumentSigning } from './DocumentSigning';
import { initialState, reducer } from './state';
import { StageSkeleton } from '../StageSkeleton';
import { AccordionCTA } from '../AccordionCTA';

const useStyle = makeStyles((theme) => ({
  stepContentWrapper: {
    [theme.breakpoints.up('md')]: {
      '& > div': {
        maxWidth: '546px',
      },
    },
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
  saveAndContinue: {
    marginTop: '48px',
    float: 'right',
  },
  stageStatusColumn: {
    display: 'flex',
    justifyContent: 'end',
  },
}));

interface TParams {
  company: Company;
  isDesktop: boolean;
}

const BankSetupLayout = ({ company, isDesktop }: TParams) => {
  const classes = useStyle();
  const [completed, setCompleted] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(false);
  const { currentUser } = useCurrentUser();

  const [state, dispatch] = useReducer(reducer, initialState());

  const steps = Object.keys(state.steps);
  const stageCompleted = () => completed === steps.length;

  const {
    currentAccount: accData,
    isLoading: isAccountLoading,
    refetch: fetchAccountInfo,
    status: accountDataStatus,
  } = useCurrentAccount({
    onSuccess: (accountData: IAccount) => {
      if (accountData?.rightSignatureURL) {
        dispatch({
          type: 'updateRightSignature',
          value: accountData,
        });
      }
      if (accountData?.progress.length > 0) {
        dispatch({
          type: ProgressTrackerStages.BankSelection,
          value: accountData,
        });
        dispatch({
          type: ProgressTrackerStages.DocumentSigning,
          value: accountData,
        });
      }
    },
  });

  const { mutateAsync: updateAccountProgress } = useUpdateAccountProgress(
    accData?.id,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['progressTracker']);
        queryClient.invalidateQueries(['getCompany', company?.id]);
      },
    },
  );

  const handleComplete = async (
    status: ProgressTrackerStatus,
    eventData: Object,
  ) => {
    const requestProps: ProgressTrackerGroupRequest = {
      stage: ProgressTrackerStages.BankSelection,
      group: ProgressTrackerGroups.FormCompletion,
      status,
    };

    await updateAccountProgress({
      progress: [requestProps],
      eventData: {
        stage: ProgressTrackerStages.BankSelection,
        stageStatus: status,
        entityType: company?.entityType || company?.legacyEntityType || '',
        ...eventData,
      },
    });
  };

  const handleExpand =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    const states = Object.keys(state.steps);
    if (states.length > 0) {
      let firstNotCompleted: number | undefined;
      let completedCount: number = 0;
      states.forEach((item, index) => {
        if (state.steps[item]?.status === ProgressTrackerStatus.Completed) {
          completedCount += 1;
        } else if (firstNotCompleted === undefined) {
          firstNotCompleted = index;
        }
      });
      setCompleted(completedCount);
      if (firstNotCompleted !== undefined) {
        setActiveStep(firstNotCompleted);
      }
    }
  }, [state]);

  useEffect(() => {
    fetchAccountInfo();
  }, [fetchAccountInfo]);

  if (isAccountLoading || accountDataStatus !== 'success') {
    return <StageSkeleton />;
  }

  return (
    <Accordion
      expanded={expanded === 'bank-setup'}
      onChange={handleExpand('bank-setup')}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="bank-setup-content"
        id="bank-setup-header"
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h6B">Bank Setup</Typography>
            <Typography variant="subtitle1">
              Set up your bank preferences and sign a few forms. Our team will
              take it from there!
            </Typography>
            <Typography variant="body2" className={classes.textSecondary}>
              Processing time : 2 - 7 days
            </Typography>
            <AccordionCTA
              expanded={expanded}
              handleExpand={handleExpand}
              completed={completed}
              totalStep={steps.length}
              testId="start-bank-setup"
              accordionId="bank-setup"
            />
          </Grid>
          <Grid item xs={2} className={classes.stageStatusColumn}>
            {!stageCompleted() && !expanded && (
              <Typography variant="h8B">
                {completed}/{steps.length}
              </Typography>
            )}
            {stageCompleted() && !expanded && (
              <Typography variant="h8B" sx={{ display: 'flex' }}>
                <CheckCircle color="secondary" />
                &nbsp; Complete
              </Typography>
            )}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={{ md: 2 }}>
          <Grid item xs={12} md={5}>
            <Stepper
              activeStep={activeStep}
              nonLinear
              orientation={isDesktop ? 'vertical' : 'horizontal'}
              alternativeLabel={!isDesktop}
              data-testid="bank-setup-stages"
            >
              {steps.map((key, index) => (
                <FormationsStep
                  key={key}
                  index={index}
                  setActiveStep={setActiveStep}
                  status={state.steps[key]?.status}
                  label={state.steps[key]?.label}
                  isTrainer={false}
                />
              ))}
            </Stepper>
          </Grid>
          <Grid item xs={12} md={7} className={classes.stepContentWrapper}>
            {activeStep === 0 && (
              <BankSelection
                handleComplete={handleComplete}
                company={company}
                user={currentUser}
              />
            )}
            {activeStep === 1 && (
              <DocumentSigning
                accountId={accData?.id}
                accountEntity={
                  company?.entityType || company?.legacyEntityType || ''
                }
                completedSteps={completed}
                hasBankAccount={!!company?.bankName}
                rightSignatureURL={state.rightSignatureURL}
              />
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export const BankSetup = (props: { isDesktop: boolean }) => {
  const {
    currentCompany: companyData,
    isLoading: companyDataLoading,
    status: companyDataStatus,
  } = useCurrentCompany();

  return !companyDataLoading &&
    companyDataStatus === 'success' &&
    companyData ? (
    <BankSetupLayout {...props} company={companyData} />
  ) : (
    <StageSkeleton />
  );
};
