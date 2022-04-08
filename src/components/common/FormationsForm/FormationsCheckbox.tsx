import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { IFormField } from './FormationsForm';

type TFormationsCheckbox = {
  field: IFormField;
  errors: any;
  control: Control;
};

export const FormationsCheckbox = ({
  field,
  errors,
  control,
}: TFormationsCheckbox) => (
  <FormControl data-testid={`field-${field.name}`}>
    <Controller
      name={field.name}
      control={control}
      render={({ onChange, value }) => (
        <FormControlLabel
          labelPlacement="end"
          control={
            <Checkbox
              size="medium"
              checked={value}
              name={field.name}
              onChange={({ target: { checked } }) => {
                onChange(checked);
                if (field.onChangeCallback) {
                  field.onChangeCallback(checked);
                }
              }}
            />
          }
          label={field.label}
        />
      )}
    />
    <FormHelperText>{errors[field?.name]?.message || ''}</FormHelperText>
  </FormControl>
);
