import { isNil, omitBy } from 'lodash';
import { FormationsDocument } from 'hooks/dataFormatters/useDocumentsTableData';
import {
  CreateDocumentForm,
  DocumentCategory,
  DocumentEmail,
  toFormData,
  UpdateDocumentForm,
} from 'services/documentTypes';
import { api } from './axios';
import { ApiListResp, ApiResponse } from '../models/api';

export interface GetDocumentsParams {
  companyId?: string;
  page?: string | number;
  size?: string | number;
  category?: string;
  subcategory?: string;
  accountId?: string;
}

export const defaultApiResponseMetaData = {
  currentPage: 1,
  pageCount: 0,
  pageSize: 0,
  totalCount: 0,
  prevPage: null,
  nextPage: null,
};

export const getDocuments = async (
  params: GetDocumentsParams,
): Promise<ApiListResp<FormationsDocument[]>> => {
  const newParams = omitBy(params, isNil);

  const { data } = await api.get<ApiListResp<FormationsDocument[]>>(
    'documents',
    {
      params: newParams,
    },
  );
  return data;
};

export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  const { data } = await api.get<ApiResponse<DocumentCategory[]>>(
    'documents/categories',
  );
  return data.data;
};

export const getDocumentEmails = async (): Promise<DocumentEmail[]> => {
  const { data } = await api.get<ApiResponse<DocumentEmail[]>>('documents/emails');
  return data.data;
};

interface CreateDocumentData {
  id: string;
}

export const createDocumentByAccountId = async (form: CreateDocumentForm) => {
  const { data } = await api.post<FormData, { data: CreateDocumentData }>(
    'documents',
    toFormData(form),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000,
    },
  );
  return data;
};

export const updateDocument = async (id: string, form: UpdateDocumentForm) => {
  const { data }: { data: UpdateDocumentForm } = await api.patch(`documents/${id}`, toFormData(form), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteDocument = async (id: string) => {
  const { data } = await api.delete(`documents/${id}`);
  return data;
};

export const downloadDocument = async (id: string) => {
  const { data } = await api.get(`documents/${id}/download`, {
    responseType: 'blob',
    timeout: 30000,
  });
  return data;
};

export const getDocumentById = async (
  id: string,
): Promise<FormationsDocument[]> => {
  const { data } = await api.get<ApiResponse<FormationsDocument[]>>(
    `documents/${id}`,
  );
  return data.data;
};

export const approveDocument = async (id: string) => {
  const { data } = await api.put(`documents/${id}/approve`);
  return data;
};

export const rejectDocument = async (id: string, form: { reason: string }) => {
  const { data } = await api.put(`documents/${id}/reject`, form);
  return data;
};
