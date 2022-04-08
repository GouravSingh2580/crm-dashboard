import { TextField, BaseTextFieldProps } from '@mui/material';
import React, { ChangeEvent, useCallback } from 'react';
import { isNumberString } from './helpers';

interface Props extends BaseTextFieldProps {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  id?: string;
  'data-testid'?: string;
}

export const FormNumber = ({
  value, label, onChange, id, ...props
}: Props) => {
  const onValueChange = useCallback((
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (isNumberString(event.target.value)) {
      onChange(Number(event.target.value));
    } else {
      onChange(undefined);
    }
  }, []);
  return (
    <TextField
      id={id}
      label={label}
      margin="normal"
      type="number"
      variant="outlined"
      value={value}
      onChange={onValueChange}
      data-testid={props['data-testid']}
      {...props}
    />
  );
};

FormNumber.defaultProps = {
  value: '',
  id: '',
  'data-testid': '',
};
