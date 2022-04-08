import { ChangeEvent, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useCreateDocument } from 'hooks/api';
import { showErrorToast, showSuccessToast } from 'components/toast/showToast';
import queryClient from 'states/reactQueryClient';
import { getErrorMessage } from 'helpers/error';
import useLoading from 'hooks/useLoading';
import { CreateDocumentForm } from 'services/documentTypes';
import { isUndefined, omitBy } from 'lodash';
import { pluralize } from 'helpers/text-transformer';
import {
  DocumentForm,
  DocumentFormData,
  DocumentFormDataField,
  generateDocumentFormData,
} from './DocumentForm';
import { DocumentDialog, FileBlock } from './DocumentDialog';

export const transformForCreateDocument = (
  formData: DocumentFormData,
  files: File[],
): Array<CreateDocumentForm> =>
  files.map((file) =>
    omitBy(
      {
        accountId: formData.accountId,
        companyId: formData.companyId,
        file,
        title: file.name,
        year: formData.year || new Date().getFullYear(),
        documentCategoryId: formData.categoryId,
        visibleToCustomer: formData.visibleToCustomer,
        emailTemplateId: formData.emailTemplateId,
      } as CreateDocumentForm,
      isUndefined,
    ),
  ) as CreateDocumentForm[];

interface Props {
  open: boolean;
  onClose: () => void;
  defaultData?: Partial<DocumentFormData>;
  disabledFields?: DocumentFormDataField[];
  accountId: string;
}
export const AdminUploadDialog = ({
  open,
  onClose,
  defaultData = {},
  disabledFields = [],
  accountId,
}: Props) => {
  const [formData, setFormData] = useState<DocumentFormData>(
    generateDocumentFormData(defaultData),
  );
  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync: createDocument, isLoading } = useCreateDocument({
    onSuccess: () => {
      queryClient.invalidateQueries(['documents', 'accountId', accountId]);
    },
  });
  const onSave = async () => {
    try {
      const createFormDatas = transformForCreateDocument(formData, files);
      await Promise.all(
        createFormDatas.map((data) => createDocument({ form: data })),
      );
      showSuccessToast('Uploading document(s) successfully');
      onClose();
    } catch (e: unknown) {
      showErrorToast(getErrorMessage(e));
    }
  };
  const onChange = (data: DocumentFormData) => {
    setFormData(data);
  };
  const onChangeFiles = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files || []));
  };

  useEffect(() => {
    setFormData({ ...formData, ...defaultData });
  }, [defaultData]);

  /** * file information block * */
  let fileBlock;
  if (files.length) {
    fileBlock = (
      <span>
        {files.length} {pluralize(files.length, 'file', 'files')}.{' '}
        <Typography
          data-testid="btn-upload"
          component="label"
          sx={{ color: 'primary.main', cursor: 'pointer' }}
        >
          Change files
          <input
            id="upload-document"
            style={{ display: 'none' }}
            type="file"
            name="documentFile"
            multiple
            onChange={onChangeFiles}
          />
        </Typography>
      </span>
    );
  } else {
    fileBlock = (
      <span>
        No file chosen!{' '}
        <Typography
          data-testid="btn-upload"
          component="label"
          sx={{ color: 'primary.main', cursor: 'pointer' }}
        >
          Select files
          <input
            id="upload-document"
            style={{ display: 'none' }}
            type="file"
            name="documentFile"
            multiple
            onChange={onChangeFiles}
          />
        </Typography>
      </span>
    );
  }

  const loading = useLoading(isLoading);
  return (
    <div>
      <DocumentDialog
        open={open}
        heading="Upload document"
        onClose={onClose}
        onSave={onSave}
        saveButtonProps={{
          disabled:
            formData.categoryId == null ||
            formData.year == null ||
            files.length === 0,
        }}
      >
        <FileBlock>{fileBlock}</FileBlock>
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
