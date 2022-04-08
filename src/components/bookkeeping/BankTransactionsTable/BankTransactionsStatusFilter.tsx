import makeStyles from '@mui/styles/makeStyles';
import { Button } from '@mui/material';
import cx from 'clsx';

interface Types {
  label: string;
  count: number;
}

interface Metadata {
  total: number;
  types: Array<Types>;
}

interface Props {
  metaData: Metadata;
  activeName: string;
  onChange: (name: string) => void;
}

interface Filter {
  name: string;
  count: number;
  activeName: string;
  onChange: (name: string) => void;
}

const useStyles = makeStyles((theme) => ({
  statusFilter: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  statusFilterItem: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    cursor: 'pointer',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    fontWeight: 'bold',
    padding: theme.spacing(0, 2),
    marginRight: theme.spacing(4),
    color: 'rgba(0, 0, 0, 0.54)',
  },
  statusFilterItemTextContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  activeStatusFilter: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: '#317E4F',
  },
  statusFilterItemCount: {
    borderRadius: 10,
    padding: theme.spacing(0, 1),
    height: 25,
    width: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(49, 126, 79, 0.08)',
    color: '#3B965E',
    marginLeft: 16,
  },
}));

const FilterItem = ({ name, count, activeName, onChange }: Filter) => {
  const classes = useStyles();
  const isActive = activeName === name;

  return (
    <Button
      className={cx(
        classes.statusFilterItem,
        isActive ? classes.activeStatusFilter : {},
      )}
      onClick={() => onChange(name)}
      data-testid={`status-filter-${name}`}
    >
      <div className={classes.statusFilterItemTextContainer}>
        <div>{name}</div>
        <div className={cx(classes.statusFilterItemCount)}>{count}</div>
      </div>
    </Button>
  );
};

const BankTransactionsStatusFilter = ({
  metaData,
  activeName,
  onChange,
}: Props) => {
  const classes = useStyles();
  const { total, types } = metaData;

  const uncategorized =
    types.find((item) => item.label === 'UNCATEGORIZED')?.count ?? 0;
  const categorized =
    types.find((item) => item.label === 'CATEGORIZED')?.count ?? 0;

  return (
    <div className={classes.statusFilter}>
      <FilterItem
        count={uncategorized}
        name="Uncategorized"
        activeName={activeName}
        onChange={onChange}
      />
      <FilterItem
        name="Categorized by Customer"
        count={categorized}
        activeName={activeName}
        onChange={onChange}
      />
      <FilterItem
        name="All Transactions"
        count={total}
        activeName={activeName}
        onChange={onChange}
      />
    </div>
  );
};

export default BankTransactionsStatusFilter;
