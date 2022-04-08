import { useCurrentAccount } from 'hooks/api';
import { makeStyles } from '@mui/styles';
import { Theme, Typography, Grid } from '@mui/material';
import { MAIN_COLOR } from 'theme/constant';
import { Insights } from 'models/account';
import { profitMetrics, IProfitMetric } from './profitMetrics';
import { ProfitMetricBox } from './ProfitMetricBox';

const useStyles = makeStyles((theme: Theme) => ({
  profitMetricsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  profitMetricsHeader: {
    color: MAIN_COLOR,
  },
  netIncome: {
    ...theme.typography.helperText,
    color: theme.palette.primary.border,
  },
}));

export const FinancialOverview = () => {
  const { currentAccount } = useCurrentAccount();

  const classes = useStyles();
  const dateRange = `${new Date().getFullYear()} year-to-date`;
  const netIncomeFormula = 'Net Income = Total Revenue – Expenses';
  let ytdIncomeExpense;
  let profitMetricsList = [];
  if (currentAccount && currentAccount?.insights) {
    profitMetricsList = profitMetrics.map((item: IProfitMetric) => {
      const amount = 
        (currentAccount?.insights as Insights)[item.key];
      return {
        ...item,
        amount
      }
    });
    ytdIncomeExpense = profitMetricsList.map((metric: IProfitMetric) => (
      <Grid item md={6} key={metric.key}>
        <ProfitMetricBox metric={metric} />
      </Grid>
    ));
  }

  return (
    <div className={classes.profitMetricsContainer}>
      <div className={classes.profitMetricsHeader}>
        <Typography display="inline" variant="body1B">
          Financial Overview
        </Typography>
        &nbsp;&#8212;&nbsp;
        <Typography display="inline" variant="body1S" data-testid="date-range">
          {dateRange}
        </Typography>
      </div>
      <div className={classes.netIncome}>{netIncomeFormula}</div>
      {ytdIncomeExpense && (
        <Grid container direction="row" spacing={2}>
          {ytdIncomeExpense}
        </Grid>
      )}
    </div>
  );
};
