import React, { ReactNode } from 'react';
import { usePlaidLinkToken } from 'hooks/api/useBankAccount';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { ReactComponent as BankIcon } from 'icons/bank_connection.svg';
import { makeStyles } from '@mui/styles';
import { ConnectionButton } from 'components/bookkeeping/ConnectionButton';
import { Alert } from '@mui/lab';
import {
  Stage,
  useStore,
} from 'components/bookkeeping/bankAccountStages/state';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'flexStart',
    width: '688px',
    marginTop: theme.spacing(8),
  },
  box: {
    padding: theme.spacing(5),
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(13, 34, 89, 0.23)',
    boxShadow: 'none',
  },
  heading: {
    color: theme.palette.text.primary,
  },
  paragraph: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  icon: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

interface ISetupProps {
  notification?: ReactNode;
  button?: ReactNode;
  heading: ReactNode;
  content: ReactNode;
}
export const SetupBox = ({
  heading,
  content,
  notification,
  button,
}: ISetupProps) => {
  const classes = useStyles();
  return (
    <Grid className={classes.container}>
      <Paper className={classes.box}>
        {notification}
        <Typography variant="h6B" component="h3" className={classes.heading}>
          {heading}
        </Typography>
        <Typography
          variant="body2"
          component="div"
          className={classes.paragraph}
        >
          {content}
        </Typography>
        <Box className={classes.icon}>
          <BankIcon />
        </Box>
        {button}
      </Paper>
    </Grid>
  );
};
SetupBox.defaultProps = {
  notification: null,
  button: null,
};

interface Props {
  accountId: string | undefined;
}
export const BankAccountSetup = ({ accountId }: Props) => {
  const { data: plaidToken, error: linkTokenError } =
    usePlaidLinkToken(accountId);
  const setStage = useStore((state) => state.setStage);

  return (
    <SetupBox
      notification={
        linkTokenError && (
          <Alert severity="error">{linkTokenError.message}</Alert>
        )
      }
      heading="You haven't connected your bank account yet."
      content={
        <>
          <p>
            You can connect your bank securely in seconds and start import
            transactions for your bookkeeping.
          </p>
          <p>
            If you don&apos;t find your bank in the list, please reach your
            Customer Success Manager.
          </p>
        </>
      }
      button={
        plaidToken &&
        accountId && (
          <ConnectionButton
            linkToken={plaidToken}
            accountId={accountId}
            onConnected={() => setStage(Stage.Loading)}
            disabled={false}
            color="primary"
          />
        )
      }
    />
  );
};
