import { Button, Grid, TextField } from '@mui/material';
import { Controller, Control, FieldError, FieldErrors } from 'react-hook-form';
import { IFormField } from './FormationsForm';

interface ISuggestedNames {
  values: string[];
  onChange: (data: string[]) => void;
  error?: FieldError;
  maxLength?: number;
}

type TError = {
  values: string[];
  value: string;
  index: number;
  error?: FieldError;
};

const isError = ({ values, value, index, error }: TError) => {
  if (error == null) return false;
  switch (error.type) {
    case 'invalidCompanyName':
      return value.trim().startsWith('0');
    case 'suggested':
      return !value;
    case 'suggestedDuplicates':
      return values.some(
        (v: string, i: number) => v.trim() === value.trim() && index !== i,
      );
    default:
      return false;
  }
};

export const SuggestedNames = ({
  values,
  onChange,
  error,
  maxLength,
}: ISuggestedNames) => {
  const onTextChange = (id: number, v: string) => {
    const newData = values.map((item, index) =>
      index === id ? v : item,
    );
    onChange(newData);
  };

  const onAddField = () => {
    const newData = [...values, ''];
    onChange(newData);
  };

  const getFields = () =>
    values.map((value, index) => {
      const err = isError({
        values,
        value,
        index,
        error,
      });
      return (
        <Grid item xs={12} key={`Option${index + 1}`}>
          <TextField
            value={value}
            onChange={({ target: { value: v } }) =>
              onTextChange(index, v.charAt(0).toUpperCase() + v.slice(1))
            }
            variant="outlined"
            fullWidth
            label={`Company Name - Option ${index + 1}`}
            placeholder={`New LLC Name Choices ${index + 1}`}
            error={err}
            helperText={err && error ? error.message : ''}
            inputProps={{
              maxLength,
              style: { textTransform: 'capitalize' },
              autoCapitalize: 'on',
            }}
            name={`suggested${index + 1}`}
            data-testid={`field-suggested-${index + 1}`}
          />
        </Grid>
      );
    });

  return (
    <Grid container spacing={2}>
      {getFields()}
      {values.length <= 5 && (
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="text"
            onClick={onAddField}
            id="addAnotherCompanyName"
          >
            +Add another option
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

type TFormationsSuggestionField = {
  field: IFormField;
  errors: FieldErrors;
  control: Control;
};

export const FormationsSuggestionField = ({
  field,
  errors,
  control,
}: TFormationsSuggestionField) => (
  <Controller
    name={field.name}
    control={control}
    render={({ onChange, value }) => (
      <SuggestedNames
        values={value}
        error={errors[field.name]}
        onChange={(item) => {
          onChange(item);
        }}
        maxLength={field?.maxLength}
      />
    )}
  />
);
