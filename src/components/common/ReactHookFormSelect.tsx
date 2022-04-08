import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { Control, Controller } from 'react-hook-form';
import makeStyles from '@mui/styles/makeStyles';
import { ReactChild, ReactFragment } from 'react';
import { FormControlProps } from '@mui/material/FormControl/FormControl';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(5, 0, 5, 0),
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
}));

type Props = FormControlProps & {
  name: string;
  label: string;
  control: Control;
  defaultValue: any;
  children?: ReactChild | ReactFragment;
  helperText: string;
  native?: boolean;
  noStyles?: boolean;
  error: boolean;
}

export const ReactHookFormSelect = ({
  name,
  label,
  control,
  defaultValue,
  children,
  helperText,
  native = false,
  noStyles = false,
  ...props
}: Props) => {
  const labelId = `${name}-label`;
  const classes = useStyles();

  return (
    <FormControl
      variant="outlined"
      className={noStyles ? classes.fullWidth : classes.formControl}
      {...props}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        as={
          <Select labelId={labelId} label={label} native={native}>
            {children}
          </Select>
        }
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
      <FormHelperText>{helperText || ''}</FormHelperText>
    </FormControl>
  );
};
