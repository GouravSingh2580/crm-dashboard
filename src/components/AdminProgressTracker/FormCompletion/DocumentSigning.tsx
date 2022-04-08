import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import EditIcon from '@mui/icons-material/Edit';
import { FormationsFormDialog } from 'components/common/FormationsFormDialog';
import { FormationsFormFields } from 'components/common/FormationsForm';
import { Company } from 'services/companies';
import {
  ProgressTrackerGroupRequest,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'services/account';
import { documentSigningSchema } from 'schemas/documentSigningSchema';
import queryClient from 'states/reactQueryClient';
import { useUpdateAccount } from 'hooks/api/useAccounts';
import { FormationsDivider } from 'components/common';
import { sendProgressTrackerEvent } from 'helpers/heap/progressTrackerEvent';
import { UploadDocuments } from '../AccountVerification/UploadDocuments';

interface IDocumentSigningViewProps {
  companyData: Company;
  accountId: string;
  rightSignatureURL: string;
  isCompleted: boolean;
}

export const DocumentSigningView: React.FC<IDocumentSigningViewProps> = ({
  companyData,
  accountId,
  rightSignatureURL,
  isCompleted,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const { mutateAsync: updateAccountProgress } = useUpdateAccount(accountId);

  const onFormSubmit = async (formData: Company) => {
    try {
      await updateAccountProgress({
        progress: [
          {
            stage: ProgressTrackerStages.DocumentSigning,
            group: ProgressTrackerGroups.FormCompletion,
            status: ProgressTrackerStatus.InProgress,
          },
        ],
        rightSignatureURL: formData?.rightSignatureURL,
      });
      await queryClient.invalidateQueries(['account', accountId]);
      setShowEditModal(false);
      sendProgressTrackerEvent({
        stage: ProgressTrackerStages.DocumentSigning,
        accountId,
        entityType:
          companyData?.entityType || companyData?.legacyEntityType || '',
      });
    } catch {
      sendProgressTrackerEvent({
        stage: ProgressTrackerStages.DocumentSigning,
        accountId,
        status: 'error',
        entityType:
          companyData?.entityType || companyData?.legacyEntityType || '',
      });
    }
  };

  const handleComplete = async (stage: ProgressTrackerStages) => {
    const requestProps: ProgressTrackerGroupRequest = {
      stage,
      status: ProgressTrackerStatus.Completed,
      group: ProgressTrackerGroups.FormCompletion,
    };

    await updateAccountProgress({ progress: [requestProps] });
    await queryClient.invalidateQueries(['account', accountId]);
  };

  return (
    <div data-testid="step-document-signing">
      <Grid container direction="column">
        <Grid container direction="row" alignItems="baseline" rowGap={2}>
          <Typography variant="h5B" component="span">
            Document Signing
          </Typography>
          <Button
            aria-label="delete"
            sx={{ marginLeft: '24px' }}
            startIcon={<EditIcon />}
            onClick={() => setShowEditModal(true)}
            data-testid="document-signing-edit-btn"
          >
            Edit
          </Button>
        </Grid>
        <ReadOnlyForm
          items={[
            {
              title: 'Right Signature URL',
              value: rightSignatureURL || 'N/A',
            },
          ]}
          overFlowType="breakLine"
        />
        <FormationsDivider />
        {accountId && companyData.id && (
          <UploadDocuments
            title="Signed Documents"
            subtitle="Click to view documents Signed by customer"
            categoryData={{
              name: 'Organizational Docs',
              subcategory: 'Signed Agreement',
              department: 'Permanent',
              visibleToCustomer: true,
            }}
            accountId={accountId}
            companyId={companyData.id}
            onComplete={() =>
              handleComplete(ProgressTrackerStages.DocumentSigning)
            }
            loading={false}
            hasCompleteCTA={!!rightSignatureURL}
            isCompleted={isCompleted}
          />
        )}
      </Grid>
      {showEditModal && (
        <FormationsFormDialog
          title="Document Signing"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onFormSubmit}
          fieldsMap={[
            {
              type: FormationsFormFields.Text,
              name: 'rightSignatureURL',
              placeholder: '',
              label: 'Right Signature URL',
              autoFocus: true,
            },
          ]}
          defaultValues={{
            rightSignatureURL,
            mode: 'onChange',
            reValidateMode: 'onChange',
          }}
          validationSchema={documentSigningSchema}
        />
      )}
    </div>
  );
};
