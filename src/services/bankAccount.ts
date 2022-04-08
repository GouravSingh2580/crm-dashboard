import { bookkeepingService } from './bookkeepingService';

/* eslint-disable camelcase */
export interface ConnectionResp {
  id: string;
  account_id: string;
  name: string;
  item_id: string;
  last_fetch_date: string;
  error_msg: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AccountResp {
  id: string;
  account_id: string;
  type: string;
  official_name: string;
  connection_id: string;
  name: string;
}

export const getLinkToken = async (accountId: string) =>
  bookkeepingService({
    method: 'POST',
    url: `/accounts/${accountId}/plaid/token`,
  }).then((resp) => resp.data);

export const setAccessToken = async (publicToken: string, accountId: string) =>
  bookkeepingService({
    method: 'POST',
    url: `/accounts/${accountId}/connections`,
    data: {
      publicToken,
    },
  }).then((resp) => resp.data);

export const getAccounts = async (accountId: string): Promise<AccountResp[]> =>
  bookkeepingService
    .get<AccountResp[]>(`/accounts/${accountId}/bank-accounts`)
    .then((resp) => resp.data);

export const getConnections = async (
  accountId: string,
): Promise<ConnectionResp[]> =>
  bookkeepingService
    .get<ConnectionResp[]>(`/accounts/${accountId}/connections`)
    .then((resp) => resp.data);

export const deleteBankConnection = async (
  accountId: string,
  connectionId: string,
): Promise<any> =>
  bookkeepingService({
    method: 'DELETE',
    url: `/accounts/${accountId}/connections/${connectionId}`,
  });

export const getReconnectLinkToken = async (
  accountId: string,
  connectionId: string,
): Promise<any> =>
  bookkeepingService({
    method: 'PUT',
    url: `/accounts/${accountId}/connections/${connectionId}`,
  }).then((resp) => resp.data);

export const resetConnectionErrorMessage = async (
  accountId: string,
  connectionId: string,
): Promise<any> =>
  bookkeepingService({
    method: 'PATCH',
    url: `/accounts/${accountId}/connections/${connectionId}`,
    data: { error_msg: '' },
  }).then((resp) => resp.data);

export const updateAccountConnected = async (
  accountId: string,
  bankAccountId: string,
  enabled: boolean,
): Promise<unknown> =>
  bookkeepingService({
    method: 'PATCH',
    url: `/accounts/${accountId}/bank-accounts/${bankAccountId}`,
    data: { is_connected: enabled },
  }).then((resp) => resp.data);
