import makeStyles from '@mui/styles/makeStyles';
import { TextField, InputAdornment, Button, Badge } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const useStyles = makeStyles((theme) => ({
  searchBar: {
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.primary.background,
    padding: theme.spacing(2, 0),
  },
  filterButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.background,
    borderRadius: 5,
    fontSize: 14,
    cursor: 'pointer',
    margin: theme.spacing(0, 2),
  },
  filterIcon: {
    fontSize: 20,
    marginRight: theme.spacing(1),
  },
  filterText: {
    color: theme.palette.primary.main,
  },
  filterCount: {
    margin: theme.spacing(0, 2),
  },
}));

interface Props {
  value: string;
  onChange: (val: string) => void;
  onFilterOpen: () => void;
  currentFilterCount: number;
}

export const SearchBar = ({
  value,
  onChange,
  onFilterOpen,
  currentFilterCount,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.searchBar}>
      <TextField
        value={value}
        placeholder="Search"
        onChange={({ target: { value: v } }) => onChange(v)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
        className={classes.filterButton}
        onClick={onFilterOpen}
        data-testid="accounts-filter"
      >
        <FilterListIcon className={classes.filterIcon} />
        <div className={classes.filterText}>Filter</div>
        <Badge
          badgeContent={currentFilterCount}
          color="primary"
          className={classes.filterCount}
        />
      </Button>
    </div>
  );
};
