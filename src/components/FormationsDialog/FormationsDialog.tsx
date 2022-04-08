/* eslint-disable react/require-default-props */
import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import {
  Grid,
  Dialog as MuiDialog,
  Button,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
} from '@mui/material';

const BootstrapDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(2, 2, 2, 3),
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2, 3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
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

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface Props {
  open: boolean;
  children?: ReactNode;
  heading?: string | ReactNode;
  headingRight?: ReactNode;
  okText?: string;
  cancelText?: string;
  onSave?: () => void;
  onClose?: () => void;
  okButtonColor?: 'secondary' | 'primary' | 'error';
  excludeFooter?: boolean;
  maxWidth?: any;
  fullScreen?: boolean;
  backButton?: boolean;
}

export const FormationsDialog: React.FC<Props> = ({
  open,
  children = null,
  heading = '',
  onSave,
  onClose,
  okText = 'Save',
  cancelText = 'Cancel',
  okButtonColor = 'primary',
  excludeFooter = false,
  maxWidth = false,
  fullScreen = false,
  backButton = false,
  headingRight = null,
}) => {
  const handleSave = () => {
    onSave?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth={maxWidth}
      fullScreen={fullScreen}
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              {backButton
                && (
                  <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                      mr: 2,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                )}

              {typeof heading === 'string'
                ? (
                  <Typography variant="h6">
                    {heading}
                  </Typography>
                )
                : heading}
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              {headingRight}
              {!backButton
                && (
                  <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                      ml: 2,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
            </Grid>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      {!excludeFooter && (
        <DialogActions>
          <Button
            color="secondary"
            size="large"
            onClick={handleClose}
          >
            {cancelText}
          </Button>
          <Button
            size="large"
            color={okButtonColor}
            onClick={handleSave}
          >
            {okText}
          </Button>
        </DialogActions>
      )}
    </BootstrapDialog>
  );
};
