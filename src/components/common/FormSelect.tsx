import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(5, 0, 5, 0),
    width: '100%',
  },
}));

interface Props {
  value: string;
  onChange: (value: SelectChangeEvent) => void;
  data: Array<{
    label: string;
    value: any;
  }>;
  label: string;
}

export const FormSelect = ({ value, onChange, data, label }: Props) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        labelId={label}
        id="selectId"
        value={value}
        onChange={onChange}
        label={`${label}-label`}
      >
        {data.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
