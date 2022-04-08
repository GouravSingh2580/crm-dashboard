import { Control, Controller } from 'react-hook-form';
import DatePicker from '@mui/lab/DatePicker';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IFormField } from './FormationsForm';

const useStyles = makeStyles(() => ({
  input: {
    '&::placeholder': { textTransform: 'uppercase' },
    '&::-moz-placeholder': { textTransform: 'uppercase' },
  },
}));

type TFormationsDateField = {
  field: IFormField;
  errors: any;
  control: Control;
};

export const FormationsDateField = ({
  field,
  errors,
  control,
}: TFormationsDateField) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={field.name}
      defaultValue={field.defaultValue || ''}
      render={({ onChange, value}) => (
        <DatePicker
          disableFuture={!!field?.disableFuture}
          inputFormat="MM/DD/YYYY"
          onChange={onChange}
          value={value}
          renderInput={(props) => (
            <TextField
              {...props}
              name={field.name}
              placeholder={field.placeholder}
              label={field.label}
              variant="outlined"
              fullWidth
              error={!!errors[field?.name]}
              helperText={errors[field?.name]?.message}
              InputProps={{
                classes: { input: classes.input },
              }}
              data-testid={`field-${field.name}`}
            />
          )}
        />
      )}
    />
  );
};
