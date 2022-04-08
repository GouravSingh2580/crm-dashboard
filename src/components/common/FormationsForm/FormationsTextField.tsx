import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { IFormField } from './FormationsForm';

type TFormationsTextField = {
  field: IFormField;
  errors: any;
  control: Control;
};

export const FormationsTextField = ({
  field,
  errors,
  control,
}: TFormationsTextField) => (
  <Controller
    name={field.name}
    control={control}
    defaultValue={field.defaultValue || ''}
    render={({ onChange, value }) => (
      <TextField
        name={field.name}
        onChange={onChange}
        value={value}
        variant="outlined"
        fullWidth
        disabled={field?.readOnly}
        label={field.label}
        placeholder={field.placeholder}
        error={!!errors[field?.name]}
        helperText={errors[field?.name]?.message}
        InputProps={{
          startAdornment: field?.startAdornment || null,
          inputProps: {
            inputMode: field?.inputMode,
            maxLength: field?.maxLength,
            style: {
              textTransform: field.autoCapitalize ? 'capitalize' : 'none',
            },
            autoCapitalize: field.autoCapitalize ? 'on' : 'off',
          },
        }}
        data-testid={`field-${field.name}`}
        autoFocus={field.autoFocus}
      />
    )}
  />
);
