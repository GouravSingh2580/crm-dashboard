import MuiAlert from '@mui/material/Alert';
import DoneIcon from '@mui/icons-material/Done';
import SyncIcon from '@mui/icons-material/Sync';
import { Snackbar } from '@mui/material';

import { useAlertsState } from 'states';

const Alerts = () => {
  const AlertsState = useAlertsState();

  const handleLoadingSnackbarClose = () => {
    AlertsState.setUploadingDocument(false);
  };
  const handleUploadedSnackbarClose = () => {
    AlertsState.setUploadedDocument(false);
  };
  const handleUpdatingSnackbarClose = () => {
    AlertsState.setUpdatingDocument(false);
  };
  const handleUpdatedSnackbarClose = () => {
    AlertsState.setUpdatedDocument(false);
  };
  const handleDeletingSnackbarClose = () => {
    AlertsState.setDeletingDocument(false);
  };
  const handleDeletedSnackbarClose = () => {
    AlertsState.setDeletedDocument(false);
  };

  const UploadingAlert = () => (
    <MuiAlert
      icon={<SyncIcon className="rotating" />}
      severity="info"
      variant="filled"
      onClose={handleLoadingSnackbarClose}
    >
      Uploading document
    </MuiAlert>
  );

  const UploadedAlert = () => (
    <MuiAlert
      icon={<DoneIcon />}
      severity="success"
      variant="filled"
      onClose={handleUploadedSnackbarClose}
    >
      Uploaded document
    </MuiAlert>
  );

  const UpdatingAlert = () => (
    <MuiAlert
      icon={<SyncIcon className="rotating" />}
      severity="info"
      variant="filled"
      onClose={handleLoadingSnackbarClose}
    >
      Updating document
    </MuiAlert>
  );

  const UpdatedAlert = () => (
    <MuiAlert
      icon={<DoneIcon />}
      severity="success"
      variant="filled"
      onClose={handleUpdatedSnackbarClose}
    >
      Updated document
    </MuiAlert>
  );

  const DeletingAlert = () => (
    <MuiAlert
      icon={<SyncIcon className="rotating" />}
      severity="info"
      variant="filled"
      onClose={handleDeletingSnackbarClose}
    >
      Deleting document
    </MuiAlert>
  );

  const DeletedAlert = () => (
    <MuiAlert
      icon={<DoneIcon />}
      severity="success"
      variant="filled"
      onClose={handleDeletedSnackbarClose}
    >
      Deleted document
    </MuiAlert>
  );

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={AlertsState.isUploadingDocument}
        onClose={handleLoadingSnackbarClose}
      >
        <UploadingAlert />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        open={AlertsState.isUploadedDocument}
        onClose={handleUploadedSnackbarClose}
      >
        <UploadedAlert />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        open={AlertsState.isUpdatingDocument}
        onClose={handleUpdatingSnackbarClose}
      >
        <UpdatingAlert />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        open={AlertsState.isUpdatedDocument}
        onClose={handleUpdatedSnackbarClose}
      >
        <UpdatedAlert />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        open={AlertsState.isDeletingDocument}
        onClose={handleDeletingSnackbarClose}
      >
        <DeletingAlert />
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        open={AlertsState.isDeletedDocument}
        onClose={handleDeletedSnackbarClose}
      >
        <DeletedAlert />
      </Snackbar>
    </>
  );
};

/**
 * @deprecated use showToast instead
 */
export default Alerts;
