import { FocusEventHandler, useEffect, useRef } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { retirementContributionIsOther } from 'enums/taxSurveyOptions';

const useStyles = makeStyles((theme: any) => ({
  field: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  title: {
    color: theme.palette.primary.main,
  },
  subtitle: {
    color: theme.palette.text.secondary,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  optionLabel: {},
}));

type CheckboxValue = {
  selections: string[];
  other: string
};

export type FieldData = {
  title: string;
  subtitle?: string;
  name: string;
  defaultValue?: string | boolean | CheckboxValue;
  type: 'TEXT' | 'RADIO' | 'CHECKBOX' | 'GROUP';
  options?: {
    label: string;
    value: any;
    type: 'LABEL' | 'TEXT';
  }[];
  hideIf?: Function[];
  children?: FieldData[];
}

type FormFieldProps = {
  error: Record<string, any> | undefined;
  field: FieldData;
  onChange: Function;
  onBlur: FocusEventHandler;
  setValue: Function;
  value: string | boolean | CheckboxValue | null;
  shouldHide: boolean;
  disabled: boolean;
  inputRef: any;
}

export const FormField = ({
  error,
  field,
  onChange,
  onBlur,
  value,
  setValue,
  shouldHide,
  disabled,
  inputRef,
}: FormFieldProps) => {
  const classes = useStyles();

  const prevShouldHideRef = useRef(false);

  const clearValue = () => {
    setValue(field.name, undefined);
  };

  const restoreDefaultValue = () => {
    setValue(field.name, field.defaultValue);
  };

  useEffect(() => {
    if (prevShouldHideRef.current !== shouldHide) {
      if (shouldHide) {
        clearValue();
      } else {
        restoreDefaultValue();
      }
    }
  });

  useEffect(() => {
    prevShouldHideRef.current = shouldHide;
  });

  const handleChange = (e: any) => {
    if (e.target.value === 'true') {
      return onChange(true);
    }
    if (e?.target.value === 'false') {
      return onChange(false);
    }
    if (e?.target.value !== 'OTHER') {
      return onChange(e);
    }
    return undefined;
  };

  const handleCheckboxChange = (val: string) => {
    const checkboxValue = value as CheckboxValue;
    let newSelections = [];
    let newOther = checkboxValue ? checkboxValue.other : '';
    const selectedOptions = checkboxValue?.selections;
    if (Array.isArray(selectedOptions)) {
      const idx = selectedOptions.indexOf(val);
      if (idx === -1) {
        newSelections = [...selectedOptions, val];
      } else {
        newSelections = [...selectedOptions];
        newSelections.splice(idx, 1);
        if (val === 'OTHER') {
          newOther = '';
        }
      }
    } else {
      newSelections = [val];
    }
    onChange({
      selections: newSelections,
      other: newOther,
    });
  };

  const handleCheckboxOptionTextChange = (e: any) => {
    const checkboxValue = value as CheckboxValue;

    let newSelections: any = [];
    const newOther = e.target.value;

    const selectedOptions = checkboxValue?.selections;
    if (Array.isArray(selectedOptions)) {
      const idx = selectedOptions.indexOf('OTHER');
      if (idx === -1) {
        newSelections = [...selectedOptions, 'OTHER'];
      } else {
        newSelections = [...selectedOptions];
        if (newOther === '') {
          newSelections.splice(idx, 1);
        }
      }
    } else {
      newSelections = ['OTHER'];
    }
    onChange({
      selections: newSelections,
      other: newOther,
    });
  };

  const handleRadioOptionTextChange = (e: any) => {
    const val = e.target.value;
    onChange(val);
  };

  const isChecked = (val: string) => {
    const checkboxValue = value as CheckboxValue;

    if (!checkboxValue || !Array.isArray(checkboxValue.selections)) {
      return false;
    }
    if (checkboxValue.selections.includes(val)) {
      return true;
    }
    return checkboxValue.other === val;
  };

  const switchFormField = () => {
    if (field.type === 'TEXT') {
      return (
        <TextField
          value={value || ''}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          placeholder="Enter your answer"
          fullWidth
          onBlur={onBlur}
          disabled={disabled}
          size="small"
          required
          error={!!error}
          helperText={error ? error.message : ''}
          inputRef={inputRef}
        />
      );
    }

    if (field.type === 'CHECKBOX') {
      const checkboxValue = value as CheckboxValue;
      return (
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormGroup onBlur={onBlur}>
            {field?.options && field.options.map((option: any) => (
              <FormControlLabel
                disableTypography
                key={option.label}
                inputRef={inputRef}
                control={(
                  <Checkbox
                    checked={isChecked(option.value)}
                    disabled={disabled}
                    onChange={() => handleCheckboxChange(option.value)}
                    name={option.label}
                  />
                )}
                label={
                  option.type === 'LABEL' ? (
                    option.label
                  ) : (
                    <TextField
                      value={checkboxValue?.other || ''}
                      onChange={handleCheckboxOptionTextChange}
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter your answer"
                      fullWidth
                      disabled={disabled}
                      size="small"
                      required
                      onBlur={onBlur}
                    />
                  )
                }
              />
            ))}
          </FormGroup>
          <FormHelperText error={!!error}>
            {error?.selections?.message || error?.other?.message}
          </FormHelperText>
        </FormControl>
      );
    }

    if (field.type === 'RADIO') {
      return (
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <RadioGroup name={field.name} onBlur={onBlur} value={`${value}`}>
            {field?.options && field.options.map((option: any) => {
              // TODO: Make this more generic, right now tightly-coupled
              // to retirement contribution
              const labelValue = option.value === 'OTHER'
                && retirementContributionIsOther(value as string)
                && value ? value : option.value;

              const textFieldValue = retirementContributionIsOther(value as string) ? value : '';

              return (
                <FormControlLabel
                  key={option.label}
                  className={classes.optionLabel}
                  inputRef={inputRef}
                  disableTypography
                  value={labelValue}
                  control={
                    <Radio onChange={(e) => handleChange(e)} size="small" />
                  }
                  label={
                    option.type === 'LABEL' ? (
                      option.label
                    ) : (
                      <TextField
                        value={textFieldValue || ''}
                        onChange={handleRadioOptionTextChange}
                        variant="outlined"
                        margin="normal"
                        placeholder="Enter your answer"
                        fullWidth
                        disabled={disabled}
                        size="small"
                        required
                        onBlur={onBlur}
                      />
                    )
                  }
                  disabled={disabled}
                />
              );
            })}
          </RadioGroup>
          <FormHelperText error={!!error}>{error?.message}</FormHelperText>
        </FormControl>
      );
    }
    return <></>;
  };

  return (
    <div className={classes.field} style={{ display: shouldHide ? 'none' : 'block' }}>
      <Typography variant="subtitle1" className={classes.title}>
        {field.title}
      </Typography>
      {field.subtitle ? (
        <div className={classes.subtitle}>{field.subtitle}</div>
      ) : (
        <></>
      )}
      {switchFormField()}
    </div>
  );
};
