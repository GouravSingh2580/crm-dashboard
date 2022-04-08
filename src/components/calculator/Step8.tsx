import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCalData } from 'states';
import { ANNUAL_COST_OPTIONS } from 'constants/calculator';
import { Header } from './header';
import { Title, FooterContainer, Form } from './shared';
import { RHFSelect, PreviousStep } from '../common';

const validationSchema = yup.object().shape({
  totalAnnualCost: yup.string().required('Please select a annual cost'),
});

type TProps = {
  handleNext: () => void;
  handleBack: () => void;
};

export const Step8 = ({ handleBack, handleNext }: TProps) => {
  const { setValues, data } = useCalData();
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      totalAnnualCost: data.totalAnnualCost || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (formData: {totalAnnualCost: string}) => {
    setValues(formData);
    handleNext();
  };

  return (
    <>
      <Header />
      <PreviousStep onBack={handleBack} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title title="What is your total annual cost for managing your business financials?" />
        <RHFSelect
          id="select-totalannualcost"
          defaultValue={data.totalAnnualCost || ''}
          name="totalAnnualCost"
          label="Total annual cost"
          control={control}
          error={!!errors.totalAnnualCost}
          helperText={
            errors.totalAnnualCost ? errors.totalAnnualCost.message : ''
          }
          data-testid="select-totalannualcost"
        >
          {ANNUAL_COST_OPTIONS.map((option) => (
            <MenuItem
              data-testid={`option-${option.value}`}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </RHFSelect>
        <FooterContainer />
      </Form>
    </>
  );
};
