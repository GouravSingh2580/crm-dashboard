import {
  FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import React from 'react';

interface OptionItem<T extends string | undefined> {
  key: T;
  value: string;
}

interface Props<T extends string> {
  label: string;
  value: T | undefined;
  onChange: (value: T | unknown) => void;
  options: Array<OptionItem<T | undefined>>
  'data-testid'?: string;
}

export const FormSelect = <T extends string>({
  label, value, options, onChange, ...props
}: Props<T>) => (
  <FormControl
    variant="outlined"
    margin="normal"
    fullWidth
  >
    <InputLabel id={props['data-testid']}>
      {label}
    </InputLabel>
    <Select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value as unknown)}
      label={label}
      data-testid={props['data-testid']}
      id={props['data-testid']}
    >
      {options.map((item) => (
        <MenuItem
          style={{ fontSize: 14 }}
          key={item.key}
          value={item.key}
        >
          {item.value}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  );

FormSelect.defaultProps = {
  'data-testid': '',
};
