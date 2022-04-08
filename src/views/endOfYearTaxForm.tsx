import { Container, Typography, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useCurrentUser } from '../hooks/api';
import useTaxSurvey from '../hooks/api/useTaxSurvey';
import useLoading from '../hooks/useLoading';
import { PlainLayout } from '../layouts';
import { TaxSurvey } from '../components/taxSurvey/taxSurvey';

const useStyles = makeStyles((theme: any) => ({
  content: {
    margin: theme.spacing(4, 'auto'),
  },
  title: {
    fontWeight: 800,
    paddingBottom: theme.spacing(1),
  },
  subtitle: {
    paddingBottom: theme.spacing(2),
  },
  secondColumn: {
    paddingBottom: theme.spacing(2),
  },
}));

const EndOfYearTaxForm = () => {
  const classes = useStyles();
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const {
    data: taxSurveyData,
    isLoading: isLoadingTaxSurvey,
    isFetched: isFetchedTaxSurvey,
  } = useTaxSurvey.GetTaxSurveyDataForUser(
    currentUser ? currentUser.id : '',
  );

  const loadingAnimation = useLoading(isLoadingUser || isLoadingTaxSurvey);

  return (
    <PlainLayout>
      {loadingAnimation}
      <Container maxWidth="lg" component="main" className={classes.content}>
        <Typography variant="h4" component="h4" className={classes.title}>
          2021 Tax Survey
        </Typography>
        <Typography variant="subtitle1" className={classes.subtitle}>
          To help us project your tax liability for the end of the year, we will
          need to collect some data from you. Tax projections are estimated
          values based on input you provide, and final tax liability will
          vary based on actual income in Q4. Our goal is to get you estimations
          and a plan to achieve your tax goals, ensuring you are prepared for
          the end of the year.
        </Typography>
        <TaxSurvey
          userData={currentUser}
          taxSurveyData={taxSurveyData}
          taxSurveyDataIsFetched={isFetchedTaxSurvey}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} className={classes.secondColumn} />
          </Grid>
        </Grid>
      </Container>
    </PlainLayout>
  );
};

export default EndOfYearTaxForm;
