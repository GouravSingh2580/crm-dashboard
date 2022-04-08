import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks/dom';
import queryClient from 'states/reactQueryClient';
import {
  getLinkToken,
  setAccessToken as setAccessTokenService,
  deleteBankConnection as deleteBankConnectionService,
  getAccounts,
  getConnections,
  getReconnectLinkToken,
  resetConnectionErrorMessage,
  updateAccountConnected,
} from 'services/bankAccount';
import {
  usePlaidLinkToken,
  useAccessToken,
  useConnectionDeleting,
  useBankAccounts,
  useBankReconnection,
  useConnectionResetErrorMessage,
  useBankAccountEnabling,
} from '../useBankAccount';
import createQueryWrapper, { mockedQueryClient } from '../__testMock__/TestComponent';

jest.mock('services/bankAccount', () => ({
  __esModule: true,
  getLinkToken: jest.fn(),
  setAccessToken: jest.fn(),
  deleteBankConnection: jest.fn(),
  getAccounts: jest.fn(),
  getConnections: jest.fn(),
  getReconnectLinkToken: jest.fn(),
  resetConnectionErrorMessage: jest.fn(),
  updateAccountConnected: jest.fn(),
}));
jest.mock('states/reactQueryClient', () => ({
  resetQueries: jest.fn(),
  invalidateQueries: jest.fn(),
}));

const getLinkTokenMock = getLinkToken as jest.Mock;
const setAccessTokenServiceMock = setAccessTokenService as jest.Mock;
const deleteBankConnectionServiceMock = deleteBankConnectionService as jest.Mock;

describe('useBankAccount test', () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = createQueryWrapper();
  });
  const accountId = 'testId';
  describe('usePlaidLinkToken test', () => {
    // jest.fn().mockReturnValueOnce
    it('success test', async () => {
      getLinkTokenMock.mockReturnValueOnce(Promise.resolve({ token: '1234' }));
      const { result } = renderHook(
        () => usePlaidLinkToken(accountId), { wrapper },
      );

      await waitFor(() => result.current.isSuccess);

      expect(result.current.error).toBeFalsy();
      expect(result.current.data).toBe('1234');
    });

    it('failing test', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      getLinkTokenMock.mockReturnValueOnce(Promise.reject(new Error('testing error')));
      const { result } = renderHook(
        () => usePlaidLinkToken(accountId), { wrapper },
      );
      await waitFor(() => result.current.isError);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useAccessToken test', () => {
    it('success test', async () => {
      setAccessTokenServiceMock.mockReturnValueOnce(Promise.resolve());
      const onSuccess = jest.fn();

      const { result } = renderHook(
        () => useAccessToken(accountId, { onSuccess }), { wrapper: createQueryWrapper() },
      );
      await act(async () => {
        await result.current.setAccessTokenAsync('public_key');
      });
      expect(result.current.isSuccess).toBe(true);
      expect(onSuccess).toBeCalled();
    });

    it('failing test', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      setAccessTokenServiceMock.mockReturnValueOnce(Promise.reject(new Error('test')));
      const onError = jest.fn();
      const { result } = renderHook(
        () => useAccessToken(accountId, { onError }), { wrapper: createQueryWrapper() },
      );

      try {
        act(() => {
          result.current.setAccessToken('public_key');
        });
      } catch {
        expect(onError).toBeCalled();
      }
    });
  });

  describe('useBankAccounts', () => {
    const sampleAccounts = [
      {
        id: 'Ql3RnaJ8eAtQrwlaQgBjfmoeyywjQGHpAWQwG',
        connection_id: 'c7a98dba-1b01-11ec-a3fd-aa665a499f3d',
        name: 'Plaid Checking',
        type: 'depository',
        is_connected: false,
        official_name: 'Plaid Gold Standard 0% Interest Checking',
        created_at: '2021-09-21T10:32:46.626873-07:00',
        updated_at: '2021-09-21T10:32:51.072667-07:00',
        account_id: '61268a98f3bb3878775c469f',
      },
      {
        id: 'Zamk3Gq9xAcypjPRyElouGLjZZngyMCgkDyer',
        connection_id: 'c7a98dba-1b01-11ec-a3fd-aa665a499f3d',
        name: 'Plaid Saving',
        type: 'depository',
        is_connected: false,
        official_name: 'Plaid Silver Standard 0.1% Interest Saving',
        created_at: '2021-09-21T10:32:46.636803-07:00',
        updated_at: '2021-09-21T10:32:51.078479-07:00',
        account_id: '61268a98f3bb3878775c469f',
      }];
    const sampleConnections = [{
      id: 'c7a98dba-1b01-11ec-a3fd-aa665a499f3d',
      account_id: '61268a98f3bb3878775c469f',
      name: 'Chase',
      user_id: '',
      item_id: 'wv86reKLz1iRZNmjRxnltrbN1ANZ8bireBe5q',
      last_fetch_date: '0000-12-31T15:47:32-08:12',
      created_at: '2021-09-21T10:31:40.036745-07:00',
      updated_at: '2021-09-21T10:31:40.036745-07:00',
    }];

    beforeEach(() => {
      mockedQueryClient.resetQueries();
    });
    it('success test', async () => {
      (getAccounts as jest.Mock).mockReturnValue(Promise.resolve(sampleAccounts));
      (getConnections as jest.Mock).mockReturnValue(Promise.resolve(sampleConnections));

      const { result, waitFor: waitUntil } = renderHook(
        () => useBankAccounts(accountId), { wrapper },
      );

      await waitUntil(() => result.current.connections.length > 0);
      expect(result.current.error).toBeFalsy();
      expect(result.current.connections).toStrictEqual([{
        id: 'c7a98dba-1b01-11ec-a3fd-aa665a499f3d',
        account_id: '61268a98f3bb3878775c469f',
        name: 'Chase',
        user_id: '',
        item_id: 'wv86reKLz1iRZNmjRxnltrbN1ANZ8bireBe5q',
        last_fetch_date: '0000-12-31T15:47:32-08:12',
        created_at: '2021-09-21T10:31:40.036745-07:00',
        updated_at: '2021-09-21T10:31:40.036745-07:00',
        accounts: [{
          id: 'Ql3RnaJ8eAtQrwlaQgBjfmoeyywjQGHpAWQwG',
          connection_id: 'c7a98dba-1b01-11ec-a3fd-aa665a499f3d',
          name: 'Plaid Checking',
          type: 'depository',
          is_connected: false,
          official_name: 'Plaid Gold Standard 0% Interest Checking',
          created_at: '2021-09-21T10:32:46.626873-07:00',
          updated_at: '2021-09-21T10:32:51.072667-07:00',
          account_id: '61268a98f3bb3878775c469f',
        },
        {
          id: 'Zamk3Gq9xAcypjPRyElouGLjZZngyMCgkDyer',
          connection_id: 'c7a98dba-1b01-11ec-a3fd-aa665a499f3d',
          name: 'Plaid Saving',
          type: 'depository',
          is_connected: false,
          official_name: 'Plaid Silver Standard 0.1% Interest Saving',
          created_at: '2021-09-21T10:32:46.636803-07:00',
          updated_at: '2021-09-21T10:32:51.078479-07:00',
          account_id: '61268a98f3bb3878775c469f',
        }],
      }]);
    });

    it('get account service failed', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      (getAccounts as jest.Mock).mockReturnValue(Promise.reject(new Error('get account failed')));
      (getConnections as jest.Mock).mockReturnValue(Promise.resolve(sampleConnections));
      const { result, waitFor: waitUntil } = renderHook(
        () => useBankAccounts(accountId), { wrapper },
      );

      await waitUntil(() => result.current.error != null);
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toHaveProperty('message', 'get account failed');
    });

    it('get connections service failed', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      (getAccounts as jest.Mock).mockReturnValue(Promise.resolve(sampleAccounts));
      (getConnections as jest.Mock).mockReturnValue(Promise.reject(new Error('get connection failed')));
      const { result, waitFor: waitUntil } = renderHook(
        () => useBankAccounts(accountId), { wrapper },
      );

      await waitUntil(() => result.current.error != null);
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toHaveProperty('message', 'get connection failed');
    });
  });

  describe('deleteBankAccount', () => {
    const connectionId = 'c7a98dba-1b01-11ec-a3fd-aa665a499f3d';
    it('success test', async () => {
      deleteBankConnectionServiceMock.mockReturnValue(Promise.resolve());
      const onSuccess = jest.fn();
      const { result, waitFor: waitUntil } = renderHook(
        () => useConnectionDeleting(accountId, { onSuccess }),
        { wrapper },
      );
      await act(() => result.current.deleteConnection(connectionId));
      await waitUntil(() => result.current.isSuccess);
      expect(result.current.isSuccess).toBeTruthy();
      expect(onSuccess).toBeCalled();
      expect(queryClient.invalidateQueries).toBeCalledTimes(2);
    });

    it('failed test', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {
        // do nothing
      });
      deleteBankConnectionServiceMock.mockReturnValue(Promise.reject(new Error('custom error')));
      const onError = jest.fn();
      const { result } = renderHook(
        () => useConnectionDeleting(accountId, { onError }),
        { wrapper },
      );
      try {
        await act(() => result.current.deleteConnection(connectionId));
      } catch {
        // do nothing
      } finally {
        expect(onError).toBeCalled();
      }
    });
  });

  describe('useBankReconnection', () => {
    it('success returning link token', async () => {
      const onSuccess = jest.fn();
      const connectionId = '123';
      (getReconnectLinkToken as jest.Mock).mockResolvedValue({ token: 'link_token_sample' });
      const { result, waitFor: waitUntil } = renderHook(
        () => useBankReconnection({ accountId, connectionId }, { onSuccess }),
        { wrapper },
      );

      await waitUntil(() => result.current.isSuccess);
      expect(result.current.linkToken).toBe('link_token_sample');
    });

    it('should throw error if service fail', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      const onSuccess = jest.fn();
      const connectionId = '123';
      (getReconnectLinkToken as jest.Mock).mockRejectedValue(new Error('custom error'));
      const { result, waitFor: waitUntil } = renderHook(
        () => useBankReconnection({ accountId, connectionId }, { onSuccess }),
        { wrapper },
      );

      await waitUntil(() => result.current.isError);
      expect(result.current.error).toHaveProperty('message', 'custom error');
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('useConnectionResetErrorMessage', () => {
    it('should perform successfully', async () => {
      const onSuccess = jest.fn();
      const connectionId = '123';
      (resetConnectionErrorMessage as jest.Mock).mockResolvedValue({});
      const { result, waitFor: waitUntil } = renderHook(
        () => useConnectionResetErrorMessage({ accountId, connectionId }, { onSuccess }),
        { wrapper },
      );
      act(() => {
        result.current.resetConnectionErrorMessage();
      });
      await waitUntil(() => result.current.isSuccess);
    });

    it('should return account id cannot be null', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      const onSuccess = jest.fn();
      const connectionId = '123';
      (resetConnectionErrorMessage as jest.Mock).mockResolvedValue({});
      const { result, waitFor: waitUntil } = renderHook(
        () => useConnectionResetErrorMessage({ accountId: undefined, connectionId }, { onSuccess }),
        { wrapper },
      );
      await act(async () => {
        try {
          await result.current.resetConnectionErrorMessage();
        } catch (e) {
          // do nothing
        }
      });
      await waitUntil(() => result.current.isError);
      expect(result.current.error).toHaveProperty('message', 'Account id is null');
    });

    it('should return error', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      const onError = jest.fn();
      const connectionId = '123';
      (resetConnectionErrorMessage as jest.Mock).mockRejectedValue(new Error('custom error'));
      const { result, waitFor: waitUntil } = renderHook(
        () => useConnectionResetErrorMessage({ accountId, connectionId }, { onError }),
        { wrapper },
      );
      await act(async () => {
        try {
          await result.current.resetConnectionErrorMessage();
        } catch (e) {
          // do nothing
        }
      });
      await waitUntil(() => result.current.isError);
      expect(result.current.error).toHaveProperty('message', 'custom error');
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('useBankAccountEnabling test', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const setup = async () => {
      const { result, waitFor: waitUntil } = renderHook(
        () => useBankAccountEnabling({ accountId, bankAccountId: '123' }, { onSuccess, onError }),
        { wrapper },
      );
      await act(async () => {
        try {
          await result.current.setBankAccountEnabling(true);
        } catch (e) {
          // do nothing
        }
      });
      return { result, waitUntil };
    };
    it('success case', async () => {
      (updateAccountConnected as jest.Mock).mockResolvedValue('');
      const { result, waitUntil } = await setup();
      await waitUntil(() => result.current.isSuccess);
      expect(result.current.isSuccess).toBe(true);
      expect(onSuccess).toBeCalled();
    });
    it('error case', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { /* do nothing */ });
      (updateAccountConnected as jest.Mock).mockRejectedValue(new Error('custom error'));
      const { result, waitUntil } = await setup();
      await waitUntil(() => result.current.isError);
      expect(result.current.isError).toBe(true);
      expect(onError).toBeCalled();
    });
  });
});
