import React, { useState, ChangeEvent } from 'react';
import {
  Typography, TextField, Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';

interface TParams {
  onContinue: (value: string)=> void,
  goPrev: React.ReactNode,
  isSubmitting: boolean,
  selected: string,
  initialBankName: string
}

export const ProvideBankName = ({
  onContinue, goPrev, isSubmitting, selected, initialBankName
}: TParams) => {
  const [value, setValue] = useState(selected);
  const [hideSaveContinue, setHideSaveContinue] = useState(
    initialBankName === selected && initialBankName !== '' && initialBankName !== 'other',
  );
  const [error, setError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value: newValue } = event.target;
    setValue(newValue);
    setHideSaveContinue(
      newValue === initialBankName,
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
        Please enter your business bank name.
      </Typography>
      <Typography variant="body1">
        Our support team will contact you shortly.
      </Typography>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        value={value}
        label="Your business bank name"
        onChange={handleChange}
        name="bankName"
        inputProps={{
          style: { textTransform: 'capitalize' },
          autoCapitalize: 'on',
          maxLength: 80
        }}
        error={error}
        helperText={error ? 'Please enter a bank name' : ''}
        sx={{ maxWidth: '442px' }}
      />
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', marginTop: '32px', marginBottom: '36px',
      }}
      >
        {goPrev}
        <LoadingButton
          type="button"
          variant="outlined"
          size="large"
          onClick={handleNext}
          data-testid="continue"
          loading={isSubmitting}
          loadingPosition="end"
          endIcon={<SaveIcon />}
          disabled={hideSaveContinue}
        >
          Save and Continue
        </LoadingButton>
      </Box>
    </>
  );
};
