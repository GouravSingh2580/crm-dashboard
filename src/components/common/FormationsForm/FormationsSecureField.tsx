import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { Control, Controller } from 'react-hook-form';
import { IFormField } from './FormationsForm';

const useStyles = makeStyles(() => ({
  securedTextField: {
    '& input': {
      fontFamily: 'password',
    },
  },
}));

type TFormationsSecuredField = {
  field: IFormField;
  errors: any;
  control: Control;
};

export const FormationsSecuredField = ({
  field,
  errors,
  control,
}: TFormationsSecuredField) => {
  const classes = useStyles();
  const [visibility, setVisibility] = useState(false);
  const helperText = errors[field?.name]?.message || field.helperText;

  const renderVisibilityControls = () => (
    <InputAdornment position="end">
      <IconButton
        aria-label={`toggle ${field.name} visibility`}
        onClick={() => setVisibility(!visibility)}
        onMouseDown={() => setVisibility(!visibility)}
        edge="end"
        component="span"
        data-testid="reveal-btn"
      >
        {visibility ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.defaultValue || ""}
      render={({ onChange, value }) => (
        <TextField
          onChange={onChange}
          value={value}
          label={field.label}
          name={field.name}
          placeholder={field.placeholder}
          variant="outlined"
          fullWidth
          className={`${!visibility && classes.securedTextField}`}
          inputProps={{
            maxLength: field?.maxLength,
            readOnly: field.readOnly,
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          InputProps={{
            endAdornment: renderVisibilityControls(),
          }}
          error={!!errors[field?.name]}
          helperText={helperText}
          data-testid={`field-${field.name}`}
        />
      )}
    />
  );
};
