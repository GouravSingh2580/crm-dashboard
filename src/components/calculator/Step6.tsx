import { useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCalData } from 'states';
import { INSURANCE_COST } from 'constants/calculator';
import { Form, Title, FooterContainer } from './shared';
import { RHFSelect, PreviousStep } from '../common';
import { Header } from './header';

const validationSchema = yup.object().shape({
  insurance: yup.string().required('Please select a insurance cost'),
});

type TProps = {
  handleNext: () => void;
  handleBack: () => void;
  prevStep: number;
};

export const Step6 = ({ handleBack, handleNext, prevStep }: TProps) => {
  const { setValues, data } = useCalData();
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      insurance: data.insurance || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (formData: {insurance: string}) => {
    setValues(formData);
    handleNext();
  };

  useEffect(() => {
    const { healthCoverage } = data;
    if (
      healthCoverage.length === 0 ||
      (healthCoverage.length > 0 &&
        healthCoverage.indexOf('im_using_my_partners_health_insurance')) ===
        -1 ||
      (healthCoverage.length === 1 &&
        healthCoverage.indexOf('im_using_my_partners_health_insurance') > -1)
    ) {
      if (prevStep === 6) {
        handleBack();
      } else {
        handleNext();
      }
    }
  }, [prevStep, data, data.healthCoverage, handleNext]);

  return (
    <>
      <Header />
      <PreviousStep onBack={handleBack} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title title="How much are you paying annually for health coverage?" />
        <RHFSelect
          id="select-insurance"
          defaultValue={data.insurance || ''}
          name="insurance"
          label="Insurance Cost"
          control={control}
          error={!!errors.insurance}
          helperText={errors.insurance ? errors.insurance.message : ''}
          data-testid="select-insurance"
        >
          {INSURANCE_COST.map((option) => (
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
