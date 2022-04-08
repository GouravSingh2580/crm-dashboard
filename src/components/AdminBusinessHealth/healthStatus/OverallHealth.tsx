import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { HealthStatusSection } from 'components/AdminBusinessHealth';
import { IAccount } from 'models/account';
import { Company } from 'services';
import { getGenericHealth, getStatusFromScore } from 'helpers/businessHealth';
import { Spacer } from 'components/Spacer';
import { HealthStatusText } from './HealthStatusText';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.primary,
    opacity: 0.7,
  },
}));

interface Props {
  companyData: Company;
  accountData: IAccount;
}

export const OverallHealth = (props: Props) => {
  const classes = useStyles();
  const { companyData, accountData } = props;
  const { score, healthText } = getGenericHealth(accountData, companyData, true);
  const status = getStatusFromScore(score);

  return (
    <HealthStatusSection title="Overall Health" status={status}>
      <Typography
        variant="body3S"
        className={classes.title}
      >{`This is the (${accountData.companyName}) Overall Health, right now.`}</Typography>
      <Spacer height={2} />
      <HealthStatusText healthText={healthText} status={status} />
    </HealthStatusSection>
  );
};
