import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { IFormField } from './FormationsForm';

const responsivePlaceHolder = (
  isSmallDevice: boolean,
  placeholder: string | undefined,
) =>
  isSmallDevice ? (
    <option aria-label="None" value="" disabled />
  ) : (
    <MenuItem value="" disabled>
      {placeholder}
    </MenuItem>
  );

const reponsiveMenuItem = (isSmallDevice: boolean, value: any, key: string) =>
  isSmallDevice ? (
    <option key={key} value={key}>
      {value}
    </option>
  ) : (
    <MenuItem key={key} value={key}>
      {value}
    </MenuItem>
  );

type TFormationsSelect = {
  field: IFormField;
  errors: any;
  control: Control;
};

export const FormationsSelect = ({
  field,
  errors,
  control,
}: TFormationsSelect) => {
  const isSmallDevice = useMediaQuery((theme: any) =>
    theme.breakpoints.down('sm'),
  );

  const labelId = `${field.name}-label`;

  return (
    <FormControl
      variant="outlined"
      fullWidth
      data-testid={`field-${field.name}`}
      error={!!errors[field?.name]}
    >
      <InputLabel id={labelId}>{field.label}</InputLabel>
      <Controller
        as={
          <Select labelId={labelId} label={field.label} native={isSmallDevice}>
            {responsivePlaceHolder(isSmallDevice, field.placeholder)}
            {Array.from(field.options || [], ([key, value]) =>
              reponsiveMenuItem(isSmallDevice, value, key),
            )}
          </Select>
        }
        name={field.name}
        control={control}
        defaultValue=""
      />
      <FormHelperText>{errors[field?.name]?.message || ''}</FormHelperText>
    </FormControl>
  );
};
