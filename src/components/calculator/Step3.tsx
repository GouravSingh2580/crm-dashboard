import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCalData } from 'states';
import { MenuItem } from '@mui/material';
import { EXPENSES, EXPENSES_HELPER } from 'constants/calculator';
import { RHFSelect, HelperModal, PreviousStep } from '../common';
import { Form, FooterContainer, HelperContent, Title } from './shared';
import { Header } from './header';

const validationSchema = yup.object().shape({
  expense: yup.string().required('Please select an expense option'),
});

type TProps = {
  handleNext: () => void;
  handleBack: () => void;
};

export const Step3 = ({ handleNext, handleBack }: TProps) => {
  const { setValues, data } = useCalData();
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      expense: data.expense || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (formData: { expense: string }) => {
    setValues(formData);
    handleNext();
  };
  return (
    <>
      <Header />
      <PreviousStep onBack={handleBack} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title title="What are your estimated annual business expenses?" />
        <HelperModal
          helperText="What does this mean?"
          modalBody={<HelperContent data={EXPENSES_HELPER} />}
        />
        <RHFSelect
          id="select-expense"
          defaultValue={data.expense || ''}
          name="expense"
          label="Select your expense"
          control={control}
          error={!!errors.expense}
          helperText={errors.expense ? errors.expense.message : ''}
          data-testid="select-expense"
        >
          {EXPENSES.map((expense) => (
            <MenuItem
              data-testid={`option-${expense.value}`}
              key={expense.value}
              value={expense.value}
            >
              {expense.label}
            </MenuItem>
          ))}
        </RHFSelect>
        <FooterContainer />
      </Form>
    </>
  );
};
