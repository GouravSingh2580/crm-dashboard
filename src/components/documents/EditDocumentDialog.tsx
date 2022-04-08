import { FormationsDocument, UpdateDocumentForm } from 'services/documentTypes';
import { UpdateDocumentVariables, useUpdateDocument } from 'hooks/api';
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from 'components/toast/showToast';
import queryClient from 'states/reactQueryClient';
import { useState } from 'react';
import { isUndefined, omitBy } from 'lodash';
import { getErrorMessage } from 'helpers/error';
import useLoading from 'hooks/useLoading';
import { AuthService } from 'services';
import { DocumentDialog, FileBlock } from './DocumentDialog';
import {
  DocumentForm,
  DocumentFormData, DocumentFormDataField,
  generateDocumentFormData,
  getDocumentDataFromFormationsDocument,
} from './DocumentForm';

interface Props {
  documents: FormationsDocument[];
  open: boolean;
  onClose: () => void;
  accountId: string;
}

export const transformDocFormForUpdate = (
  formData: Partial<DocumentFormData>,
): UpdateDocumentForm => {
  const form = {
    year: formData.year,
    documentCategoryId: formData.categoryId,
    visibleToCustomer: formData.visibleToCustomer,
    emailTemplateId: formData.emailTemplateId,
  };
  return omitBy(form, isUndefined) as UpdateDocumentForm;
};

export const EditDocumentDialog = ({
  documents,
  open,
  onClose,
  accountId,
}: Props) => {
  const document = documents[0];
  const documentFormData = document
    ? getDocumentDataFromFormationsDocument(document)
    : generateDocumentFormData();

  const { mutateAsync: updateDocument, isLoading } =
    useUpdateDocument({
      onSuccess: () => {
        queryClient.invalidateQueries(['documents', 'accountId', accountId]);
      },
    });

  const [formData, setFormData] = useState<DocumentFormData>(documentFormData);
  const onSave = async () => {
    showInfoToast('Updating document');
    try {
      await updateDocument({
        id: document.id,
        form: transformDocFormForUpdate(formData),
      } as UpdateDocumentVariables);
      showSuccessToast('Document updated successfully');
      onClose();
    } catch (e: unknown) {
      showErrorToast(getErrorMessage(e));
    }
  };

  const onChange = (newFormData: DocumentFormData) => {
    setFormData(newFormData);
  };

  let disabledFields: DocumentFormDataField[] = ['emailTemplateId', 'visibleToCustomer'];
  if (AuthService.isAdmin() && document.uploader.role === 'Admin' ) {
    disabledFields = ['emailTemplateId'];
  }

  const loading = useLoading(isLoading);
  return (
    <div>
      <DocumentDialog
        open={open}
        heading="Recategorize Document"
        onClose={onClose}
        onSave={onSave}
        saveButtonProps={{
          disabled: formData.categoryId == null || formData.year == null,
        }}
      >
        <FileBlock>{document.title}</FileBlock>
        <DocumentForm
          value={formData}
          onChange={onChange}
          disabledFields={disabledFields}
        />
      </DocumentDialog>
      {loading}
    </div>
  );
};
