import { sortBy } from 'lodash';
import moment, { Moment } from 'moment';

export interface IBankAccount {
  id: string;
  accountId: string;
  connectionId: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  subtype: string;
  isConnected: boolean;
  connectionName: string;
}

export interface IBank {
  bankId: string;
  name: string;
  errorMsg: string;
  updatedAt: Moment | undefined;
  accounts: IBankAccount[];
}

// convert rawdata from API response to data that can be used in the frontend
const useBankAccountForDashboard = (rawData: any[] | undefined | null): IBank[] => (
  rawData == null || !Array.isArray(rawData) || rawData.length === 0
    ? []
    : rawData.map((connection) => ({
      bankId: connection.id,
      name: connection.name,
      errorMsg: connection.error_msg,
      updatedAt: connection.updated_at ? moment(connection.updated_at) : undefined,
      accounts: sortBy(connection.accounts, ['name']).map((account: any) => ({
        id: account.id,
        accountId: account.account_id,
        connectionId: account.connection_id,
        name: account.name,
        officialName: account.official_name,
        balance: account.balance || 0,
        currency: account.currency || 'USD',
        type: account.type,
        subtype: account.subtype,
        isConnected: Boolean(account.is_connected),
        connectionName: connection.name,
      })),
    })));

export default useBankAccountForDashboard;
