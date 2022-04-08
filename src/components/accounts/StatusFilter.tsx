import makeStyles from '@mui/styles/makeStyles';
import { Button } from '@mui/material';
import cx from 'clsx';
import { AccountStatus } from 'services/account';

const useStyles = makeStyles((theme) => ({
  statusFilter: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
    color: theme.palette.white.main,
    backgroundColor: theme.palette.primary.main,
  },
  statusFilterItem: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 170,
    height: 50,
    cursor: 'pointer',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    padding: theme.spacing(0, 2),
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 0,
    borderColor: theme.palette.primary.main,
    color: theme.palette.white.main,
    backgroundColor: theme.palette.primary.main,
    opacity: 0.7,
  },
  statusFilterItemTextContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  activeStatusFilter: {
    borderBottomColor: theme.palette.secondary.main,
    opacity: 1,
  },
  statusFilterItemCount: {
    color: theme.palette.white.main,
    fontWeight: 'normal',
    borderRadius: '10px',
    padding: theme.spacing(0, 1),
  },
}));

interface FilterItemProps {
  name: string;
  count: number;
  isActive: boolean;
  value?: AccountStatus;
  onChange: (val: AccountStatus | undefined) => void;
}

const FilterItem = ({
  name,
  count,
  isActive,
  onChange,
  value,
}: FilterItemProps) => {
  const classes = useStyles();

  return (
    <Button
      className={cx(
        classes.statusFilterItem,
        isActive ? classes.activeStatusFilter : {},
      )}
      onClick={() => onChange(value)}
      data-testid={`status-filter-${name}`}
    >
      <div className={classes.statusFilterItemTextContainer}>
        <div>{name}</div>
        <div className={cx(classes.statusFilterItemCount)}>{count}</div>
      </div>
    </Button>
  );
};

interface StatusFilterProps {
  metaData: {
    total: number;
    types: Array<{
      label: string;
      count: number;
    }>;
  };
  activeName?: AccountStatus;
  onChange: (val: AccountStatus | undefined) => void;
}

export const StatusFilter = ({
  metaData,
  activeName,
  onChange,
}: StatusFilterProps) => {
  const classes = useStyles();

  const { total, types } = metaData;

  const newCount = types.find((item) => item.label === 'NEW')?.count ?? 0;
  const activeCount = types.find((item) => item.label === 'ACTIVE')?.count ?? 0;
  const archivedCount =
    types.find((item) => item.label === 'ARCHIVED')?.count ?? 0;

  return (
    <div className={classes.statusFilter}>
      <FilterItem
        count={total}
        name="Total"
        isActive={activeName == null}
        onChange={onChange}
      />
      <FilterItem
        value="NEW"
        name="New"
        count={newCount}
        isActive={activeName === 'NEW'}
        onChange={onChange}
      />
      <FilterItem
        value="ACTIVE"
        name="Active"
        count={activeCount}
        isActive={activeName === 'ACTIVE'}
        onChange={onChange}
      />
      <FilterItem
        name="Archived"
        value="ARCHIVED"
        count={archivedCount}
        isActive={activeName === 'ARCHIVED'}
        onChange={onChange}
      />
    </div>
  );
};
