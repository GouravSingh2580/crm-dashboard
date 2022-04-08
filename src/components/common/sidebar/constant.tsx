import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { SvgIcon } from '@mui/material';
import { Routes } from 'fnRoutes';

interface IActionBase {
  id: string;
  Icon: typeof SvgIcon;
  text: string;
  path: string;
  featureFlag?: string;
}

export type ISubAction = Omit<IActionBase, 'Icon'>;
export interface IAction extends IActionBase {
  subActions?: Array<ISubAction>;
}

const CUSTOMER_ACTIONS: IAction[] = [
  {
    id: 'welcome',
    Icon: BarChartOutlinedIcon,
    text: 'Dashboard',
    path: Routes.WELCOME,
  },
  {
    id: 'bookkeeping',
    Icon: CreditCardIcon,
    text: 'Bookkeeping',
    path: '',
    featureFlag: 'bookkeeping',
    subActions: [
      {
        id: 'banks',
        text: 'Bank accounts',
        path: Routes.MY_BANK,
        featureFlag: 'bookkeeping',
      },
      {
        id: 'transactions',
        text: 'Bank transactions',
        path: Routes.TRANSACTIONS,
        featureFlag: 'bookkeeping',
      },
    ],
  },
  {
    id: 'documents',
    Icon: FolderOpenIcon,
    text: 'Documents',
    path: Routes.DOCUMENTS,
  },
];

const ADMIN_ACTIONS = [
  {
    id: 'accounts',
    Icon: AccountBalanceWalletIcon,
    text: 'Accounts',
    path: Routes.ACCOUNTS,
  },
];

export { CUSTOMER_ACTIONS, ADMIN_ACTIONS };
