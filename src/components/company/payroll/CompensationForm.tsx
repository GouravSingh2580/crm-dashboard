import { IAccount } from 'models/account';
import { Box } from '@mui/material';
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

const schema = yup.object().shape({
  estimatedSalary: yup
    .number()
    .label('Estimated Salary')
    .required()
    .positive()
    .max(9999999999, 'The amount is too large')
    .typeError('Estimated salary must be a number'),
});

const fieldMap: IFormField[] = [
  {
    type: FormationsFormFields.Text,
    name: 'estimatedSalary',
    placeholder: 'Estimated Salary',
    label: 'Estimated Salary',
    helperText: 'Enter business owner’s annual reasonable compensation',
    autoFocus: true,
    inputMode: 'numeric',
    maxLength: 12,
  },
];

interface Inputs {
  estimatedSalary: number;
}

const defaultFn = () => {
  /** do nothing * */
};
interface Props {
  account: IAccount;
  onSwitch?: () => void;
}

export const CompensationForm = ({ account, onSwitch = defaultFn }: Props) => {
  const { mutateAsync: update, isLoading } = useUpdateAccount(account.id);
  const onSubmit = async (data: Inputs) => {
    try {
      await update({
        estimatedSalary: data.estimatedSalary,
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
          estimatedSalary: account.estimatedSalary || '',
        }}
      />
    </Box>
  );
};
