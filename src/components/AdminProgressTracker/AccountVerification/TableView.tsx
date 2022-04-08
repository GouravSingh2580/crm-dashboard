/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  TableContainer,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  Button,
  TableBody,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { LoadingButton } from '@mui/lab';
import { YesNoModal } from 'components/common/modals';
import { FormationsDocument } from 'hooks/dataFormatters/useDocumentsTableData';
import { getStatus } from './statusUtil';

interface TableviewProps {
  isLoading: boolean;
  documents: FormationsDocument[];
  onComplete: () => void;
  onDelete: (file: any) => void;
  hasCompleteCTA?: boolean;
  onFileClick?: (file: FormationsDocument) => void;
  onUpload: () => void;
  allowFileDelete?: boolean;
  showUploadFile?: boolean;
  isCompleted?: boolean;
  allowStepReject: boolean;
  onReject: () => void;
}

export const TableView = ({
  isLoading,
  documents = [],
  onDelete,
  hasCompleteCTA,
  onFileClick,
  onUpload,
  onComplete,
  allowFileDelete,
  showUploadFile,
  isCompleted = false,
  allowStepReject,
  onReject,
}: TableviewProps) => {
  const [deleteFile, setDeleteFile] = useState<any>();
  const [isDeleteModelOpen, setDeleteModelOpen] = useState(false);

  useEffect(() => {
    if (deleteFile) {
      setDeleteModelOpen(true);
    } else {
      setDeleteModelOpen(false);
    }
  }, [deleteFile]);

  const handleConfirmDelete = () => {
    onDelete(deleteFile);
    setDeleteFile(undefined);
  };

  return (
    <>
      <Box my={2}>
        <TableContainer component={Paper}>
          <Table aria-label="documents table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ p: 0 }}>Name</TableCell>
                <TableCell sx={{ p: 0 }}>Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc: any) => (
                <TableRow key={doc.id}>
                  <TableCell
                    scope="row"
                    sx={{ p: 0, cursor: onFileClick ? 'pointer' : 'default' }}
                    onClick={() => onFileClick && onFileClick(doc)}
                  >
                    <AttachFileIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {doc.title}
                  </TableCell>
                  <TableCell sx={{ p: 0 }}>{getStatus(doc.status)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      visibility: allowFileDelete ? 'visible' : 'hidden',
                    }}
                  >
                    <IconButton
                      aria-label="delete"
                      onClick={() => setDeleteFile(doc)}
                      disabled={isLoading || !allowFileDelete}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {documents && documents.length === 0 && (
            <Grid item sx={{ mt: 2, mb: 2 }}>
              <Typography>No documents have been uploaded yet.</Typography>
            </Grid>
          )}
        </TableContainer>
      </Box>
      {showUploadFile && (
        <Grid container item sx={{ mt: 2 }}>
          <Grid item xs={5}>
            <Button
              size="large"
              variant="contained"
              color="secondary"
              component="span"
              startIcon={<FileUploadIcon />}
              disabled={isLoading}
              onClick={onUpload}
            >
              Upload Document
            </Button>
          </Grid>
        </Grid>
      )}

      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-end"
        item
        xs={12}
        sx={{ mt: 2 }}
        columnSpacing={2}
      >
        {allowStepReject && !isCompleted && (
          <Grid item>
            <LoadingButton
              loading={isLoading}
              variant="outlined"
              size="large"
              onClick={onReject}
              data-testid="request-action-btn"
            >
              Request customer action
            </LoadingButton>
          </Grid>
        )}
        {(hasCompleteCTA &&  documents.length > 0) && (
          <Grid item>
            <LoadingButton
              loading={isLoading}
              variant="outlined"
              size="large"
              onClick={onComplete}
              disabled={isCompleted}
              data-testid="btn-complete-step"
            >
              {isCompleted ? 'Completed' : 'Complete'}
            </LoadingButton>
          </Grid>
        )}
      </Grid>

      <YesNoModal
        open={isDeleteModelOpen}
        heading="Are you sure you want to delete this file?"
        okText="Delete"
        okButtonColor="error"
        onSave={handleConfirmDelete}
        onClose={() => setDeleteFile(undefined)}
      />
    </>
  );
};

TableView.defaultProps = {
  hasCompleteCTA: true,
  allowFileDelete: true,
  showUploadFile: true,
};
