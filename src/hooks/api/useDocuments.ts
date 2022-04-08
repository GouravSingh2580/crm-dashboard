import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseQueryOptions,
  UseMutationOptions,
} from 'react-query';
import {
  createDocumentByAccountId,
  deleteDocument,
  getDocumentCategories,
  getDocuments,
  getDocumentEmails,
  updateDocument,
  getDocumentById,
  approveDocument,
  rejectDocument,
  defaultApiResponseMetaData,
  GetDocumentsParams,
} from 'services/document';
import { FormationsDocument } from 'hooks/dataFormatters/useDocumentsTableData';
import {
  CreateDocumentForm,
  DocumentCategory,
  DocumentEmail,
  UpdateDocumentForm,
} from 'services/documentTypes';
import { ApiListResp, PageInfo } from '../../models/api';

export const getDocumentsByCompany = async (
  companyId: string,
  page: string,
  size?: string,
): Promise<ApiListResp<FormationsDocument[]>> => {
  if (!companyId) return { data: [], pageInfo: defaultApiResponseMetaData };
  return getDocuments({
    companyId,
    page,
    size,
  });
};

export const getDocumentsByCategoryAndSubcategory = async (
  companyId: string,
  page: string,
  category: string,
  subcategory: string,
): Promise<ApiListResp<FormationsDocument[]>> => {
  if (!companyId) return { data: [], pageInfo: defaultApiResponseMetaData };
  return getDocuments({
    companyId,
    page,
    category,
    subcategory,
  });
};

export const getDocumentsByAccountId = async (
  accountId: string | undefined,
  page: string | number,
  size?: string,
): Promise<ApiListResp<FormationsDocument[]>> => {
  if (!accountId) return { data: [], pageInfo: defaultApiResponseMetaData };
  return getDocuments({
    accountId,
    page,
    size,
  });
};

// Hooks
type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;
type QueryResult<T> = Omit<UseQueryResult<T>, 'data'>;
type DocumentsQueryResult = QueryResult<
  ApiListResp<FormationsDocument[]>
> & {
  documents: FormationsDocument[];
  pageInfo: PageInfo;
};
type CategoriesQueryResult = QueryResult<DocumentCategory[]> & {
  categories: DocumentCategory[];
};
type EmailsQueryResult = QueryResult<DocumentEmail[]> & {
  emails: DocumentEmail[];
};
type MutateOptions<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
> = Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>;

export const useDocumentsQuery = (
  params: GetDocumentsParams,
  queryOps?: QueryOptions<ApiListResp<FormationsDocument[]>>,
): DocumentsQueryResult => {
  const { data, ...rest } = useQuery<
  ApiListResp<FormationsDocument[]>,
    unknown
  >(['documents', params], () => getDocuments(params), queryOps);

  return {
    documents: data?.data || ([] as FormationsDocument[]),
    pageInfo: data?.pageInfo || defaultApiResponseMetaData,
    ...rest,
  };
};

interface DocumentsByCompanyProps {
  id: string;
  page: string;
  size?: string;
}
export const useDocumentsByCompany = (
  { id, page, size }: DocumentsByCompanyProps,
  queryProps?: QueryOptions<ApiListResp<FormationsDocument[]>>,
): DocumentsQueryResult => {
  const { data, ...rest } = useQuery<
    ApiListResp<FormationsDocument[]>,
    unknown
  >(
    ['documents', 'companyId', id, page, size],
    () => getDocumentsByCompany(id, page, size),
    queryProps,
  );

  return {
    documents: data?.data || [],
    pageInfo: data?.pageInfo || defaultApiResponseMetaData,
    ...rest,
  };
};

interface DocumentByAccountProps {
  accountId: string | undefined;
  page: string | number;
  size?: string;
}
export const useDocumentsByAccount = (
  { accountId, page, size }: DocumentByAccountProps,
  queryProps?: QueryOptions<ApiListResp<FormationsDocument[]>>,
): DocumentsQueryResult => {
  const { data, ...rest } = useQuery<
    ApiListResp<FormationsDocument[]>,
    unknown
  >(
    ['documents', 'accountId', accountId, page, size],
    () => getDocumentsByAccountId(accountId, page, size),
    queryProps,
  );
  return {
    documents: data?.data || [],
    pageInfo: data?.pageInfo || defaultApiResponseMetaData,
    ...rest,
  };
};

export const useDocument = (
  id: string,
  queryProps?: QueryOptions<FormationsDocument>,
): QueryResult<FormationsDocument> & {
  document: FormationsDocument | undefined;
} => {
  const { data, ...rest } = useQuery<FormationsDocument, unknown>(
    ['documents', id],
    () =>
      getDocumentById(id).then((resp) => {
        if (resp.length > 0) {
          return resp[0];
        }
        throw new Error('Document not found');
      }),
    queryProps,
  );

  return {
    document: data,
    ...rest,
  };
};

export const useDocumentCategories = (
  queryProps?: QueryOptions<DocumentCategory[]>,
): CategoriesQueryResult => {
  const { data, ...rest } = useQuery<DocumentCategory[]>(
    ['documents/categories'],
    () => getDocumentCategories(),
    queryProps,
  );

  return {
    categories: data || [],
    ...rest,
  };
};

export const useDocumentEmails = (
  queryProps?: QueryOptions<DocumentEmail[]>,
): EmailsQueryResult => {
  const { data: emails, ...rest } = useQuery<DocumentEmail[], unknown>(
    ['documents/emails'],
    () => getDocumentEmails(),
    queryProps,
  );
  return {
    emails: emails || [],
    ...rest,
  };
};

interface CreateDocumentVariables {
  form: CreateDocumentForm;
}
export const useCreateDocument = (
  queryProps?: MutateOptions<unknown, unknown, CreateDocumentVariables>,
) =>
  useMutation(
    ({ form }: CreateDocumentVariables) => createDocumentByAccountId(form),
    queryProps,
  );

export interface UpdateDocumentVariables {
  id: string;
  form: CreateDocumentForm;
}
export const useUpdateDocument = (
  queryProps?: MutateOptions<UpdateDocumentForm, unknown, UpdateDocumentVariables>,
) =>
  useMutation(
    ({ id, form }: UpdateDocumentVariables) => updateDocument(id, form),
    queryProps,
  );

export const useDeleteDocument = (
  queryProps?: MutateOptions<unknown, unknown, string>,
) => useMutation((id: string) => deleteDocument(id), queryProps);

interface ApproveDocumentVariables {
  id: string;
}
export const useApproveDocument = (
  queryProps?: MutateOptions<unknown, unknown, ApproveDocumentVariables>,
) => useMutation(({ id }) => approveDocument(id), queryProps);

interface RejectDocumentVariables {
  id: string;
  form: { reason: string };
}
export const useRejectDocument = (
  queryProps?: MutateOptions<unknown, unknown, RejectDocumentVariables>,
) =>
  useMutation(
    ({ id, form }: { id: string; form: { reason: string } }) =>
      rejectDocument(id, form),
    queryProps,
  );
