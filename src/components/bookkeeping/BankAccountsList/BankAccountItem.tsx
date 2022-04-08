import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import { useBankReconnectAction } from 'hooks/api/useBankReconnectDialog';
import { IconText } from 'components/common/IconText';
import UpdateIcon from '@mui/icons-material/Update';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { getPrettyDateTime } from 'helpers/dateTimeFormat';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import React, { useEffect } from 'react';
import { IBank } from 'hooks/dataFormatters/useBankAccountForDashboard';
import { makeStyles } from '@mui/styles';
import { useBookkeepingState } from 'states/bookkeeping';
import { useBankAccounts } from 'hooks/api/useBankAccount';
import { showErrorToast, showSuccessToast } from 'components/toast/showToast';
import { AccountItem } from './AccountItem';

interface Props {
  accountId: string;
  bankAccount: IBank;
  onDelete: (bank: IBank) => void;
}

const useStyles = makeStyles((theme) => ({
  box: {
    border: '1px solid rgba(13, 34, 89, 0.23)',
    borderRadius: '5px',
    boxShadow: 'none',
    padding: `${theme.spacing(3)} ${theme.spacing(3)} 0 ${theme.spacing(3)}`,
  },
  heading: {
    ...theme.typography.h5B,
  },
  status: {
    display: 'flex',
  },
  statusText: {
    color: theme.palette.secondary.contrastText,
  },
}));

export const BankAccountItem = ({
  accountId,
  bankAccount,
  onDelete,
}: Props) => {
  const classes = useStyles();
  const { isBookkeeper } = useBookkeepingState();
  const { refresh } = useBankAccounts(accountId);
  const { bankId, errorMsg, name, updatedAt, accounts } = bankAccount;

  const emptyStateAccounts = (
    <ListItem>
      <Box sx={{ flex: 1 }}>
        <Typography component="p" sx={{ textAlign: 'center' }}>
          Please refresh the page to view the bank accounts. 
          It might take few minutes to retrieve and list the accounts.
        </Typography>
        <Typography component="p" sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" onClick={refresh}>
            Refresh
          </Button>
        </Typography>
      </Box>
    </ListItem>
  );

  useEffect(() => {
    if (errorMsg) {
      showErrorToast(errorMsg, 'Reconnect your bank');
    }
  }, [errorMsg]);

  const { open, ready } = useBankReconnectAction({
    accountId,
    connectionId: bankId,
    onSuccess: () => {
      showSuccessToast('You bank has been reconnected');
    },
  });

  return (
    <Box marginTop={2} key={bankId}>
      <Paper className={classes.box}>
        <Box pb={2}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item>
              <Typography variant="h4">{name}</Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <IconText
                    icon={<UpdateIcon />}
                    content={
                      updatedAt &&
                      `Last updated: ${getPrettyDateTime(updatedAt)}`
                    }
                    textProps={{ className: classes.statusText }}
                  />
                </Grid>
                <Grid item>
                  {errorMsg !== '' ? (
                    ready && (
                      <IconText
                        icon={<LinkOffIcon />}
                        content="Reconnect you bank"
                        textProps={{ className: classes.statusText }}
                        onClick={open as () => void}
                        rootProps={{ 'data-testid': 'reconnect-button' }}
                      />
                    )
                  ) : (
                    <IconText
                      icon={<LinkIcon />}
                      content="Bank connected"
                      textProps={{ className: classes.statusText }}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              {!isBookkeeper && (
                <IconButton
                  data-testid="delete-connection"
                  aria-label="delete"
                  onClick={() => onDelete(bankAccount)}
                  size="large"
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <List data-testid="bank-account-table">
          {accounts?.length === 0
            ? emptyStateAccounts
            : accounts.map((account, index) => (
                <AccountItem
                  key={account.id}
                  accountId={accountId}
                  account={account}
                  divider={index < accounts.length - 1}
                />
              ))}
        </List>
      </Paper>
    </Box>
  );
};
