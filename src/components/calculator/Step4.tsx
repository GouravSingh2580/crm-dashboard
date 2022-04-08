import { useState, useEffect, FormEvent } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { FormControl, FormHelperText, Divider } from '@mui/material';
import { useCalData } from 'states';
import { BENEFITS_OPTIONS } from 'constants/calculator';
import { Title, Form, Card, FooterContainer } from './shared';
import { Header } from './header';
import { PreviousStep } from '../common';

const useStyles = makeStyles((theme) => ({
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(4, 0),
  },
}));

type TProps = {
  handleNext: () => void;
  handleBack: () => void;
};

export const Step4 = ({ handleBack, handleNext }: TProps) => {
  const { setValues, data } = useCalData();
  const [benefits, setBenifits] = useState(data.benefits || []);
  const [isError, setisError] = useState<string>('');
  const [others, setOthersDisabled] = useState(false);
  const [noBenfitsDisabled, setNoBenfitsDisabled] = useState(false);
  const classes = useStyles();

  const onSubmit = () => {
    if (benefits.length === 0) {
      setisError('Please select a benefit option');
      return;
    }
    setValues({ ...data, benefits });
    handleNext();
  };
  const onSelect = (e: FormEvent<HTMLInputElement>, key: string) => {
    setisError('');
    let updatedBenefits = [...benefits];
    if (
      updatedBenefits &&
      updatedBenefits.length &&
      updatedBenefits.indexOf(key) > -1
    ) {
      if (key === 'i_have_no_benefits') {
        setOthersDisabled(false);
        setNoBenfitsDisabled(true);
      }
      updatedBenefits = updatedBenefits.filter((val) => val !== key);
      if (updatedBenefits.length === 0) {
        setNoBenfitsDisabled(false);
      }
    } else if (key === 'i_have_no_benefits') {
        updatedBenefits.push(key);
        updatedBenefits = updatedBenefits.filter(
          (val) => val === 'i_have_no_benefits',
        );
        setOthersDisabled(true);
        setNoBenfitsDisabled(false);
      }else {
        updatedBenefits.push(key);
        setNoBenfitsDisabled(true);
      }

    setBenifits(updatedBenefits);
  };

  useEffect(() => {
    if (
      data?.benefits &&
      data.benefits.length &&
      data.benefits.indexOf('i_have_no_benefits')> -1
    ) {
      setOthersDisabled(true);
    }
  }, [data?.benefits]);

  const isChecked = (val:string) =>
    benefits && benefits.indexOf(val) > -1;

  return (
    <>
      <Header />
      <Form>
        <PreviousStep onBack={handleBack} />
        <Title title="What type of benefits do you have today?" />
        <FormControl
          style={{ width: '100%' }}
          component="fieldset"
          error={!!isError}
        >
          <div className={classes.listContainer}>
            {BENEFITS_OPTIONS.map((option) => (
              <Card
                {...option}
                key={option.value}
                isDisabled={
                  (others && option.value !== 'i_have_no_benefits') ||
                  (noBenfitsDisabled && option.value === 'i_have_no_benefits')
                }
                isChecked={isChecked(option.value)}
                onChange={(e) => onSelect(e, option.value)}
                dataTestId={option.value}
              />
            ))}
          </div>
          <FormHelperText>{isError}</FormHelperText>
        </FormControl>
        <Divider className={classes.divider} />
        <FooterContainer
          isButton
          onButtonClick={onSubmit}
        />
      </Form>
    </>
  );
};
