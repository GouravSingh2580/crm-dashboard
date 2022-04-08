import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Stepper,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { Company } from 'models/company';
import {
  IAccount,
  ProgressTrackerGroupRequest,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'models/account';
import {
  useCurrentAccount,
  useUpdateAccountProgress,
  useCurrentCompany
} from 'hooks/api';
import queryClient from 'states/reactQueryClient';
import { FormationsStep } from 'components/FormationsStep';
import { ENTITY_MAPPING } from 'constants/common';
import { Routes } from 'fnRoutes';
import { PersonalDetails } from './PersonalDetails';
import { CompanyDetails } from './CompanyDetails';
import { AddressInformation } from './AddressInformation';
import { FilingDocuments } from './FilingDocuments';
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
    marginTop: theme.spacing(2),
    float: 'right',
  },
  stageStatusColumn: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'flex-start',
  },
}));

interface TParams {
  company: Company;
  isDesktop: boolean;
}

const IncorporationLayout = ({ company, isDesktop }: TParams) => {
  const classes = useStyle();
  const [completed, setCompleted] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(false);

  const [state, dispatch] = useReducer(
    reducer,
    initialState(company?.entityType || company?.legacyEntityType || ''),
  );

  const steps = Object.keys(state);
  const stageCompleted = () => completed === steps.length;

  const {
    currentAccount,
    isLoading: isAccountLoading,
    refetch: fetchAccountInfo,
    status: accountDataStatus,
  } = useCurrentAccount({
    onSuccess: (accountData: IAccount) => {
      if (accountData?.progress.length > 0) {
        dispatch({
          type: ProgressTrackerStages.PersonalDetails,
          value: accountData?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.CompanyDetails,
          value: accountData?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.AddressDetails,
          value: accountData?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.FilingDocuments,
          value: accountData?.progress,
        });
      }
    },
  });

  const { mutateAsync: updateAccountProgress } = useUpdateAccountProgress(
    currentAccount?.id,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['progressTracker']);
      },
    },
  );

  const handleComplete = async (
    stage: ProgressTrackerStages,
    status: ProgressTrackerStatus = ProgressTrackerStatus.Unknown,
  ) => {
    const requestProps: ProgressTrackerGroupRequest = {
      group: ProgressTrackerGroups.Incorporation,
      status,
      stage,
    };

    await updateAccountProgress({
      progress: [requestProps],
      eventData: {
        stage,
        stageStatus: status,
        entityType: company?.entityType || company?.legacyEntityType || '',
      }
    });
  };

  const handleExpand =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    /**
     * Only update and show correct step only when we land first time or do refresh.
     * On update, the onSuccess callback will handle updation of the step.
     */

    const states = Object.keys(state);

    if (states.length > 0) {
      let firstNotCompleted: number | undefined;
      let completedCount: number = 0;
      states.forEach((item, index) => {
        if (state[item]?.status === ProgressTrackerStatus.Completed) {
          completedCount += 1;
        } else if (firstNotCompleted === undefined) {
          firstNotCompleted = index;
        }
      });
      setCompleted(completedCount);
      if (
        firstNotCompleted !== undefined &&
        state?.companyDetails?.status !== ProgressTrackerStatus.Started // company details fist step submit is the only place status change to started
      ) {
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
      expanded={expanded === 'incorporation'}
      onChange={handleExpand('incorporation')}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="incorporation-content"
        id="incorporation-header"
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h6B">Incorporation</Typography>

            <Typography variant="subtitle1" color="primary">
              {completed < 3 && (
                <>
                  {company?.entityType === ENTITY_MAPPING.sole_prop
                    ? 'We need your personal and business info to create your LLC.'
                    : 'Please provide us your personal and company information to build your profile.'}
                </>
              )}
              {completed === 3 &&
                !stageCompleted() &&
                `Based on the information you provided, we will file with the state
                    and then IRS to get your employer identification number (EIN).`}
              {stageCompleted() && (
                <Box>
                  All done! Your Employer Identification Number (EIN) can be
                  found on your{' '}
                  <Link to={Routes.MY_ACCOUNT}>
                    <Typography variant="body1B">Profile page</Typography>
                  </Link>
                  .
                </Box>
              )}
            </Typography>
            <Typography variant="body2" className={classes.textSecondary}>
              Processing time : 2 - 7 days
            </Typography>
            <AccordionCTA
              expanded={expanded}
              handleExpand={handleExpand}
              completed={completed}
              totalStep={steps.length}
              testId="start-incorporation"
              accordionId="incorporation"
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
        {!isAccountLoading && (
          <Grid container spacing={{ md: 2 }}>
            <Grid item xs={12} md={5}>
              <Stepper
                activeStep={activeStep}
                nonLinear
                orientation={isDesktop ? 'vertical' : 'horizontal'}
                alternativeLabel={!isDesktop}
                data-testid="incorporation-stages"
              >
                {steps.map((key, index) => (
                  <FormationsStep
                    key={key}
                    index={index}
                    setActiveStep={setActiveStep}
                    status={state[key]?.status}
                    label={state[key]?.label}
                    isTrainer={false}
                  />
                ))}
              </Stepper>
            </Grid>
            <Grid item xs={12} md={7} className={classes.stepContentWrapper}>
              {activeStep === 0 && (
                <PersonalDetails
                  handleComplete={() =>
                    handleComplete(ProgressTrackerStages.PersonalDetails, ProgressTrackerStatus.Completed)
                  }
                  stageCompleted={
                    state[ProgressTrackerStages.PersonalDetails]?.status ===
                    ProgressTrackerStatus.Completed
                  }
                />
              )}
              {activeStep === 1 && (
                <CompanyDetails
                  handleComplete={(status: ProgressTrackerStatus) =>
                    handleComplete(ProgressTrackerStages.CompanyDetails, status)
                  }
                  status={state[ProgressTrackerStages.CompanyDetails]?.status}
                  stageCompleted={
                    state[ProgressTrackerStages.CompanyDetails]?.status ===
                    ProgressTrackerStatus.Completed
                  }
                  companyData={company}
                />
              )}
              {activeStep === 2 && (
                <AddressInformation
                  handleComplete={() =>
                    handleComplete(ProgressTrackerStages.AddressDetails, ProgressTrackerStatus.Completed)
                  }
                  stageCompleted={
                    state[ProgressTrackerStages.AddressDetails]?.status ===
                    ProgressTrackerStatus.Completed
                  }
                  companyData={company}
                />
              )}
              {activeStep === 3 && currentAccount?.id && (
                <FilingDocuments
                  accountId={currentAccount?.id}
                  companyData={company}
                  completedSteps={completed}
                  stageCompleted={
                    state[ProgressTrackerStages.FilingDocuments]?.status ===
                    ProgressTrackerStatus.Completed
                  }
                />
              )}
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export const Incorporation = (props: { isDesktop: boolean }) => {
  const {
    currentCompany: companyData,
    isLoading: companyDataLoading,
    status: companyDataStatus,
  } = useCurrentCompany();

  return !companyDataLoading &&
    companyDataStatus === 'success' &&
    companyData ? (
    <IncorporationLayout {...props} company={companyData} />
  ) : (
    <StageSkeleton />
  );
};
