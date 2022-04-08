import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { IconStatusType } from 'models/insight';

import { MAIN_COLOR } from 'theme/constant';
import { StatusIcon } from './StatusIcon';

const useStyles = makeStyles((theme) => ({
  bankStatusContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
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

interface IBankStatus {
  status?: IconStatusType;
  title: string;
  description: string;
}

export const BankStatus = (props: IBankStatus) => {
  const { status = 'green', title, description } = props;
  const classes = useStyles();
  const bankArray = description.split(',');

  return (
    <div className={classes.bankStatusContainer}>
      <div className={classes.statusContainer}>
        <div className={classes.iconContainer} />
        <Typography variant="inputLabel" className={classes.title}>
          {title}
        </Typography>
      </div>
      {bankArray.map((bank: string) => (
        <div key={bank} className={classes.statusContainer}>
          <div className={classes.iconContainer}>
            <StatusIcon status={status} />
          </div>
          <Typography variant="helperText" className={classes.description}>
            {bank}
          </Typography>
        </div>
      ))}
    </div>
  );
};
