import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from 'react-query';
import {
  createCompanyByUserId,
  getCompanyById,
  getCompanyByUserId,
  updateCompanyById,
} from 'services/companies';
import { Company } from 'models/company';
import { useCurrentUser } from './useUser';

export const useCompanyByUserId = (
  id?: string,
  queryProps?: UseQueryOptions<Company | undefined>,
) => {
  const { data, ...rest } = useQuery<Company | undefined, unknown>(
    ['company/user', 'userid', id],
    () =>
      getCompanyByUserId(id).then((companies) => {
        if (companies.length > 0) {
          return companies[0];
        }
        return undefined;
      }),
    queryProps,
  );

  return {
    company: data,
    ...rest,
  };
};

export const useCurrentCompany = () => {
  const { currentUser } = useCurrentUser();
  const companyId = currentUser?.companyId;
  const { data, ...rest } = useQuery<Company>(
    ['getCompany', companyId],
    () => getCompanyById(companyId!),
  );
  return {
    currentCompany: data,
    ...rest,
  };
};

interface UseUpdateCompanyVariables {
  id: string;
  data: any;
}
export const useUpdateCompany = (
  mutationProps?: UseMutationOptions<
    unknown,
    unknown,
    UseUpdateCompanyVariables
  >,
) =>
  useMutation(
    ({ id, data }: UseUpdateCompanyVariables) => updateCompanyById(id, data),
    mutationProps,
  );

interface UseCreateCompanyVariables {
  userId: string;
  data: any;
}
export const useCreateCompany = (
  mutationProps?: UseMutationOptions<
    unknown,
    unknown,
    UseCreateCompanyVariables
  >,
) =>
  useMutation(
    ({ userId, data }: UseCreateCompanyVariables) =>
      createCompanyByUserId(userId, data),
    mutationProps,
  );
