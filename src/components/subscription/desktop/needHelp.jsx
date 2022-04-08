import makeStyles from '@mui/styles/makeStyles';
import { Button, Typography } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import image from '../../../icons/need-help.png';

const useStyles = makeStyles((theme) => ({
  needHelpTitle: {
    fontWeight: '800',
    color: theme.palette.white.main,
  },
  container: {
    maxWidth: '1155px',
    margin: '0 auto',
    padding: '0 16px',
  },
  needHelpContainer: {
    width: '100%',
    padding: '32px 0',
    background: theme.palette.primary.main,
  },
  scheduleCall: {
    background: theme.palette.white.main,
    border: `1px solid ${theme.palette.white.main}`,
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.white.main,
    },
  },
  testinomyContainer: {
    padding: theme.spacing(0, 6),
    borderLeft: `1px solid ${theme.palette.white.main}`,
    marginLeft: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  testinomyText: {
    ...theme.typography.h4,
    color: theme.palette.yellow.light,
    marginBottom: theme.spacing(2),
  },
  testinomyName: {
    fontSize: '24px',
    color: theme.palette.white.main,
  },
  leftContainer: {
    display: 'flex',
  },
  callContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '245px',
    marginLeft: theme.spacing(6),
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const NeedHelp = () => {
  const classes = useStyles();
  return (
    <div className={classes.needHelpContainer}>
      <div className={classes.container}>
        <div className={classes.leftContainer}>
          <img src={image} alt="call" />
          <div className={classes.callContainer}>
            <Typography
              variant="h3"
              className={classes.needHelpTitle}
              component="h3"
            >
              Need Help Deciding?
            </Typography>
            <div>
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
            </div>
          </div>
          <div className={classes.testinomyContainer}>
            <div className={classes.testinomyText}>
              &quot;Formations helped me to get my books in order. Thanks to them, I
              was able to save $14,000 on my taxes!&quot;
            </div>
            <div>
              <div
                className={classes.testinomyName}
                style={{ fontWeight: '700' }}
              >
                Stephanie Kristen
              </div>
              <div
                className={classes.testinomyName}
                style={{ fontWeight: '400' }}
              >
                Windermere Real Estate Agent
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedHelp;
