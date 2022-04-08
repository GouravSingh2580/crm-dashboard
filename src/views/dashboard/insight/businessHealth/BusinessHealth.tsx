import { useMemo } from 'react';
import { Typography, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { useCurrentAccount, useCurrentCompany } from 'hooks/api';
import {
  getHealthStatusList,
  checkIncorporationRenewStatus,
  getStatusFromScore,
  checkIncorporationStatus,
  checkIncorporationStatusText,
} from 'helpers/businessHealth';
import { UIDateFormat } from 'helpers/dateTimeFormat';
import { Spacer } from 'components/Spacer';
import { HealthStatus } from './HealthStatus';
import { HealthGraph } from './HealthGraph';

const useStyles = makeStyles((theme) => ({
  healthContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 335,
  },
  healthText: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2),
  },
  spacer: {
    height: theme.spacing(2),
    width: 335,
  },
}));

export const BusinessHealth = () => {
  const classes = useStyles();
  const { currentAccount } = useCurrentAccount();
  const { currentCompany } = useCurrentCompany();

  const { incorporationDate, incorporationRenewalDate } = currentCompany || {};

  const generalHealthStatusList = useMemo(
    () => getHealthStatusList(currentAccount),
    [currentAccount],
  );

  return (
    <div className={classes.healthContainer}>
      <Typography variant="body1B" className={classes.healthText}>
        Your Formations Health
      </Typography>
      <HealthGraph accountData={currentAccount} companyData={currentCompany} />

      <Divider variant="middle" className={classes.divider} />
      <HealthStatus
        status={getStatusFromScore(
          checkIncorporationStatus(incorporationRenewalDate),
        )}
        title="Incorporation Status"
        description={checkIncorporationStatusText(incorporationRenewalDate)}
      />
      <Divider variant="middle" className={classes.divider} />
      {generalHealthStatusList.map((ghs, i) => (
        <div key={ghs.title}>
          <HealthStatus
            status={ghs.status}
            title={ghs.title}
            description={ghs.description}
          />
          {i < generalHealthStatusList.length - 1 && <Spacer height={2} />}
        </div>
      ))}
      {generalHealthStatusList.length > 0 && (
        <Divider variant="middle" className={classes.divider} />
      )}
      <HealthStatus
        title="Formation Start Date"
        description={UIDateFormat(incorporationDate || '')}
      />
      {incorporationRenewalDate && (
        <>
          <Spacer height={2} />
          <HealthStatus
            status={getStatusFromScore(
              checkIncorporationRenewStatus(incorporationRenewalDate),
            )}
            title="Incorporation Renewal Date"
            description={incorporationRenewalDate}
          />
        </>
      )}
    </div>
  );
};
