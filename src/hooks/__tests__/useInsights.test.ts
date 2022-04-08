import { renderHook } from '@testing-library/react-hooks';
import { getTransactionInsights } from '../../services/bankTransactions';
import {
    useTransactionInsights,
  } from '../api//useInsights';
import { createQueryWrapper, mockedQueryClient } from '../api/__testMock__/TestComponent';
import { sampleTransactionInsights } from '../api/__tests__/insights.mock';

jest.mock('services/bankTransactions', () => ({
  getTransactionInsights: jest.fn(),
}));

async function initWrapper() {
  await mockedQueryClient.resetQueries();
  return createQueryWrapper();
}

describe('useInsights test', () => {
  let wrapper: any;
  const accountId = '123';
  jest.spyOn(console, 'error').mockImplementation(() => { /** do nothing */ });

  beforeEach(async () => {
    wrapper = await initWrapper();
  });

  it('should return data', async () => {
    (getTransactionInsights as jest.Mock).mockResolvedValue(sampleTransactionInsights);
    const { result, waitFor } = renderHook(() => useTransactionInsights(accountId), { wrapper });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.transactionInsights).toStrictEqual(sampleTransactionInsights);
  });

  it('should return error', async () => {
    (getTransactionInsights as jest.Mock).mockRejectedValue(new Error('custom error'));
    const { result, waitFor } = renderHook(() => useTransactionInsights(accountId), { wrapper });
    await waitFor(() => result.current.isError);
    expect(result.current.transactionInsights).toBe(undefined);
    expect(result.current.error).toHaveProperty('message', 'custom error');
  });
});
