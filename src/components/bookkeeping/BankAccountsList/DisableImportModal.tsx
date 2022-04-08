import { Collapse, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { YesNoModal } from 'components/common/modals';
import { useState } from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Alert } from '@mui/lab';
import { TransitionGroup } from 'react-transition-group';

interface Props {
  onClose: () => void;
  onConfirm: (keepData: boolean) => void;
  open: boolean;
}

export const DisableImportModal = ({ onConfirm, onClose, open }: Props) => {
  const [keepData, setKeepData] = useState<boolean>(true);
  const handleConfirm = () => {
    onConfirm(keepData);
  };
  return (
    <YesNoModal
      open={open}
      heading="Do you want to keep the transactions already imported?"
      okText="Confirm"
      onSave={handleConfirm}
      onClose={onClose}
      size="md"
      okButtonColor="primary"
    >
      <RadioGroup onChange={(event) => setKeepData(event.target.value === '1')}>
        <FormControlLabel
          value="1"
          checked={keepData}
          control={<Radio />}
          label="Yes, keep my imported transactions"
        />
        <FormControlLabel
          value="0"
          checked={!keepData}
          control={<Radio />}
          label="No, delete my imported transactions"
        />
      </RadioGroup>
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
        )}
      </TransitionGroup>
    </YesNoModal>
  );
};
