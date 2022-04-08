import React, { useEffect, useReducer, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Stepper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  ProgressTrackerGroupRequest,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'services/account';
import { useAccount, useUpdateAccount } from 'hooks/api/useAccounts';
import queryClient from 'states/reactQueryClient';
import { FormationsStep } from 'components/FormationsStep';
import { DocumentSigningView } from './DocumentSigning';
import { BankSelectionView } from './BankSelection';
import { initialState, reducer } from './state';

interface IFormCompletionProps {
  companyData: any;
  userData: any;
}

export const FormCompletion: React.FC<IFormCompletionProps> = ({
  companyData,
  userData,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState());

  const steps = Object.keys(state.steps);

  const { account } = useAccount(userData.accountId);

  useEffect(() => {
    if (account?.rightSignatureURL) {
      dispatch({
        type: 'updateRightSignature',
        value: account,
      });
    }
    if (account && account?.progress.length > 0) {
      dispatch({
        type: ProgressTrackerStages.BankSelection,
        value: account,
      });
      dispatch({
        type: ProgressTrackerStages.DocumentSigning,
        value: account,
      });
    }
  }, [account]);

  useEffect(() => {
    if (steps.length > 0) {
      let firstNotCompleted: number | undefined;
      steps.forEach((item, index) => {
        if (firstNotCompleted === undefined && index !== 0) {
          firstNotCompleted = index;
        }
      });
      if (firstNotCompleted !== undefined) {
        setActiveStep(firstNotCompleted);
      }
    }
  }, []);

  const { mutateAsync: updateAccountProgress } =
    useUpdateAccount(userData.accountId, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['account', userData.accountId]);
      },
    });

  const handleComplete = async (
    stage: ProgressTrackerStages,
    status: ProgressTrackerStatus,
    additionalProps: { rightSignatureURL?: string },
  ) => {
    let requestProps: ProgressTrackerGroupRequest = {
      stage: '',
      group: '',
    };

    switch (stage) {
      case ProgressTrackerStages.BankSelection:
        requestProps = {
          stage: ProgressTrackerStages.BankSelection,
          group: ProgressTrackerGroups.FormCompletion,
          status,
        };
        break;
      case ProgressTrackerStages.DocumentSigning:
        requestProps = {
          stage: ProgressTrackerStages.DocumentSigning,
          group: ProgressTrackerGroups.FormCompletion,
          status,
        };
        break;
      default:
        break;
    }

    if (Object.values(requestProps).length > 0) {
      await updateAccountProgress({ progress: [requestProps], ...additionalProps });
    }
  };

  const toggleExpandStatus = () => setIsExpanded(!isExpanded);
  return (
    <Accordion expanded={isExpanded} onChange={toggleExpandStatus}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="form-completion-content"
        id="form-completion-header"
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography variant="h6B">Bank Setup</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={12} md={5}>
            <Stepper
              activeStep={activeStep}
              nonLinear
              orientation="vertical"
              alternativeLabel={false}
              data-test-id="form-completion-stages"
            >
              {steps.map((key, index) => (
                <FormationsStep
                  key={key}
                  index={index}
                  setActiveStep={setActiveStep}
                  status={state.steps[key]?.status}
                  label={state.steps[key]?.label}
                  lastUpdatedTime={state.steps[key]?.updatedAt}
                  isTrainer
                />
              ))}
            </Stepper>
          </Grid>
          <Grid item xs={12} md={7}>
            {activeStep === 0 && (
              <BankSelectionView
                handleComplete={(status, additionalProps = {}) =>
                  handleComplete(
                    ProgressTrackerStages.BankSelection,
                    status,
                    additionalProps,
                  )
                }
                userData={userData}
                companyData={companyData}
              />
            )}
            {activeStep === 1 && (
              <DocumentSigningView
                rightSignatureURL={state.rightSignatureURL}
                accountId={userData.accountId}
                companyData={companyData}
                isCompleted={state.steps[ProgressTrackerStages.DocumentSigning]?.status ===
                  ProgressTrackerStatus.Completed}
              />
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
