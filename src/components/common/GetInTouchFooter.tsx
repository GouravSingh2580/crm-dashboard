import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Link from '@mui/material/Link';

const useStyles = makeStyles((theme) => ({
  questions: {
    lineHeight: '24px',
    letterSpacing: '0.4px',
    fontWeight: '500',
    marginTop: theme.spacing(5),
  },
  customerService: {
    lineHeight: '24px',
    letterSpacing: '0.4px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  helpOut: {
    lineHeight: '24px',
    letterSpacing: '0.4px',
    fontWeight: '500',
  },
}));

export const GetInTouchFooter = () => {
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.questions} variant="body2" component="div">
        Have questions?
      </Typography>
      <Typography
        className={classes.customerService}
        variant="body2"
        component="div"
      >
        <Link href="mailto:onboarding@formationscorp.com" color="secondary">
          Get in touch with our customer service
        </Link>
      </Typography>
      <Typography className={classes.helpOut} variant="body2" component="div">
        and we&apos;ll help you out.
      </Typography>
    </>
  );
};
