/* eslint-disable no-unused-expressions */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  useCurrentAccount,
  useUpdateAccountProgress,
} from 'hooks/api/useAccounts';
import { useCurrentCompany } from 'hooks/api/useCompanies';
import React, { useEffect, useReducer, useState } from 'react';
import {
  IAccount,
  ProgressTrackerGroupRequest,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'services/account';
import { Company } from 'services/companies';
import queryClient from 'states/reactQueryClient';
import makeStyles from '@mui/styles/makeStyles';
import { initialState, reducer } from './state';
import { AccountVerificationLayout } from './AccountVerificationLayout';
import { StageSkeleton } from '../StageSkeleton';
import { AccordionCTA } from '../AccordionCTA';

const useStyle = makeStyles(() => ({
  stageStatusColumn: {
    display: 'flex',
    justifyContent: 'end',
  },
}));

interface AccountVerificationComponentProps {
  companyData: Company | undefined;
}

const AccountVerification = ({
  companyData,
}: AccountVerificationComponentProps) => {
  const classes = useStyle();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [state, dispatch] = useReducer(
    reducer,
    initialState(companyData?.entityType || ''),
  );
  /**
   *
   * Logic:
   *
   * - Handling the active step based on the response of the api.
   * - After every update, we need to call updated progress api to update the status.
   * - On success of update progress, we will invalidate the get current account api.
   *   We need to have latest status changes. Which will inturn set the active step.
   *
   */

  const [incorporationActiveStep, setIncorporationActiveStep] = useState(0);
  const [completedStep, setCompletedStep] = useState(0);

  const incStep = () => {
    setIncorporationActiveStep((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    /**
     * Only update and show correct step only when we land first time or do refresh.
     *
     * On update, the onSuccess callback will handle updation of the step.
     */

    const states = Object.keys(state);

    if (states.length > 0) {
      let completedCount: number = 0;
      states.forEach((item) => {
        if (state[item]?.status === ProgressTrackerStatus.Completed) {
          completedCount += 1;
        }
      });
      setCompletedStep(completedCount);
    }
  }, [state]);

  const {
    currentAccount: accData,
    isLoading: fetchingCurrentAccount,
    status: accountDataStatus,
    refetch: fetchAccountInfo,
  } = useCurrentAccount({
    onSuccess: (accountData: IAccount) => {
      if (accountData?.progress.length > 0) {
        dispatch({
          type: ProgressTrackerStages.UploadIdentityProof,
          value: accountData?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.UploadLastYearTaxStatement,
          value: accountData?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.DocumentOfIncorporation,
          value: accountData?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.DirectDepositInformation,
          value: accountData?.progress,
        });
      }
    },
  });

  const { mutateAsync: updateAccountProgress, isLoading: IsUpdatingProgress } =
    useUpdateAccountProgress(accData?.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(['progressTracker']);
      },
    });

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const onContinue = async (stage: ProgressTrackerStages) => {
    const requestProps: ProgressTrackerGroupRequest = {
      group: ProgressTrackerGroups.AccountVerification,
      stage,
      status: ProgressTrackerStatus.Unknown,
    };

    switch (stage) {
      case ProgressTrackerStages.UploadIdentityProof:
        requestProps.status = ProgressTrackerStatus.InProgress;
        break;
      case ProgressTrackerStages.UploadLastYearTaxStatement:
        requestProps.status = ProgressTrackerStatus.InProgress;
        break;
      case ProgressTrackerStages.DocumentOfIncorporation:
        requestProps.status = ProgressTrackerStatus.InProgress;
        break;
      case ProgressTrackerStages.DirectDepositInformation:
        requestProps.status = ProgressTrackerStatus.Completed;
        break;
      default:
        break;
    }

    await updateAccountProgress({
      progress: [requestProps],
      eventData: {
        stage,
        entityType:
          companyData?.entityType || companyData?.legacyEntityType || '',
      }
    });

    incStep();
  };

  const handleExpand =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const steps = Object.keys(state);
  const stageCompleted = () => completedStep === steps.length;

  if (fetchingCurrentAccount || accountDataStatus !== 'success') {
    return <StageSkeleton />;
  }

  return (
    <Accordion
      expanded={expanded === 'account-verification'}
      onChange={handleExpand('account-verification')}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="account-verification-content"
        id="account-verification-header"
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h6B">Account Verification</Typography>
            <Typography variant="subtitle1">
              Verify your personal and business information so we can setup your
              account.
            </Typography>
            <Typography variant="body2">
              Processing time : 2 - 7 days
            </Typography>
            <AccordionCTA
              expanded={expanded}
              handleExpand={handleExpand}
              completed={completedStep}
              totalStep={steps.length}
              testId="start-account-verification"
              accordionId="account-verification"
            />
          </Grid>
          {!expanded && (
            <Grid item xs={2} className={classes.stageStatusColumn}>
              {!stageCompleted() && !expanded && (
                <Typography variant="h8B">
                  {completedStep}/{steps.length}
                </Typography>
              )}
              {stageCompleted() && !expanded && (
                <Typography variant="h8B" sx={{ display: 'flex' }}>
                  <CheckCircle color="secondary" />
                  &nbsp; Complete
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {!fetchingCurrentAccount && (
          <AccountVerificationLayout
            accountId={accData?.id}
            activeStep={incorporationActiveStep}
            setActiveStep={setIncorporationActiveStep}
            handleContinue={onContinue}
            isLoading={IsUpdatingProgress}
            state={state}
            entityType={companyData?.entityType || ''}
            ein={companyData?.ein}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export const AccountVerificationComponent = () => {
  const {
    currentCompany: companyData,
    isLoading: companyDataLoading,
    status: companyDataStatus,
  } = useCurrentCompany();

  return !companyDataLoading &&
    companyDataStatus === 'success' &&
    companyData ? (
    <AccountVerification companyData={companyData} />
  ) : (
    <StageSkeleton />
  );
};
