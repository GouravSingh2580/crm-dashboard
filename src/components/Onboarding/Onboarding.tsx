import { ReactComponent as Logo } from 'icons/logo-text.svg';
import { makeStyles } from '@mui/styles';
import { useParams } from 'react-router-dom';
import { BusinessType } from './BusinessType'
import { IncorporationStatus } from './IncorporationStatus';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(3)} ${theme.spacing(2)}`,
  },
  [theme.breakpoints.up('md')]: {
    root: {
      margin: `${theme.spacing(12)} ${theme.spacing(10)}`,
    },
  }
}));

export const Onboarding = () => {
  const classes = useStyles();
  const { id } = useParams<{id: string}>();
  return (
    <div className={classes.root}>
      <Logo height="21px" width="150px"/>
      {id === 'business-type' && <BusinessType/>}
      {id === 'incorporation-status' &&<IncorporationStatus />}
    </div>
  );
};
