import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import { ErrorOutline } from '@mui/icons-material';
import {
  Dialog,
  Button,
  Typography,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  DialogTitle as MuiDialogTitle,
} from '@mui/material';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  icon: {
    width: '68px',
    height: '68px',
    color: '#FF9800',
  },
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
    // @ts-ignore
    color: theme.palette.graylight.main,
    marginLeft: `0 !important`,
  },
}));

const DialogTitle = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 0, 0, 0),
  },
}))(MuiDialogTitle);

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

interface Props {
  showIcon?: boolean;
  open: boolean;
  title?: string;
  question: string;
  yesText?: string;
  noText?: string;
  onSave: () => void;
  onClose: () => void;
  isYesAsLink?: boolean;
  yesHref?: string;
}

export function ConfirmModal({
  showIcon = true,
  open,
  title = '',
  question,
  yesText = 'Yes',
  noText = 'No',
  onSave,
  onClose,
  isYesAsLink = false,
  yesHref = '',
}: Props) {
  const classes = useStyles();

  const handleSave = () => {
    onSave();
  };

  const handleClose = () => {
    onClose();
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
        {showIcon && (
          <div className={classes.iconContainer}>
            <ErrorOutline className={classes.icon} />
          </div>
        )}
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>
          <Typography variant="body1" component="div">
            {question}
          </Typography>
        </DialogContent>

        <DialogActions>
          {isYesAsLink ? (
            <Button
              size="large"
              variant="contained"
              color="secondary"
              fullWidth
              href={yesHref}
              onClick={handleClose}
              disabled={!yesHref}
              target="_blank"
            >
              {yesText}
            </Button>
          ) : (
            <Button
              size="large"
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleSave}
            >
              {yesText}
            </Button>
          )}
          <br />
          <Button
            className={classes.secondaryButton}
            size="large"
            fullWidth
            onClick={handleClose}
          >
            {noText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
