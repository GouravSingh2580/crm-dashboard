import { Button, Grid, InputBase } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useCallback, useState } from 'react';

interface SearchArgs {
  value?: string;
  onChange: (value: string) => void;
  onFilterOpen: () => void;
}

const useStyles = makeStyles((theme) => ({
  searchBar: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    '&:before': {
      borderBottom: '0px solid',
    },
    '&:hover:before': {
      borderBottom: '0px solid !important',
    },
    '&:hover:before:not(.Mui-disabled)': {
      borderBottom: '0px solid',
    },
  },
  filterButton: {
    fontSize: 14,
    cursor: 'pointer',
    padding: theme.spacing(0, 2),
    color: theme.palette.text.primary,
  },
  filterIcon: {
    fontSize: 20,
  },
}));

/** search field */
const InputField = withStyles((theme) => ({
  input: {
    border: '0',
    backgroundColor: 'transparent',
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
  },
}))(InputBase);
const SearchIconUI = withStyles((theme) => ({
  color: theme.palette.textHint,
}))(SearchIcon);

const SearchField = ({ value, onChange }: Omit<SearchArgs, 'onFilterOpen'>) => {
  const [search, setSearch] = useState<string>(value || '');
  const onSearch = useCallback(() => onChange(search), [search]);
  const onKeyUp = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onSearch();
      }
    },
    [search],
  );
  return (
    <Grid container alignItems="center" columnSpacing={1}>
      <Grid item>
        <SearchIconUI style={{ color: 'rgba(13, 34, 89, 0.5)' }} />
      </Grid>
      <Grid item>
        <InputField
          value={search}
          onChange={({ target: { value: v } }) => setSearch(v)}
          onKeyUp={onKeyUp}
          onBlur={onSearch}
          placeholder="Search"
        />
      </Grid>
    </Grid>
  );
};

const FilterButton = ({ onClick }: { onClick: () => void }) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.filterButton}
      onClick={onClick}
      data-testid="accounts-filter"
      startIcon={<FilterListIcon className={classes.filterIcon} />}
    >
      Filter
    </Button>
  );
};

export const BankTransactionsSearch = ({
  value,
  onChange,
  onFilterOpen,
}: SearchArgs) => {
  const classes = useStyles();
  const showSearch = false;

  return (
    <div className={classes.searchBar}>
      {/* To do: Bring back this functionality in later releases and integrate with backend to work */}
      {showSearch && <SearchField value={value} onChange={onChange} />}
      <FilterButton onClick={onFilterOpen} />
    </div>
  );
};
BankTransactionsSearch.defaultProps = {
  value: '',
};
