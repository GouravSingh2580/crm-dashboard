import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import EditIcon from '@mui/icons-material/Edit';
import { FormationsFormDialog } from 'components/common/FormationsFormDialog';
import { UserInfo } from 'services/users';
import queryClient from 'states/reactQueryClient';
import { FormationsFormFields } from 'components/common/FormationsForm';
import { useUpdateCompany } from 'hooks/api/useCompanies';
import { Company } from 'models/company';
import { bankSelectionAdminSchema } from 'schemas/bankSelectionSchema';
import { ALLOWED_BANKS, ALLOWED_BANKS_OPTIONS } from 'enums';
import { ProgressTrackerStages, ProgressTrackerStatus } from 'services/account';
import { sendProgressTrackerEvent } from 'helpers/heap/progressTrackerEvent';

interface IBankSelectionViewProps {
  companyData: Company;
  userData: UserInfo;
  handleComplete: (status: ProgressTrackerStatus) => void;
}

export const BankSelectionView: React.FC<IBankSelectionViewProps> = ({
  companyData,
  userData,
  handleComplete,
}) => {
  const { bankName = '', useExistingBank, hasBankAccount } = companyData;
  const [showEditModal, setShowEditModal] = React.useState(false);

  const { mutateAsync: updateCompany } = useUpdateCompany({
    onSuccess: async () => {
      await queryClient.invalidateQueries(['company/user', 'userid', userData.id]);
      setShowEditModal(false);
    },
  });

  const onFormSubmit = async (formData: {
    bankName: string;
    hasBankAccount: string;
    otherOption?: string;
  }) => {
    const companyDetails = {
      bankName: formData?.bankName,
      useExistingBank: true,
      useOtherBank: false,
      hasBankAccount: formData.hasBankAccount === 'true',
    };

    if (formData?.bankName === 'other' && formData?.otherOption) {
      companyDetails.bankName = formData?.otherOption;
      companyDetails.useExistingBank = false;
      companyDetails.useOtherBank = true;
    }
    if (companyData.id) {
      await updateCompany({ id: companyData.id, data: companyDetails });
      handleComplete(ProgressTrackerStatus.Completed);
      sendProgressTrackerEvent({
        stage: ProgressTrackerStages.BankSelection,
        accountId: userData.accountId,
        entityType: companyData?.entityType || companyData?.legacyEntityType || '',
        bankName: companyDetails.bankName,
        bankRequired: companyDetails.hasBankAccount? 'Yes' : 'No'
      });
    }
  };

  return (
    <div data-testid="step-bank-selection">
      <Grid container direction="column">
        <Grid container direction="row" alignItems="baseline" rowGap={2}>
          <Typography variant="h5B" component="span">
            Bank Selection
          </Typography>
          <Button
            aria-label="delete"
            sx={{ marginLeft: '24px' }}
            startIcon={<EditIcon />}
            onClick={() => setShowEditModal(true)}
            data-testid="bank-selection-edit-btn"
          >
            Edit
          </Button>
        </Grid>
        <ReadOnlyForm
          items={[
            {
              title: 'Has a bank account?',
              value: hasBankAccount ? 'Yes' : 'No',
            },
            {
              title: 'Bank Name',
              value: ALLOWED_BANKS[bankName] || bankName,
            },
          ]}
        />
      </Grid>
      {showEditModal && (
        <FormationsFormDialog
          title="Bank Selection"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onFormSubmit}
          fieldsMap={[
            {
              type: FormationsFormFields.RadioField,
              name: 'hasBankAccount',
              label: 'Has a bank account?',
              options: [
                { value: "true", label: 'Yes' },
                { value: "false", label: 'No' },
              ],
            },
            {
              type: FormationsFormFields.RadioField,
              name: 'bankName',
              label: 'Bank Name',
              maxLength: 80,
              options: [...ALLOWED_BANKS_OPTIONS, { value: 'other', label: 'Other' }],
            },
          ]}
          defaultValues={{
            bankName: useExistingBank === false ? 'other' : bankName,
            otherOption: useExistingBank === false ? bankName : '',
            hasBankAccount: `${hasBankAccount}`,
            mode: 'onChange',
            reValidateMode: 'onChange',
          }}
          validationSchema={bankSelectionAdminSchema}
        />
      )}
    </div>
  );
};
