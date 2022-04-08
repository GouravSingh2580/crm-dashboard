import {
  PlaidLinkError,
  usePlaidLink,
} from 'react-plaid-link';
import queryClient from 'states/reactQueryClient';
import { useBankReconnection, useConnectionResetErrorMessage } from './useBankAccount';

const stubFn = () => {
  /** do nothing * */
};

interface ActionProps {
  accountId: string;
  connectionId: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}
export const useBankReconnectAction = ({
  accountId,
  connectionId,
  onSuccess = stubFn,
  onError = stubFn,
}: ActionProps) => {
  const {
    linkToken,
  } = useBankReconnection({
    accountId,
    connectionId,
  });
  const {
    resetConnectionErrorMessage,
  } = useConnectionResetErrorMessage({
    accountId,
    connectionId,
  });
  const onReconnectSuccess = async () => {
    try {
      await resetConnectionErrorMessage();
      await Promise.all([
        queryClient.invalidateQueries(['connections', accountId]),
        queryClient.invalidateQueries(['bankAccounts', accountId]),
      ]);
      onSuccess();
    } catch (e) {
      onError(e);
    }
  };
  const onExit = async (error: PlaidLinkError | null) => {
    if (error != null && error.error_message) {
      onError(error);
    }
  };

  const config = {
    onSuccess: onReconnectSuccess,
    onExit,
    token: linkToken || '',
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { ready, ...rest } = usePlaidLink(config);

  return {
    ready: linkToken == null ? false : ready,
    ...rest,
  };
};
