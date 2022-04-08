import React, { useState, ChangeEvent } from 'react';
import {
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  FormHelperText,
  Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { makeStyles } from '@mui/styles';

import { ALLOWED_BANKS_OPTIONS } from 'enums';

const useStyles = makeStyles({
  options: {
    marginTop: '16px',
    marginBottom: '36px',
  },
});

interface TParams {
  onContinue: (value: string) => void;
  goPrev: React.ReactNode;
  isSubmitting: boolean;
  selected: string;
  initialBankName: string;
}

export const HaveAccountWith = ({
  onContinue,
  goPrev,
  isSubmitting,
  selected,
  initialBankName,
}: TParams) => {
  const classes = useStyles();
  const [value, setValue] = useState(selected);
  const [error, setError] = useState(false);
  const [hideSaveContinue, setHideSaveContinue] = useState(
    initialBankName === selected && initialBankName !== '' && initialBankName !== 'other',
  );
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value: newValue } = event.target;
    setValue(newValue);
    setHideSaveContinue(
      newValue === initialBankName && selected !== '',
    );
  };

  const handleNext = () => {
    if (!value) {
      setError(true);
    } else {
      onContinue(value);
    }
  };

  return (
    <>
      <Typography variant="h5B" component="h5">
        Which bank do you have a business account with?
      </Typography>
      <FormControl
        className={classes.options}
        component="fieldset"
        error={error}
      >
        <RadioGroup
          aria-label="banks"
          name="banks"
          value={value}
          onChange={handleChange}
        >
          {ALLOWED_BANKS_OPTIONS.map((option) => (
            <FormControlLabel
              value={option.value}
              control={<Radio checked={value === option.value} />}
              label={option.label}
              key={option.value}
            />
          ))}
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        {error && <FormHelperText>Please select an option.</FormHelperText>}
      </FormControl>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '32px',
        }}
      >
        {goPrev}
        <LoadingButton
          type="button"
          variant="outlined"
          size="large"
          data-testid="continue"
          onClick={handleNext}
          loadingPosition="end"
          loading={isSubmitting}
          endIcon={<SaveIcon />}
          disabled={hideSaveContinue}
        >
          Save and Continue
        </LoadingButton>
      </Box>
    </>
  );
};
