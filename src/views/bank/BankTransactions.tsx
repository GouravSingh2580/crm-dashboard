import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import {
  buildParamsFromSearch,
  useBankTransactions,
  buildQueryString,
  Filters,
  useTransactionCategories,
} from 'hooks/api/useBankTransactions';
import { useCurrentUser } from 'hooks/api';
import { Box, Button, Alert, AlertTitle, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useBankAccounts } from 'hooks/api/useBankAccount';
import { getTableResultText, getTotalPages } from 'helpers/tableUtils';
import { BankTransactionsTable } from 'components/bookkeeping';
import { BankTransactionSearchPanel } from 'components/bookkeeping/BankTransactionsTable';
import { useBankTransactionForDashboard } from 'hooks/dataFormatters/useBankTransactionForDashboard';
import { Loading, TooltipInfoWithLink } from 'components/common';
import { useBookkeepingState } from 'states/bookkeeping';
import {
  QuickFilterBox,
  useQuickFilter,
} from 'components/bookkeeping/QuickFilterPanel';
import { SortingDirection } from 'enums';
import {
  TRANSACTION_INFO_URL,
  POPOVER_TITLE,
} from 'constants/transactionConstants';
import { PageTitle } from 'components/common/PageTitle';
import { getPrettyDateTime } from 'helpers/dateTimeFormat';
import { MAIN_COLOR } from 'theme/constant';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface ISorting {
  name: string;
  direction: SortingDirection;
}

interface Props {
  disableQueryUrl?: boolean;
  accountId?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  headingContainer: {
    marginBottom: theme.spacing(4),
  },
  adminHeader: {
    marginLeft: theme.spacing(1),
  },
  heading: {
    marginBottom: theme.spacing(1),
    letterSpacing: '0.25px',
  },
  headingInfo: {
    fontWeight: 500,
    fontSize: '13px',
    color: theme.palette.primary.dark,
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.palette.primary.contrastText,
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    paddingBottom: theme.spacing(2),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  tableInfo: {
    display: 'flex',
    flexDirection: 'row',
    color: MAIN_COLOR,
    fontWeight: 500,
    fontSize: '13px',
    opacity: '0.7',
  },
  escalation: {
    color: '#E81C0D',
  },
  quickFilters: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectSource: {
    backgroundColor: 'white',
    height: '55px',
  },
  errorButton: {
    color: theme.palette.error.dark,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  categorizedIcon: {
    fill: theme.palette.warning.main,
  },
  actionable: {
    color: theme.palette.warning.dark,
  },
  otherInfo: {
    color: theme.palette.info.main,
  },
}));

export const BankTransactionsContent = ({
  accountId,
  disableQueryUrl,
}: Props) => {
  const classes = useStyles();
  const { currentUser } = useCurrentUser();
  const history = useHistory();
  const { path } = useRouteMatch();
  const location = useLocation();
  const [sorting, setSorting] = useState<ISorting>({
    name: 'date',
    direction: SortingDirection.Desc,
  });

  // initialize data
  const defaultParams = useMemo(
    () => buildParamsFromSearch(location.search),
    [location.search],
  );
  const accountID = accountId !== '' ? accountId : currentUser?.accountId;
  const { connections } = useBankAccounts(accountID);
  const {
    transactions: tableDataRaw,
    params,
    setPage,
    setOrder,
    setSearch,
    setFilters,
    error,
    isError,
    isLoading,
    refresh,
  } = useBankTransactions(accountID, defaultParams);
  const tableData = useBankTransactionForDashboard(tableDataRaw);
  const { categories } = useTransactionCategories();
  const { page, search } = params;
  const filters = {
    from: params.from,
    to: params.to,
    categoryId: params.categoryId,
    amountGreaterThan: params.amountGreaterThan,
    amountLessThan: params.amountLessThan,
    source: params.source,
  };
  const [lastRefreshed, setLastRefreshed] = useState('');

  const size = tableData?.pageInfo.size || 0;
  const total = tableData?.pageInfo.total || 0;
  const numberOfPages = getTotalPages(size, total);
  const tableInfo = getTableResultText(
    size,
    page,
    tableData?.pageInfo.total ?? 0,
    '{from} - {to} of {total} Results',
  );
  const { isBookkeeper } = useBookkeepingState();
  const quickFilterState = useQuickFilter();
  // end preparing data

  // events & function
  const onSearchChange = (value: string) => {
    setSearch(value);
  };

  const onFiltersChange = (updatedFilters: Filters) => {
    setFilters(updatedFilters);
    quickFilterState.setQuickFilterId(undefined);
  };

  const changePage = (newPage: number): void => {
    setPage(newPage);
  };

  const onSortingChange = (value: ISorting): void => {
    const sort = { ...value };
    setSorting(sort);
    setOrder(value.direction);
  };

  // change url whenever params change
  useEffect(() => {
    if (disableQueryUrl) return;
    const queryString = buildQueryString(params);
    if (`?${queryString}` !== location.search) {
      history.push(`${path}?${queryString}`);
    }
  }, [history, location.search, params, path, disableQueryUrl]);

  useEffect(() => {
    if (connections.length) {
      setLastRefreshed(getPrettyDateTime(connections[0].last_fetch_date));
    }
  }, [connections]);

  useEffect(() => {
    setFilters(quickFilterState.quickFilter?.data || {});
  }, [quickFilterState.quickFilter]);

  // inside component
  const errorMessage = (
    <Box padding={2}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error instanceof Error
          ? error.message
          : 'There is error while fetching transactions!'}
        .
        <Button
          variant="text"
          data-testid="refresh"
          className={classes.errorButton}
          onClick={refresh}
        >
          Refresh
        </Button>
      </Alert>
    </Box>
  );
  return (
    <main className={classes.content}>
      <>
        <div
          className={
            !isBookkeeper ? classes.headingContainer : classes.adminHeader
          }
        >
          {!isBookkeeper && (
            <PageTitle variant="h1" component="h1" className={classes.heading}>
              Transactions
            </PageTitle>
          )}
          {lastRefreshed !== '' && (
            <div className={classes.headingInfo}>
              {`Last updated: ${lastRefreshed}`}
              <TooltipInfoWithLink
                title={POPOVER_TITLE}
                url={TRANSACTION_INFO_URL}
                width="391px"
                placement="right-start"
              >
                <div>
                  <InfoOutlinedIcon
                    sx={{ m: 1 }}
                    style={{ color: MAIN_COLOR }}
                  />
                </div>
              </TooltipInfoWithLink>
            </div>
          )}
        </div>
        <BankTransactionSearchPanel
          search={search}
          onSearchChange={onSearchChange}
          filters={filters}
          onFiltersChange={onFiltersChange}
          refresh={refresh}
          quickFilter={
            <QuickFilterBox accountId={accountID} {...quickFilterState} />
          }
        />
      </>

      {isError && errorMessage}

      {isLoading && <Loading />}

      {!isLoading && tableData && tableData.data && (
        <div>
          <Box className={classes.tableInfo} pt={5} pb={1}>
            <span>
              {tableInfo}
              &nbsp;
            </span>
          </Box>
          <BankTransactionsTable
            data={tableData.data}
            page={page}
            sorting={sorting}
            onSortingChange={onSortingChange}
            numberOfPages={numberOfPages}
            onPageChange={changePage}
            categories={categories ?? []}
            refresh={refresh}
          />
        </div>
      )}
    </main>
  );
};

BankTransactionsContent.defaultProps = {
  disableQueryUrl: false,
  accountId: '',
};

/**
 * bank transaction page for customer. The page component should not have any props
 * because the route won't pass any prop
 */
const BankTransactions = () => (
  <BankTransactionsContent disableQueryUrl={false} />
);

export default BankTransactions;
