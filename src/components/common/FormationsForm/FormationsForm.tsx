import React from 'react';
import { Control, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loading } from 'components/common/Loading';
import { FormationsSelect } from './FormationsSelect';
import { FormationsTextField } from './FormationsTextField';
import { FormationsDateField } from './FormationsDateField';
import { FormationsSuggestionField } from './FormationsSuggestionField';
import { FormationsAutoComplete } from './FormationsAutoComplete';
import { FormationsTextArea } from './FormationsTextArea';
import { FormationsCheckbox } from './FormationsCheckbox';
import { FormationsRadioField } from './FormationsRadioField';
import { FormationsPhoneField } from './FormationsPhoneField';
import { FormationsSecuredField } from './FormationsSecureField';
import { FormationsZipCodeField } from './FormationsZipCodeField';

export enum FormationsFormFields {
  Text = 'text',
  Date = 'date',
  Suggested = 'suggested',
  AutoComplete = 'autoComplete',
  TextArea = 'textArea',
  SameAsAbove = 'sameAsAbove',
  Select = 'select',
  RadioField = 'radio',
  Phone = 'phone',
  SecuredText = 'SecuredText',
  ZipCode = 'ZipCode',
}

export interface IAutoCompleteOption {
  code: string;
  name: string;
  description?: string;
}

export interface IFormField {
  type: string;
  name: string;
  placeholder?: string;
  autoCapitalize?: boolean;
  label: string;
  autoFocus?: boolean;
  options?: any[];
  onChangeCallback?: (value: any | boolean) => void;
  characterLimit?: number;
  defaultValue?: any;
  helperText?: string;
  readOnly?: boolean;
  maxLength?: number;
  inputMode?:
    | 'search'
    | 'text'
    | 'none'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal';
  disableFuture?: boolean;
  startAdornment?: React.ReactNode;
}

export enum ButtonsAlign {
  Left = 'start',
  Right = 'end',
}

const renderField = (
  field: IFormField,
  control: Control,
  errors: any,
  getValues: () => void,
  watch: () => void,
  handleFormChange: (fieldName: string) => void,
) => {
  switch (field.type) {
    case FormationsFormFields.Select:
      return (
        <FormationsSelect field={field} errors={errors} control={control} />
      );
    case FormationsFormFields.Text:
      return (
        <FormationsTextField field={field} errors={errors} control={control} />
      );
    case FormationsFormFields.ZipCode:
      return (
        <FormationsZipCodeField
          field={field}
          errors={errors}
          control={control}
        />
      );
    case FormationsFormFields.Date:
      return (
        <FormationsDateField field={field} errors={errors} control={control} />
      );
    case FormationsFormFields.Suggested:
      return (
        <FormationsSuggestionField
          field={field}
          errors={errors}
          control={control}
        />
      );
    case FormationsFormFields.AutoComplete:
      return (
        <FormationsAutoComplete
          field={field}
          errors={errors}
          control={control}
          getValues={getValues}
          onFormChange={handleFormChange}
        />
      );
    case FormationsFormFields.TextArea:
      return (
        <FormationsTextArea
          field={field}
          errors={errors}
          control={control}
          watch={watch}
        />
      );
    case FormationsFormFields.SameAsAbove:
      return (
        <FormationsCheckbox field={field} errors={errors} control={control} />
      );
    case FormationsFormFields.RadioField:
      return (
        <FormationsRadioField field={field} errors={errors} control={control} />
      );
    case FormationsFormFields.Phone:
      return (
        <FormationsPhoneField field={field} errors={errors} control={control} />
      );
    case FormationsFormFields.SecuredText:
      return (
        <FormationsSecuredField
          field={field}
          errors={errors}
          control={control}
        />
      );
    default:
      return null;
  }
};
interface IForm {
  defaultValues?: any;
  onSubmit: (data: any) => Promise<void> | void | undefined;
  onChange?: (
    fieldName: string,
    data: {[key:string]: string},
    setValue: (
      name: string,
      value: any,
      config?:
        | Partial<{ shouldValidate: boolean; shouldDirty: boolean }>
        | undefined,
    ) => void
  ) => void;
  onCancel?: () => void | undefined;
  fieldsMap: IFormField[];
  validationSchema: any;
  formContext?: any;
  renderFormControls?: (state: any) => React.ReactNode | null;
  showLoader?: boolean;
  buttonsAlign?: ButtonsAlign;
}

export const FormationsForm = ({
  defaultValues,
  fieldsMap,
  onSubmit,
  onChange,
  onCancel,
  validationSchema,
  formContext,
  renderFormControls,
  showLoader,
  buttonsAlign = ButtonsAlign.Right,
}: IForm) => {
  const {
    control,
    handleSubmit,
    errors,
    watch,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    context: formContext,
  });

  const submit = async (data: any) => {
    await onSubmit(data);
  };

  const handleFormChange = (fieldName: string) => {
    if (onChange) {
      const formValues = getValues();
      onChange?.(fieldName, formValues, setValue);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
    >
      <Grid container spacing={2} sx={{ marginTop: '4px' }}>
        {fieldsMap.map((field) => (
          <Grid item xs={12} key={field.name}>
            {renderField(
              field,
              control,
              errors,
              getValues,
              watch,
              handleFormChange,
            )}
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: buttonsAlign,
            marginTop: '32px',
          }}
        >
          {renderFormControls ? (
            renderFormControls({ isSubmitting })
          ) : (
            <>
              <Button type="submit" variant="contained" data-testid="form-save-btn">
                Save
              </Button>
              <Button onClick={onCancel} data-testid="form-cancel-btn">Cancel</Button>
            </>
          )}
        </Grid>
      </Grid>
      {showLoader && isSubmitting && <Loading />}
    </form>
  );
};

FormationsForm.defaultProps = {
  defaultValues: {},
  formContext: {},
  showLoader: true,
  renderFormControls: null,
};
