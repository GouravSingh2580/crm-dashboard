import React, { useEffect, useState } from 'react';
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

const useStyles = makeStyles((theme) => ({
  options: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
  },
}));

interface TParams {
  onContinue: (value: boolean) => void,
  selected: boolean | undefined,
}

export const HaveAccount = ({ onContinue, selected }: TParams) => {
  const classes = useStyles();
  const [value, setValue] = useState(selected);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (selected !== undefined) {
      setValue(selected);
    }
  }, [selected]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setValue(event.target.value === 'true');
  };

  const handleNext = () => {
    if (value === undefined) {
      setError(true);
    } else {
      onContinue(value);
    }
  };

  return (
    <>
      <Typography variant="h5B" component="h5">
        Do you have a business bank account?
      </Typography>

      <FormControl
        className={classes.options}
        component="fieldset"
        error={error}
      >
        <RadioGroup
          aria-label="option"
          name="options"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel value control={<Radio />} label="Yes" />
          <FormControlLabel value={false} control={<Radio />} label="No" />
        </RadioGroup>
        {error && <FormHelperText>Please select an option.</FormHelperText>}
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '36px' }}>
        <LoadingButton
          type="button"
          variant="outlined"
          size="large"
          data-testid="continue"
          onClick={handleNext}
          loadingPosition="end"
          endIcon={<SaveIcon />}
        >
          Save and Continue
        </LoadingButton>
      </Box>
    </>
  );
};
