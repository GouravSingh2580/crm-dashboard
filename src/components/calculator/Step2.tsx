import { useForm } from 'react-hook-form';
import { useCalData } from 'states';
import { MenuItem } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { REVENUE_GENERATION, REVENUE_HELPER } from 'constants/calculator';
import { RHFSelect, PreviousStep, HelperModal } from '../common';
import { Form, FooterContainer, HelperContent, Title } from './shared';
import { Header } from './header';

const validationSchema = yup.object().shape({
  revenue: yup.string().required('Please select a revenue option'),
});

type TProps = {
  handleNext: () => void,
  handleBack: () => void
}

export const Step2 = ({ handleNext, handleBack }: TProps) => {
  const { setValues, data } = useCalData();
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      revenue: data.revenue || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (formData: {revenue: string}) => {
    setValues(formData);
    handleNext();
  };

  return (
    <>
      <Header />
      <PreviousStep onBack={handleBack} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title title="How much money will your business generate this year?" />
        <HelperModal
          helperText="What does this mean?"
          modalBody={<HelperContent data={REVENUE_HELPER} />}
        />
        <RHFSelect
          defaultValue={data.revenue || ''}
          id="select-revenue"
          name="revenue"
          label="Select your revenue"
          control={control}
          error={!!errors.revenue}
          helperText={errors.revenue ? errors.revenue.message : ''}
          data-testid="select-revenue"
        >
          {REVENUE_GENERATION.map((revenue) => (
            <MenuItem
              data-testid={`option-${revenue.value}`}
              key={revenue.value}
              value={revenue.value}
            >
              {revenue.label}
            </MenuItem>
          ))}
        </RHFSelect>
        <FooterContainer />
      </Form>
    </>
  );
};
