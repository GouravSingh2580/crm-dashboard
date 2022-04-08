import { TextField } from '@mui/material';
import React from 'react';

interface Props {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  'data-testid'?: string;
}

export const FormText = ({
  value, label, onChange, id, ...props
}: Props) => (
  <TextField
    id={id}
    label={label}
    margin="normal"
    type="number"
    variant="outlined"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    data-testid={props['data-testid']}
  />
);

FormText.defaultProps = {
  value: '',
  id: '',
  'data-testid': '',
};
