import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from 'react-query';
import {
  connectGustoCompany, disconnectGustoCompany,
  getCurrentGustoAccount,
  getGustoCompanies,
  GustoAccountResp,
  GustoCompanyResp,
} from 'services/payroll';
import queryClient from 'states/reactQueryClient';

type GustoAccount = GustoAccountResp;
export const useGustoCurrentUser = (
  queryProps?: UseQueryOptions<GustoAccount>,
) => {
  const { data, ...rest } = useQuery<GustoAccount>(
    ['gustoCurrentAccount'],
    () => getCurrentGustoAccount(),
    queryProps,
  );
  return {
    currentGustoUser: data,
    ...rest,
  };
};

export type GustoCompany = GustoCompanyResp;
export const useGustoCompanies = (
  queryProps?: UseQueryOptions<GustoCompany[]>,
) => {
  const { data, ...rest } = useQuery<GustoCompany[]>(
    ['gustoCompanies'],
    () => getGustoCompanies(),
    queryProps,
  );
  return {
    gustoCompanies: data,
    ...rest,
  };
};

export const useConnectGustoCompany = (
  accountId: string,
  updateProps?: UseMutationOptions<unknown, unknown, string>,
) => {
  const { mutateAsync, mutate, ...rest } = useMutation<
    unknown,
    unknown,
    string
  >((uuid: string) => connectGustoCompany(accountId, uuid), {
    onSuccess: () => queryClient.invalidateQueries(['account', accountId]),
    ...updateProps,
  });
  return {
    connectGustoCompanyAsync: mutateAsync,
    connectGustoCompany: mutate,
    ...rest,
  };
};

export const useDisconnectGustoCompany = (
  accountId: string,
  updateProps?: UseMutationOptions,
) => {
  const { mutateAsync, mutate, ...rest } = useMutation(() => disconnectGustoCompany(accountId), {
    onSuccess: () => queryClient.invalidateQueries(['account', accountId]),
    ...updateProps,
  });

  return {
    disconnectGustoCompanyAsync: mutateAsync,
    disconnectGustoCompany: mutate,
    ...rest,
  };
};

