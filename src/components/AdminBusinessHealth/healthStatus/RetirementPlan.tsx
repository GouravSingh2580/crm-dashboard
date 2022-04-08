import { useState, useEffect, useMemo } from 'react';
import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { HealthStatusSection } from 'components/AdminBusinessHealth';
import { CustomerDiscussionStatus, IAccount } from 'models/account';
import { getIconStatusCustomerDiscussion, mapCustomerDiscussionStatusToString } from 'helpers/businessHealth';
import { Spacer } from 'components/Spacer';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.primary,
    opacity: 0.7,
  },
}));

interface Props {
  accountData: IAccount;
  onStatusChange: (fieldName: string, newStatus: CustomerDiscussionStatus) => void;
}

export const RetirementPlan = (props: Props) => {
  const classes = useStyles();
  const { accountData, onStatusChange } = props;
  const [status, setStatus] = useState<CustomerDiscussionStatus>('todo');

  const changeStatus = (newStatus: CustomerDiscussionStatus) => {
    onStatusChange('retirementPlan', newStatus);
    setStatus(newStatus);
  };

  useEffect(
    () => setStatus(accountData.retirementPlan),
    [accountData],
  );

  const statusScore = useMemo(
    () =>
      getIconStatusCustomerDiscussion(accountData.retirementPlan),
    [accountData],
  );


  return (
    <HealthStatusSection title="Retirement plan through business" status={statusScore}>
      <Typography variant="body3S" className={classes.title}>
        Does the customer have a Retirement Plan through business?
      </Typography>
      <Spacer height={2} />
      <RadioGroup
        onChange={(e) =>
          changeStatus(e.target.value as CustomerDiscussionStatus)
        }
      >
        <FormControlLabel
          value="yes"
          checked={status === 'yes'}
          control={<Radio />}
          label={mapCustomerDiscussionStatusToString('yes')}
        />
        <FormControlLabel
          value="decline"
          checked={status === 'decline'}
          control={<Radio />}
          label={mapCustomerDiscussionStatusToString('decline')}
        />
        <FormControlLabel
          value="todo"
          checked={status === 'todo'}
          control={<Radio />}
          label={mapCustomerDiscussionStatusToString('todo')}
        />
      </RadioGroup>
    </HealthStatusSection>
  );
};
