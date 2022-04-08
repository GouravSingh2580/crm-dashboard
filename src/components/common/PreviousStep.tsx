import makeStyles from '@mui/styles/makeStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonBase } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  backButton: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(5),
    cursor: 'pointer',
  },
  backButtonText: {
    marginLeft: theme.spacing(1),
  },
}));
interface Props {
  onBack: () => void;
}

export const PreviousStep = ({ onBack }: Props) => {
  const classes = useStyles();
  return (
    <ButtonBase
      data-testid="btn-previous"
      className={classes.backButton}
      onClick={onBack}
    >
      <ArrowBackIcon />
      <div className={classes.backButtonText}>Previous Step</div>
    </ButtonBase>
  );
};
