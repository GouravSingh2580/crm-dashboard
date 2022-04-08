import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { IFormField } from './FormationsForm';

function formatZipCode(value: string, callback: (value: string) => void) {
  const isAllowedPattern = /(\d*)-?(\d*)/.test(value);
  if (isAllowedPattern) {
    let zipCodeValue;
    const chunks = [];
    const newValue = value.replace('-', '');
    if (newValue.length > 5) {
      chunks.push(newValue.substr(0, 5), newValue.substr(5, 7));
      zipCodeValue = chunks.join('-');
    } else {
      zipCodeValue = newValue;
    }
    callback(zipCodeValue);
  }
}

type TFormationsZipCodeField = {
  field: IFormField;
  errors: any;
  control: Control;
};

export const FormationsZipCodeField = ({
  field,
  errors,
  control,
}: TFormationsZipCodeField) => (
  <Controller
    name={field.name}
    control={control}
    render={({ onChange, value }) => (
      <TextField
        value={value}
        onChange={(e) => {
          formatZipCode(e.target.value, onChange);
        }}
        name={field.name}
        variant="outlined"
        fullWidth
        placeholder={field.placeholder}
        label={field.label}
        error={!!errors[field?.name]}
        helperText={errors[field?.name]?.message}
        inputProps={{
          maxLength: field?.maxLength || 10,
        }}
        data-testid={`field-${field.name}`}
      />
    )}
  />
);
