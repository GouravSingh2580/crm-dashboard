import React, { useEffect, useMemo, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Drawer, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Filters,
  useTransactionCategories,
} from 'hooks/api/useBankTransactions';
import { BankAccount, useBankAccounts } from 'hooks/api/useBankAccount';
import { useCurrentAccount } from 'hooks/api';
import { AccountResp } from 'services/bankAccount';
import { CategoryItem } from 'services/bankTransactions';
import { FormSelect } from './FormSelect';
import { FormDatePicker } from './FormDatePicker';
import { FormNumber } from './FormNumber';
import {
  LocalFilters,
  convertFromLocalFilter,
  convertToLocalFilter,
  forcingMaxLength,
} from './helpers';

export interface FilterArgs {
  open: boolean;
  filters: Filters;
  onChange: ({
    from,
    to,
    categoryId,
    amountGreaterThan,
    amountLessThan,
    source,
  }: Filters) => void;
  onClose: () => void;
  refresh: () => void;
}

const useStyles = makeStyles((theme) => ({
  drawer: {
    minWidth: 380,
    padding: theme.spacing(4),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  drawerHeaderTitle: {
    margin: theme.spacing(2, 0, 1, 2),
    fontWeight: 200,
    fontSize: '34px',
  },
  drawerButton: {
    marginBottom: theme.spacing(2),
  },
  drawerCloseIcon: {
    cursor: 'pointer',
  },
  drawerInputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
  },
  drawerButtonActions: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
}));

export const TransactionFilterDrawer = ({
  open,
  filters,
  onChange,
  onClose,
  refresh,
}: FilterArgs) => {
  const classes = useStyles();

  const [transactionFilters, setTransactionFilters] = useState<LocalFilters>(
    {},
  );
  const { currentAccount } = useCurrentAccount();
  const { categories } = useTransactionCategories();
  const { connections } = useBankAccounts(currentAccount?.id);

  useEffect(() => {
    setTransactionFilters(convertToLocalFilter(filters));
  }, [filters]);

  const sources = useMemo(() => {
    try {
      return connections
        .reduce<AccountResp[]>(
          (s, connection: BankAccount) => [...s, ...connection.accounts],
          [] as AccountResp[],
        )
        .map((account) => ({ key: account.id, value: account.name }));
    } catch {
      return [];
    }
  }, [connections]);

  const onApply = () => {
    const updatedFilters = convertFromLocalFilter(transactionFilters);
    onChange(updatedFilters);
    onClose();
  };

  const onReset = () => {
    onChange({
      from: undefined,
      to: undefined,
      source: undefined,
      categoryId: undefined,
      amountGreaterThan: undefined,
      amountLessThan: undefined,
    });
    refresh();
    onClose();
  };

  const onCancel = () => {
    setTransactionFilters(convertToLocalFilter(filters));
    onClose();
  };

  const applyValidation = (val: number | undefined) => {
    let value = forcingMaxLength(val);
    if (value) {
      value = Math.abs(value);
    }
    return value;
  };

  type AllowKeys =
    | 'categoryId'
    | 'amountGreaterThan'
    | 'amountLessThan'
    | 'from'
    | 'to'
    | 'source';
  const createOnChange = (key: AllowKeys) => (val: unknown) => {
    let value: any;
    switch (key) {
      case 'amountGreaterThan':
      case 'amountLessThan':
        value = applyValidation(val as number | undefined);
        break;
      case 'categoryId':
      case 'from':
      case 'to':
      case 'source':
      default:
        value = val;
    }
    transactionFilters[key] = value != null ? value : undefined;
    setTransactionFilters({
      ...transactionFilters,
    });
  };

  const categoriesOptions = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.map((category: CategoryItem) => ({
      key: category.id,
      value: category.name,
    }));
  }, [categories]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className={classes.drawer}>
        <div className={classes.drawerHeader}>
          <CloseIcon className={classes.drawerCloseIcon} onClick={onCancel} />
          <Typography
            className={classes.drawerHeaderTitle}
            variant="h5"
            component="h5"
            data-testid="filter-header"
          >
            Filters
          </Typography>
        </div>

        <div className={classes.drawerInputsContainer}>
          <FormSelect
            label="Category"
            value={transactionFilters.categoryId}
            options={categoriesOptions}
            onChange={createOnChange('categoryId')}
            data-testid="select-category"
          />

          <FormSelect
            label="Source"
            value={transactionFilters.source}
            options={sources}
            onChange={createOnChange('source')}
            data-testid="select-source"
          />

          <FormDatePicker
            label="From"
            value={transactionFilters.from}
            onChange={createOnChange('from')}
            renderInput={(props) => (
              <TextField data-testid="filter-from-date" {...props} />
            )}
          />

          <FormDatePicker
            label="To"
            value={transactionFilters.to}
            onChange={createOnChange('to')}
            renderInput={(props) => (
              <TextField data-testid="filter-to-date" {...props} />
            )}
          />

          <FormNumber
            id="outlined-number"
            label="Amount Greater Than"
            data-testid="filter-amount-greater"
            onChange={createOnChange('amountGreaterThan')}
            value={transactionFilters.amountGreaterThan}
            inputProps={{ maxLength: 12, min: 0 }}
          />

          <FormNumber
            id="outlined-number"
            label="Amount Less Than"
            data-testid="filter-amount-less"
            onChange={createOnChange('amountLessThan')}
            value={transactionFilters.amountLessThan}
            inputProps={{ maxLength: 12, min: 0 }}
          />
        </div>

        <div>
          <Button
            className={classes.drawerButton}
            type="button"
            size="large"
            variant="contained"
            color="secondary"
            onClick={onApply}
            data-testid="apply-filter"
            fullWidth
          >
            Apply
          </Button>
          <Button
            className={classes.drawerButton}
            size="large"
            type="button"
            variant="outlined"
            onClick={onReset}
            data-testid="reset-filter"
            fullWidth
          >
            Reset
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
