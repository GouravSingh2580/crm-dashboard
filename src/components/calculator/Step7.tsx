import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TIME_OPTIONS } from 'constants/calculator';
import { useCalData } from 'states';
import { Title, FooterContainer, Form } from './shared';
import { RHFSelect, PreviousStep } from '../common';
import { Header } from './header';

const validationSchema = yup.object().shape({
  timeSpend: yup.string().required('Please select a time spend'),
});

type TProps = {
  handleNext: () => void;
  handleBack: () => void;
};

export const Step7 = ({ handleBack, handleNext }: TProps) => {
  const { setValues, data } = useCalData();
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      timeSpend: data.timeSpend || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (formData: {timeSpend: number}) => {
    setValues(formData);
    handleNext();
  };
  return (
    <>
      <Header />
      <PreviousStep onBack={handleBack} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title title="How much time do you spend managing your business financials and back office?" />
        <RHFSelect
          id="select-timespend"
          defaultValue={data.timeSpend || ''}
          name="timeSpend"
          label="Time spend"
          control={control}
          error={!!errors.timeSpend}
          helperText={errors.timeSpend ? errors.timeSpend.message : ''}
          data-testid="select-timespend"
        >
          {TIME_OPTIONS.map((option) => (
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

