import { Switch, Divider, Typography, FormControlLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { HealthStatusSection } from 'components/AdminBusinessHealth';
import { getPayRollStatus } from 'helpers/businessHealth';
import { Spacer } from 'components/Spacer';
import { IAccount } from 'models/account';

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  title: {
    color: theme.palette.text.primary,
    opacity: 0.7,
  },
  statusText: {
    color: theme.palette.text.primary,
  },
  editButton: {
    color: theme.palette.text.primary,
    opacity: 0.7,
    fontSize: 14,
    padding: 0,
  },
  editActionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

interface Props {
  accountData: IAccount;
  updateAccountData: (fieldName: string, newStatus: boolean) => void;
}

export const Payroll = (props: Props) => {
  const classes = useStyles();
  const { accountData, updateAccountData } = props;

  const status = getPayRollStatus(accountData.payrollEnabled);

  const numberOfPayrollRun = accountData.payrollEnabled
    ? accountData.payrollRunNumber
    : 'N/A';

  const onAutoPilotToggle = (newStatus: boolean) => {
    updateAccountData('payrollEnabled', newStatus);
  };

  return (
    <HealthStatusSection title="Payroll" status={status}>
      <div className={classes.titleContainer}>
        <Typography variant="body3S" className={classes.title}>
          Enable payroll autopilot
        </Typography>
      </div>
      <FormControlLabel
        checked={accountData.payrollEnabled}
        onChange={(event, checked) => onAutoPilotToggle(checked)}
        control={<Switch />}
        label="Autopilot by Gusto"
        data-testid="field-payroll-enabled"
      />
      <Spacer height={2} />
      <Divider />
      <Spacer height={2} />
      <div className={classes.titleContainer}>
        <Typography variant="body3S" className={classes.title}>
          Number of payroll run
        </Typography>
      </div>
      <Typography variant="body2B" className={classes.statusText} data-testid="number-payroll-run">
        {numberOfPayrollRun}
      </Typography>
    </HealthStatusSection>
  );
};
