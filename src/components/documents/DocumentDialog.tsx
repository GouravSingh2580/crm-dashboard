import makeStyles from '@mui/styles/makeStyles';
import { PropsWithChildren, ReactNode } from 'react';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  dialog: {
    [theme.breakpoints.down('md')]: {
      minWidth: 300,
      maxWidth: 300,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: 300,
      width: 600,
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.graylight.main,
  },
  content: {
    padding: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(1, 0),
    minHeight: '4.5rem',
  },
  h5: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(4),
  },
  fileBlock: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(4, 0),
    padding: theme.spacing(2, 4),
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.background,
  },
  fileIcon: {
    color: theme.palette.blue.main,
    marginRight: theme.spacing(1),
  },
  listEmailsButton: {
    marginLeft: theme.spacing(1),
  },
}));

export const FileBlock = ({ children }: { children: ReactNode }) => (
  <Grid
    container
    direction="row"
    alignItems="center"
    gap={1}
    sx={{ p: 3, mb: 2, bgcolor: 'grey.100' }}
    wrap="nowrap"
    data-testid="document-field-files"
  >
    <Grid item>
      <InsertDriveFileIcon sx={{ color: 'blue.main' }} />
    </Grid>
    <Grid item xs>
      <Typography variant="body1" component="p" sx={{ color: 'grey.900' }}>
        {children}
      </Typography>
    </Grid>
  </Grid>
);

interface Props extends PropsWithChildren<any> {
  onClose: () => void;
  open: boolean;
  heading: string;
  saveButtonProps?: ButtonProps;
  saveLabel?: string;
  cancelLabel?: string;
}

export const DocumentDialog = ({
  open,
  onClose,
  children,
  heading,
  saveButtonProps = {},
  onSave,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
}: Props) => {
  const classes = useStyles();
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      classes={{
        paper: classes.dialog,
      }}
      onClose={handleClose}
      open={open}
    >
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
        size="large"
        data-testid="dialog-close-btn"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography className={classes.h5} variant="h5" component="h5">
          {heading}
        </Typography>
        {children}
      </DialogContent>
      <DialogActions sx={{ pb: 3, pr: 3 }}>
        <Button
          size="large"
          onClick={handleClose}
          data-testid="dialog-cancel-btn"
        >
          {cancelLabel}
        </Button>
        <Button
          {...saveButtonProps}
          size="large"
          variant="contained"
          color="secondary"
          onClick={onSave}
          data-testid="dialog-save-btn"
        >
          {saveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
