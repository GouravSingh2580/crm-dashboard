import { CategorizeSelectors } from 'components/documents/CategorizeSelectors';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthService } from 'services';
import {
  DocumentCategory,
  DocumentYear,
  FormationsDocument,
} from 'services/documentTypes';
import { useDocumentDataOptions } from 'components/documents/helper';
import { useDocumentCategories, useDocumentEmails } from 'hooks/api';
import { get, isUndefined, merge, omitBy } from 'lodash';
import { useState } from 'react';
import { EmailTemplateSelector } from 'components/documents/EmailTemplateSelector';

export interface DocumentFormData {
  year?: DocumentYear;
  department: string;
  category: string;
  subcategory: string;
  categoryId?: string;
  visibleToCustomer: boolean;
  emailTemplateId?: string;
  companyId?: string; // hidden field, cannot be changed
  accountId?: string; // hidden field, cannot be changed
}

export const defaultDocumentCategory = {
  year: undefined,
  department: '',
  category: '',
  subcategory: '',
  visibleToCustomer: false,
};

export const getDocumentDataFromFormationsDocument = (
  doc: FormationsDocument,
): DocumentFormData => ({
  year: doc.forYear,
  department: doc.documentCategory?.department || '',
  category: doc.documentCategory?.category || '',
  subcategory: doc.documentCategory?.subcategory || '',
  categoryId: doc.documentCategory?.id,
  visibleToCustomer: get(doc, 'visibleToCustomer', true),
  companyId: doc.companyId, // hidden field, cannot be changed
  accountId: doc.companyId, // hidden field, cannot be changed
});

export const generateDocumentFormData = (
  defaultValue?: Partial<DocumentFormData>,
): DocumentFormData => {
  const doc: DocumentFormData = {
    department: '',
    category: '',
    subcategory: '',
    visibleToCustomer: true,
  };

  return omitBy(merge(doc, defaultValue), isUndefined) as DocumentFormData;
};

export type DocumentFormDataField =
  | 'year'
  | 'department'
  | 'category'
  | 'subcategory'
  | 'visibleToCustomer'
  | 'emailTemplateId';

const generateLockField = (
  defaultValue: DocumentFormData,
  disabledFields: DocumentFormDataField[],
) => {
  if (
    disabledFields.includes('category') &&
    disabledFields.includes('subcategory') &&
    disabledFields.includes('department')
  ) {
    return {
      category: defaultValue.category,
      subcategory: defaultValue.subcategory,
      department: defaultValue.department,
    };
  }
  return undefined;
};

export const getCategoryId = (
  names: {
    department: string;
    category: string;
    subcategory: string;
  },
  categories: DocumentCategory[],
) =>
  categories.find(
    (category) =>
      category.category === names.category &&
      category.subcategory === (names.subcategory || '') &&
      category.department === names.department,
  )?.id;

interface EmailFieldProps {
  value?: string;
  onChange: (emailTemplateId: string | undefined) => void;
}
export const EmailField = ({ onChange, value }: EmailFieldProps) => {
  const { emails } = useDocumentEmails();
  const [enableEmail, setEnableEmail] = useState<boolean>(false);
  return (
    <div data-testid="document-field-email">
      <FormControlLabel
        control={
          <Checkbox
            name="enableEmail"
            data-testid="field-enable-email"
            onChange={(event) => setEnableEmail(event.target.checked)}
            value={enableEmail}
          />
        }
        label="Notify customer via email"
      />
      {enableEmail && (
        <EmailTemplateSelector
          emailTemplateOptions={emails}
          handleChange={onChange}
          value={value || ''}
        />
      )}
    </div>
  );
};

interface Props {
  value: DocumentFormData;
  disabledFields?: Array<DocumentFormDataField>;
  onChange: (formData: DocumentFormData) => void;
}

/**
 * This component is for the document form inside the admin upload dialog. It will be shared with recategorize dialog to prevent duplication
 */
export const DocumentForm = ({
  value,
  disabledFields = [],
  onChange,
}: Props) => {
  const { categories } = useDocumentCategories();
  const documentOptions = useDocumentDataOptions(value, categories);
  const handleChange = (key: DocumentFormDataField, newVal: any) => {
    onChange({
      ...value,
      [key]: newVal,
    });
  };
  const handleChangeCat = (key: string, newVal: any) => {
    const names = {
      ...value,
      category: key === 'department' ? '' : value.category,
      subcategory:
        key === 'department' || key === 'category' ? '' : value.subcategory,
      [key]: newVal,
    };
    const categoryId = getCategoryId(names, categories);
    onChange({
      ...names,
      [key]: newVal,
      categoryId,
    });
  };
  const lockCategory = generateLockField(value, disabledFields);

  const visibilityLabel = value.visibleToCustomer ? 'Customer-visible' : 'Not customer-visible';
  const visibilityEdit = AuthService.isAdmin() ? (
    <FormControlLabel
      control={
        <Checkbox
          checkedIcon={<Visibility />}
          icon={<VisibilityOff />}
          name="checked"
          checked={value.visibleToCustomer}
          disabled={disabledFields?.includes('visibleToCustomer')}
          onChange={({ target: { checked } }) =>
            handleChange('visibleToCustomer', checked)
          }
        />
      }
      label={visibilityLabel}
      data-testid="document-field-visible"
    />
  ) : null;

  return (
    <>
      <CategorizeSelectors
        options={documentOptions}
        handleChange={handleChangeCat}
        value={value}
        lockDownCategory={lockCategory}
      />
      {visibilityEdit}
      {!disabledFields?.includes('emailTemplateId') && (
        <EmailField
          value={value.emailTemplateId}
          onChange={(newEmailTemplateId) =>
            handleChange('emailTemplateId', newEmailTemplateId)
          }
        />
      )}
    </>
  );
};
