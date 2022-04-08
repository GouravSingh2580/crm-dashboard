import { AuthService } from 'services';
import { documentAdmin } from 'hooks/api/__tests__/documents.mock';
import { FormationsDocument, useDocumentsTableData } from '../useDocumentsTableData';

jest.mock('services', () => ({
  __esModule: true,
  AuthService: {
    isAdmin: jest.fn(),
  },
}));
const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('useDocumentsTableData test', () => {

  it('should return default data', () => {
    expect(useDocumentsTableData([])).toStrictEqual([]);
  });

  it('should have isVisibilityEditable', () => {
    mockedAuthService.isAdmin.mockReturnValue(true);
    expect(useDocumentsTableData([documentAdmin] as FormationsDocument[])).toHaveProperty(
      '0.isVisibilityEditable',
      true,
    );
  });
});
