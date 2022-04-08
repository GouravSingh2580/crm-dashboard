import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { makeStyles } from '@mui/styles';
import { IFormField } from './FormationsForm';

const useStyles = makeStyles(() => ({
  textarea: {
    fontSize: '14px',
  },
}));

type TFormationsTextArea = {
  field: IFormField;
  errors: any;
  control: Control;
  watch: (name: string) => any;
};

const getTextAreaWordCount = (
  field: IFormField,
  errors: any,
  watch: Function,
) =>
  errors[field?.name]?.message ||
  `${watch(field.name)?.length ?? 0} /${field.characterLimit}`;

export const FormationsTextArea = ({
  field,
  errors,
  control,
  watch,
}: TFormationsTextArea) => {
  const classes = useStyles();
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ onChange, value }) => (
        <TextField
          name={field.name}
          onChange={onChange}
          value={value}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
          label={field.label}
          placeholder={field.placeholder}
          multiline
          minRows={4}
          error={!!errors[field?.name]}
          helperText={getTextAreaWordCount(field, errors, watch)}
          InputProps={{
            classes: { input: classes.textarea },
          }}
          data-testid={`field-${field.name}`}
        />
      )}
    />
  );
};
