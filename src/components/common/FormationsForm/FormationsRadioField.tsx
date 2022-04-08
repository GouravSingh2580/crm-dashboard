import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { IFormField } from './FormationsForm';

type TFormationsRadioField = {
  field: IFormField;
  errors: FieldErrors;
  control: Control;
};

const getRadioOptions = (field: IFormField, errors: any, control: Control) =>
  field.options
    ? field.options.map((option: { label: string; value: string }) =>
        option.value === 'other' ? (
          <FormControlLabel
            value={option.value}
            control={<Radio />}
            key={option.value}
            label={
              <Controller
                name="otherOption"
                control={control}
                render={({ onChange, value }) => (
                  <TextField
                    value={value}
                    label={option.label}
                    onChange={onChange}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      maxLength: field?.maxLength,
                    }}
                    error={!!errors?.otherOption}
                    helperText={errors?.otherOption?.message}
                    data-testid="field-value-other"
                  />
                )}
              />
            }
          />
        ) : (
          <FormControlLabel
            value={option.value}
            label={option.label}
            control={<Radio />}
            key={option.value}
            data-testid={`field-value-${option.value}`}
          />
        ),
      )
    : null;

export const FormationsRadioField = ({
  field,
  errors,
  control,
}: TFormationsRadioField) => (
  <Controller
    name={field.name}
    control={control}
    render={({ onChange, value }) => (
      <FormControl
        component="fieldset"
        error={!!errors[field?.name]}
        data-testid={`field-${field.name}`}
      >
        <FormLabel component="legend">{field.label}</FormLabel>
        <RadioGroup value={value} onChange={onChange}>
          {getRadioOptions(field, errors, control)}
        </RadioGroup>
        <FormHelperText>{errors[field?.name]?.message}</FormHelperText>
      </FormControl>
    )}
  />
);
