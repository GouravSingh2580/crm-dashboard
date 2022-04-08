import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { DocumentYear } from 'services/documentTypes';
import { UseCategoryData } from './helper';

export interface ICategoryState {
  year?: DocumentYear,
  department: string,
  category: string,
  subcategory: string,
}

interface ICategorizeSelectorsProps {
  value: ICategoryState,
  handleChange: (type: string, value: string | DocumentYear) => void,
  lockDownCategory?: {
    department: string,
    category: string,
    subcategory: string,
  },
  options: UseCategoryData,
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1, 0),
    minHeight: '4.5rem',
  },
  h5: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(4),
  },
}));

export const CategorizeSelectors: React.FC<ICategorizeSelectorsProps> = ({
  value,
  handleChange,
  lockDownCategory,
  options,
}) => {
  const {
    yearOptions,
    departmentOptions,
    categoryOptions,
    subCategoryOptions,
  } = options;
  const classes = useStyles();

  return (
    <>
      <FormControl
        variant="outlined"
        fullWidth
        className={classes.formControl}
        data-testid="document-field-year"
      >
        <InputLabel>Year</InputLabel>
        <Select
          value={value.year || ''}
          onChange={({ target: { value: v } }) => handleChange('year', v)}
          label="Year"
        >
          {yearOptions.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl
        variant="outlined"
        fullWidth
        className={classes.formControl}
        disabled={!!lockDownCategory?.department}
        data-testid="document-field-department"
      >
        <InputLabel>Department</InputLabel>
        <Select
          value={value.department || ''}
          onChange={({ target: { value: v } }) =>
            handleChange('department', v)
          }
          label="Department"
        >
          {departmentOptions.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl
        variant="outlined"
        fullWidth
        disabled={!value.department || !categoryOptions.length ||!!lockDownCategory?.category}
        className={classes.formControl}
        data-testid="document-field-category"
      >
        <InputLabel>Category</InputLabel>
        <Select
          value={value.category || ''}
          onChange={({ target: { value: v } }) =>
            handleChange('category', v)
          }
          label="Category"
        >
          {categoryOptions.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl
        variant="outlined"
        fullWidth
        disabled={!value.category || !subCategoryOptions?.length || !!lockDownCategory?.subcategory}
        className={classes.formControl}
        data-testid="document-field-subcategory"
      >
        <InputLabel>Subcategory</InputLabel>
        <Select
          value={value.subcategory || ''}
          onChange={({ target: { value: v } }) =>
            handleChange('subcategory', v)
          }
          label="Subcategory"
        >
          {subCategoryOptions.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </Select>
      </FormControl>
    </>
  );
}
