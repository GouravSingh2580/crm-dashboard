import { Control, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { IFormField } from './FormationsForm';

type TFormationsAutoComplete = {
  field: IFormField;
  errors: any;
  control: Control;
  getValues: (name: string) => any;
  onFormChange: (fieldName: string) => void;
};

export const FormationsAutoComplete = ({
  field,
  errors,
  control,
  getValues,
  onFormChange,
}: TFormationsAutoComplete) => (
  <Controller
    control={control}
    name={field.name}
    defaultValue={getValues && getValues(field.name)}
    render={({ onChange, value }) => (
      <Autocomplete
        autoComplete
        autoHighlight
        clearOnBlur
        clearOnEscape
        handleHomeEndKeys
        openOnFocus
        onChange={(event, item) => {
          onChange(item);
          onFormChange?.(field.name);
        }}
        value={value}
        options={field.options || []}
        getOptionLabel={(item) => item.name || item.title || ''}
        renderInput={(params) => (
          <TextField
            {...params}
            name={field.name}
            label={field.label}
            variant="outlined"
            placeholder={field.placeholder}
            error={!!errors[field?.name]}
            helperText={errors[field?.name]?.message}
            data-testid={`field-${field.name}`}
          />
        )}
      />
    )}
  />
);
