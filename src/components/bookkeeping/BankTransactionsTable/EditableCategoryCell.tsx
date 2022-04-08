import React, { useState, useRef } from 'react';
import { MenuItem, ListSubheader, Select } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { MAIN_COLOR } from 'theme/constant';
import { INCOME_CATEGORIES } from 'enums';
import { CategoryItem } from 'services/bankTransactions';

interface Props {
  categories: Array<CategoryItem>;
  onChange: (newCategory: string) => void;
  category: string;
  categoryId: string | null;
  onToggleEditMode: (isEdit?: boolean) => void;
  reviewed?: boolean;
}

const useStyles = makeStyles((theme) => ({
  tableCell: {
    fontWeight: 500,
  },
  editableCategory: {
    fontWeight: 600,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  select: {
    padding: theme.spacing(2),
    paddingRight: theme.spacing(4),
    paddingLeft: 0,
    paddingBottom: theme.spacing(1),
    maxHeight: '524px',
    overflowY: 'auto',
    '& ul': {
      fontSize: '14px',
      color: MAIN_COLOR,
      padding: '0 !important',
    },
  },
  listSubHeader: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(4),
  },
  listOption: {
    paddingLeft: theme.spacing(8),
    fontSize: '14px',
    opacity: '0.7',
  },
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiSelect-select': {
      width: '0',
    },
  },
}));

export const EditableCategoryCell = ({
  category,
  categories,
  categoryId,
  onChange,
  onToggleEditMode,
  reviewed = false,
}: Props) => {
  const classes = useStyles();
  const [editedCategory, setEditedCategory] = useState<string>(category);
  const [open, setOpen] = useState<boolean>(false);

  const sortCategories = (x: CategoryItem, y: CategoryItem) => {
    if (x.name < y.name) {
      return -1;
    }
    if (x.name > y.name) {
      return 1;
    }
    return 0;
  };

  const getIncomeCategories = () =>
    categories
      .filter((item) => INCOME_CATEGORIES.includes(item.name))
      .sort(sortCategories);

  const getExpenseCategories = () =>
    categories
      .filter((item) => !INCOME_CATEGORIES.includes(item.name))
      .sort(sortCategories);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLLIElement>(null);

  const getMenuList = (list: Array<CategoryItem>) =>
    list.map((categoryItem) => (
      <MenuItem
        value={categoryItem.name}
        key={categoryItem.id}
        className={classes.listOption}
      >
        {categoryItem.name}
      </MenuItem>
    ));

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    if (reviewed) return;
    setOpen(true);
  };

  return (
    <div className={classes.fieldContainer}>
      <div
        role="button"
        tabIndex={0}
        className={reviewed ? classes.tableCell : classes.editableCategory}
        onClick={handleOpen}
        onKeyDown={handleOpen}
        data-testid="transaction-category-toggle"
      >
        {categoryId ? editedCategory : 'Choose A Category'}
      </div>
      <Select
        style={{
          fontSize: 14,
          visibility: 'hidden',
          padding: 0,
        }}
        ref={wrapperRef}
        MenuProps={{ classes: { paper: classes.select } }}
        data-testid="transaction-category-select"
        inputProps={{ 'data-testid': 'transaction-category-select-input' }}
        onChange={(event) => {
          setEditedCategory(event.target.value as string);
          const { id } = categories.filter(
            (item) => item.name === event.target.value,
          )[0];
          onChange(id);
          onToggleEditMode();
        }}
        value={open ? editedCategory : ''}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <ListSubheader
          ref={listRef}
          className={classes.listSubHeader}
          key="income"
        >
          Income Categories
        </ListSubheader>
        {getMenuList(getIncomeCategories())};
        <ListSubheader className={classes.listSubHeader} key="expense">
          Expense Categories
        </ListSubheader>
        {getMenuList(getExpenseCategories())}
      </Select>
    </div>
  );
};
