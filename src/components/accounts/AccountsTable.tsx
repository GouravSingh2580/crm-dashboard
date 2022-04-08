import { useHistory, useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import cx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';

import { AccountStatus } from 'services/account';
import React, { useCallback, useMemo } from 'react';
import { get } from 'lodash';
import { SortingDirection } from 'enums';
import { IAccountItemRow } from 'hooks/dataFormatters/useAccountsTableData';
import { Routes } from 'fnRoutes';
import qs from 'qs';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexFlow: 'column',
    minHeight: 100,
  },
  tableHeadCell: {
    backgroundColor: '#FFFFFF',
    color: '#0D2259',
  },
  paper: {
    width: '100%',
    overflow: 'auto',
    border: '1px solid rgba(13, 34, 89, 0.23)',
    boxShadow: '0px 2px 1px -1px rgba(13, 34, 89, 0.1)',
  },
  table: {
    minWidth: 320,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    flex: '0 1 auto',
    marginLeft: theme.spacing(2),
  },
  statusFilterItemNew: {
    color: theme.palette.yellow.main,
  },
  statusFilterItemActive: {
    color: theme.palette.info.main,
  },
  statusFilterItemArchived: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
}));

interface ISorting {
  name: string;
  direction: SortingDirection;
}

interface Props {
  data: IAccountItemRow[];
  page: number;
  sorting: ISorting;
  onPageChange: (val: number) => void;
  onSortingChange: (val: ISorting) => void;
  totalCount: number;
  statusFilter: AccountStatus | undefined;
  rowsPerPage: number;
  setRowsPerPage: (newRowCount: number) => void;
}

const headers = [
  { title: 'Company Name', key: 'companyName' },
  { title: 'Entity Type', key: 'entityType' },
  { title: 'Regd', key: 'registeredDate' },
  { title: 'Status', key: 'status' },
  { title: 'Contact Name', key: 'ownerName' },
  { title: 'Contact Email', key: 'ownerEmail' },
  // TODO: hide CSM filter until we have CSM data in the system
  // { title: 'CSM', key: 'csm' },
];
const newAccountHeader = [
  { title: 'Company Name', key: 'companyName' },
  { title: 'Regd', key: 'registeredDate' },
  { title: 'Days in this status', key: 'dayInStatus' },
  { title: 'Entity Type', key: 'entityType' },
  { title: 'LLC Form', key: 'llcForm' },
  { title: 'Bank Preference', key: 'bankPreference' },
  { title: 'Signature Package Signed', key: 'signaturePackage' },
  { title: 'Direct Deposit Available', key: 'directDeposit' },
];

export const AccountsTable = ({
  data,
  page,
  sorting,
  onPageChange,
  onSortingChange,
  totalCount,
  statusFilter,
  rowsPerPage,
  setRowsPerPage,
}: Props) => {
  const classes = useStyles();
  const history = useHistory();

  const tableHeader = useMemo(() => {
    if (statusFilter === 'NEW') {
      return newAccountHeader;
    }
    return headers;
  }, [statusFilter]);

  const onRowClick = (id: string) => {
    history.push(`${Routes.ACCOUNTS}/${id}`);
  };

  const location = useLocation();

  const handlePageChange = (e: unknown, value: number) => {
    const queryParams = qs.parse(location.search.replace('?', ''));
  
    const newQueries = { ...queryParams, page: value };
    history.push({ search: qs.stringify(newQueries) });
    onPageChange(value);
  };

  const isSortingAvailable = (headerName: string) =>
    ['companyName', 'registeredDate', 'ownerName', 'dayInStatus'].includes(
      headerName,
    );

  const handleSortingChange = (name: string) => {
    if (name === sorting.name) {
      onSortingChange({
        name,
        direction:
          sorting.direction === SortingDirection.Asc
            ? SortingDirection.Desc
            : SortingDirection.Asc,
      });
    } else {
      onSortingChange({ name, direction: SortingDirection.Asc });
    }
  };

  const cellClass = useCallback(
    (
      status: string,
    ):
      | null
      | 'statusFilterItemNew'
      | 'statusFilterItemActive'
      | 'statusFilterItemArchived' => {
      if (['New', 'Active', 'Archived'].includes(status)) {
        return get(classes, `statusFilterItem${status}`);
      }
      return null;
    },
    [],
  );

  return (
    <div className={classes.tableContainer}>
      <TableContainer component={Paper} className={classes.paper}>
        <Table
          stickyHeader
          className={classes.table}
          aria-label="accounts table"
          data-testid="table-accounts"
        >
          <TableHead>
            <TableRow>
              {tableHeader.map((item) => (
                <TableCell
                  key={item.key}
                  className={classes.tableHeadCell}
                  component="th"
                  scope="row"
                >
                  {item.title}
                  {isSortingAvailable(item.key) ? (
                    <TableSortLabel
                      active={sorting.name === item.key}
                      direction={sorting.direction}
                      onClick={() => handleSortingChange(item.key)}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.ownerId}
                hover
                onClick={() => onRowClick(row.ownerId)}
                data-testid={`table-row-account-${row.ownerId}`}
              >
                {tableHeader.map((item) => (
                  <TableCell
                    key={item.key}
                    className={
                      item.key === 'status' ? cx(cellClass(row.status)) : ''
                    }
                    component="td"
                    scope="row"
                  >
                    {row[item.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className={classes.paginationContainer}>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e: React.ChangeEvent) =>
            setRowsPerPage(parseInt(e.target.value as string, 10))
          }
        />
      </div>
    </div>
  );
};
