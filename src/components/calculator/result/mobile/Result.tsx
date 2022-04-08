import makeStyles from '@mui/styles/makeStyles';
import {
  numberFormat as commaSeparated,
  roundOffToNearest100,
} from 'helpers/currencyFormat';
import { Upper } from './Upper';
import { JoinFormations } from './JoinFormations';
import { NeedHelp } from './NeedHelp';
import { Scorp } from './Scorp';

const useStyles = makeStyles(() => ({
  resultWrapper: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
}));

type TProps = {
  onReanalyze: () => void,
  report: {
    point: number,
    recommendation: string[],
    savingsCalculationEnd: number,
    savingsCalculationDiapason: string,
    redirect: boolean,
  },
  results: object
};

export const Result = ({ onReanalyze, report, results }: TProps) => {
  const savingsCalculationDiapason = `${commaSeparated(
    roundOffToNearest100(Number(report.savingsCalculationDiapason.split('-')[0])),
  )} - ${commaSeparated(
    roundOffToNearest100(Number(report.savingsCalculationDiapason.split('-')[1])),
  )}`;

  const classes = useStyles();
  return (
    <div className={classes.resultWrapper}>
      <Upper
        value={commaSeparated(
          roundOffToNearest100(report.savingsCalculationEnd),
        )}
      />
      <JoinFormations
        value={savingsCalculationDiapason}
        onReanalyze={onReanalyze}
      />
      <NeedHelp />
      <Scorp results={results}/>
    </div>
  );
};
