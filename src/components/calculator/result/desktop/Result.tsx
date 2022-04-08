import makeStyles from '@mui/styles/makeStyles';
import {
  numberFormat as commaSeparated,
  roundOffToNearest100,
} from 'helpers/currencyFormat';
import { Header } from './Header';
import { JoinFormations } from './JoinFormations';
import { Scorp } from './Scorp';

const useStyles = makeStyles((theme) => ({
  resultWrapper: {
    paddingTop: theme.spacing(10),
    height: '100%',
  },
}));

interface Props {
  onReanalyze: () => void;
  report: {
    point: number,
    recommendation: string[],
    savingsCalculationEnd: number,
    savingsCalculationDiapason: string,
    redirect: boolean,
  },
  results: object
}

export const Result = ({ onReanalyze, report, results }: Props) => {
  const classes = useStyles();

  const savingsCalculationDiapason = `${commaSeparated(
    roundOffToNearest100(Number(report.savingsCalculationDiapason.split('-')[0])),
  )} - ${commaSeparated(
    roundOffToNearest100(Number(report.savingsCalculationDiapason.split('-')[1])),
  )}`;

  return (
    <div className={classes.resultWrapper}>
      <Header
        value={commaSeparated(
          roundOffToNearest100(report.savingsCalculationEnd),
        )}
      />
      <JoinFormations
        value={savingsCalculationDiapason}
        onReanalyze={onReanalyze}
      />
      <Scorp results={results} />
    </div>
  );
};
