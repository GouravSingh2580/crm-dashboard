import { useState } from 'react';
import { Grid, Paper, Button, Skeleton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { numberFormat } from 'helpers/currencyFormat';
import { ConfirmModal } from '../common/modals';
import { useSubscription } from '../../hooks';
import { Title } from './Title';

const useStyles = makeStyles((theme: any) => ({
  container: {
    padding: theme.spacing(4),
  },
  form: {
    paddingTop: theme.spacing(6),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  textContainer: {
    backgroundColor: theme.palette.primary.background,
    padding: theme.spacing(2, 3),
    display: 'flex',
    marginBottom: theme.spacing(3),
  },
  label1: {
    ...theme.typography.h6B,
  },
  label2: {
    ...theme.typography.h6B,
    fontWeight: 400,
  },
}));

export const CurrentPackage = () => {
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);

  const { data, status } = useSubscription.GetSubscriptionStatus();

  return (
    <>
      <ConfirmModal
        open={showModal}
        question="You will be redirected to new tab to request a change to your current package."
        yesText="Let’s go!"
        noText="Cancel"
        onSave={() => {
          /** do nothing * */
        }}
        onClose={() => setShowModal(false)}
        showIcon={false}
        isYesAsLink
        yesHref="https://learn.formationscorp.com/kb-tickets/new"
      />
      <Paper className={classes.container}>
        <Title text="Current Package" />
        {status === 'loading' && (
          <div className={classes.form}>
            <Skeleton height="80px" />
          </div>
        )}
        {status === 'success' && (
          <div className={classes.form}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={classes.textContainer}
            >
              <span className={classes.label2}>{data?.planName}</span>
              <span>
                <span className={classes.label1}>
                  {data?.price?.amount
                    ? numberFormat(data?.price?.amount)
                    : null}
                </span>
                <span className={classes.label2}> / mo</span>
              </span>
            </Grid>
            <Button
              variant="outlined"
              size="large"
              color="secondary"
              onClick={() => setShowModal(true)}
            >
              Change Package
            </Button>
          </div>
        )}
      </Paper>
    </>
  );
};

export default CurrentPackage;
