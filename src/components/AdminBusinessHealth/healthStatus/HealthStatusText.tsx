import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { IconStatusType } from 'models/insight';
import { HealthTypeIcon } from 'components/AdminBusinessHealth';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    height: theme.spacing(5),
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 2),
    gap: theme.spacing(1),
    width: 'fit-content',
  },
}));

interface Props {
  healthText: string;
  status: IconStatusType;
}

export const HealthStatusText = (props: Props) => {
  const { status, healthText } = props;
  const classes = useStyles();
  const colorMap = {
    red: {
      color: '#E81C0D',
      backgroundColor: '#fbe2e1',
    },
    yellow: {
      color: '#FF9800',
      backgroundColor: '#FFF1C6',
    },
    green: {
      backgroundColor: '#e4f0e8',
      color: '#317E4F',
    },
  };

  return (
    <div className={classes.container} style={colorMap[status]}>
      <HealthTypeIcon status={status} />
      <Typography variant="body2S">{healthText}</Typography>
    </div>
  );
};
