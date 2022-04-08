import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

import PopupIcon from 'icons/welcome-popup.png';

const useStyles = makeStyles((theme) => ({
  dialog: {
    [theme.breakpoints.down('md')]: {
      minWidth: 300,
      maxWidth: 300,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: 320,
      maxWidth: 600,
    },
  },
  img: {
    width: '100%',
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
  h5: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(4),
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiDialogContent);

// eslint-disable-next-line react/prop-types
export function CustomizedDialogs({ open, onClose }) {
  const classes = useStyles();

  const handleClose = () => {
    onClose(false);
  };

  return (
    <div>
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
          size="large">
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <img className={classes.img} src={PopupIcon} alt="Logo" />

          <div className={classes.content}>
            <Typography className={classes.h5} variant="h5" component="h5">
              Your incorporation is underway!
            </Typography>
            <Typography variant="body1" component="div">
              It will take 2-7 days for the state and IRS to send your official
              papers. While we wait, let’s get your account set up.
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}