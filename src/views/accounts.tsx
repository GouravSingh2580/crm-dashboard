import React, { useEffect, useMemo, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';

import { useAccountsTableData } from 'hooks/dataFormatters';
import useLoading from 'hooks/useLoading';
import { useAccountsList, useAccountsMeta } from 'hooks/api/useAccounts';

import { AccountsTable } from 'components/accounts/AccountsTable';
import { Filters } from 'components/accounts/Filters';
import { SearchBar } from 'components/accounts/SearchBar';
import { StatusFilter } from 'components/accounts/StatusFilter';
import { SortingDirection } from 'enums';
import { AccountStatus } from 'services/account';
import { debounce } from 'lodash';
import { IAccountItemRow } from 'hooks/dataFormatters/useAccountsTableData';
import { getISOFormatTime } from 'helpers/dateTimeFormat';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

export interface IFilters {
  entityType: string;
  assignedCSM: string;
  from?: string | null;
  to?: string | null;
  completionStatus: string;
}

export const initFilterState: IFilters = {
  entityType: '',
  assignedCSM: '',
  from: null,
  to: null,
  completionStatus: '',
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
    padding: theme.spacing(4, 15),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(4),
    },
  },
  title: {
    margin: theme.spacing(4, 0),
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

export interface ISorting {
  name: string;
  direction: SortingDirection;
}

// debounce function, for not re-fetch query while typing search
type SetSearch = (value: string) => void;
const debounceSearch = debounce<
  (setSearch: SetSearch, value: string, history: any, location: any) => void
>((setSearch, value: string, history: any, location: any) => {
  setSearch(value);

  const queryParams = qs.parse(location.search.replace('?', ''));
  const newQueries = { ...queryParams, search: value };
  history.push({ search: qs.stringify(newQueries) });
}, 500);

const Accounts = () => {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  const searchParamValue =
    new URLSearchParams(location.search).get('search') || undefined;
  const pageParamValue =
    new URLSearchParams(location.search).get('page') || undefined;
  const sortNameParamValue =
    new URLSearchParams(location.search).get('sort') || undefined;
  const orderParamValue =
    new URLSearchParams(location.search).get('order') || undefined;

  const [filters, setFilters] = useState<IFilters>(initFilterState);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(Number(pageParamValue) || 0);
  const [statusFilter, setStatusFilter] = useState<AccountStatus | undefined>(
    undefined,
  );
  const [search, setSearch] = useState(searchParamValue || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState<ISorting>({
    name: sortNameParamValue || 'registeredDate',
    direction: (orderParamValue as any) || SortingDirection.Desc,
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const currentFilterCount: number = useMemo(
    () => Object.values(filters).reduce((acc, cur) => (cur ? acc + 1 : acc), 0),
    [filters],
  );

  console.log(searchQuery); // TODO

  const {
    isLoading,
    accounts,
    pageInfo: { totalCount },
  } = useAccountsList({
    // server expect page starting from 1
    // material ui pagenation expect page from 0
    page: page + 1,
    search,
    size: rowsPerPage,
    from: filters.from ? getISOFormatTime(filters.from) : undefined,
    to: filters.to ? getISOFormatTime(filters.to) : undefined,
    status: statusFilter,
    sortingName: sorting.name,
    sortingDirection: sorting.direction,
    taxFormCompletionStatus: filters.completionStatus,
    entityType: filters.entityType,
    csm: filters.assignedCSM,
  });
  const { isLoading: isLoadingMeta, accountMeta: accountsMetaData } =
    useAccountsMeta();

  const loading = useLoading(isLoading || isLoadingMeta);
  const tableData: IAccountItemRow[] = useAccountsTableData(accounts);

  useEffect(() => {
    // keyword=abc&sort=created_at&order=desc&page=1&size=10
    const obj = {
      search,
      sort: sorting.name,
      order: sorting.direction,
      page,
    };

    const q = qs.stringify(obj);
    history.push(`/dashboard/accounts?${q}`);
  }, []);

  const resetPage = () => {
    if (page !== 0) {
      setPage(0);
    }
  };

  const updateRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    resetPage();
  };

  const changePage = (value: number) => {
    setPage(value);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    debounceSearch(setSearchQuery, value, history, location);
    resetPage();
  };

  const onStatusChange = (value: AccountStatus | undefined) => {
    setStatusFilter(value);
    resetPage();
  };

  const onFiltersChange = (value: IFilters) => {
    setFilters(value);
    resetPage();
  };

  const onSortingChange = (value: {
    name: string;
    direction: SortingDirection;
  }) => {
    const queryParams = qs.parse(location.search.replace('?', ''));

    const newQueries = {
      ...queryParams,
      sort: value.name,
      order: value.direction,
    };

    history.push({ search: qs.stringify(newQueries) });
    setSorting(value);
    resetPage();
  };

  return (
    <main className={classes.content}>
      {loading}

      <Typography className={classes.title} variant="h4" component="h4">
        Accounts
      </Typography>

      <StatusFilter
        metaData={accountsMetaData}
        activeName={statusFilter}
        onChange={onStatusChange}
      />

      <SearchBar
        value={search}
        onChange={onSearchChange}
        onFilterOpen={() => setFilterOpen(true)}
        currentFilterCount={currentFilterCount}
      />

      <Filters
        open={isFilterOpen}
        filters={filters}
        onChange={onFiltersChange}
        onClose={() => setFilterOpen(false)}
        currentFilterCount={currentFilterCount}
      />

      <AccountsTable
        data={tableData}
        page={page}
        sorting={sorting}
        totalCount={totalCount}
        onSortingChange={onSortingChange}
        onPageChange={changePage}
        statusFilter={statusFilter}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={updateRowsPerPage}
      />
    </main>
  );
};

// eslint-disable-next-line import/no-default-export
export default Accounts;
