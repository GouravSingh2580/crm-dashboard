import { FormationsDocument } from 'services/documentTypes';
import { EDocumentStatus } from 'hooks/dataFormatters/useDocumentsTableData';
import {
  generateDocumentFormData,
  getDocumentDataFromFormationsDocument,
} from 'components/documents/DocumentForm';
import { get } from 'lodash';

describe('getDocumentDataFromFormationsDocument', () => {
  const document: FormationsDocument = {
    id: '61ea5eb1dab9898a2d8eddae',
    companyId: '',
    accountId: '61ea5a24dab9898a2d8edda7',
    title: 'severin-candrian-7d7OR-RvufU-unsplash.jpg',
    status: EDocumentStatus.Approved,
    forYear: 2022,
    metadata: {
      mimeType: 'image/jpeg',
      size: 1313968,
      filename: 'severin-candrian-7d7OR-RvufU-unsplash.jpg',
      hash: '82b6731be658459009daf6b4b48b0de8',
    },
    documentCategory: {
      id: '606f7387f2b41b4bd023b6ab',
      department: 'Permanent',
      category: 'Notices and Letters',
      subcategory: 'Miscellaneous',
    },
    visibleToCustomer: true,
    uploader: {
      id: '61313607be6422d7e340f1b0',
      name: {
        first: 'Toan',
        middle: '',
        last: 'Nguyen',
      },
      accountId: '61313607be6422d7e340f1af',
      companyId: '61313625fe6170fdd47dcee7',
      contactId: '61313606fe6170fdd47dcee6',
      role: 'Admin',
      dob: '01/01/2000',
      createdAt: '2021-09-02T20:37:27.057Z',
      updatedAt: '2022-01-14T00:22:38.979Z',
      notification_preference: null,
      newsletter: null,
      bankName: 'Test bank',
      routingNumber: '123456789',
      bankAccountNumber: '1234567890',
      bankAccountType: 'checking',
      lastAcceptedVersion: '2021-09-06',
      tncAcceptedAt: '2021-09-09T19:43:06.989Z',
    },
    uploadedAt: '2022-01-21T07:20:17.197Z',
  } as unknown as FormationsDocument;
  it('should convert', () => {
    const formData = getDocumentDataFromFormationsDocument(document);
    expect(formData).toStrictEqual({
      year: document.forYear,
      department: document.documentCategory?.department,
      category: document.documentCategory?.category,
      subcategory: document.documentCategory?.subcategory,
      categoryId: document.documentCategory?.id,
      visibleToCustomer: get(document, 'visibleToCustomer', true),
      companyId: document.companyId, // hidden field, cannot be changed
      accountId: document.companyId, // hidden field, cannot be changed
    });
  });
});

describe('generateDocumentFormData', () => {
  it('should generate default data', () => {
    const formData = generateDocumentFormData();
    expect(formData).toStrictEqual({
      department: '',
      category: '',
      subcategory: '',
      visibleToCustomer: true,
    });
  });
  it('should override default data', () => {
    const formData = generateDocumentFormData({
      department: 'test_department',
      category: 'test_category',
      subcategory: 'test_category',
      visibleToCustomer: false,
    });
    expect(formData).toStrictEqual({
      department: 'test_department',
      category: 'test_category',
      subcategory: 'test_category',
      visibleToCustomer: false,
    });
  })
});
