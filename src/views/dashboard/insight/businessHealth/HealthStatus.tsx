import { ReactNode } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { MAIN_COLOR } from 'theme/constant';
import { IconStatusType } from 'models/insight';
import { StatusIcon } from './StatusIcon';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  healthStatusContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: theme.spacing(6),
    minWidth: theme.spacing(6),
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: MAIN_COLOR,
    opacity: '0.59',
  },
  description: {
    color: MAIN_COLOR,
  },
}));

interface IHealthStatus {
  showIcon?: boolean;
  status?: IconStatusType;
  title: string | ReactNode;
  description: string;
}

export const HealthStatus = (props: IHealthStatus) => {
  const { showIcon = true, status = 'green', title, description } = props;
  const classes = useStyles();

  return (
    <div className={classes.healthStatusContainer}>
      <div className={classes.iconContainer}>
        {showIcon && <StatusIcon status={status} />}
      </div>
      <div className={classes.textContainer}>
        <Typography variant="inputLabel" className={classes.title}>
          {title}
        </Typography>
        <Typography variant="helperText" className={classes.description}>
          {description}
        </Typography>
      </div>
    </div>
  );
};
