import { Button, ButtonProps } from '@mui/material';
import { usePlaidLink } from 'react-plaid-link';
import { useAccessToken } from 'hooks/api/useBankAccount';
import { showToastOnError } from 'components/toast/showToast';
import { sendBankConnectResult } from 'helpers/heap/bookkeepingEvent';

interface Props extends ButtonProps {
  linkToken: string;
  accountId: string;
  disabled?: boolean;
  onConnected?: () => void;
  onError?: () => void;
}

export const ConnectionButton = ({
  linkToken,
  accountId,
  disabled,
  onConnected,
  size = 'large',
  variant = 'contained',
  color = 'primary',
  children = <>Connect to a bank</>,
  ...rest
}: Props) => {
  const { setAccessToken } = useAccessToken(accountId, {
    onError: showToastOnError,
    onSuccess: onConnected,
  });
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess: (publicLink, metadata) => {
      console.log('send heap connect Bank');
      // send heap event
      sendBankConnectResult({
        bankName: metadata.institution?.name,
        status: 'Success',
        accountCount: metadata.accounts.length,
      });
      setAccessToken(publicLink);
    },
    onExit: (error, metadata) => {
      // send heap event
      sendBankConnectResult({
        bankName: metadata.institution?.name,
        status: 'Failed',
        accountCount: 0,
      });
    },
  };

  const { open, ready } = usePlaidLink(config);

  if (!ready) return null;
  return (
    <Button
      {...rest}
      size={size}
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={() => open()}
      data-testid="connectButton"
    >
      {children}
    </Button>
  );
};

ConnectionButton.defaultProps = {
  disabled: false,
  onConnected: () => {
    // do nothing
  },
  onError: () => {
    // do nothing
  },
};
