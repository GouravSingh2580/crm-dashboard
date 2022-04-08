import { IBankAccount } from 'hooks/dataFormatters/useBankAccountForDashboard';
import { sendHeapEvent } from './heap';

export const sendBankAccountToggle = (account: IBankAccount) => {
  sendHeapEvent('AccountImport', {
    'Bank Name': account.connectionName,
    'Account Name': account.name,
    'Account Type': account.subtype,
    Status: account.isConnected,
  });
};

export const sendBankTransactionCategorize = (
  transactionName: string,
  oldCategory: string | boolean,
  newCategory: string | boolean,
) => {
  sendHeapEvent('CategoryTransactions', {
    'Transaction Name': transactionName,
    'Old Transaction Type': oldCategory as string,
    'New Transaction Type': newCategory as string,
  });
};

export const sendBankConnectResult = (data: {
  bankName?: string,
  status: 'Success' | 'Failed',
  accountCount: number,
  country?: string
}) => {
  sendHeapEvent('ConnectBank', {
    'Bank name': data.bankName || 'Unknown',
    Status: data.status,
    '# of Accounts': data.accountCount,
    Country: data.country,
  });
};

export const sendBankDelete = (data: {
  bankName?: string,
  status: 'Success' | 'Failed',
  accountCount: number,
  country?: string
}) => {
  sendHeapEvent('DeleteBank', {
    'Bank name': data.bankName,
    Status: data.status,
    '# of Accounts': data.accountCount,
    Country: data.country,
  });
};
