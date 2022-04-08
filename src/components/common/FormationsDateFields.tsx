import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/lab';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
  },
}));

interface Props {
  setValue: (name: string, val: string, options?: object) => void;
  value: string;
  error: boolean | undefined;
  helperText: string;
  name: string;
  variant: 'filled' | 'standard' | 'outlined' | undefined;
  label?: string;
}

export const FormationsDateFields = ({
  setValue,
  value,
  error,
  helperText,
  name,
  variant,
  label = '',
}: Props) => {
  const classes = useStyles();

  const onChange = (newValue: string | null) => {
    if (newValue != null) {
      setValue(name, newValue);
    }
  };

  return (
    <div className={classes.container}>
      <DatePicker
        disableFuture
        inputFormat="MM/DD/YYYY"
        onChange={onChange}
        value={value}
        label={label}
        renderInput={(props) => (
          <TextField
            {...props}
            name={name}
            variant={variant}
            helperText={helperText}
            error={error === true}
            data-testid={`field-${name}`}
          />
        )}
      />
    </div>
  );
};
