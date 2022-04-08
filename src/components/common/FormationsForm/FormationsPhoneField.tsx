import InputMask from 'react-input-mask';
import { TextField } from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import { IFormField } from './FormationsForm';

type TFormationsPhoneField = {
  field: IFormField;
  errors: any;
  control: Control;
};

export const FormationsPhoneField = ({
  field,
  errors,
  control,
}: TFormationsPhoneField) => (
  <Controller
    name={field.name}
    control={control}
    defaultValue={field.defaultValue || ''}
    render={({ value, onChange }) => (
      <InputMask mask="(999) 999-9999" value={value} onChange={onChange}>
        {() => (
          <TextField
            variant="outlined"
            name={field.name}
            fullWidth
            label={field.label}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
            data-testid={`field-${field.name}`}
          />
        )}
      </InputMask>
    )}
  />
);
