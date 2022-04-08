import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Stepper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import queryClient from 'states/reactQueryClient';
import {
  IAccount,
  ProgressTrackerGroupRequest,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'services/account';
import { FormationsStep } from 'components/FormationsStep';
import { useAccount, useUpdateAccountProgress } from 'hooks/api/useAccounts';
import { intersection } from 'lodash';
import { UploadDocuments } from './UploadDocuments';
import { DirectDepositInformationView } from './DirectDepositInformation';
import { useSetupState } from './state';

interface IAccountVerificationProps {
  companyId: string;
  companyData: any;
  userData: any;
}

export const AccountVerification: React.FC<IAccountVerificationProps> = ({
  companyId,
  companyData,
  userData,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState(0);

  const { state, dispatch, isStepCompleted } = useSetupState(
    userData?.accountId,
    companyData?.entityType || companyData?.legacyEntityType || '',
  );

  const steps = intersection(Object.keys(state), [
    ProgressTrackerStages.UploadIdentityProof,
    ProgressTrackerStages.UploadLastYearTaxStatement,
    ProgressTrackerStages.DocumentOfIncorporation,
    ProgressTrackerStages.DirectDepositInformation,
  ]);

  useAccount(userData.accountId, {
    onSuccess: (account: IAccount) => {
      if (account?.progress.length > 0) {
        dispatch({
          type: ProgressTrackerStages.UploadIdentityProof,
          value: account?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.UploadLastYearTaxStatement,
          value: account?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.DocumentOfIncorporation,
          value: account?.progress,
        });
        dispatch({
          type: ProgressTrackerStages.DirectDepositInformation,
          value: account?.progress,
        });
      }
    },
  });

  const { mutateAsync: updateAccountProgress, isLoading: isProgressUpdating } =
    useUpdateAccountProgress(userData.accountId, {
      onSuccess: () => {
        queryClient.invalidateQueries(['account', userData.accountId]);
      },
    });

  const handleComplete = async (stage: ProgressTrackerStages) => {
    const requestProps: ProgressTrackerGroupRequest = {
      stage,
      status: ProgressTrackerStatus.Completed,
      group: ProgressTrackerGroups.AccountVerification,
    };
    await updateAccountProgress({
      progress: [requestProps],
      eventData: {
        stage,
        stageStatus: ProgressTrackerStatus.Completed,
        entityType:
          companyData?.entityType || companyData?.legacyEntityType || '',
      }
    });
  };

  const handleStepReject = (
    customerAction: string,
    stage: ProgressTrackerStages,
  ) => {
    const requestProps: ProgressTrackerGroupRequest = {
      stage,
      status: ProgressTrackerStatus.Rejected,
      group: ProgressTrackerGroups.AccountVerification,
      comment: customerAction,
    };

    return updateAccountProgress({ progress: [requestProps] });
  };

  const toggleExpandStatus = () => setIsExpanded(!isExpanded);
  return (
    <Accordion expanded={isExpanded} onChange={toggleExpandStatus}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="account-verification-content"
        id="account-verification-header"
      >
        <Typography variant="h6B">Account Verification</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={12} md={5}>
            <Stepper
              activeStep={activeStep}
              nonLinear
              orientation="vertical"
              alternativeLabel={false}
              data-test-id="account-verification-stages"
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
            {steps[activeStep] ===
              ProgressTrackerStages.UploadIdentityProof && (
              <UploadDocuments
                title="Identity Proof"
                subtitle="Click to view and approve the Identity proof files from the customer"
                categoryData={{
                  name: 'Miscellaneous',
                  subcategory: 'Biographical Information',
                  department: 'Permanent',
                  visibleToCustomer: true,
                }}
                accountId={userData.accountId}
                companyId={companyId}
                onComplete={() =>
                  handleComplete(ProgressTrackerStages.UploadIdentityProof)
                }
                loading={isProgressUpdating}
                isCompleted={isStepCompleted(
                  ProgressTrackerStages.UploadIdentityProof,
                )}
                onReject={(customerAction) =>
                  handleStepReject(
                    customerAction,
                    ProgressTrackerStages.UploadIdentityProof,
                  )
                }
                allowStepReject = {
                  state[ProgressTrackerStages.UploadIdentityProof]?.status !==
                  ProgressTrackerStatus.Rejected
                }
                data-testid="step-identity-proof"
              />
            )}
            {steps[activeStep] ===
              ProgressTrackerStages.UploadLastYearTaxStatement && (
              <UploadDocuments
                title="Last Year's Tax Statement"
                subtitle="Click to view and approve the Last Year Tax Return files from the customer"
                categoryData={{
                  name: 'Business',
                  subcategory: 'Tax Return',
                  department: 'Tax',
                  visibleToCustomer: true,
                }}
                accountId={userData.accountId}
                companyId={companyId}
                onComplete={() =>
                  handleComplete(
                    ProgressTrackerStages.UploadLastYearTaxStatement,
                  )
                }
                loading={isProgressUpdating}
                isCompleted={isStepCompleted(
                  ProgressTrackerStages.UploadLastYearTaxStatement,
                )}
                onReject={(customerAction) =>
                  handleStepReject(
                    customerAction,
                    ProgressTrackerStages.UploadLastYearTaxStatement,
                  )
                }
                allowStepReject = {
                  state[ProgressTrackerStages.UploadLastYearTaxStatement]?.status !==
                  ProgressTrackerStatus.Rejected
                }
                data-testid="step-last-year-tax"
              />
            )}
            {steps[activeStep] ===
              ProgressTrackerStages.DocumentOfIncorporation && (
              <UploadDocuments
                title="Documents of Incorporation"
                subtitle="Click to view and approve the Document of Incorporation files from the customer"
                categoryData={{
                  name: 'Organizational Docs',
                  subcategory: 'Miscellaneous',
                  department: 'Permanent',
                  visibleToCustomer: true,
                }}
                accountId={userData.accountId}
                companyId={companyId}
                onComplete={() =>
                  handleComplete(ProgressTrackerStages.DocumentOfIncorporation)
                }
                loading={isProgressUpdating}
                isCompleted={isStepCompleted(
                  ProgressTrackerStages.DocumentOfIncorporation,
                )}
                onReject={(customerAction) =>
                  handleStepReject(
                    customerAction,
                    ProgressTrackerStages.DocumentOfIncorporation,
                  )
                }
                allowStepReject = {
                  state[ProgressTrackerStages.DocumentOfIncorporation]?.status !==
                  ProgressTrackerStatus.Rejected
                }
                data-testid="step-documents-incorpotion"
              />
            )}
            {steps[activeStep] ===
              ProgressTrackerStages.DirectDepositInformation && (
              <DirectDepositInformationView
                userData={userData}
                onComplete={() =>
                  handleComplete(ProgressTrackerStages.DirectDepositInformation)
                }
              />
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
