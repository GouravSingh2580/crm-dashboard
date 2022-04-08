import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import makeStyles from '@mui/styles/makeStyles';
import { useForm } from 'react-hook-form';
import { useCalData } from 'states';
import { FooterContainer } from './shared/FooterContainer';
import {
  CurrencyField,
  normalizeValue,
  PreviousStep
} from '../common';
import { Form } from './shared/Form';
import { Title } from './shared/Title';
import { Header } from './header';

const validationSchema = yup.object().shape({
  taxes: yup.string().required('Please enter valid tax amount'),
});

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: theme.spacing(2),
    minHeight: '5.5rem',
  },
}));

type TProps = {
  handleNext: () => void;
  handleBack: () => void;
};

export const Step9 = ({ handleBack, handleNext }: TProps) => {
  const classes = useStyles();
  const { setValues, data } = useCalData();
  const { handleSubmit, register, errors } = useForm({
    defaultValues: {
      taxes: data.taxes || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (val: {taxes: string}) => {
    const normalVal = normalizeValue(val.taxes);
    setValues({ ...data, ...{ taxes: normalVal } });
    handleNext();
  };

  return (
    <>
      <Header />
      <PreviousStep onBack={handleBack} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title title="How much did you pay in taxes last year?" />
        <CurrencyField
          register={register}
          name="taxes"
          errors={errors}
          className={classes.textField}
          data-testId="txtinp-taxes"
        />
        <FooterContainer handleNextText="See Results" />
      </Form>
    </>
  );
};
