import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Typography, Box, AlertTitle, alpha } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { makeStyles } from '@mui/styles';
import { ErrorCode, FileRejection } from 'react-dropzone';
import { Alert, LoadingButton } from '@mui/lab';
import { UploadFile } from 'components/common';
import Skeleton from '@mui/lab/Skeleton';
import { ProgressTrackerStatus } from 'services/account';

import {
  useDocumentsByAccount,
  useDocumentCategories,
  useCreateDocument,
  useDeleteDocument,
} from 'hooks/api';
import {
  findCategoryByName,
  getDocumentAvailableForCategory,
} from 'helpers/documents';
import queryClient from 'states/reactQueryClient';

import { TableView } from 'components/AdminProgressTracker/AccountVerification/TableView';
import { DocumentYear } from 'services/documentTypes';

const useStyles = makeStyles((theme: any) => ({
  title: {
    fontFamily: theme.typography.fontFamily,
  },
  desc: {
    marginTop: theme.spacing(2),
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    color: theme.palette.black.main,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
  },
  backButtonText: {
    marginLeft: theme.spacing(1),
  },
  ListItem: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    marginTop: theme.spacing(1),
  },
  buttonText: {
    ...theme.typography.label,
    marginTop: theme.spacing(5),
  },
  continueBtnContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'end',
  },
}));

interface IFile extends File {
  id: string;
  title: string;
  status: string;
  statusReason: string;
}

export const UploadGovID = ({
  accountId,
  handleContinue,
  isLoading,
  categoryData,
  title,
  subtitle,
  currentStatus,
  defaultYear = new Date().getFullYear(),
  comment = ''
}: {
  accountId: string | undefined;
  handleContinue: () => void;
  isLoading: boolean;
  categoryData: {
    name: string;
    subcategory: string;
    department: string;
  };
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  currentStatus: ProgressTrackerStatus;
  defaultYear?: DocumentYear;
  comment?: string,
}) => {
  const classes = useStyles();
  const [error, setError] = useState<Error | null>(null);

  const { categories, refetch: refetchCategories } = useDocumentCategories();

  const {
    isLoading: loadingDocuments,
    refetch: refetchDocuments,
    documents: documentData,
  } = useDocumentsByAccount(
    { accountId, page: '1', size: '10' },
    {
      enabled: !!accountId,
    },
  );

  const kycDocuments = getDocumentAvailableForCategory({
    documents: documentData,
    name: categoryData.name,
    subcategory: categoryData.subcategory,
    department: categoryData.department,
  });


  useEffect(() => {
    refetchCategories();
    refetchDocuments();
  }, [refetchCategories, refetchDocuments]);

  const documentCategory =
    findCategoryByName({
      categories,
      name: categoryData.name,
      subcategory: categoryData.subcategory,
      department: categoryData.department,
    }) || '';

  const { mutateAsync: createDocument, isLoading: isDocumentCreating } =
    useCreateDocument({
      onSuccess: () => {
        queryClient.invalidateQueries(['documents', 'accountId', accountId]);
      },
    });

  const { mutateAsync: deleteDocument, isLoading: isDocumentDeleting } =
    useDeleteDocument({
      onSuccess: () => {
        queryClient.invalidateQueries(['documents', 'accountId', accountId]);
      },
    });

  const onSubmit = () => {
    if (kycDocuments && kycDocuments.length > 0) {
      handleContinue();
    } else {
      setError(new Error('Please upload documents and retry...'));
    }
  };

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      const totalNoOfFiles = kycDocuments.length + acceptedFiles.length;
      if (totalNoOfFiles > 10) {
        setError(
          new Error(
            'Exceeded max number of files to be uploaded. Maxmum files limit is 10.',
          ),
        );
      } else if (accountId) {
        acceptedFiles.forEach((file) =>
          createDocument({
            form: {
              accountId,
              file,
              title: file.name,
              year: defaultYear,
              documentCategoryId: documentCategory,
            },
          }),
        );
      }
    },
    [kycDocuments, documentCategory, accountId, createDocument],
  );

  const isStepCompleted = useMemo(() => currentStatus === ProgressTrackerStatus.Completed, [currentStatus]);
  const isStepRejected = useMemo(() => currentStatus === ProgressTrackerStatus.Rejected, [currentStatus]);

  const isInCustomerStage = useMemo(() =>
    currentStatus !== ProgressTrackerStatus.InProgress && currentStatus !== ProgressTrackerStatus.Completed, [currentStatus]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0 && fileRejections[0].errors.length > 0) {
      if (fileRejections[0].errors[0].code === ErrorCode.FileTooLarge) {
        setError(new Error('The file is over 5MB, please retry ...'));
      } else if (fileRejections[0].errors[0].code === ErrorCode.TooManyFiles) {
        setError(new Error('Too many files. Please upload only 10 files.'));
      } else {
        setError(new Error('Unsupported file type, upload an acceptable file format.'));
      }
    }
  }, []);

  const onDrop = useCallback(() => {
    setError(null);
  }, []);

  function nameLengthValidator(file: File) {
    if (file.name.length > 100) {
      return {
        code: 'name-too-large',
        message: 'File Name must not be longer than 100 characters',
      };
    }

    return null;
  }

  const onRemoveFile = async (fileToRemove: IFile) => {
    if (fileToRemove.id) {
      await deleteDocument(fileToRemove.id);
    }
  };

  const getSkeleton = () =>
    ['1'].map((index) => (
      <Typography component="div" key={index} variant="h2">
        <Skeleton animation="wave" />
      </Typography>
    ));

  const loadFileList = () =>
    isDocumentCreating || isDocumentDeleting || loadingDocuments ? (
      getSkeleton()
    ) : (
      <TableView
        isLoading={false}
        documents={kycDocuments}
        allowFileDelete={!isStepCompleted}
        onDelete={onRemoveFile}
        showUploadFile={false}
        hasCompleteCTA={false}
        onUpload={() => null}
        onComplete={() => null}
        allowStepReject={false}
        onReject={() => null}
      />
    );

  return (
    <>
      <Typography variant="h5B" component="h5">
        {title}
      </Typography>
      <Typography sx={{ opacity: '0.7' }} mt={2} variant="body1" component="p">
        {subtitle}
      </Typography>
      {
        error && (
          <Box mt={1}>
            <Alert severity="warning">{error.message}</Alert>
          </Box>
        )
      }
      {
        isStepRejected && (
          <Box mt={1}>
            <Alert severity="warning">
              <AlertTitle>Action required</AlertTitle>
              {comment || 'Please reupload the correct files'}
            </Alert>
          </Box>
        )
      }
      {
        isInCustomerStage && (
          <>
            <UploadFile
              uploadProps={{
                onDrop,
                onDropAccepted,
                onDropRejected,
                accept: 'image/PNG, image/JPEG, application/PDF',
                maxSize: 5242880,
                multiple: true,
                noClick: true,
                noKeyboard: true,
                validator: nameLengthValidator,
              }}
            />
          </>
        )
      }
      {loadFileList()}

      {isInCustomerStage && (
        <Box className={classes.continueBtnContainer}>
          <LoadingButton
            endIcon={<SaveIcon />}
            loadingPosition="end"
            loading={isLoading}
            variant="outlined"
            size="large"
            onClick={onSubmit}
            data-testid="save-n-continue-btn"
          >
            Save and Continue
          </LoadingButton>
        </Box>
      )}
    </>
  );
};
