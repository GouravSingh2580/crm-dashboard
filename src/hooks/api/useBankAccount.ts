import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  getLinkToken,
  setAccessToken as setAccessTokenService,
  getAccounts,
  deleteBankConnection as deleteBankConnectionService,
  getConnections,
  getReconnectLinkToken,
  resetConnectionErrorMessage,
  updateAccountConnected,
  ConnectionResp,
  AccountResp,
} from 'services/bankAccount';
import queryClient from 'states/reactQueryClient';

interface LinkTokenResp {
  token: string;
}

interface MutationCallBack {
  onSuccess?: () => void;
  onError?: () => void;
}

/* eslint-enabled camelcase */

export const usePlaidLinkToken = (accountId: string | undefined) =>
  useQuery<string, Error>(
    ['plaidLinkToken', accountId],
    () => getLinkToken(accountId!).then((data: LinkTokenResp) => data.token),
    { enabled: !!accountId },
  );

export const useAccessToken = (accountId: string, props?: any) => {
  const moreProps = {
    ...props,
    onSuccess: (data: any) => {
      if (props && props.onSuccess) props.onSuccess(data);
    },
  };
  const {
    mutate: setAccessToken,
    mutateAsync: setAccessTokenAsync,
    ...rest
  } = useMutation(
    (publicToken: string) => setAccessTokenService(publicToken, accountId),
    moreProps,
  );
  return {
    setAccessToken,
    setAccessTokenAsync,
    ...rest,
  };
};

export interface BankAccount extends ConnectionResp {
  accounts: AccountResp[];
}

export const useBankAccounts = (
  accountId: string | undefined,
  queryProps: any = {},
) => {
  const [connections, setConnections] = useState<BankAccount[]>([]);
  const refresh = async () => {
    await queryClient.invalidateQueries(['connections', accountId]);
    await queryClient.invalidateQueries(['bankAccounts', accountId]);
  };

  const banksQuery = useQuery<ConnectionResp[], Error>(
    ['connections', accountId],
    () => getConnections(accountId!),
    { enabled: !!accountId, ...queryProps },
  );
  const accountsQuery = useQuery<AccountResp[], Error>(
    ['bankAccounts', accountId],
    () => getAccounts(accountId!),
    { enabled: !!accountId, ...queryProps },
  );
  useEffect(() => {
    if (banksQuery.data && accountsQuery.data) {
      const conn = banksQuery.data.map((connection: ConnectionResp) => {
        let accounts: AccountResp[] = [];
        try {
          accounts = accountsQuery.data.filter(
            (acc: AccountResp) => acc.connection_id === connection.id,
          );
        } catch {
          accounts = [];
        }
        return {
          ...connection,
          accounts,
        };
      });
      setConnections(conn);
    }
  }, [banksQuery.data, accountsQuery.data]);

  return {
    connections,
    refresh,
    error: banksQuery.error || accountsQuery.error,
    isLoading: banksQuery.isLoading || accountsQuery.isLoading,
    isFetching: banksQuery.isFetching || accountsQuery.isFetching,
  };
};

export const useConnectionDeleting = (
  accountId: string,
  props?: MutationCallBack,
) => {
  const moreProps = {
    ...props,
    onSuccess: () => {
      queryClient.invalidateQueries(['connections', accountId]);
      queryClient.invalidateQueries(['bankAccounts', accountId]);
      props?.onSuccess?.();
    },
    onError: props?.onError,
  };
  const { mutateAsync, isLoading, isSuccess, isError } = useMutation(
    (connectionId: string) =>
      deleteBankConnectionService(accountId, connectionId),
    moreProps,
  );

  return {
    deleteConnection: mutateAsync,
    isLoading,
    isSuccess,
    isError,
  };
};

interface ReconnectInput {
  accountId?: string;
  connectionId: string;
}

export const useBankReconnection = (
  { accountId, connectionId }: ReconnectInput,
  props?: MutationCallBack,
) => {
  const { data, ...rest } = useQuery<string, Error>(
    ['updateLinkToken', accountId, connectionId],
    () =>
      getReconnectLinkToken(accountId!, connectionId).then(
        (resp) => resp.token,
      ),
    {
      ...props,
      enabled: !!accountId && !!connectionId,
    },
  );

  return {
    linkToken: data,
    ...rest,
  };
};

export const useConnectionResetErrorMessage = (
  { accountId, connectionId }: ReconnectInput,
  props?: MutationCallBack,
) => {
  const { mutateAsync, ...rest } = useMutation(() => {
    if (accountId) {
      return resetConnectionErrorMessage(accountId, connectionId);
    }
    return Promise.reject(new Error('Account id is null'));
  }, props);
  return {
    resetConnectionErrorMessage: mutateAsync,
    ...rest,
  };
};

interface IBankAccountEnabling {
  accountId: string;
  bankAccountId: string;
}

export const useBankAccountEnabling = (
  { accountId, bankAccountId }: IBankAccountEnabling,
  props?: MutationCallBack,
) => {
  const { mutateAsync, ...rest } = useMutation((enabled: boolean) => {
    if (accountId) {
      return updateAccountConnected(accountId, bankAccountId, enabled);
    }
    return Promise.reject(new Error('Account id is null'));
  }, props);

  return {
    setBankAccountEnabling: mutateAsync,
    ...rest,
  };
};
