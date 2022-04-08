import { useMemo } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';

import { MAIN_COLOR } from 'theme/constant';
import { getGenericHealth, HEALTH_SCORE_MAPPING } from 'helpers/businessHealth';
import { IAccount } from 'models/account';
import { Company } from 'models/company';

const useStyles = makeStyles((theme) => ({
  healthIconContainer: {
    width: 335,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthIcon: {
    width: 160,
    marginBottom: theme.spacing(1),
  },
  date: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    bottom: theme.spacing(-0.5),
    width: 200,
  },
  status: {
    marginBottom: theme.spacing(4.5),
    width: 90,
    textAlign: 'center',
  },
  statusWarming: {
    marginBottom: theme.spacing(3),
    width: 90,
    textAlign: 'center',
    color: theme.palette.error.dark,
  },
  dateMonth: {
    marginBottom: theme.spacing(0.5),
    color: MAIN_COLOR,
  },
  dateYear: {
    color: MAIN_COLOR,
    opacity: 0.7,
  },
}));

interface IHealthGraphProps {
  companyData?: Company;
  accountData?: IAccount;
}

export const HealthGraph = (props: IHealthGraphProps) => {
  const { companyData, accountData } = props;
  const classes = useStyles();

  const { imageSrc, healthText, score } = useMemo(
    () => getGenericHealth(accountData, companyData),
    [accountData, companyData],
  );

  const healthTextClass =
    score < HEALTH_SCORE_MAPPING.fair ? classes.statusWarming : classes.status;

  return (
    <div className={classes.healthIconContainer}>
      <img className={classes.healthIcon} src={imageSrc} alt="incorporation" />
      <div className={classes.date}>
        <Typography variant="body3B" className={healthTextClass}>
          {healthText}
        </Typography>
        <Typography variant="body3B" className={classes.dateMonth}>
          {moment().format('MMM')}
        </Typography>
        <Typography variant="tooltip" className={classes.dateYear}>
          {moment().format('YYYY')}
        </Typography>
      </div>
    </div>
  );
};
