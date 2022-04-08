import React from 'react';
import EditIcon from '@mui/icons-material/Edit';

import {
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import { FormationsFormDialog } from 'components/common/FormationsFormDialog';
import { FormationsFormFields } from 'components/common/FormationsForm';
import { directDepositSchema } from 'schemas/directDepositSchema';
import { useUpdateUser } from 'hooks/api';
import queryClient from 'states/reactQueryClient';
import { BANK_ACCOUNT_TYPES } from 'enums';

interface IDirectDepositInformationViewProps {
  userData: any,
  onComplete: () => void,
}

export const DirectDepositInformationView: React.FC<
  IDirectDepositInformationViewProps
> = ({ userData, onComplete }) => {
  const [showEditModal, setShowEditModal] = React.useState(false);

  const {
    bankName, routingNumber, bankAccountNumber, bankAccountType,
  } = userData || {};

  const {
    updateUserAsync: updateUser,
  } = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userData.id]);
      setShowEditModal(false);
    },
  });

  const onFormSubmit = async (formData: any) => {
    await updateUser({
      id: userData.id,
      data: formData,
    });
    onComplete();
  };

  return (
    <Grid
      container
      direction="column"
      data-testid="step-direct-deposit"
    >
      <Grid
        container
        direction="row"
        alignItems="center"
        rowGap={2}
      >
        <Typography
          variant="h5B"
          component="span"
        >
          Direct Deposit Information
        </Typography>

        <Button
          aria-label="delete"
          sx={{ marginLeft: '24px' }}
          startIcon={<EditIcon />}
          onClick={() => setShowEditModal(true)}
        >
          Edit
        </Button>

      </Grid>

      <ReadOnlyForm items={[{
        title: 'Bank Name',
        value: bankName || 'N/A',
      }, {
        title: 'Routing Number',
        value: routingNumber || 'N/A',
      }, {
        title: 'Account Number',
        value: bankAccountNumber || 'N/A',
      },
      {
        title: 'Account Type',
        value: bankAccountType || 'N/A',
      }]}
      />

      {showEditModal && (
        <FormationsFormDialog
          title="Edit Direct Deposit (Personal Bank Account)"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onFormSubmit}
          validationSchema={directDepositSchema}
          fieldsMap={[{
            type: FormationsFormFields.Text,
            name: 'bankName',
            placeholder: 'Bank Name',
            autoCapitalize: true,
            label: 'Bank Name',
            autoFocus: true,
            maxLength: 80,
          }, {
            type: FormationsFormFields.Text,
            name: 'routingNumber',
            placeholder: '123456789',
            autoCapitalize: true,
            label: 'Routing Number',
            inputMode: 'tel',
            maxLength: 9,
          },
          {
            type: FormationsFormFields.Text,
            name: 'bankAccountNumber',
            placeholder: 'Account Number',
            autoCapitalize: true,
            label: 'Account Number',
            inputMode: 'tel',
            maxLength: 15
          },
          {
            type: FormationsFormFields.Select,
            name: 'bankAccountType',
            placeholder: 'Choose an account type',
            autoCapitalize: true,
            label: 'Account Type',
            options: BANK_ACCOUNT_TYPES,
          }]}
          defaultValues={{
            bankName,
            routingNumber,
            bankAccountNumber,
            bankAccountType,
            mode: 'onChange',
            reValidateMode: 'onChange',
          }}
        />
      )}
    </Grid>
  );
};
