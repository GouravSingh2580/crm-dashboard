import React, { useState } from 'react';
import {
  Button,
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
import HelpIcon from '@mui/icons-material/Help';
import { YesNoModal } from '../../common/modals';

const useStyles = makeStyles((theme) => ({
  textSecondary: {
    color: theme.palette.text.secondary,
  },
  options: {
    marginTop: '16px',
    marginBottom: '36px',
  },
  buttonInfo: {
    padding: 0,
    margin: '0 0 36px 0',
  },
}));

interface TParams {
  onContinue: (value: boolean)=> void,
  goPrev: React.ReactNode,
  selected: boolean | null
}

export const WillingToSwitch = ({ onContinue, goPrev, selected }: TParams) => {
  const classes = useStyles();
  const [value, setValue] = useState(selected);
  const [error, setError] = useState(false);

  const [isModelOpen, setIsModelOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setValue(event.target.value === 'true');
  };

  const handleNext = () => {
    if (value === null || value === undefined) {
      setError(true);
    } else {
      onContinue(value);
    }
  };

  return (
    <>
      <YesNoModal
        open={isModelOpen}
        heading="Who are Formations’ partner banks?"
        onClose={() => setIsModelOpen(false)}
      >
        <>
          <Typography variant="body1">
            <ul>
              <li>Chase</li>
              <li>Bank of America</li>
              <li>Relay</li>
              <li>Wells Fargo </li>
            </ul>
          </Typography>
        </>
      </YesNoModal>
      <Typography variant="h5B" component="h5">
        Would you be willing to switch to one of our partner banks?
      </Typography>
      <Typography variant="body1" sx={{ marginTop: '8px' }} className={classes.textSecondary}>
        Our partnered banks integrate seamlessly with our software, eliminating
        hours of manual work you’ll otherwise have to do throughout the year.
      </Typography>
      <FormControl
        className={classes.options}
        component="fieldset"
        error={error}
      >
        <Button
          startIcon={<HelpIcon />}
          onClick={() => setIsModelOpen(true)}
          className={classes.buttonInfo}
        >
          Who are
          Formations’ partner banks?
        </Button>
        <RadioGroup
          aria-label="partnerBanks"
          name="partnerBanks"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel value control={<Radio />} label="Yes" />
          <FormControlLabel value={false} control={<Radio />} label="No" />
        </RadioGroup>
        {error && <FormHelperText>Please select an option.</FormHelperText>}
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        {goPrev}
        <LoadingButton
          type="button"
          variant="outlined"
          onClick={handleNext}
          size="large"
          data-testid="continue"
          loadingPosition="end"
          endIcon={<SaveIcon />}
        >
          Save and Continue
        </LoadingButton>
      </Box>
    </>
  );
};
