import {
  InputBaseComponentProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import currency from 'currency.js';
import { UseFormMethods } from 'react-hook-form';
import { ChangeEvent, ElementType } from 'react';

export type CurrencyTextFieldProps = UseFormMethods & TextFieldProps;

export const normalizeValue = (value: string): number => currency(value).value;

export const NumberFormatCustom = (props: NumberFormatProps) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        if (onChange) {
          onChange({
            target: {
              // eslint-disable-next-line react/destructuring-assignment
              name: props.name,
              value: values.value,
            },
          } as ChangeEvent<HTMLInputElement>);
        }
      }}
      thousandSeparator
    />
  );
};

export const CurrencyField = (props: CurrencyTextFieldProps) => {
  const { name = '', errors, register, ...rest } = props;
  return (
    <TextField
      name={name}
      variant="outlined"
      margin="normal"
      fullWidth
      required
      error={!!errors[name]}
      helperText={errors[name] ? errors[name].message : ''}
      {...rest}
      InputProps={{
        inputComponent:
          NumberFormatCustom as ElementType<InputBaseComponentProps>,
        inputMode: 'numeric',
        inputProps: {
          inputRef: register,
        },
      }}
    />
  );
};
