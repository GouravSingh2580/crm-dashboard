import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  btn: {
    margin: theme.spacing(1, 0, 1, 0),
  },
}));

type TProps = {
  handleNextText?: string,
  nextDisable?: boolean,
  isButton?: boolean,
  onButtonClick?: ()=> void,
}

export const FooterContainer = ({
  handleNextText = 'Continue',
  nextDisable,
  isButton,
  onButtonClick,
}: TProps) => {
  const classes = useStyles();

  return (
    <div>
      <Button
        type={isButton ? 'button' : 'submit'}
        size="large"
        variant="contained"
        color="secondary"
        fullWidth
        className={classes.btn}
        disabled={nextDisable}
        onClick={onButtonClick}
        data-testid={`btn-${handleNextText}`}
      >
        {handleNextText}
      </Button>
    </div>
  );
};
