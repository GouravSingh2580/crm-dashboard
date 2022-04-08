import { CONFIG } from 'config';
import nock from 'nock';
import { useDocumentsByCompany } from 'hooks/api/useDocuments';
import { renderHook } from '@testing-library/react-hooks';
import { createResponse, documentOne, documentTwo } from './documents.mock';

const apiMock = nock(CONFIG.apiUrl);

describe.skip('useDocuments tests', () => {
  describe('useDocumentsByCompany test', () => {
    it('success', async () => {
      apiMock
        .get('documents')
        .reply(200, createResponse([documentOne, documentTwo]));

      const { result, waitFor } = renderHook(() =>
        useDocumentsByCompany({ id: '123', page: '1' }),
      );
      await waitFor(() => result.current.isSuccess);
      expect(result.current.documents).toHaveLength(2);
      expect(result.current.pageInfo).toHaveProperty('totalCount', 2);
    })
  });
});
