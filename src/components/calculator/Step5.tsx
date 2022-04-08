import { useState, useEffect, FormEvent } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { FormControl, FormHelperText, Divider } from '@mui/material';
import { useCalData } from 'states';
import { HEALTH_OPTIONS } from 'constants/calculator';
import { Title, FooterContainer, Card, Form } from './shared';
import { PreviousStep } from '../common';
import { Header } from './header';

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

export const Step5 = ({ handleBack, handleNext }: TProps) => {
  const classes = useStyles();
  const { setValues, data } = useCalData();
  const [isError, setisError] = useState('');
  const [healthCoverage, setHealthCoverage] = useState(
    data.healthCoverage || [],
  );
  const [isDisabled, setIsDisabled] = useState(false);

  const onSubmit = () => {
    if (healthCoverage.length === 0) {
      setisError('Please select a health coverage option');
      return;
    }
    setValues({ ...data, healthCoverage });
    handleNext();
  };
  const onSelect = (e: FormEvent<HTMLInputElement>, key: string) => {
    setisError('');
    let updatedHeatlhCoverage = [...healthCoverage];
    if (
      updatedHeatlhCoverage &&
      updatedHeatlhCoverage.length &&
      updatedHeatlhCoverage.indexOf(key) > -1
    ) {
      if (key === 'idont_have_health_insurance') {
        setIsDisabled(false);
      }
      updatedHeatlhCoverage = updatedHeatlhCoverage.filter(
        (val) => val !== key,
      );
    } else if (key === 'idont_have_health_insurance') {
      updatedHeatlhCoverage.push(key);
      updatedHeatlhCoverage = updatedHeatlhCoverage.filter(
        (val) => val === 'idont_have_health_insurance',
      );
      setIsDisabled(true);
    } else {
      updatedHeatlhCoverage.push(key);
    }
    setHealthCoverage(updatedHeatlhCoverage);
  };

  useEffect(() => {
    if (
      data?.healthCoverage &&
      data.healthCoverage.length &&
      data.healthCoverage.indexOf('idont_have_health_insurance') > -1
    ) {
      setIsDisabled(true);
    }
  }, [data?.healthCoverage]);

  const isChecked = (val: string) =>
    healthCoverage && healthCoverage.indexOf(val) > -1;

  return (
    <>
      <Header />
      <Form>
        <PreviousStep onBack={handleBack} />
        <Title title="What type of health coverage do you have?" />
        <FormControl
          style={{ width: '100%' }}
          component="fieldset"
          error={!!isError}
        >
          <div className={classes.listContainer}>
            {HEALTH_OPTIONS.map((option) => (
              <Card
                {...option}
                key={option.value}
                isDisabled={
                  isDisabled && option.value !== 'idont_have_health_insurance'
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
        <FooterContainer isButton onButtonClick={onSubmit} />
      </Form>
    </>
  );
};
