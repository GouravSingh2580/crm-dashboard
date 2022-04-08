import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
} from 'react-query';
import { AccountService } from 'services';
import {
  AccountStatus,
  defaultPageInfo,
  getAccount,
  getAccountsList,
  getAccountsMeta,
  GetAccountsListProps,
  IAccount,
  IMetadata,
  updateStatus,
} from 'services/account';
import { sendProgressTrackerEvent } from 'helpers/heap/progressTrackerEvent';
import {
  IAccountListItem,
  IAccountRequest,
  ProgressTrackerEvent,
} from 'models/account';
import queryClient from 'states/reactQueryClient';
import { useCurrentUser, useUser } from './useUser';
import { ApiListResp, PageInfo } from '../../models/api';

type IUseAccountsList = ApiListResp<IAccountListItem[]>;
export const useAccountsList = (
  props: GetAccountsListProps,
): Omit<UseQueryResult<IUseAccountsList>, 'data'> & {
  accounts: IAccountListItem[];
  pageInfo: PageInfo;
} => {
  const { data, ...rest } = useQuery<IUseAccountsList>(
    ['accounts', props],
    () => getAccountsList(props),
    // NOTE: Disabled query caching for now because cache needs to be invalidated when
    // taxFormCompletionStatus updates, but the place where this updates do not have all
    // the rest of the query key components to invalidate the cache.
    { cacheTime: 0 },
  );

  return {
    accounts: data?.data || [],
    pageInfo: data?.pageInfo || defaultPageInfo,
    ...rest,
  };
};

export const useAccount = (
  id: string | undefined,
  queryProps?: UseQueryOptions<IAccount>,
) => {
  const { data, ...rest } = useQuery<IAccount>(
    ['account', id],
    () => getAccount(id!),
    {
      enabled: !!id,
      ...queryProps,
    },
  );

  return {
    account: data,
    ...rest,
  };
};

export const useAccountByUserId = (userId: string) => {
  const { user } = useUser(userId);
  return useAccount(user?.accountId);
};

export const useCurrentAccount = (queryProps?: UseQueryOptions<IAccount>) => {
  const { currentUser } = useCurrentUser();
  const accountId = currentUser?.accountId || '';

  const { data, ...rest } = useQuery<IAccount>(
    ['progressTracker', accountId],
    () => getAccount(accountId),
    {
      enabled: !!accountId,
      ...queryProps,
    },
  );
  return {
    currentAccount: data,
    ...rest,
  };
};

type UpdateAccountVariables = Omit<Partial<IAccountRequest>, 'id'>;
export const useUpdateAccount = (
  accountId?: string,
  updateProps?: UseMutationOptions<unknown, unknown, UpdateAccountVariables>,
) =>
  useMutation<unknown, unknown, UpdateAccountVariables>(
    (params) => {
      if (accountId) {
        return AccountService.updateAccountById(accountId, params);
      }
      throw new Error('Account is not found');
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['account', accountId]);
      },
      ...updateProps,
    },
  );

export const useUpdateCurrentAccount = (
  updateProps?: UseMutationOptions<unknown, unknown, UpdateAccountVariables>,
) => {
  const { currentUser } = useCurrentUser();
  const accountId = currentUser?.accountId || undefined;
  return useUpdateAccount(accountId, updateProps);
};

const defaultAccountMeta = {
  total: 0,
  types: [],
};
export const useAccountsMeta = () => {
  const { data, ...rest } = useQuery<IMetadata>(['accountsMeta'], () =>
    getAccountsMeta(),
  );
  return {
    accountMeta: data || defaultAccountMeta,
    ...rest,
  };
};

interface UpdateStatusVariables {
  id: string;
  label: AccountStatus;
}
export const useUpdateAccountStatus = (
  mutateProp?: UseMutationOptions<unknown, unknown, UpdateStatusVariables>,
) =>
  useMutation(
    ({ id, label }: UpdateStatusVariables) => updateStatus(id, label),
    mutateProp,
  );

type UpdateProgressProps = Pick<IAccountRequest, 'progress'> & {
  eventData?: ProgressTrackerEvent;
};
export const useUpdateAccountProgress = (
  accountId: string | undefined,
  mutationOptions?: UseMutationOptions<
    unknown,
    unknown,
    UpdateAccountVariables
  >,
) => {
  const { mutateAsync, ...rest } = useUpdateAccount(accountId, mutationOptions);

  return {
    mutateAsync: async (updateProps: UpdateProgressProps) => {
      const { progress, eventData } = updateProps;
      try {
        await mutateAsync({ progress });
        if (eventData) {
          sendProgressTrackerEvent({
            accountId,
            ...eventData,
          });
        }
      } catch (e) {
        if (eventData) {
          sendProgressTrackerEvent({
            accountId,
            ...eventData,
            status: 'error',
          });
        }
      }
    },
    ...rest,
  };
};
