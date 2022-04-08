import DatePicker from '@mui/lab/DatePicker';
import { FormControl, TextFieldProps } from '@mui/material';
import React, { ReactElement } from 'react';
import { Moment } from 'moment';

interface Props {
  label: string;
  value: Moment | undefined,
  onChange: (date: Moment | null) => void;
  renderInput: (props: TextFieldProps) => ReactElement;
}

export const FormDatePicker = ({
  label, value, onChange, renderInput,
}: Props) => (
  <FormControl
    variant="outlined"
    margin="normal"
    fullWidth
  >
    <DatePicker
      renderInput={renderInput}
      inputFormat="MM/DD/yyyy"
      label={label}
      value={value || null}
      onChange={onChange}
    />
  </FormControl>
);
