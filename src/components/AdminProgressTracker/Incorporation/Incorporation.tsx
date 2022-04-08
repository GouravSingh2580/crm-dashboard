import React, {
  createContext,
  Dispatch,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stepper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ENTITY_MAPPING } from 'constants/common';
import {
  ProgressTrackerGroup,
  ProgressTrackerGroupRequest,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'services/account';
import { useAccount, useUpdateAccountProgress } from 'hooks/api/useAccounts';
import queryClient from 'states/reactQueryClient';
import { FormationsStep } from 'components/FormationsStep';
import { PersonalDetailsView } from './PersonalDetails';
import { CompanyDetailsView } from './CompanyDetails';
import { BusinessAddress } from './BusinessAddress';
import { FilingDocumentsView } from './FilingDocuments';
import { initialState, reducer } from './state';

interface IIncorporationProps {
  companyData: any;
  userData: any;
}

interface IContext {
  state: unknown;
  dispatch: Dispatch<{
    type: ProgressTrackerStages;
    value: ProgressTrackerGroup[];
  }>;
}
export const IncorporationContext = createContext({
  state: undefined,
  dispatch: () => {
    // do nothing
  },
} as IContext);

export const Incorporation: React.FC<IIncorporationProps> = ({
  companyData,
  userData,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState(0);

  const [state, dispatch] = useReducer(
    reducer,
    initialState(
      companyData?.entityType || companyData?.legacyEntityType || '',
    ),
  );

  const steps = Object.keys(state);

  const { account } = useAccount(userData.accountId);
  useEffect(() => {
    if (account && account?.progress.length > 0) {
      dispatch({
        type: ProgressTrackerStages.PersonalDetails,
        value: account?.progress,
      });
      dispatch({
        type: ProgressTrackerStages.CompanyDetails,
        value: account?.progress,
      });
      dispatch({
        type: ProgressTrackerStages.AddressDetails,
        value: account?.progress,
      });
      dispatch({
        type: ProgressTrackerStages.FilingDocuments,
        value: account?.progress,
      });
    }
  }, [account]);

  useEffect(() => {
    const states = Object.keys(state);
    if (states.length > 0) {
      const firstNotCompleted = states.findIndex(
        (item) => state[item]?.status !== 'completed',
      );
      if (firstNotCompleted !== -1) {
        setActiveStep(firstNotCompleted);
      } else {
        setActiveStep(states.length - 1);
      }
    }
  }, [state]);

  const { mutateAsync: updateAccountProgress, isLoading: isProgressUpdating } =
    useUpdateAccountProgress(userData.accountId, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['progressTracker']);
        await queryClient.invalidateQueries(['account', userData.accountId]);
      },
    });

  const handleComplete = async (stage: ProgressTrackerStages) => {
    let requestProps: ProgressTrackerGroupRequest = {
      stage: ProgressTrackerStages.Unsupported,
      status: ProgressTrackerStatus.NotStarted,
      group: ProgressTrackerGroups.Unsupported,
    };

    switch (stage) {
      case ProgressTrackerStages.PersonalDetails:
        requestProps = {
          stage: ProgressTrackerStages.PersonalDetails,
          status: ProgressTrackerStatus.Completed,
          group: ProgressTrackerGroups.Incorporation,
        };
        break;
      case ProgressTrackerStages.CompanyDetails:
        requestProps = {
          stage: ProgressTrackerStages.CompanyDetails,
          status: ProgressTrackerStatus.Completed,
          group: ProgressTrackerGroups.Incorporation,
        };
        break;
      case ProgressTrackerStages.AddressDetails:
        requestProps = {
          stage: ProgressTrackerStages.AddressDetails,
          status: ProgressTrackerStatus.Completed,
          group: ProgressTrackerGroups.Incorporation,
        };
        break;
      case ProgressTrackerStages.FilingDocuments:
        requestProps = {
          stage: ProgressTrackerStages.FilingDocuments,
          status: ProgressTrackerStatus.Completed,
          group: ProgressTrackerGroups.Incorporation,
        };
        break;
      default:
        break;
    }

    await updateAccountProgress({
      progress: [requestProps],
      eventData: {
        stage,
        stageStatus: requestProps.status,
        entityType:
          companyData?.entityType || companyData?.legacyEntityType || '',
      },
    });
  };

  const toggleExpandStatus = () => setIsExpanded(!isExpanded);

  return (
    <IncorporationContext.Provider value={{ state, dispatch }}>
      <Accordion
        expanded={isExpanded}
        onChange={toggleExpandStatus}
        data-testid="incorporation-container"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="incorporation-content"
          id="incorporation-header"
        >
          <Typography variant="h6B">Incorporation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} md={5}>
              <Stepper
                activeStep={activeStep}
                nonLinear
                orientation="vertical"
                alternativeLabel={false}
                data-test-id="incorporation-stages"
              >
                {steps.map((key, index) => (
                  <FormationsStep
                    key={key}
                    index={index}
                    setActiveStep={setActiveStep}
                    status={state[key]?.status}
                    label={state[key]?.label}
                    lastUpdatedTime={state[key]?.updatedAt}
                    isTrainer
                  />
                ))}
              </Stepper>
            </Grid>
            <Grid item xs={12} md={7}>
              {activeStep === 0 && (
                <PersonalDetailsView
                  handleComplete={() =>
                    handleComplete(ProgressTrackerStages.PersonalDetails)
                  }
                  userData={userData}
                />
              )}
              {activeStep === 1 && (
                <CompanyDetailsView
                  handleComplete={() =>
                    handleComplete(ProgressTrackerStages.CompanyDetails)
                  }
                  isSoleProp={
                    companyData?.entityType === ENTITY_MAPPING.sole_prop
                  }
                  companyData={companyData}
                  userData={userData}
                />
              )}
              {activeStep === 2 && (
                <BusinessAddress
                  companyData={companyData}
                  userData={userData}
                  handleComplete={() =>
                    handleComplete(ProgressTrackerStages.AddressDetails)
                  }
                />
              )}
              {activeStep === 3 && (
                <FilingDocumentsView
                  userData={userData}
                  companyData={companyData}
                  handleComplete={() =>
                    handleComplete(ProgressTrackerStages.FilingDocuments)
                  }
                  isProgressUpdating={isProgressUpdating}
                />
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </IncorporationContext.Provider>
  );
};
