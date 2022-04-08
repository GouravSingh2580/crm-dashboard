import { Link, useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Routes } from '../../../../fnRoutes';

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.secondary.lighter,
    marginTop: theme.spacing(3),
    padding: theme.spacing(4, 2),
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
}));

type TProps = { value: string; onReanalyze: () => void };

export const JoinFormations = ({ value, onReanalyze }: TProps) => {
  const classes = useStyles();
  const history = useHistory();

  const handleReanalyze = () => {
    history.push('/calculator');
    onReanalyze();
  };
  return (
    <div className={classes.container}>
      <div data-testid="txt-result-sub-heading" className={classes.desc}>
        Based on your inputs, you can likely add {value} to your household
        income every year by getting your financials in order and following our
        recommendations.
      </div>
      <div className={classes.desc}>Getting excited?</div>
      <Button type="button" size="medium" variant="contained" color="secondary">
        <Link to={Routes.SIGNUP}> JOIN FORMATIONS NOW </Link>
      </Button>
      <div className={classes.subDesc}>
        Think something went wrong with your calculation?
      </div>
      <Button color="secondary" onClick={handleReanalyze}>
        Re-Calculate
      </Button>
    </div>
  );
};
