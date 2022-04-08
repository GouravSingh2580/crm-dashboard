import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import {
  Dialog,
  Button,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Typography,
} from '@mui/material';

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      minWidth: 250,
      maxWidth: 250,
    },
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 0, 4, 0),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(0),
  },
}))(MuiDialogActions);

interface Props {
  open: boolean;
  okText?: string;
  cancelText?: string;
  heading: string;
  isValid?: boolean;
  onSave?: () => void;
  onClose?: () => void;
  okButtonColor?: 'secondary' | 'primary' | 'error';
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function YesNoModal({
  open,
  children = null,
  okText = 'Save Changes',
  cancelText = 'Cancel',
  heading,
  isValid = true,
  onSave,
  onClose,
  okButtonColor = 'secondary',
  size = 'sm',
}: Props) {
  const classes = useStyles();

  const handleSave = () => {
    onSave?.();
  };
  const handleClose = () => {
    onClose?.();
  };
  const sizesMap = {
    sm: 430,
    md: 600,
    lg: 900,
  };

  return (
    <div>
      <Dialog
        classes={{
          paper: `${classes.dialog}`,
        }}
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            minWidth: `${sizesMap[size]}px`,
            maxWidth: `${sizesMap[size]}px`,
          },
        }}
      >
        <DialogContent>
          <Typography
            variant="h6B"
            component="h6"
            sx={{ marginBottom: '36px' }}
          >
            {heading}
          </Typography>

          {children}
        </DialogContent>

        <DialogActions>
          {onClose && (
            <Button size="large" variant="text" onClick={handleClose}>
              {cancelText}
            </Button>
          )}

          {onSave && (
            <Button
              size="large"
              variant="contained"
              color={okButtonColor}
              disabled={!isValid}
              onClick={handleSave}
            >
              {okText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
