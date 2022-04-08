import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Switch,
} from '@mui/material';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import makeStyles from '@mui/styles/makeStyles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ReactComponent as Reviewed } from 'icons/subtract.svg';
import { SECONDARY_COLOR } from 'theme/constant';
import { EmptyState } from 'components/common/EmptyState';
import { useTransactionUpdate } from 'hooks/api/useBankTransactions';
import { useCurrentUser } from 'hooks/api';
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from 'components/toast/showToast';
import { useBookkeepingState } from 'states/bookkeeping';
import { sendBankTransactionCategorize } from 'helpers/heap/bookkeepingEvent';
import { SortingDirection, transactionTableHeaders } from 'enums';
import { CategoryItem } from 'services/bankTransactions';
import { EditableNoteCell } from './EditableNoteCell';
import { EditableCategoryCell } from './EditableCategoryCell';
import { BankTransactionNote } from './BankTransactionNote';
import { formatAmount } from '../TransactionsFilterDrawer/helpers';

interface ISorting {
  name: string;
  direction: SortingDirection;
}

interface Keyable {
  [key: string]: any;
}

interface IHeaderItem {
  title: string;
  key: string;
}

export interface TransactionItem extends Keyable {
  id: string;
  // eslint-disable-next-line camelcase
  account_id: string;
  // eslint-disable-next-line camelcase
  cent_amount: number;
  category: string;
  // eslint-disable-next-line camelcase
  connection_id: string;
  date: string;
  // eslint-disable-next-line camelcase
  is_pending: boolean;
  // eslint-disable-next-line camelcase
  iso_currency_code: string;
  // eslint-disable-next-line camelcase
  merchant_name: string;
  name: string;
  notes: string;
  subtype: string;
}

interface Props {
  data: Array<TransactionItem>;
  categories: Array<CategoryItem>;
  page: number;
  sorting: ISorting;
  onPageChange: (val: number) => void;
  onSortingChange: (val: ISorting) => void;
  numberOfPages: number;
  refresh: () => void;
}

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexFlow: 'column',
    minHeight: 100,
  },
  sortLabelIcon: {
    color: '#000 !important',
  },
  paper: {
    width: '100%',
    overflow: 'auto',
  },
  table: {
    minWidth: 320,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    flex: '0 1 auto',
    marginLeft: theme.spacing(2),
  },
  nocategory: {
    color: '#E81C0D',
    fontWeight: 'normal',
    textDecoration: 'underline',
    textDecorationColor: '#E81C0D',
  },
  field: {
    fontSize: 14,
  },
  uncategorizedIcon: {
    fill: theme.palette.warning.main,
  },
  categorizedIcon: {
    fill: SECONDARY_COLOR,
  },
  tableHeaderCell: {
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  tableRow: {
    position: 'relative',
  },
  textGreen: {
    color: theme.palette.secondary.dark,
  },
}));

export const BankTransactionsTable = ({
  data,
  categories,
  page,
  sorting,
  onPageChange,
  onSortingChange,
  numberOfPages,
  refresh,
}: Props) => {
  const classes = useStyles();
  const [inEditMode, setInEditMode] = useState({
    key: '',
    rowKey: -1,
  });

  let headers = [
    { title: '', key: 'symbol' },
    { title: 'Date', key: 'date' },
    { title: 'Description', key: 'name' },
    { title: 'Source', key: 'account_name' },
    { title: 'Category', key: 'category' },
    { title: 'Notes', key: 'notes' },
    { title: 'Amount', key: 'cent_amount' },
    { title: 'R&B', key: 'reviewed' },
  ];
  const { currentUser } = useCurrentUser();
  let top = '';
  const { isBookkeeper } = useBookkeepingState();

  const setNoteTop = () => {
    const table = document.getElementById(
      'transaction-table',
    ) as HTMLTableElement;
    if (table && table.rows.length > 1) {
      top = `${table.rows[inEditMode.rowKey + 1].clientHeight}px`;
    }
  };

  if (inEditMode.key === transactionTableHeaders.NOTES) {
    setNoteTop();
  }

  useEffect(() => {
    function handleResize() {
      if (inEditMode.key === transactionTableHeaders.NOTES) {
        setNoteTop();
      }
    }
    window.addEventListener('resize', handleResize);
    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inEditMode.key === transactionTableHeaders.NOTES &&
      !document
        .getElementById('editNote')
        ?.parentNode?.contains(e.target as Node) &&
      (e.target as HTMLElement)?.id !== 'note-id'
    ) {
      setInEditMode({
        key: '',
        rowKey: -1,
      });
    }
  };

  useEffect(() => {
    if (inEditMode.key === transactionTableHeaders.NOTES) {
      setTimeout(() => {
        window.addEventListener('click', handleClickOutside);
      }, 500);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }
    return function cleanup() {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [inEditMode.key]);
  if (!isBookkeeper) {
    headers = headers.filter((item) => item.title !== 'R&B');
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageData: number,
  ) => {
    onPageChange(pageData);
  };

  const isSortingAvailable = (headerName: string) =>
    ['Date'].includes(headerName);

  const toggleEdit = (index: number, key: string) => {
    setInEditMode({
      key,
      rowKey: index,
    });
  };

  const resetEdit = () =>
    setInEditMode({
      key: '',
      rowKey: -1,
    });

  const getParamData = (
    transaction: TransactionItem,
    paramValue: string | boolean,
    changedParam: string,
  ) => ({
    category_id:
      changedParam === transactionTableHeaders.CATEGORY
        ? (paramValue as string)
        : transaction.category,
    notes:
      changedParam === transactionTableHeaders.NOTES
        ? (paramValue as string)
        : transaction.notes,
    reviewed: changedParam === 'review' ? paramValue : transaction.reviewed,
  });

  const { updateTransaction } = useTransactionUpdate();
  const onUpdateTransaction = async (
    transaction: TransactionItem,
    // eslint-disable-next-line camelcase
    paramValue: string | boolean,
    changedParam: string,
  ) => {
    const paramData = getParamData(transaction, paramValue, changedParam);
    try {
      await updateTransaction({
        accountId: currentUser?.accountId || '',
        transactionId: transaction.id,
        ...paramData,
      });
      if (changedParam === 'review') {
        if (paramValue) {
          showSuccessToast('Transaction has been reviewed and booked!');
        } else {
          showWarningToast('Transaction is not reviewed!');
        }
      } else {
        showSuccessToast('Transaction has been updated!');
      }
      if (changedParam === transactionTableHeaders.CATEGORY) {
        const newCategory =
          categories[categories.findIndex((item) => item.id === paramValue)]
            .name;
        sendBankTransactionCategorize(
          transaction.name,
          transaction.category_name,
          newCategory,
        );
      }
      refresh();
      resetEdit();
    } catch (e: unknown) {
      if (e instanceof Error) {
        showErrorToast(e.message);
      } else {
        showErrorToast('There is an error occurred while updating');
      }
    }
  };

  const getStatusIcon = (transaction: TransactionItem) => {
    let value;
    if (
      transaction.category_name === '' ||
      transaction.category_name === 'Unknown'
    ) {
      value = <ErrorOutlineIcon className={classes.uncategorizedIcon} />;
    } else {
      value = transaction.reviewed ? (
        <CheckCircleIcon className={classes.categorizedIcon} />
      ) : (
        <Reviewed />
      );
    }
    return value;
  };

  const getClassNameForAmount = (item: IHeaderItem, row: TransactionItem) => {
    const amountKey = headers.find((header) => header.title === 'Amount')?.key;
    return item.key === amountKey && row[item.key] < 0 ? classes.textGreen : '';
  };

  const getTableCellValue = (
    item: IHeaderItem,
    transaction: TransactionItem,
    index: number,
  ) => {
    let cellValue;
    switch (item.title) {
      case '':
        cellValue = getStatusIcon(transaction);
        break;
      case 'Category':
        cellValue = (
          <EditableCategoryCell
            reviewed={transaction.reviewed}
            category={transaction.category_name}
            categoryId={transaction.category_id}
            categories={categories}
            onToggleEditMode={(isEdit = true) =>
              isEdit
                ? toggleEdit(index, transactionTableHeaders.CATEGORY)
                : resetEdit()
            }
            onChange={
              // eslint-disable-next-line camelcase
              (newCategory) =>
                onUpdateTransaction(
                  transaction,
                  newCategory,
                  transactionTableHeaders.CATEGORY,
                )
            }
          />
        );
        break;
      case 'Amount':
        cellValue = formatAmount(transaction.cent_amount);
        break;
      case 'Notes':
        cellValue = (
          <EditableNoteCell
            notes={transaction.notes}
            onToggleEditMode={(isEdit) =>
              isEdit
                ? toggleEdit(index, transactionTableHeaders.NOTES)
                : resetEdit()
            }
          />
        );
        break;
      case 'Date':
        cellValue = moment(transaction.date).format('MM-DD-YYYY');
        break;
      case 'R&B':
        cellValue = (
          <Switch
            checked={transaction.reviewed}
            onChange={(event) =>
              onUpdateTransaction(transaction, event.target.checked, 'review')
            }
            inputProps={{ 'aria-label': 'controlled' }}
          />
        );
        break;
      default:
        cellValue = transaction[item.key] ?? '-';
        break;
    }
    return cellValue;
  };

  const getTableCell = (
    item: IHeaderItem,
    row: TransactionItem,
    index: number,
  ) => (
    <TableCell
      key={item.key}
      component="td"
      scope="row"
      style={
        item.key === transactionTableHeaders.SYMBOL
          ? { width: 'auto' }
          : { width: '15%' }
      }
      className={getClassNameForAmount(item, row)}
    >
      {getTableCellValue(item, row, index)}
    </TableCell>
  );

  const handleSortingChange = (name: string) => {
    onSortingChange({
      name,
      direction:
        sorting.direction === SortingDirection.Asc
          ? SortingDirection.Desc
          : SortingDirection.Asc,
    });
  };

  return (
    <div className={classes.tableContainer}>
      <TableContainer component={Paper} className={classes.paper}>
        <Table
          stickyHeader
          className={classes.table}
          aria-label="simple table"
          data-testid="table-transactions"
          id="transaction-table"
        >
          <TableHead>
            <TableRow>
              {headers.map((item) => (
                <TableCell
                  className={classes.tableHeaderCell}
                  key={item.key}
                  component="th"
                  scope="row"
                >
                  {item.title}
                  {isSortingAvailable(item.title) ? (
                    <TableSortLabel
                      classes={{
                        icon: classes.sortLabelIcon,
                      }}
                      active={sorting.name === item.title}
                      direction={sorting.direction}
                      onClick={() => handleSortingChange(item.title)}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length || 1}>
                  <EmptyState message="No transactions available!" />
                </TableCell>
              </TableRow>
            ) : null}
            {data &&
              data.map((row: TransactionItem, index: number) => (
                <TableRow
                  className={classes.tableRow}
                  key={row.id}
                  hover
                  data-testid={`table-row-transaction-${row.id}`}
                >
                  {headers.map((item) => getTableCell(item, row, index))}
                  {inEditMode.rowKey === index &&
                    inEditMode.key === transactionTableHeaders.NOTES && (
                      <BankTransactionNote
                        top={top}
                        row={row}
                        index={index}
                        onUpdateTransaction={onUpdateTransaction}
                        toggleEdit={toggleEdit}
                      />
                    )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className={classes.paginationContainer}>
        <Pagination
          color="primary"
          className={classes.pagination}
          page={page}
          onChange={handlePageChange}
          count={numberOfPages}
        />
      </div>
    </div>
  );
};
