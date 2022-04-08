import { makeStyles } from '@mui/styles';
import { Theme, Typography } from '@mui/material';
import { MAIN_COLOR } from 'theme/constant';
import { numberFormat } from 'helpers/currencyFormat';
import { IProfitMetric } from './profitMetrics';

interface IProps {
  metric: IProfitMetric;
}

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    border: `1px solid ${theme.palette.others.stroke}`,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  metricHeader: {
    color: theme.palette.primary.border,
  },
  metricAmount: {
    color: MAIN_COLOR,
  },
}));

export const ProfitMetricBox = ({ metric }: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.box}>
      <Typography variant="body2S" className={classes.metricHeader} pb={1}>
        {metric.name}
      </Typography>
      <Typography variant="h8B" className={classes.metricAmount}>
        {numberFormat(metric.amount)}
      </Typography>
    </div>
  );
};
