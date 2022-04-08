import makeStyles from '@mui/styles/makeStyles';
import { Button, Typography, Divider } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import image from '../../../icons/need-help-mobile.png';

const useStyles = makeStyles((theme) => ({
  needHelpTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: theme.palette.white.main,
    margin: theme.spacing(2, 0),
  },
  needHelpContainer: {
    margin: '0 auto',
    padding: '20px',
    background: theme.palette.primary.main,
    dislay: 'flex',
  },
  scheduleCall: {
    background: theme.palette.white.main,
    border: `1px solid ${theme.palette.white.main}`,
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.white.main,
    },
  },
  testinomyText: {
    fontSize: '24px',
    color: theme.palette.yellow.light,
    marginBottom: theme.spacing(4),
  },
  testinomyName: {
    fontSize: '18px',
    color: theme.palette.white.main,
  },
  leftContainer: {
    display: 'flex',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    background: theme.palette.white.main,
    margin: theme.spacing(3, 0),
  },
}));

const NeedHelp = () => {
  const classes = useStyles();
  return (
    <div className={classes.needHelpContainer}>
      <img src={image} alt="call" style={{ width: '100%' }} />
      <Typography variant="h3" className={classes.needHelpTitle} component="h3">
        Need Help Deciding?
      </Typography>
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
          className={classes.alignCenter}
        >
          <div style={{ display: 'flex' }}>
            <CallIcon />
          </div>
          <div style={{ marginLeft: '8px' }}>Schedule a Call</div>
        </a>
      </Button>
      <Divider className={classes.divider} />
      <div className={classes.testinomyText}>
        &quot;Formations helped me to get my books in order. Thanks to them, I was
        able to save $14,000 on my taxes!&quot;
      </div>
      <div>
        <div className={classes.testinomyName} style={{ fontWeight: '700' }}>
          Stephanie Kristen
        </div>
        <div className={classes.testinomyName} style={{ fontWeight: '400' }}>
          Windermere Real Estate Agent
        </div>
      </div>
    </div>
  );
};

export default NeedHelp;
