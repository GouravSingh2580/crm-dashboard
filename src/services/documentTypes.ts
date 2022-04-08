import { EDocumentStatus } from 'hooks/dataFormatters/useDocumentsTableData';

export type DocumentYear = number | 'Permanent';
export interface CreateDocumentForm {
  file: any;
  title: string;
  companyId?: string;
  accountId?: string;
  year: DocumentYear;
  documentCategoryId?: string;
  visibleToCustomer?: boolean;
  emailTemplateId?: string;
}

export interface UpdateDocumentForm {
  file?: any;
  title?: string;
  companyId?: string;
  accountId?: string;
  year?: DocumentYear;
  documentCategoryId?: string;
  visibleToCustomer?: boolean;
  emailTemplateId?: string;
}

export interface DocumentCategory {
  id: string;
  department: string;
  category: string;
  subcategory: string;
}

export interface DocumentEmail {
  id: string;
  type: string;
  name: string;
}

export interface IUploadedFile {
  lastModified: string;
  name: string;
  size: number;
  type: string;
}

export interface IMetadata {
  filename: string;
  hash: string;
  mimeType: string;
  size: number;
}

export interface IFileUploader {
  accountId: string;
  bankAccountNumber: string;
  bankAccountType: string;
  companyId: string;
  createdAt: string;
  email: string;
  id: string;
  name: {
    first: string;
    middle: string;
    last: string;
  };
  role: string;
  updatedAt: string;
}
export interface IDocumentType {
  accountId: string;
  companyId: string;
  documentCategory: DocumentCategory;
  forYear: DocumentYear;
  id: string;
  metadata: IMetadata;
  status: string;
  title: string;
  uploadedAt: string;
  uploader: IFileUploader;
  visibleToCustomer: boolean;
}

export interface FormationsDocument {
  id: string;
  file: any;
  title: string;
  companyId: string;
  documentCategory?: {
    id: string;
    department?: string;
    category?: string;
    subcategory?: string;
  };
  visibleToCustomer?: boolean;
  uploader: {
    id: string;
    role: string;
    name?: {
      first: string;
      middle: string;
      last: string;
    };
  };
  metadata: {
    filename: string;
    mimeType?: string;
    size?: number;
    hash?: string;
  };
  forYear: DocumentYear;
  uploadedAt: string;
  status: EDocumentStatus;
  statusReason?: string;
}

export const toFormData = (form: UpdateDocumentForm): FormData => {
  const formData = new FormData();

  if (form.file !== undefined) {
    formData.append('file', form.file);
  }

  if (form.title !== undefined) {
    formData.append('title', form.title);
  }

  if (form.year !== undefined) {
    formData.append('year', form.year.toString());
  }

  if (form.companyId !== undefined) {
    formData.append('companyId', form.companyId);
  }

  if (form.documentCategoryId) {
    formData.append('documentCategoryId', form.documentCategoryId);
  }

  if (form.accountId) {
    formData.append('accountId', form.accountId);
  }

  if (typeof form.visibleToCustomer === 'boolean') {
    formData.append('visibleToCustomer', form.visibleToCustomer.toString());
  }

  if (form.emailTemplateId) {
    formData.append('emailTemplateId', form.emailTemplateId);
  }

  return formData;
};
