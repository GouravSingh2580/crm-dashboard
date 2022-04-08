import { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Grid, Button } from '@mui/material';
import queryClient from 'states/reactQueryClient';
import useLoading from 'hooks/useLoading';
import {
  useCreateDocument,
  useDocumentCategories,
  useDocumentsByAccount,
  useUpdateDocument,
  useDeleteDocument,
  useApproveDocument,
  useRejectDocument,
  UpdateDocumentVariables,
} from 'hooks/api/useDocuments';
import { useDocumentsTableData } from 'hooks/dataFormatters';
import { useAppSettingsStore } from 'stores';
import { AuthService } from 'services';
import { YesNoModal } from 'components/common/modals';
import { DocumentsTable, Uploader } from 'components/common';
import { showInfoToast, showSuccessToast } from 'components/toast/showToast';
import { FilePreviewDialog } from 'components/FilePreviewDialog';
import {
  DocumentKey,
  FormationsTableDocument,
} from 'components/common/tables/DocumentsTable';
import { FormationsDocument, UpdateDocumentForm } from 'services/documentTypes';
import { EditDocumentDialog } from 'components/documents/EditDocumentDialog';
import { AdminUploadDialog } from 'components/documents/AdminUploadDialog';
import { VisibilityPopup } from './VisibilityPopup';

interface IHeaders {
  title: string;
  key: DocumentKey;
}

const useStyles = makeStyles((theme) => ({
  grid: {
    marginBottom: theme.spacing(2),
  },
  uploadDocument: {
    height: '100%',
  },
}));

const headers: Array<IHeaders> = [
  { title: 'Name', key: 'title' },
  { title: 'Associated Year', key: 'forYear' },
  { title: 'Department', key: 'department' },
  { title: 'Category', key: 'category' },
  { title: 'Subcategory', key: 'subcategory' },
  { title: 'Uploaded', key: 'uploaded' },
];

export const Documents = ({
  companyId,
  accountId,
}: {
  companyId: string;
  accountId: string;
}) => {
  const classes = useStyles();

  const [deleteFiles, setDeleteFiles] = useState<string[]>([]);
  const [visibility, setVisibility] = useState({ id: '', status: false });
  const [isAdminUploadModalOpen, setAdminUploadModalOpen] = useState(false);
  const [isVisibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const [isDeleteModelOpen, setDeleteModelOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteModalText, setDeleteModalText] = useState('Are you sure?');
  const size: number = useAppSettingsStore((state) => state.numberOfTableRows);

  const [selectedFile, setSelectedFile] = useState<FormationsTableDocument>();
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const handleClosePreviewDialog = () => setSelectedFile(undefined);
  const [editedDocuments, setEditedDocuments] = useState<FormationsDocument[]>(
    [],
  );

  useEffect(() => {
    if (selectedFile) {
      setIsPreviewDialogOpen(true);
    } else {
      setIsPreviewDialogOpen(false);
    }
  }, [selectedFile]);

  const {
    documents,
    pageInfo: { totalCount },
    isLoading: isLoadingDocuments,
  } = useDocumentsByAccount(
    { accountId, page, size: String(size) },
    { enabled: !!accountId },
  );
  const { categories: cats, isLoading: isLoadingCategories } =
    useDocumentCategories();

  const { mutateAsync: createDocument, isLoading: isDocumentCreating } =
    useCreateDocument({
      onMutate: () => {
        showInfoToast('Uploading document');
      },
      onSuccess: () => {
        showSuccessToast('Uploading document successfully');
        queryClient.invalidateQueries(['documents', 'accountId', accountId]);
      },
    });

  const { mutateAsync: updateDocument, isLoading: isDocumentUpdating } =
    useUpdateDocument({
      onMutate: () => {
        showInfoToast('Updating document');
      },
      onSuccess: () => {
        showSuccessToast('Document updated successfully');
        queryClient.invalidateQueries(['documents', 'accountId', accountId]);
      },
    });

  const {
    mutateAsync: updateDocumentFromPreview,
    isLoading: isDocumentUpdatingFromPreview,
  } = useUpdateDocument({
    onSuccess: (res: UpdateDocumentForm) => {
      if (selectedFile) {
        setSelectedFile({
          ...selectedFile,
          visibleToCustomer: res?.visibleToCustomer,
        });
      }
      queryClient.invalidateQueries(['documents', 'accountId', accountId]);
    },
  });

  const { mutateAsync: deleteDocument, isLoading: isDocumentDeleting } =
    useDeleteDocument({
      onMutate: () => {
        showInfoToast('Deleting document');
      },
      onSuccess: () => {
        showSuccessToast('Document deleted successfully');
        queryClient.invalidateQueries(['documents', 'accountId', accountId]);
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
        queryClient.invalidateQueries(['documents', 'accountId', accountId]);
      },
    });

  const loading = useLoading(
    isLoading ||
      isLoadingDocuments ||
      isLoadingCategories ||
      isDocumentCreating ||
      isDocumentUpdating ||
      isDocumentUpdatingFromPreview ||
      isDocumentDeleting ||
      isDocumentApproving ||
      isDocumentRejecting,
  );

  const categories = cats ?? [];

  const data = useDocumentsTableData(documents);

  const numberOfPages = Math.ceil(totalCount / size);
  const isAdmin = AuthService.isAdmin();

  const onRecategorize = (id: string) => {
    const docs = documents.find((item) => item.id === id);
    if (docs) {
      setEditedDocuments([docs]);
    }
  };

  const onDelete = (ids: string[]) => {
    let filteredFiles = ids;
    const adminFiles = [];
    if (!isAdmin) {
      filteredFiles = [];
      ids.forEach((id) => {
        const file = data.find((item) => item.id === id);
        if (file?.role !== 'Admin') {
          filteredFiles.push(id);
        } else {
          adminFiles.push(id);
        }
      });
      if (adminFiles.length > 0) {
        setDeleteModalText(
          `You have selected a file added by the Admin, which cannot be deleted. Click continue to proceed deleting ${filteredFiles.length} files selected.`,
        );
      }
    }

    setDeleteModelOpen(true);
    setDeleteFiles(filteredFiles);
  };

  const openAdminPopup = () => {
    setAdminUploadModalOpen(true);
  };

  const closeAdminPopup = () => {
    setAdminUploadModalOpen(false);
  };

  const closeVisibilityPopup = () => {
    setVisibilityModalOpen(false);
  };

  const handleDelete = () => {
    deleteFiles.forEach((id) => {
      deleteDocument(id)
        .then(() => setSelected([]))
        .catch(() => {
          console.error('Error in Deleting File Id:', id);
        });
    });
    setDeleteModelOpen(false);
    setDeleteFiles([]);
  };

  const closeDeleteModal = () => {
    setDeleteModelOpen(false);
    setDeleteFiles([]);
  };

  const onCustomerUpload = (targetFiles: File[]) =>
    Promise.all(
      targetFiles.map((file: File) =>
        createDocument({
          form: {
            accountId,
            file,
            title: file.name,
            year: new Date().getFullYear(),
            companyId,
          },
        }),
      ),
    );

  const onUpload = (targetFiles: File[]) => onCustomerUpload(targetFiles);

  const onVisibilityModalOpen = async (id: string, status: boolean) => {
    setVisibility({ id, status });
    setVisibilityModalOpen(true);
  };

  const onVisibilityChange = async () => {
    closeVisibilityPopup();

    const { id, status } = visibility;

    await updateDocument({
      id,
      form: {
        visibleToCustomer: status,
      },
    } as UpdateDocumentVariables);
  };

  const handleFileNameClick = async (file: FormationsTableDocument) => {
    setSelectedFile(file);
  };

  return (
    <>
      {loading}

      <Grid className={classes.grid} container spacing={3}>
        <Grid item xs={12} md={3}>
          {isAdmin ? (
            <Button
              size="large"
              variant="contained"
              color="secondary"
              onClick={openAdminPopup}
              data-testid="btn-upload"
            >
              Upload Document
            </Button>
          ) : (
            <Uploader
              text="Upload Document"
              disabled={!companyId}
              onUpload={onUpload}
              data-testid="btn-upload"
            />
          )}
        </Grid>
      </Grid>

      <DocumentsTable
        data={data}
        headers={headers}
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        onRecategorize={onRecategorize}
        selected={selected}
        setSelected={setSelected}
        onDelete={onDelete}
        setLoading={setLoading}
        onChangeVisibility={onVisibilityModalOpen}
        onFileNameClick={handleFileNameClick}
      />
      {isAdminUploadModalOpen && (
        <AdminUploadDialog
          open={isAdminUploadModalOpen}
          onClose={closeAdminPopup}
          accountId={accountId}
          defaultData={{
            accountId,
            companyId,
          }}
        />
      )}

      <VisibilityPopup
        open={isVisibilityModalOpen}
        status={visibility.status}
        onSave={onVisibilityChange}
        onClose={closeVisibilityPopup}
      />

      <YesNoModal
        open={isDeleteModelOpen}
        heading={deleteModalText}
        okText="Delete"
        okButtonColor="error"
        onSave={handleDelete}
        onClose={closeDeleteModal}
      />
      {selectedFile && (
        <FilePreviewDialog
          open={isPreviewDialogOpen}
          file={selectedFile}
          files={data}
          categoriesData={categories}
          setViewingfile={setSelectedFile}
          onClose={handleClosePreviewDialog}
          updateDocument={updateDocumentFromPreview}
          approveDocument={approveDocument}
          rejectDocument={rejectDocument}
          deleteDocument={deleteDocument}
        />
      )}
      {editedDocuments.length > 0 && (
        <EditDocumentDialog
          accountId={accountId}
          documents={editedDocuments}
          open={editedDocuments.length > 0}
          onClose={() => setEditedDocuments([])}
        />
      )}
    </>
  );
};
