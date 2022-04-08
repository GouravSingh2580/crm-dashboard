import makeStyles from '@mui/styles/makeStyles';
import { Typography, Button } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import image from 'icons/result.png';
import { Routes } from '../../../../fnRoutes';

const useStyles = makeStyles((theme) => ({
  resultWrapper: {
    paddingTop: theme.spacing(10),
    height: '100%',
  },
  container: {
    maxWidth: '1155px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    padding: '0 16px',
  },
  rowCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    left: '3%',
    background: theme.palette.secondary.lighter,
    borderRadius: '40px 0px 0px 40px',
    padding: theme.spacing(6, 14),
    zIndex: '1',
  },
  image: {
    position: 'absolute',
    height: '50%',
    top: '-19%',
    left: '76%',
  },
  desc: {
    marginTop: theme.spacing(2),
    fontSize: '20px',
    color: theme.palette.black.main,
    lineHeight: '160%',
    marginBottom: theme.spacing(3),
    width: '44%',
  },
  subDesc: {
    fontWeight: '700',
    fontSize: '14px',
    color: theme.palette.graylight.main,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  resultInnerWrapper: {
    position: 'relative',
    height: '890px',
  },
  needHelpContainer: {
    background: theme.palette.primary.main,
    position: 'absolute',
    left: '0',
    top: '34%',
    display: 'flex',
    width: '100%',
    paddingTop: '244px',
    minHeight: '100px',
    justifyContent: 'center',
    paddingBottom: '100px',
  },
  needHelpTitle: {
    fontWeight: '800',
    color: theme.palette.white.main,
  },
  testinomyContainer: {
    padding: theme.spacing(0, 6),
    borderLeft: `1px solid ${theme.palette.white.main}`,
    marginLeft: theme.spacing(6),
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
  scheduleCall: {
    background: 'none',
    border: `1px solid ${theme.palette.white.main}`,
    marginTop: theme.spacing(3),
    color: theme.palette.white.main,
  },
}));

type TProps = { value: string, onReanalyze: () => void };

export const JoinFormations = ({ value, onReanalyze }: TProps) => {
  const classes = useStyles();
  const history = useHistory();
  const handleReanalyze = () => {
    history.push('/calculator');
    onReanalyze();
  };
  return (
    <div className={classes.resultInnerWrapper}>
      <div className={classes.card}>
        <div data-testid="txt-result-sub-heading" className={classes.desc}>
          Based on your inputs, you can likely add {value} to your household
          income every year by getting your financials in order and following
          our recommendations.
        </div>
        <div className={classes.desc}>Getting excited?</div>
        <Button
          type="button"
          size="medium"
          variant="contained"
          color="secondary"
        >
          <Link to={Routes.SIGNUP}> JOIN FORMATIONS NOW </Link>
        </Button>
        <div className={classes.subDesc}>
          Think something went wrong with the results of your calculation?
        </div>
        <Button
          color="secondary"
          onClick={handleReanalyze}
        >
          Re-Analyze
        </Button>
        <img src={image} className={classes.image} alt="result" />
      </div>
      <div className={classes.needHelpContainer}>
        <div className={classes.container}>
          <div style={{ width: '50%' }}>
            <Typography
              variant="h3"
              className={classes.needHelpTitle}
              component="h3"
            >
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
              >
                Schedule A Call
              </a>
            </Button>
          </div>
          <div className={classes.testinomyContainer}>
            <div className={classes.testinomyText}>
            &quot;Formations helped me to get my books in order. Thanks to them, I
              was able to save $14,000 on my taxes!&quot;
            </div>
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
  );
};
