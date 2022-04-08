import { useState } from 'react';
import ReactDOM from 'react-dom';
import { Snackbar, Alert } from '@mui/material';
import { getErrorMessage } from 'helpers/error';
import { AlertTitle } from '@mui/lab';

type ShowToastParams = {
  title?: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  duration?: number;
}
interface ToastProps extends ShowToastParams {
  onClose: () => void;
}

const Toast = ({
  title = '', message, type, duration = 6000, onClose,
}: ToastProps) => {
  const [open, setOpen] = useState<boolean>(true);
  const handleClose = () => { setOpen(false); onClose(); };
  return (
    <Snackbar
      data-testid={`toast-${type}`}
      open={open}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={type} variant="outlined">
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};
Toast.defaultProps = {
  title: '',
  duration: 6000,
};

export const showToast = (props: ShowToastParams) => {
  const container = document.createElement('div');
  const handleClose = () => {
    container.remove();
  };
  ReactDOM.render(
    <Toast {...props} onClose={handleClose} />, container,
  );
  document.body.append(container);
};
export const showErrorToast = (message: string, title: string = '') => {
  showToast({ title, message, type: 'error' });
};
export const showSuccessToast = (message: string, title: string = '') => {
  showToast({ title, message, type: 'success' });
};
export const showInfoToast = (message: string, title: string = '') => {
  showToast({ title, message, type: 'info' });
};
export const showWarningToast = (message: string, title: string = '') => {
  showToast({ title, message, type: 'warning' });
};
export const showToastOnError = (e: unknown | Error) => {
  showErrorToast(`Error has been occurred: ${getErrorMessage(e)}`);
};
