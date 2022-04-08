import PropTypes from 'prop-types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCalData } from 'states';
import { LegalEntity } from './LegalEntity';
import { FooterContainer } from './shared/FooterContainer';
import { Form } from './shared/Form';
import { Header } from './header'

const validationSchema = yup.object().shape({
  legalEntity: yup.string().required('Please select a business legal entity'),
});

type TProps = {
  handleNext: () => void
}

export const Step1 = ({ handleNext }: TProps) => {
  const { setValues, data } = useCalData();
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      legalEntity: data.legalEntity || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (formData: {legalEntity: string}) => {
    setValues(formData);
    handleNext();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Header />
        <LegalEntity control={control} errors={errors} />
        <FooterContainer />
      </Form>
    </>
  );
};

Step1.propTypes = {
  handleNext: PropTypes.func.isRequired,
};
