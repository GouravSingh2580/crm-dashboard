import { ChangeEvent, useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import {
  TextField,
  FormHelperText,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import * as yup from 'yup';
import InputMask from 'react-input-mask';

import { STATES, BUSINESS_INDUSTRIES, BANK_ACCOUNT_TYPES } from 'enums';
import { YesNoModal, ConfirmModal } from 'components/common/modals';
import { ChipInput } from 'components/common';
import {
  directDepositSchema,
  userSchema,
  existingCompanySchema,
} from 'schemas';
import { FormationsDateFields } from 'components/common/FormationsDateFields';
import { BUSINESS_DESCRIPTION_LIMIT } from 'schemas/companyDetailsSchema';
import { capitalizeFirstLetter } from 'helpers/text-transformer';
import { ENTITY_OPTIONS } from 'constants/common';
import { GustoCompanyField } from './fields/GustoCompanyField';

const filter = createFilterOptions();

function validateMailing(value: any, testContext: any) {
  const physicalSameAsMailing =
    testContext?.options?.parent?.physicalSameAsMailing;
  return !physicalSameAsMailing ? value?.length : true;
}

function validateWorkPhone(val: string | undefined) {
  if (!val) return true;

  const pureValue = val.replace(/_|-|\(|\)|\s/g, '');

  if (!pureValue) return false;

  return pureValue?.length === 10;
}

function validateZip(val: string | undefined): boolean {
  if (!val) return true;

  const isValid = /^\d{5}(?:-?\d{4})?$/.test(val);

  return !!isValid;
}

const useStyles = makeStyles((theme) => ({
  mainColor: {
    color: theme.palette.primary.main,
  },
  divider: {
    margin: theme.spacing(4, 0),
  },
  textField: {
    minHeight: '5.5rem',
  },
  autoCompleteTextField: {
    marginTop: theme.spacing(2),
    minHeight: '5.5rem',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  help: {
    marginTop: theme.spacing(2),
  },
  helpText: {
    color: theme.palette.gray.main,
  },
  helpLink: {
    color: theme.palette.secondary.main,
    textDecoration: 'underline',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  title: {
    color: '#333333',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
  },
  textFieldSsn: {
    margin: theme.spacing(2, 0),
    minHeight: '6.5rem',
  },
  chip: {
    float: 'left',
    margin: theme.spacing(0, 1, 1, 0),
  },
  select: {
    width: '100%',
  },
}));

const validationOptions = {
  ...userSchema,
  ...directDepositSchema,
  ...existingCompanySchema,

  // Contact details
  mailingStreet1: yup.string().required('Please provide an address'),
  mailingStreet2: yup.string(),
  mailingCity: yup.string().required('Please provide a city'),
  mailingState: yup.string().required('Please provide a state'),
  mailingZip: yup
    .string()
    .required('Zip code is required')
    .test('physicalZip', 'Invalid zip code', validateZip),

  workPhone: yup
    .string()
    .test('workPhone', 'Please use 10 digits', validateWorkPhone)
    .required('Please provide a phone'),

  physicalSameAsMailing: yup.boolean(),

  physicalStreet1: yup
    .string()
    .test('physicalStreet1', 'Please provide an address', validateMailing),
  physicalStreet2: yup.string(),
  physicalCity: yup
    .string()
    .test('physicalCity', 'Please provide a city', validateMailing),
  physicalState: yup
    .string()
    .test('physicalState', 'Please provide a state', validateMailing),
  physicalZip: yup
    .string()
    .test('physicalZip', 'Zip code is required', validateMailing)
    .test('physicalZip', 'Invalid zip code', validateZip),

  // Company details
  entityType: yup.string().required('Please select an entity type.'),
  hubspotId: yup.number().typeError('Hubspot ID must be a number'),

  // Company details
  industry: yup.string().required('Please provide a business industry'),
  name: yup.string().required('Please provide a official company name'),
  description: yup
    .string()
    .required('Please provide a business description')
    .max(250, `Please use less than ${BUSINESS_DESCRIPTION_LIMIT} characters`),
  gustoCompanyUUID: yup.string().required('Please provide gusto company'),
};

const initErrors = (name: string, value: unknown) => {
  if (name === 'ein' && !value) {
    return {
      ein: {
        message: 'Please use 9 digits',
      },
    };
  }

  return {};
};

type TInput = {
  value: string;
  onChange: (value: string, capitalize?: boolean) => void;
  className: string;
  label: string;
  placeholder: string;
  name: keyof typeof validationOptions;
  errors: Partial<ValidationError>;
  capitalize?: boolean;
  inputProps?: object;
};

const InputText = ({
  value,
  onChange,
  className,
  label,
  placeholder = '',
  name,
  errors,
  capitalize = true,
  inputProps = {},
}: TInput) => (
  <TextField
    value={value}
    onChange={(e) => onChange(e.target.value, capitalize)}
    className={className}
    variant="outlined"
    margin="normal"
    fullWidth
    required
    label={label}
    placeholder={placeholder}
    name={name}
    error={!!errors[name]}
    helperText={errors[name]?.message}
    inputProps={{
      style: { textTransform: capitalize ? 'capitalize' : 'none' },
      autoCapitalize: 'on',
      ...inputProps,
    }}
  />
);

interface Props {
  name: keyof typeof validationOptions;
  value: any;
  onChange: (value: any, isValid: boolean) => void;
  onSave: (field: { value: any; isValid: boolean; name: string }) => void;
  onClose: () => void;
}

type ValidationError = {
  [key in keyof typeof validationOptions]: {
    message: string;
  };
};

export const EditableComponent = ({
  name,
  value = '',
  onChange,
  onSave,
  onClose,
}: Props) => {
  const classes = useStyles();

  const validationSchema = yup
    .object()
    .shape({ [name]: validationOptions[name] });

  const [officialCompanyName, setOfficialCompanyName] = useState<string>(
    value.name || '',
  );

  const [errors, setErrors] = useState<Partial<ValidationError>>(
    initErrors(name, value),
  );

  const [isSuggestedNamesModalOpen, setSuggestedNamesModalOpen] =
    useState(true);
  const [isFinalizeModalOpen, setFinalizeModalOpen] = useState(false);

  const [isEinModalOpen, setEinModalOpen] = useState(true);
  const [isEinConfirmModalOpen, setEinConfirmModalOpen] = useState(false);

  const onOfficialCompanyNameChange = async ({
    target: { value: v },
  }: ChangeEvent<HTMLInputElement>) => {
    try {
      await validationSchema.validate({ name: v });
      setErrors({});
    } catch (e) {
      setErrors({ name: e as Error });
    }

    setOfficialCompanyName(v);
  };

  let component;

  const onTextChange = async (val: string, capitalize: boolean = true) => {
    let isValid = true;
    setErrors({ [name]: null });

    let formattedValue = val;
    if (capitalize && val) {
      formattedValue = capitalizeFirstLetter(val);
    }

    try {
      await validationSchema.validate({ [name]: formattedValue });
    } catch (e) {
      setErrors({ [name]: e });
      isValid = false;
    }

    onChange(formattedValue, isValid);
  };

  const onEinSave = async () => {
    onSave({ value, isValid: true, name });
    onClose();
  };

  const openFinalizeModal = () => {
    setSuggestedNamesModalOpen(false);
    setFinalizeModalOpen(true);
  };

  const openEinConfirmModal = () => {
    setEinModalOpen(true);
    setEinConfirmModalOpen(true);
  };

  const onSuggestedChange = async () => {
    setErrors({ [name]: null });

    try {
      await validationSchema.validate({
        [name]: officialCompanyName,
      });

      onSave({ value: officialCompanyName, isValid: true, name: 'name' });
      onClose();
    } catch (e) {
      setErrors({ [name]: e });
    }
  };

  const onCheckboxChange = (v: boolean) => {
    onChange(v, true);
  };

  const onGustoCompanyChange = (companyValue: { uuid: string } | undefined) => {
    if (companyValue == null) {
      onSave({
        name,
        value: '',
        isValid: true,
      });
    } else {
      onSave({
        name,
        value: companyValue.uuid,
        isValid: true,
      });
    }
    onClose();
  };

  switch (name) {
    case 'first':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          capitalize={false}
          label="First Name"
          placeholder="Mary"
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'middle':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          capitalize={false}
          label="Middle Initial (optional)"
          placeholder="D."
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'last':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          capitalize={false}
          label="Last Name"
          placeholder="Wang"
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'dob':
      component = (
        <div>
          <FormationsDateFields
            variant="outlined"
            name="dob"
            label="Date of Birth"
            value={value}
            setValue={(n, v) => onTextChange(v, false)}
            error={!!errors.dob}
            helperText={errors?.dob?.message || ''}
          />
        </div>
      );
      break;
    case 'entityType':
      component = (
        <FormControl variant="outlined" required className={classes.select}>
          <InputLabel id="entityType-label">Entity Type</InputLabel>
          <Select
            labelId="entityType-label"
            label="Entity Type"
            id="entityType"
            name="entityType"
            value={value}
            error={!!errors?.entityType}
            onChange={(e) => onTextChange(e.target.value, false)}
          >
            {ENTITY_OPTIONS.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors?.entityType?.message}</FormHelperText>
        </FormControl>
      );
      break;
    case 'incorporationDate':
      component = (
        <FormationsDateFields
          variant="outlined"
          name="incorporationDate"
          label="Date of Incorporation"
          value={value}
          setValue={(n, v) => onTextChange(v, false)}
          error={!!errors.incorporationDate}
          helperText={errors?.incorporationDate?.message || ''}
        />
      );
      break;
    case 'ein':
      component = (
        <>
          <YesNoModal
            open={isEinModalOpen}
            isValid={value && !errors.ein}
            heading="EIN"
            onSave={openEinConfirmModal}
            onClose={onClose}
          >
            <TextField
              value={value}
              onChange={(e) => onTextChange(e.target.value)}
              className={classes.textField}
              variant="outlined"
              margin="normal"
              label="Employer Identification Number"
              placeholder="XXXXXXXXX"
              error={!!errors.ein}
              inputProps={{
                inputMode: 'numeric',
              }}
              helperText={errors?.ein?.message}
              fullWidth
              required
            />
          </YesNoModal>
          <ConfirmModal
            open={isEinConfirmModalOpen}
            question="Are you sure you want to change this EIN?"
            yesText="Yes, make changes"
            noText="No, discard changes"
            onSave={onEinSave}
            onClose={onClose}
          />
        </>
      );
      break;
    case 'mailingStreet1':
    case 'physicalStreet1':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          capitalize={false}
          label="Address Line 1"
          placeholder="1234 Ave E"
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'mailingStreet2':
    case 'physicalStreet2':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          capitalize={false}
          label="Address Line 2 (optional)"
          placeholder="Apt 2"
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'mailingCity':
    case 'physicalCity':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          capitalize={false}
          label="City"
          placeholder="Seattle"
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'mailingState':
    case 'physicalState':
      component = (
        <Autocomplete
          className={classes.autoCompleteTextField}
          value={value}
          onChange={(event, newValue) => {
            onTextChange(newValue?.code || '', false);
          }}
          options={STATES}
          blurOnSelect
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          autoHighlight
          fullWidth
          getOptionLabel={(option) => option.name ?? ''}
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              required
              placeholder="Washington"
              variant="outlined"
              error={!!errors[name]}
              helperText={errors[name]?.message}
            />
          )}
        />
      );
      break;
    case 'mailingZip':
    case 'physicalZip':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          label="Zip Code"
          placeholder="12345"
          name={name}
          errors={errors}
          className={classes.textField}
          inputProps={{
            maxLength: 10,
            inputMode: 'numeric',
          }}
        />
      );
    case 'workPhone':
      component = (
        <InputMask
          mask="(999) 999-9999"
          value={value}
          onChange={(e) => onTextChange(e.target.value)}
        >
          {() => (
            <TextField
              className={classes.textField}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label="Best phone to reach you"
              error={!!errors.workPhone}
              helperText={errors.workPhone?.message}
            />
          )}
        </InputMask>
      );
      break;
    case 'name':
      component = (
        <>
          <YesNoModal
            isValid={!!officialCompanyName && !errors.name}
            open={isSuggestedNamesModalOpen}
            heading="Company Name Options"
            onSave={openFinalizeModal}
            onClose={onClose}
          >
            <>
              <Typography variant="body2" component="div">
                Customer’s Company Name Options
              </Typography>
              <ChipInput readMode value={value.suggested} />
              <TextField
                value={officialCompanyName}
                onChange={onOfficialCompanyNameChange}
                className={classes.textField}
                variant="outlined"
                margin="normal"
                label="Official Company Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                required
              />
            </>
          </YesNoModal>
          <ConfirmModal
            open={isFinalizeModalOpen}
            question={`Are you sure to set the official company name as “${officialCompanyName}”?`}
            yesText="Yes, finalize the company name"
            noText="No, keep displaying the company name options"
            onSave={onSuggestedChange}
            onClose={onClose}
          />
        </>
      );
      break;
    case 'industry':
      component = (
        <Autocomplete
          data-testid="industry-select"
          className={classes.autoCompleteTextField}
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              onTextChange(newValue, false);
            } else if (newValue && newValue.inputValue) {
              onTextChange(newValue.inputValue, false);
            } else {
              onTextChange(newValue?.title ?? '', false);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                title: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          blurOnSelect
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          autoHighlight
          fullWidth
          options={BUSINESS_INDUSTRIES}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.title;
          }}
          renderOption={(props, option) => (
            <MenuItem
              {...props}
              data-testid={`industry-option-${option.title}`}
            >
              {option.title}
            </MenuItem>
          )}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Business Industry"
              placeholder="Doctors &amp; Other Health Professionals"
              variant="outlined"
              required
              error={!!errors.industry}
              helperText={errors.industry ? errors.industry.message : null}
            />
          )}
        />
      );
      break;
    case 'description':
      component = (
        <TextField
          value={value}
          onChange={(e) => onTextChange(e.target.value, false)}
          className={classes.textField}
          variant="outlined"
          margin="normal"
          fullWidth
          required
          label="Business Description"
          placeholder="Individual and Family Psychotherapy Practice"
          name="description"
          multiline
          rows={4}
          error={!!errors.description}
          helperText={`${value?.length ?? 0}/${BUSINESS_DESCRIPTION_LIMIT} ${
            errors.description?.message
          }`}
        />
      );
      break;
    case 'physicalSameAsMailing':
      component = (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              onChange={({ target: { checked } }) =>
                onCheckboxChange(!!checked)
              }
              color="secondary"
            />
          }
          label={
            <span style={{ fontSize: '20px', lineHeight: 1.5 }}>
              Business physical address is the same as business mailing address
            </span>
          }
        />
      );
      break;
    case 'bankName':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          capitalize={false}
          label="Bank Name"
          placeholder="Bank Name"
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'routingNumber':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          label="Routing Number"
          placeholder="123456789"
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'bankAccountNumber':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          label="Account Number"
          placeholder="Account Number"
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'bankAccountType':
      component = (
        <FormControl variant="outlined" required className={classes.select}>
          <InputLabel id="bankAccountType-label">Account Type</InputLabel>
          <Select
            labelId="bankAccountType-label"
            label="Account Type"
            id="bankAccountType"
            name="bankAccountType"
            value={value}
            error={!!errors.bankAccountType}
            onChange={(e) => onTextChange(e.target.value, false)}
          >
            {Array.from(BANK_ACCOUNT_TYPES, ([key, val]) => (
              <MenuItem key={key} value={key}>
                {val}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {errors.bankAccountType?.message ?? ''}
          </FormHelperText>
        </FormControl>
      );
      break;
    case 'hubspotId':
      return (
        <InputText
          value={value}
          onChange={onTextChange}
          label="Hubspot Contact ID"
          placeholder=""
          name={name}
          errors={errors}
          className={classes.textField}
        />
      );
    case 'gustoCompanyUUID':
      return (
        <GustoCompanyField
          value={value === '' ? undefined : value}
          onSave={onGustoCompanyChange}
          onCancel={onClose}
        />
      );
    default:
      component = <div />;
      break;
  }

  return component;
};
