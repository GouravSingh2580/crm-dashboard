import { Box, InputAdornment } from '@mui/material';
import * as yup from 'yup';
import { useUpdateAccount } from 'hooks/api';
import { showErrorToast } from 'components/toast/showToast';
import { getErrorMessage } from 'helpers/error';
import useLoading from 'hooks/useLoading';
import {
  FormationsForm,
  FormationsFormFields,
  IFormField,
} from 'components/common/FormationsForm';
import { Taxes } from 'models/account';

const schema = yup.object().shape({
  annualEstimated: yup
    .number()
    .label('Estimated Tax Liability')
    .required('Estimated Tax Liability is required.')
    .integer('Amount must be a whole number.')
    .min(1, 'Amount must be greater than 0 and less than 1000000.')
    .max(999999, 'Amount must be greater than 0 and less than 1000000.')
});

const fieldMap: IFormField[] = [
  {
    type: FormationsFormFields.Text,
    name: 'annualEstimated',
    placeholder: 'Estimated Tax Liability',
    label: 'Estimated Annual Tax Liability',
    helperText: 'Enter Total Liability YTD',
    autoFocus: true,
    inputMode: 'numeric',
    maxLength: 12,
    startAdornment: <InputAdornment position="start">$</InputAdornment>,
  },
];

interface Inputs {
  annualEstimated: number;
}

const defaultFn = () => {
  /** do nothing * */
};
interface Props {
  accountId: string | undefined;
  taxes: Taxes | undefined;
  onSwitch?: () => void;
}

export const PersonalTaxLiabilityForm = ({ accountId, taxes, onSwitch = defaultFn }: Props) => {
  const { mutateAsync: update, isLoading } = useUpdateAccount(accountId);
  const onSubmit = async (data: Inputs) => {
    try {
      await update({
        taxes: data
      });
      onSwitch();
    } catch (e) {
      showErrorToast(getErrorMessage(e, 'Cannot save data, please try again'));
    }
  };
  const loading = useLoading(isLoading);
  return (
    <Box sx={{ pt: 4 }}>
      {loading}
      <FormationsForm
        onSubmit={onSubmit}
        validationSchema={schema}
        fieldsMap={fieldMap}
        onCancel={onSwitch}
        defaultValues={{
          taxes: taxes?.annualEstimated,
        }}
      />
    </Box>
  );
};
