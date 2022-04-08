import {
  Button,
  Collapse,
  Grid,
  ListItem,
  ListItemProps,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import { IBankAccount } from 'hooks/dataFormatters/useBankAccountForDashboard';
import { useBookkeepingState } from 'states/bookkeeping';
import { useBankAccountEnabling } from 'hooks/api/useBankAccount';
import { bookkeepingEvent } from 'helpers/heap';
import { showToastOnError, showWarningToast } from 'components/toast/showToast';
import { queryClient } from 'states/reactQueryClient';
import { withStyles } from '@mui/styles';
import { useCallback, useState } from 'react';
import { Alert } from '@mui/lab';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { TransitionGroup } from 'react-transition-group';
import { DisableImportModal } from './DisableImportModal';

interface ConfimProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
const ConfirmBox = ({ isOpen, onCancel, onConfirm }: ConfimProps) => (
  <TransitionGroup>
    {isOpen
      && (
      <Collapse>
        <Grid item>
          <Alert
            icon={<WarningAmberIcon />}
            severity="warning"
            variant="outlined"
          >
            Import your transactions automatically helps keep your
            bookkeeping up to date. Are you sure you want to turn this off?
          </Alert>
          <Grid container justifyContent="flex-end" sx={{ pt: 1, pb: 1 }} spacing={2}>
            <Grid item><Button variant="text" onClick={onConfirm}>Turn off</Button></Grid>
            <Grid item><Button variant="contained" onClick={onCancel}>Keep on</Button></Grid>
          </Grid>
        </Grid>
      </Collapse>
      )}
  </TransitionGroup>
);

interface Props extends ListItemProps {
  accountId: string;
  account: IBankAccount;
}

const AccountItemText = withStyles((theme) => ({
  primary: {
    ...theme.typography.body1B,
    color: theme.palette.text.secondary,
  },
  secondary: {
    ...theme.typography.body2,
    color: theme.palette.text.primary,
  },
}))(ListItemText);

const useDisableFlow = () => {
  const [turnOffConfirmOpen, setTurnOffConfirmOpen] = useState<boolean>(false);
  const [keepDataConfirmOpen, setKeepDataConfirmOpen] = useState<boolean>(false);
  const closeConfirm = useCallback(() => {
    setKeepDataConfirmOpen(false);
    setTurnOffConfirmOpen(false);
  }, []);
  const confirmTurnOff = useCallback(() => {
    setKeepDataConfirmOpen(true);
  }, []);
  const startConfirm = useCallback(() => setTurnOffConfirmOpen(true), []);
  return {
    turnOffConfirmOpen,
    keepDataConfirmOpen,
    closeConfirm,
    confirmTurnOff,
    startConfirm,
  };
};

export const AccountItem = ({
  accountId, account, ...rest
}: Props) => {
  const { name, subtype } = account;
  const {
    turnOffConfirmOpen,
    keepDataConfirmOpen,
    closeConfirm,
    startConfirm,
  } = useDisableFlow();
  const { isBookkeeper } = useBookkeepingState();
  const { setBankAccountEnabling, isLoading } = useBankAccountEnabling({
    accountId: account.accountId,
    bankAccountId: account.id,
  }, {
    onSuccess: () => {
      // send heap custom event to record the toggle
      bookkeepingEvent.sendBankAccountToggle({ ...account, isConnected: !account.isConnected });
    },
  });

  // event
  const handleChange = async () => {
    try {
      await setBankAccountEnabling(!account.isConnected);
      if (account.isConnected) {
        showWarningToast('Transaction from this bank account will not be imported');
      }
      await queryClient.invalidateQueries(['connections', accountId]);
      await queryClient.invalidateQueries(['bankAccounts', accountId]);
    } catch (e: unknown) {
      showToastOnError(e);
    } finally {
      closeConfirm();
    }
  };
  const handleTurnOff = (keepData: boolean) => {
    // TODO: update with backend
    console.log('keep data', keepData);
    return handleChange();
  };
  const toggleSwitch = () => {
    if (account.isConnected) {
      startConfirm();
      return Promise.resolve();
    }
    return handleChange();
  };

  return (
    <ListItem disableGutters {...rest}>
      <Grid container direction="column">
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item>
            <AccountItemText
              primary={name}
              secondary={subtype}
            />
          </Grid>
          <Grid item>
            <Switch
              color="secondary"
              checked={account.isConnected}
              onChange={toggleSwitch}
              disabled={isLoading || isBookkeeper}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography component="span" sx={{ fontSize: '13px' }}>
              Automatically import transactions
            </Typography>
          </Grid>
        </Grid>
        <ConfirmBox
          isOpen={turnOffConfirmOpen}
          onCancel={closeConfirm}
          onConfirm={handleChange}
        />
      </Grid>
      <DisableImportModal
        open={keepDataConfirmOpen}
        onClose={closeConfirm}
        onConfirm={handleTurnOff}
      />
    </ListItem>
  );
};
