import { useCompanyByUserId } from 'hooks/api/useCompanies';
import { renderHook } from '@testing-library/react-hooks';
import createQueryWrapper, {
  mockedQueryClient,
} from 'hooks/api/__testMock__/TestComponent';
import nock from 'nock';
import { CONFIG } from 'config';

describe('useCompanies test', () => {
  const wrapper = createQueryWrapper();
  const userId = '123';
  const api = nock(CONFIG.apiUrl).defaultReplyHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'Authorization',
  });
  const respCompany = {
    id: '61d617457a5ce96810ff2e21',
    entityType: 'LLC',
    legacyEntityType: 'LLC',
    updatedAt: '2022-01-05T22:19:22.286Z',
    updatedBy: '61d617427a5ce96810ff2e20',
    hasBankAccount: false,
    bankName: 'Bank Of America',
  };

  beforeEach(() => {
    api.options(`/users/${userId}/companies`).reply(200);
  });

  describe('useCompanyByUserId test', () => {
    beforeEach(() => {
      mockedQueryClient.clear(); // clear query cached
    });

    it('should return empty array', async () => {
      api.get(`/users/${userId}/companies`).reply(200, {
        data: [],
      });
      const { result, waitFor } = renderHook(() => useCompanyByUserId(userId), {
        wrapper,
      });
      await waitFor(() => result.current.isSuccess);
      expect(result.current.company).toBe(undefined);
    });

    it('should return non empty company', async () => {
      api.get(`/users/${userId}/companies`).reply(200, {
        data: [respCompany],
      });
      const { result, waitFor } = renderHook(() => useCompanyByUserId(userId), {
        wrapper,
      });
      await waitFor(() => result.current.isSuccess);
      expect(result.current.company).toBeTruthy();
      expect(result.current.company).toHaveProperty(
        'id',
        '61d617457a5ce96810ff2e21',
      );
      expect(result.current.company).toHaveProperty(
        'bankName',
        'bankOfAmerica',
      );
    });
  });
});
