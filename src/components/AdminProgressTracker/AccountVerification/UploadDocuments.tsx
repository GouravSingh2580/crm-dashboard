import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { getDocumentAvailableForCategory } from 'helpers/documents';
import { IFile } from 'models/IFile';
import {
  useDocumentsByAccount,
  useDocumentCategories,
  useUpdateDocument,
  useDeleteDocument,
  useApproveDocument,
  useRejectDocument,
} from 'hooks/api/useDocuments';
import queryClient from 'states/reactQueryClient';
import { showSuccessToast } from 'components/toast/showToast';
import { FilePreviewDialog } from 'components/FilePreviewDialog';
import { FormationsFormDialog } from 'components/common/FormationsFormDialog';
import { FormationsFormFields } from 'components/common/FormationsForm';
import * as yup from 'yup';
import { AdminUploadDialog } from 'components/documents/AdminUploadDialog';
import { FormationsDocument } from 'services/documentTypes';
import { TableView } from './TableView';

interface IUploadDocumentsProps {
  title?: string;
  subtitle: string;
  categoryData: {
    name: string;
    subcategory: string;
    department: string;
    visibleToCustomer?: boolean;
  };
  hasCompleteCTA?: boolean;
  onComplete: () => void;
  loading: boolean;
  accountId: string;
  companyId: string;
  isCompleted?: boolean;
  allowStepReject?: boolean;
  onReject?: (customerAction: string) => void;
}

export const UploadDocuments: React.FC<IUploadDocumentsProps> = ({
  title,
  subtitle,
  categoryData,
  hasCompleteCTA,
  onComplete,
  loading,
  accountId,
  companyId,
  isCompleted = false,
  allowStepReject = false,
  onReject,
}) => {
  const [isAdminUploadModalOpen, setAdminUploadModalOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<FormationsDocument | undefined>();
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const handleClosePreviewDialog = () => setSelectedFile(undefined);

  const openAdminUpload = () => {
    setAdminUploadModalOpen(true);
  };

  const closeAdminUpload = () => {
    setAdminUploadModalOpen(false);
  };

  useEffect(() => {
    if (selectedFile) {
      setIsPreviewDialogOpen(true);
    } else {
      setIsPreviewDialogOpen(false);
    }
  }, [selectedFile]);

  const { documents: documentData } = useDocumentsByAccount(
    { accountId, page: '1', size: '100' },
    {
      enabled: !!accountId,
    },
  );

  const { categories: cats, isLoading: isLoadingCategories } =
    useDocumentCategories();

  const refreshGrid = () => {
    queryClient.invalidateQueries(['documents', 'accountId', accountId]);
  };

  const {
    mutateAsync: updateDocumentFromPreview,
    isLoading: isDocumentUpdatingFromPreview,
  } = useUpdateDocument({
    onSuccess: (res: any) => {
      if (selectedFile) {
        setSelectedFile({
          ...selectedFile,
          visibleToCustomer: !!res?.data?.visibleToCustomer,
        });
      }
      refreshGrid();
    },
  });

  const { mutateAsync: deleteDocument, isLoading: isDocumentDeleting } =
    useDeleteDocument({
      onSuccess: () => {
        showSuccessToast('Document deleted successfully');
        refreshGrid();
      },
    });

  const { mutateAsync: approveDocument, isLoading: isDocumentApproving } =
    useApproveDocument({
      onSuccess: () => {
        queryClient.invalidateQueries(['documents', 'accountId', accountId]);
      },
    });

  const { mutateAsync: rejectDocument, isLoading: isDocumentRejecting } =
    useRejectDocument({
      onSuccess: () => {
        showSuccessToast('Document rejected successfully');
        refreshGrid();
      },
    });

  const documents = getDocumentAvailableForCategory({
    documents: documentData,
    name: categoryData.name,
    subcategory: categoryData.subcategory,
    department: categoryData.department,
  });

  const isLoading =
    loading ||
    isLoadingCategories ||
    isDocumentUpdatingFromPreview ||
    isDocumentDeleting ||
    isDocumentApproving ||
    isDocumentRejecting;

  const categories = cats ?? [];

  const handleDelete = async (fileToRemove: IFile) => {
    if (fileToRemove.id) {
      await deleteDocument(fileToRemove.id);
    }
  };

  const handleStepReject = async (formData: { customerAction: string }) => {
    if (onReject) {
      onReject(formData.customerAction);
    }
    setIsRejectDialogOpen(false);
  };

  const formFields = [
    {
      type: FormationsFormFields.TextArea,
      name: 'customerAction',
      label: 'Customer action detail',
      placeholder: 'Please provide detail on what customer needs to do.',
      characterLimit: 300,
      autoFocus: true,
    },
  ];

  return (
    <Grid container direction="column">
      {title && (
        <Grid container direction="row" alignItems="baseline" rowGap={2}>
          <Typography variant="h5B" component="span">
            {title}
          </Typography>
        </Grid>
      )}
      <Typography variant="h8B" component="h6" mt={2}>
        {subtitle}
      </Typography>
      <TableView
        isLoading={isLoading}
        documents={documents}
        hasCompleteCTA={hasCompleteCTA}
        onUpload={openAdminUpload}
        onDelete={handleDelete}
        onFileClick={setSelectedFile}
        onComplete={onComplete}
        isCompleted={isCompleted}
        allowStepReject={allowStepReject}
        onReject={() => setIsRejectDialogOpen(true)}
      />
      {isAdminUploadModalOpen && (
        <AdminUploadDialog
          open={isAdminUploadModalOpen}
          onClose={closeAdminUpload}
          accountId={accountId}
          defaultData={{
            category: categoryData.name,
            subcategory: categoryData.subcategory,
            department: categoryData.department,
            visibleToCustomer: categoryData.visibleToCustomer,
            accountId,
            companyId,
          }}
          disabledFields={[
            'department',
            'category',
            'subcategory',
            'visibleToCustomer',
          ]}
        />
      )}

      {selectedFile && (
        <FilePreviewDialog
          open={isPreviewDialogOpen}
          file={selectedFile}
          files={documents || []}
          categoriesData={categories}
          setViewingfile={setSelectedFile}
          onClose={handleClosePreviewDialog}
          updateDocument={updateDocumentFromPreview}
          approveDocument={approveDocument}
          rejectDocument={rejectDocument}
          deleteDocument={deleteDocument}
          enableAction
          lockDownCategory={{
            department: categoryData.department,
            category: categoryData.name,
            subcategory: categoryData.subcategory,
          }}
        />
      )}
      {isRejectDialogOpen && (
        <FormationsFormDialog
          title="Request Customer Action"
          isOpen={isRejectDialogOpen}
          onClose={() => setIsRejectDialogOpen(false)}
          onSubmit={handleStepReject}
          fieldsMap={formFields}
          validationSchema={yup.object().shape({
            customerAction: yup
              .string()
              .required('Please provide detail on what customer needs to do.')
              .max(300, `Please use less than ${300} characters`),
          })}
          defaultValues={{
            customerAction: '',
          }}
        />
      )}
    </Grid>
  );
};

UploadDocuments.defaultProps = {
  hasCompleteCTA: true,
};
