import { YesNoModal } from 'components/common/modals';
import React, { useState } from 'react';
import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { Alert } from '@mui/lab';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface Props {
  name: string | undefined;
  open: boolean;
  onClose: () => void;
  onConfirm: (keepData: boolean) => void;
}
export const DeleteAccountModal = ({
  name,
  open,
  onClose,
  onConfirm,
}: Props) => {
  // TODO: remove eslint disable later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keepData] = useState<boolean>(true);
  const handleConfirm = () => {
    onConfirm(keepData);
  };
  return (
    <YesNoModal
      open={open}
      heading="Delete connection"
      okText="Confirm"
      okButtonColor="primary"
      onSave={handleConfirm}
      onClose={onClose}
      size="md"
    >
      <p>
        Are you sure you want to delete your
        {' '}
        {name}
        {' '}
        connection?
        Deleting the connection will remove all accounts.
      </p>
      <p>Note: No transactions will be imported after deleting this bank connection.</p>
      {/* TODO: enable this later
      <p>What do you want to do with your imported transactions?</p>
      <RadioGroup onChange={(event) => setKeepData(event.target.value === '1')}>
        <FormControlLabel
          value="1"
          checked={keepData}
          control={<Radio />}
          label="I want to delete this connection, but keep my transactions"
        />
        <FormControlLabel
          value="0"
          checked={!keepData}
          control={<Radio />}
          label="I want to delete this connection and my transactions"
        />
      </RadioGroup>
      */}
      <TransitionGroup>
        {!keepData && (
          <Collapse>
            <Alert
              icon={<WarningAmberIcon />}
              severity="warning"
              variant="outlined"
            >
              Deleting the imported transactions will impact your insights and bookkeeping. 
              Please confirm if you still want to delete the transactions.
            </Alert>
          </Collapse>
        )
      }
      </TransitionGroup>
    </YesNoModal>
  );
};
