import { Components } from '@mui/material';
import {
  button, table, alert, form, tab, pagination, breadscrumbs, accordion, input, stepper, list, badge,
} from './componentOverrides';

export const components: Components = {
  ...button,
  ...alert,
  ...form,
  ...table,
  ...tab,
  ...breadscrumbs,
  ...pagination,
  ...accordion,
  ...input,
  ...stepper,
  ...list,
  ...badge,
};
