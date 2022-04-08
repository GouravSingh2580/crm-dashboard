import { transformForCreateDocument } from 'components/documents/AdminUploadDialog';
import { DocumentFormData } from 'components/documents/DocumentForm';
import { omit } from 'lodash';

describe('transformForCreateDocument', () => {
  const document: DocumentFormData = {
    year: 2000,
    category: 'sample category',
    subcategory: 'sub category',
    department: 'department',
    categoryId: '123896asd7123',
    visibleToCustomer: true,
    companyId: 'companyId_123', // hidden field, cannot be changed
    accountId: 'accountId_123', // hidden field, cannot be changed}
    emailTemplateId: '1',
  };
  const files = [new File([], 'name_1'), new File([], 'name_2')];
  it('should only convert necessary field', () => {
    const formData = transformForCreateDocument(document, files);
    expect(formData.length).toBe(2);
    expect(formData[0]).toStrictEqual({
      accountId: document.accountId,
      companyId: document.companyId,
      file: files[0],
      title: files[0].name,
      year: document.year,
      documentCategoryId: document.categoryId,
      visibleToCustomer: document.visibleToCustomer,
      emailTemplateId: document.emailTemplateId,
    });
  });
  it('should have default year', () => {
    const formData = transformForCreateDocument(omit(document, 'year'), files);
    expect(formData.length).toBe(2);
    expect(formData[0]).toStrictEqual({
      accountId: document.accountId,
      companyId: document.companyId,
      file: files[0],
      title: files[0].name,
      year: new Date().getFullYear(),
      documentCategoryId: document.categoryId,
      visibleToCustomer: document.visibleToCustomer,
      emailTemplateId: document.emailTemplateId,
    });
  });
});
