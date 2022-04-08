import { Divider, Typography, TextFieldProps, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

const useStyles = makeStyles((theme: any) => ({
  label: {
    ...theme.typography.label,
  },
  input: {
    marginTop: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

interface FormatPhoneNumberProps extends NumberFormatProps {
  name: string;
  inputRef: any;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

const FormatPhoneNumber = (props: FormatPhoneNumberProps) => {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
      format="(###) ###-####"
      allowEmptyFormatting
      mask="_"
    />
  );
};

export type EditableTextFieldProps = TextFieldProps & {
  editable: boolean;
  labelText: string;
  isDirty?: boolean;
  isPhone?: boolean;
};

export const EditableTextField = ({
  editable,
  error,
  helperText,
  InputProps,
  labelText,
  isDirty,
  isPhone,
  ...rest
}: EditableTextFieldProps) => {
  const classes = useStyles();
  const variant = editable ? 'outlined' : 'standard';
  const inputProps = editable
    ? {
        ...InputProps,
      }
    : {
        ...InputProps,
        disableUnderline: true,
        readOnly: true,
      };
  if (isPhone) {
    // @ts-ignore
    inputProps.inputComponent = FormatPhoneNumber;
  }

  return (
    <>
      <Typography
        color={error ? 'error' : 'textPrimary'}
        className={classes.label}
        variant="body1"
        component="span"
      >
        {labelText} {!editable && isDirty ? '(edited)' : ''}
      </Typography>
      <TextField
        className={classes.input}
        fullWidth
        variant={variant}
        InputProps={inputProps}
        error={error}
        helperText={helperText}
        {...rest}
      />
      <Divider className={classes.divider} />
    </>
  );
};
