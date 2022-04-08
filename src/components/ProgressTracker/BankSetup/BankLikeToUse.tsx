import React, { useState, ChangeEvent } from 'react';
import {
  Button,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  Link,
  FormHelperText,
  Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { makeStyles } from '@mui/styles';
import HelpIcon from '@mui/icons-material/Help';
import { ALLOWED_BANKS_OPTIONS } from 'enums';
import { YesNoModal } from '../../common/modals';

const useStyles = makeStyles({
  options: {
    marginTop: '16px',
    marginBottom: '36px',
  },
  buttonInfo: {
    padding: 0,
    margin: '0 0 36px -20px',
  },
});

const RELAY_PRICING_LINK =
  'https://support.relayfi.com/hc/en-us/articles/360054705132-Relay-Pricing-';

interface TParams {
  onContinue: (value: string) => void;
  goPrev: React.ReactNode;
  isSubmitting: boolean;
  selected: string;
}

export const BankLikeToUse = ({
  onContinue,
  goPrev,
  isSubmitting,
  selected,
}: TParams) => {
  const classes = useStyles();
  const [value, setValue] = useState(selected);
  const [error, setError] = useState(false);

  const [hideSaveContinue, setHideSaveContinue] = useState(selected !== '');

  const [isModelOpen, setIsModelOpen] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value: newValue } = event.target;
    setValue(newValue);
    setHideSaveContinue(newValue === selected);
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
      <YesNoModal
        open={isModelOpen}
        heading="Choosing your bank"
        onClose={() => setIsModelOpen(false)}
      >
        <>
          <Typography variant="body1">All our partner banks:</Typography>
          <Typography variant="body1">
            <ul>
              <li>
                Allow us to set up the business bank account on your behalf.
              </li>
              <li>
                Integrate seamlessly with our accounting and payroll software,
                eliminating manual work you’d otherwise have to do throughout
                the year.
              </li>
            </ul>
          </Typography>
          <Typography variant="body1">
            Customers who do their personal banking with one of our partners
            often choose to keep their business accounts with that same provider
            for convenience.
          </Typography>
          <Typography variant="body1">
            Relay is a technology-first bank that has no monthly transaction
            fees* and no physical branches.
          </Typography>
          <Typography variant="body1">
            *Relay{' '}
            <Link href={RELAY_PRICING_LINK} target="_blank">
              does charge
            </Link>{' '}
            for premium features like bill pay and for outgoing wires.
          </Typography>
        </>
      </YesNoModal>
      <Typography variant="h5B" component="h5">
        Which bank would you like to use?
      </Typography>
      <FormControl
        className={classes.options}
        component="fieldset"
        error={error}
      >
        <Button
          onClick={() => setIsModelOpen(true)}
          startIcon={<HelpIcon />}
          className={classes.buttonInfo}
        >
          How do I decide?
        </Button>

        <RadioGroup
          aria-label="banks"
          name="banks"
          value={value}
          onChange={handleChange}
        >
          {ALLOWED_BANKS_OPTIONS.map((option) => (
            <FormControlLabel
              value={option.value}
              control={<Radio checked={option.value === value} />}
              label={option.label}
              key={option.value}
            />
          ))}
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
          onClick={handleNext}
          data-testid="continue"
          loading={isSubmitting}
          loadingPosition="end"
          endIcon={<SaveIcon />}
          disabled={hideSaveContinue}
          sx={{
            marginLeft: 'auto'
          }}
        >
          Save and Continue
        </LoadingButton>
      </Box>
    </>
  );
};
