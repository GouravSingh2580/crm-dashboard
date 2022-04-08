import { transformDocFormForUpdate } from 'components/documents/EditDocumentDialog';
import { DocumentFormData } from 'components/documents/DocumentForm';

describe('transformDocFormForUpdate', () => {
  const document: DocumentFormData = {
    year: 2000,
    category: 'sample category',
    subcategory: 'sub category',
    department: 'department',
    categoryId: '123896asd7123',
    visibleToCustomer: true,
    companyId: 'companyId_123', // hidden field, cannot be changed
    accountId: 'accountId_123', // hidden field, cannot be changed}
  };
  it('should convert only necessary field correctly', () => {
    const form = transformDocFormForUpdate(document);
    expect(form).toStrictEqual({
      year: 2000,
      documentCategoryId: '123896asd7123',
      visibleToCustomer: true,
    });
  });
  it('should omit empty field', () => {
    const form = transformDocFormForUpdate({
      ...document,
      year: undefined,
    });
    expect(form).toStrictEqual({
      documentCategoryId: '123896asd7123',
      visibleToCustomer: true,
    });
  });
});
