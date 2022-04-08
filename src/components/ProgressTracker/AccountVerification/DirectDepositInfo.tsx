import { Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { directDepositSchema } from 'schemas';
import { BANK_ACCOUNT_TYPES } from 'enums';
import { useCurrentUser, useUpdateUser } from 'hooks/api';
import queryClient from 'states/reactQueryClient';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { ProgressTrackerStatus } from 'services/account';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import {
  FormationsForm,
  FormationsFormFields,
} from 'components/common/FormationsForm';
import { useState } from 'react';

const useStyles = makeStyles((theme: any) => ({
  textSecondary: {
    color: theme.palette.text.secondary,
    margin: `${theme.spacing(2)} 0`
  },
  select: {
    width: '100%',
  },
  continueBtn: {
    marginTop: theme.spacing(3),
  },
  formSection: {
    marginBottom: '36px',
  },
  form: {
    margin: theme.spacing(2, 0),
  },
}));

export const DirectDepositInfo = ({
  handleContinue,
  currentStatus,
}: {
  handleContinue: () => void;
  currentStatus: ProgressTrackerStatus;
}) => {
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);
  const { currentUser: userData } = useCurrentUser();

  const { updateUser } = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      handleContinue();
    },
  });

  const handleSubmit = (data: any) => {
    setSubmitting(true);
    updateUser({ data });
  };

  return (
    <>
      <Typography variant="h5B" component="h5">
        Direct Deposit (Personal Bank Account)
      </Typography>
      <Typography variant="body1" className={classes.textSecondary}>
        {currentStatus === ProgressTrackerStatus.Completed
          ? 'All good!'
          : 'Enter your personal banking information so we can setup payroll from your business to your personal bank account.'}
      </Typography>
      <Grid container className={classes.formSection} spacing={2}>
        {currentStatus === ProgressTrackerStatus.Completed ? (
          <Grid item xs={12}>
            <ReadOnlyForm
              items={[
                {
                  title: 'Bank Name',
                  value: userData?.bankName || 'N/A',
                },
                {
                  title: 'Routing Number',
                  value: userData?.routingNumber || 'N/A',
                },
                {
                  title: 'Account Number',
                  value: userData?.bankAccountNumber || 'N/A',
                },
                {
                  title: 'Account Type',
                  value: userData?.bankAccountType || 'N/A',
                },
              ]}
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <FormationsForm
              onSubmit={handleSubmit}
              validationSchema={directDepositSchema}
              fieldsMap={[
                {
                  type: FormationsFormFields.Text,
                  name: 'bankName',
                  placeholder: 'Bank Name',
                  autoCapitalize: true,
                  label: 'Bank Name',
                  autoFocus: true,
                  maxLength: 80,
                },
                {
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
                  maxLength: 15,
                },
                {
                  type: FormationsFormFields.Select,
                  name: 'bankAccountType',
                  placeholder: 'Choose an account type',
                  autoCapitalize: true,
                  label: 'Account Type',
                  options: BANK_ACCOUNT_TYPES,
                },
              ]}
              defaultValues={{
                bankName: userData?.bankName,
                routingNumber: userData?.routingNumber,
                bankAccountNumber: userData?.bankAccountNumber,
                bankAccountType: userData?.bankAccountType,
                mode: 'onChange',
                reValidateMode: 'onChange',
              }}
              renderFormControls={() => (
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  size="large"
                  data-testid="save-direct-deposit"
                  loading={submitting}
                  loadingPosition="end"
                  endIcon={<SaveIcon />}
                >
                  Save and Continue
                </LoadingButton>
              )}
              showLoader={false}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};
