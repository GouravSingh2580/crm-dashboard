import { Button, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.primary.main,
    padding: theme.spacing(4, 2),
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: theme.palette.white.main,
  },
  desc: {
    fontSize: '0.875rem',
    color: theme.palette.black.main,
    letterSpacing: '0.15px',
    lineHeight: '143%',
    marginBottom: theme.spacing(3),
  },
  subDesc: {
    fontWeight: '700',
    fontSize: '0.875rem',
    color: theme.palette.graylight.main,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    lineHeight: '143%',
    width: '66%',
  },
  scheduleCall: {
    background: 'none',
    border: `1px solid ${theme.palette.white.main}`,
    marginTop: theme.spacing(3),
    color: theme.palette.white.main,
  },
  divider: {
    background: theme.palette.white.main,
    margin: theme.spacing(3, 0),
  },
  testinomyText: {
    fontSize: '1.5rem',
    fontWeight: '400',
    color: theme.palette.yellow.light,
    marginBottom: theme.spacing(5),
  },
  testinomyName: {
    fontSize: '1.5rem',
    color: theme.palette.white.main,
  },
}));

export const NeedHelp = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.title}>Need Help Deciding?</div>
      <Button
        type="button"
        size="medium"
        variant="outlined"
        className={classes.scheduleCall}
      >
        <a
          href="https://meetings.hubspot.com/taylor262/personalized-consultation"
          target="_blank"
          rel="noreferrer"
        >
          Schedule A Call
        </a>
      </Button>
      <Divider className={classes.divider} />
      <div className={classes.testinomyText}>
        &quot;Formations helped me to get my books in order. Thanks to them, I was
        able to save $14,000 on my taxes!&quot;
      </div>
      <div className={classes.testinomyName} style={{ fontWeight: '700' }}>
        Stephanie Kristen
      </div>
      <div className={classes.testinomyName} style={{ fontWeight: '400' }}>
        Windermere Real Estate Agent
      </div>
    </div>
  );
};
