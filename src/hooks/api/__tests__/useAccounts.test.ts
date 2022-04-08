import { renderHook, WrapperComponent } from '@testing-library/react-hooks';
import {
  createQueryWrapper,
  mockedQueryClient,
} from 'hooks/api/__testMock__/TestComponent';
import { getAccount } from 'services/account';
import { useAccount } from '../useAccounts';

jest.mock('services/account', () => ({
  __esModule: true,
  getAccount: jest.fn(),
}));

async function initWrapper() {
  await mockedQueryClient.resetQueries();
  return createQueryWrapper();
}

const sampleGustoAccount = {
  id: '61268a98f3bb3878775c469f',
  gusto: {
    companyUUID: '1a98e61c-0646-4c51-bc9f-28cff7a7ec46',
    companyName: "O'Connor, Ginsberg, and Kagan LLC",
  },
};

describe('useAccount hook test', () => {
  let wrapper: WrapperComponent<any> | undefined;
  describe('gusto field test', () => {
    const id = '61268a98f3bb3878775c469f';
    beforeEach(async () => {
      wrapper = await initWrapper();
    });

    it('should success', async () => {
      (getAccount as jest.Mock).mockResolvedValue(sampleGustoAccount);

      const { result, waitFor } = renderHook(() => useAccount(id), { wrapper });
      await waitFor(() => result.current.isSuccess);
      expect(result?.current?.account?.gusto).toStrictEqual({
        companyUUID: '1a98e61c-0646-4c51-bc9f-28cff7a7ec46',
        companyName: "O'Connor, Ginsberg, and Kagan LLC",
      });
    });

    it('should receive empty gusto field', async () => {
      (getAccount as jest.Mock).mockResolvedValue({
        id: '61268a98f3bb3878775c469f',
      });

      const { result, waitFor } = renderHook(() => useAccount(id), { wrapper });
      await waitFor(() => result.current.isSuccess);
      expect(result?.current?.account?.gusto).toBeUndefined();
    });
  });
});
