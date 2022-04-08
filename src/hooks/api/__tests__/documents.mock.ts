import {
  EDocumentStatus,
  FormationsDocument,
} from 'hooks/dataFormatters/useDocumentsTableData';

export const documentOne: FormationsDocument = {
  companyId: '61433ad6628a77836c23a806',
  file: undefined,
  id: '619d1a4ed23789a535a44ed1',
  title: 'Without a document category!',
  status: EDocumentStatus.Submitted,
  forYear: 2021,
  metadata: {
    mimeType: 'image/png',
    size: 90890,
    filename: 'Screenshot 2021-10-30 at 4.29.59 PM.png',
    hash: '295a9bf0964a5143c1ba72d2235c1bb6',
  },
  visibleToCustomer: true,
  uploader: {
    id: '61433ad6628a77836c23a806',
    name: {
      first: 'Test',
      middle: 'Tesd',
      last: 'Adskljtnhradjksl',
    },
    role: 'Customer',
  },
  uploadedAt: '2021-11-23T16:43:58.612Z'
};

export const documentTwo: FormationsDocument = {
  file: undefined,
  id: '619c067d8abb495a1d108c4f',
  companyId: '60469c089deb34d7485e36d6',
  title: 'Without a document category!',
  status: 'Submitted' as EDocumentStatus,
  forYear: 2021,
  metadata: {
    mimeType: 'image/png',
    size: 90890,
    filename: 'Screenshot 2021-10-30 at 4.29.59 PM.png',
    hash: '295a9bf0964a5143c1ba72d2235c1bb6',
  },
  visibleToCustomer: true,
  uploader: {
    id: '61433ad6628a77836c23a806',
    name: {
      first: 'Test',
      middle: 'Tesd',
      last: 'Adskljtnhradjksl',
    },
    role: 'Customer',
  },
  uploadedAt: '2021-11-22T21:07:09.207Z'
};

export const documentAdmin: FormationsDocument = {
  file: undefined,
  id: '619c067d8abb495a1d108c4f',
  companyId: '60469c089deb34d7485e36d6',
  title: 'Admin Document',
  status: 'Submitted' as EDocumentStatus,
  forYear: 2021,
  metadata: {
    mimeType: 'image/png',
    size: 90890,
    filename: 'Screenshot 2021-10-30 at 4.29.59 PM.png',
    hash: '295a9bf0964a5143c1ba72d2235c1bb6',
  },
  visibleToCustomer: true,
  uploader: {
    id: '61433ad6628a77836c23a806',
    name: {
      first: 'Test',
      middle: 'Tesd',
      last: 'Adskljtnhradjksl',
    },
    role: 'Admin',
  },
  uploadedAt: '2021-11-22T21:07:09.207Z'
};

export const createResponse = (documents: object[]) => ({
  data: documents,
  pageInfo: {
    pageCount: 1,
    pageSize: 100,
    totalCount: documents.length,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  },
});
