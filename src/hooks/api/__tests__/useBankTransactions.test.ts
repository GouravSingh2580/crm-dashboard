import { act, renderHook } from '@testing-library/react-hooks';
import { getCategories, getTransactions } from 'services/bankTransactions';
import {
  useBankTransactions,
  useTransactionCategories,
  useUncategorizedTransactionCount,
} from '../useBankTransactions';
import { createQueryWrapper, mockedQueryClient } from '../__testMock__/TestComponent';
import { sampleCategories, sampleTransactionsResp } from './bankTransactions.mock';

jest.mock('services/bankTransactions', () => ({
  getTransactions: jest.fn(),
  getCategories: jest.fn(),
}));

async function initWrapper() {
  await mockedQueryClient.resetQueries();
  return createQueryWrapper();
}

describe('useBankTransactions test', () => {
  let wrapper: any;
  const accountId = '123';
  jest.spyOn(console, 'error').mockImplementation(() => { /** do nothing */ });

  beforeEach(async () => {
    wrapper = await initWrapper();
  });
  it('should return data', async () => {
    (getTransactions as jest.Mock).mockResolvedValue(sampleTransactionsResp);
    const { result, waitFor } = renderHook(() => useBankTransactions(accountId), { wrapper });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.transactions).toStrictEqual(sampleTransactionsResp);
  });

  it('should return error', async () => {
    (getTransactions as jest.Mock).mockRejectedValue(new Error('custom error'));
    const { result, waitFor } = renderHook(() => useBankTransactions(accountId), { wrapper });
    await waitFor(() => result.current.isError);
    expect(result.current.transactions).toBe(undefined);
    expect(result.current.error).toHaveProperty('message', 'custom error');
  });

  it('should be able update params', async () => {
    (getTransactions as jest.Mock).mockResolvedValueOnce(sampleTransactionsResp)
      .mockResolvedValueOnce({
        ...sampleTransactionsResp,
        pageInfo: {
          ...sampleTransactionsResp.pageInfo,
          page: 2,
        },
      });

    // first fetch
    const { result, waitFor } = renderHook(() => useBankTransactions(accountId), { wrapper });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.transactions).toStrictEqual(sampleTransactionsResp);
    expect(result.current.transactions).toHaveProperty('pageInfo.page', 1);

    // update params and refetch
    act(() => {
      result.current.updateParams({ page: 2 });
    });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.transactions).toHaveProperty('pageInfo.page', 2);
  });
});

describe('useTransactionCategories', () => {
  let wrapper: any;
  beforeEach(async () => {
    wrapper = await initWrapper();
  });

  it('should get categories list', async () => {
    (getCategories as jest.Mock).mockResolvedValue(sampleCategories);
    const { result, waitFor } = renderHook(() => useTransactionCategories(), { wrapper });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.categories).toStrictEqual(sampleCategories);
  });
});

describe('use Uncategorized count', () => {
  let wrapper: any;

  beforeEach(async () => {
    wrapper = await initWrapper();
  });

  it('should return ', async () => {
    (getCategories as jest.Mock).mockResolvedValue(sampleCategories);
    (getTransactions as jest.Mock).mockResolvedValueOnce({
      ...sampleTransactionsResp,
      pageInfo: {
        ...sampleTransactionsResp.pageInfo,
        total: 2,
      },
    });
    const { result, waitFor } = renderHook(() => useUncategorizedTransactionCount('123'), { wrapper });
    await waitFor(() => result.current.isLoading === false);
    expect(result.current.count).toBe(2);
  });
});
