import React, { useEffect, useState } from 'react';
import { useCurrentUser } from 'hooks/api';
import { useBankAccounts } from 'hooks/api/useBankAccount';
import useBankAccountForDashboard from 'hooks/dataFormatters/useBankAccountForDashboard';
import { Alert, AlertTitle, Grid, Typography } from '@mui/material';
import { BankAccountsList } from 'components/bookkeeping';
import { PageTitle } from 'components/common/PageTitle';
import { makeStyles } from '@mui/styles';
import { Loading } from 'components/common/Loading';

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(4, 0),
    fontWeight: 'bold',
  },
  subTitle: {
    ...theme.typography.h6B,
    color: theme.palette.primary.main,
  },
  content: {
    flexGrow: 1,
    padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentLoading: {
    display: 'flex',
    minHeight: '100vh',
  },
}));

export const BankAccountView = () => {
  const [error, setError] = useState<Error | null>(null);
  const classes = useStyles();
  const { currentUser } = useCurrentUser();
  const {
    connections: rawAccounts,
    error: bankAccountError,
    isLoading: connectionsLoading,
    isFetching: connectionsFetching,
  } = useBankAccounts(currentUser?.accountId);
  const bankAccounts = useBankAccountForDashboard(rawAccounts);

  useEffect(() => {
    if (bankAccountError != null) {
      setError(bankAccountError);
    } else {
      setError(null);
    }
  }, [bankAccountError]);

  const canRenderAccounts =
    currentUser && currentUser.accountId && bankAccountError == null;

  // display view
  let view = null;
  if (error != null) {
    view = (
      <Alert severity="error" data-testid="bank-account-error">
        <AlertTitle>Error</AlertTitle>
        There is problem fetching bank accounts:
        <br />
        <strong>{error?.message}</strong>
      </Alert>
    );
  } else if (canRenderAccounts) {
    view = (
      <BankAccountsList
        accountId={currentUser?.accountId!}
        bankAccounts={bankAccounts}
      />
    );
  }
  const fullName = [currentUser?.name?.first, currentUser?.name?.last].join(
    ' ',
  );

  return (
    <main className={classes.content}>
      <div>
        <PageTitle variant="h1" component="h1">
          Hi {fullName}!
        </PageTitle>
        <Grid
          container
          direction="row"
          spacing={0}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Grid item>
            <Typography
              variant="h4"
              component="h4"
              className={classes.subTitle}
            >
              Bank account connections
            </Typography>
          </Grid>
        </Grid>
      </div>
      {(connectionsLoading || connectionsFetching) && <Loading />}
      {view}
    </main>
  );
};
