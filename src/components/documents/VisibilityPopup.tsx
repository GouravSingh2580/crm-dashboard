import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';

import {
  Dialog,
  Button,
  Typography,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
} from '@mui/material';

interface IProps {
  open: boolean;
  status: boolean;
  onSave: () => void;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  dialog: {
    [theme.breakpoints.down('md')]: {
      minWidth: 250,
      maxWidth: 250,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 430,
      maxWidth: 430,
    },
    padding: theme.spacing(2, 4, 4, 4),
  },
  secondaryButton: {
    color: theme.palette.graylight.main,
    marginLeft: `0 !important`,
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
    flexDirection: 'column',
    padding: theme.spacing(0),
  },
}))(MuiDialogActions);

export function VisibilityPopup({ open, status, onSave, onClose }: IProps) {
  const classes = useStyles();

  const handleSave = () => {
    onSave();
  };

  const handleClose = () => {
    onClose();
  };

  const getMainText = () => status
      ? 'Are you sure you want to make this document visible to customers?'
      : 'Are you sure you want to make this document invisible to customers?';

  const getOkayText = () => status
      ? 'Yes, make it customer-visible'
      : 'Yes, make it hidden from customers';

  const getCancelText = () => status
      ? 'No, keep it hidden from customers'
      : 'No, keep it visible to customers';

  return (
    <div>
      <Dialog
        classes={{
          paper: classes.dialog,
        }}
        onClose={handleClose}
        open={open}
      >
        <DialogContent>
          <div>
            <Typography variant="body1" component="div">
              {getMainText()}
            </Typography>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSave}
          >
            {getOkayText()}
          </Button>

          <Button
            className={classes.secondaryButton}
            size="large"
            fullWidth
            onClick={handleClose}
          >
            {getCancelText()}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
