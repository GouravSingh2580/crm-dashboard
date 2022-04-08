import React, { ReactNode, useEffect } from 'react';
import { FLAGS, withFeatureFlag } from 'hooks/useFeatureFlag';
import { useBankAccounts } from 'hooks/api/useBankAccount';
import { useCurrentUser } from 'hooks/api';
import { makeStyles } from '@mui/styles';
import {
  BankAccountLoading,
  BankAccountSetup,
  BankAccountView,
  useStore,
} from 'components/bookkeeping/bankAccountStages';
import { PageTitle } from 'components/common/PageTitle';
import { Stage } from 'components/bookkeeping/bankAccountStages/state';
import { Alert } from '@mui/lab';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  centeredContent: {
    flexGrow: 1,
    height: `calc(100vh - ${theme.spacing(6)})`,
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const BankAccountPageUI = () => {
  const classes = useStyles();
  const {
    currentUser,
    isLoading: getUserLoading,
  } = useCurrentUser();
  const {
    connections: rawAccounts,
    error: bankAccountError,
    isLoading: connectionsLoading,
  } = useBankAccounts(currentUser?.accountId);
  const error = bankAccountError;
  const { stage: currentStage, setStage } = useStore((state) => state);

  useEffect(() => {
    if (getUserLoading || connectionsLoading) {
      setStage(Stage.Loading);
    } else if (rawAccounts.length === 0) {
      setStage(Stage.Setup);
    } else if (bankAccountError) {
      setStage(Stage.Error);
    } else {
      setStage(Stage.BankView);
    }
  }, [getUserLoading, connectionsLoading, rawAccounts, error]);

  const fullName = [currentUser?.name?.first, currentUser?.name?.last].join(' ');
  const WrappedContainer = ({ className = classes.content, children }:
    {
      // eslint-disable-next-line react/require-default-props
      className?: string,
      children: ReactNode
    }) => (
      <main className={className}>
        <PageTitle variant="h1" component="h1">
          Hi
          {' '}
          {fullName}
          !
        </PageTitle>
        {children}
      </main>
  );

  switch (currentStage) {
    case Stage.Loading:
      return (
        <main className={classes.centeredContent}>
          <BankAccountLoading accountId={currentUser?.accountId} />
        </main>
      );
    case Stage.Setup:
      return (
        <WrappedContainer>
          <BankAccountSetup accountId={currentUser?.accountId} />
        </WrappedContainer>
      );
    case Stage.Error:
      return (
        <WrappedContainer>
          <Alert severity="error">
            {bankAccountError?.message}
          </Alert>
        </WrappedContainer>
      );
    case Stage.BankView:
    default:
      return <BankAccountView />;
  }
};

const BankAccountPage = withFeatureFlag(FLAGS.BOOKKEEPING)(BankAccountPageUI);
export default BankAccountPage;
