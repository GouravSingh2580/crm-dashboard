import { clone, cloneDeep, set } from 'lodash';
import useBankAccountForDashboard from '../useBankAccountForDashboard';

describe('useBankAccountForDashboard test', () => {
  it('should return empty array', () => {
    expect(useBankAccountForDashboard(undefined)).toStrictEqual([]);
    expect(useBankAccountForDashboard(null)).toStrictEqual([]);
    expect(useBankAccountForDashboard([])).toStrictEqual([]);
    // @ts-ignore
    expect(useBankAccountForDashboard({})).toStrictEqual([]);
  });
  const sampleAccounts: any = [{
    id: '456',
    name: 'Bank Name',
    error_msg: '',
    updated_at: undefined,
    accounts: [{
      id: '123',
      account_id: 'acc_123',
      connection_id: 'conn_123',
      is_connected: true,
      name: 'sample name',
      official_name: 'Checking Account',
      balance: 0,
      currency: 'USD',
      type: 'checking',
      subtype: 'saving',
    }],
  }];

  it('should return default value', () => {
    expect(useBankAccountForDashboard(sampleAccounts)).toStrictEqual(
      [
        {
          bankId: '456',
          name: 'Bank Name',
          errorMsg: '',
          updatedAt: undefined,
          accounts: [
            {
              id: '123',
              accountId: 'acc_123',
              connectionId: 'conn_123',
              isConnected: true,
              balance: 0,
              currency: 'USD',
              name: 'sample name',
              officialName: 'Checking Account',
              type: 'checking',
              subtype: 'saving',
              connectionName: 'Bank Name',
            },
          ],
        },
      ],
    );
  });

  it('updateAt should be available', () => {
    const accounts = clone(sampleAccounts);
    accounts[0].updated_at = '2021-11-11';
    const data = useBankAccountForDashboard(accounts);
    expect(data[0]).toHaveProperty('updatedAt');
    expect(data[0].updatedAt?.format('YYYY-MM-DD')).toBe('2021-11-11');
  });

  it('isConnected should be boolean', () => {
    const account = cloneDeep(sampleAccounts);
    set(account, '[0].accounts[0].is_connected', undefined);
    expect(useBankAccountForDashboard(account)[0].accounts[0].isConnected).toBe(false);
    expect(useBankAccountForDashboard(sampleAccounts)[0].accounts[0].isConnected).toBe(true);
    set(account, '[0].accounts[0].is_connected', false);
    expect(useBankAccountForDashboard(account)[0].accounts[0].isConnected).toBe(false);
  });
});
