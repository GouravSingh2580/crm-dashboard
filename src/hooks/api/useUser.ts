import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import { UsersService } from 'services';
import { getCurrentUser, getUser, getUserIdentity, updateUser, UserInfo } from 'services/users';

export const useCurrentUser = (): Omit<UseQueryResult<UserInfo>, 'data'> & {
  currentUser: UserInfo | undefined;
} => {
  const { data, ...rest } = useQuery<UserInfo, unknown>('currentUser', () =>
    getCurrentUser(),
  );
  return {
    currentUser: data,
    ...rest,
  };
};

export const useUser = (
  id: string,
): Omit<UseQueryResult<UserInfo>, 'data'> & {
  user: UserInfo | undefined;
} => {
  const { data, ...rest } = useQuery<UserInfo, unknown>(['user', id], () =>
    getUser(id),
  );
  return {
    user: data,
    ...rest,
  };
};

interface UpdateVariables {
  id?: string;
  data: any;
}
export const useUpdateUser = (
  queryProps?: Omit<
    UseMutationOptions<unknown, unknown, UpdateVariables>,
    'mutationFn'
  >,
) => {
  const { mutate, mutateAsync, ...rest } = useMutation(
    ({ id, data }: { id?: string; data: any }) => updateUser(data, id),
    queryProps,
  );
  return {
    updateUser: mutate,
    updateUserAsync: mutateAsync,
    ...rest,
  };
};

interface UserIdentityVariable {
  id: string;
  ssn: string;
}
export const useUpdateUserIdentity = (
  queryProps?: Omit<
    UseMutationOptions<unknown, unknown, UserIdentityVariable>,
    'mutationFn'
  >,
) => {
  const { mutate, mutateAsync, ...rest } = useMutation(
    ({ id, ssn }: { id: string; ssn: string }) =>
      UsersService.updateIdentityByUserId(id, { ssn }),
    queryProps,
  );

  return {
    updateUserIdentity: mutate,
    updateUserIdentityAsync: mutateAsync,
    ...rest,
  };
};

interface UserIdentity {
  ssn: {
    first5: string;
    last4: string;
  };
}
export const useUserIdentityById = (
  id: string,
  queryProps?: Omit<UseQueryOptions<UserIdentity>, 'queryKey' | 'queryFn'>,
) => {
  const { data, ...rest } = useQuery<UserIdentity>(
    ['user', 'identity', id],
    () => getUserIdentity(id),
    queryProps,
  );
  return { userIdentity: data, ...rest };
};
