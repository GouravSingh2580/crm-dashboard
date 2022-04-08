import { Switch, TableCell, TableRow, Typography } from '@mui/material';
import { IBankAccount } from 'hooks/dataFormatters/useBankAccountForDashboard';
import { useBookkeepingState } from 'states/bookkeeping';
import { useBankAccountEnabling } from 'hooks/api/useBankAccount';
import { queryClient } from 'states/reactQueryClient';
import { showToastOnError, showWarningToast } from 'components/toast/showToast';
import { bookkeepingEvent } from 'helpers/heap';
import { upperFirst } from 'lodash';
import { makeStyles } from '@mui/styles';

interface Props {
  account: IBankAccount;
}

const useStyles = makeStyles((theme) => ({
  cellLeft: {
    paddingLeft: '0px',
  },
  cellRight: {
    paddingRight: '0px',
  },
  accountName: {
    ...theme.typography.body1B,
    color: theme.palette.text.secondary,
  },
  accountSub: {
    ...theme.typography.body2,
    color: theme.palette.text.primary,
  },
}));

export const BankAccountRow = ({ account }: Props) => {
  const classes = useStyles();
  const { isBookkeeper } = useBookkeepingState();
  const { accountId } = account;
  const { setBankAccountEnabling, isLoading } = useBankAccountEnabling(
    {
      accountId: account.accountId,
      bankAccountId: account.id,
    },
    {
      onSuccess: () => {
        // send heap custom event to record the toggle
        bookkeepingEvent.sendBankAccountToggle({
          ...account,
          isConnected: !account.isConnected,
        });
      },
    },
  );
  const handleChange = async () => {
    try {
      await setBankAccountEnabling(!account.isConnected);
      if (account.isConnected) {
        showWarningToast(
          'Transaction from this bank account will not be imported',
        );
      }
      await queryClient.invalidateQueries(['connections', accountId]);
      await queryClient.invalidateQueries(['bankAccounts', accountId]);
    } catch (e: unknown) {
      showToastOnError(e);
    }
  };

  return (
    <TableRow
      key={account.accountId}
      sx={{
        '&:last-child td': {
          borderBottom: '0',
        },
      }}
    >
      <TableCell className={classes.cellLeft}>
        <Typography variant="subtitle1" className={classes.accountName}>
          {account.name}
        </Typography>
        <Typography variant="body2" className={classes.accountSub}>
          {upperFirst(account.subtype)}
        </Typography>
      </TableCell>
      <TableCell align="right" className={classes.cellRight}>
        <Switch
          color="secondary"
          checked={account.isConnected}
          onChange={handleChange}
          disabled={isLoading || isBookkeeper}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        Automatically import transactions
      </TableCell>
    </TableRow>
  );
};
