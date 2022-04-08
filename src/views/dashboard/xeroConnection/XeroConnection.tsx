import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { AccountService } from 'services';
import { saveXeroCodeToServer } from 'services/xero';
import { generateXeroUrl } from 'helpers/xero';
import useUserData from 'hooks/useUserData';
import { Routes } from 'fnRoutes';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const XeroConnection = () => {
  const history = useHistory();
  const { data: userData } = useUserData();
  const [clientId, setClientId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const classes = useStyles();

  const getXeroStatus = async () => {
    const xeroStatus = await AccountService.getAccountsXero(
      userData?.userInfo.accountId || '',
    );
    setClientId(xeroStatus?.client_id || '');
  };

  const saveXeroCode = async (accountId: string, code: string, uri: string) => {
    await saveXeroCodeToServer(accountId, {
      code,
      redirect_url: uri,
    });
    // redirect back to same page without xero token
    history.push(`${Routes.WELCOME}/`);
  };

  const redirectToXero = () => {
    if (clientId) {
      const uri = generateXeroUrl(
        clientId,
        userData?.userInfo?.accountId || '',
      );
      window.location.replace(uri);
    }
  };

  useEffect(() => {
    const check = async () => {
      await getXeroStatus();
    };
    check();
  }, []);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const accountIdFromUrl = urlParams.get('state');
    if (clientId && accountIdFromUrl && code && !isLoading) {
      setIsLoading(true);
      // save the code to server
      saveXeroCode(
        accountIdFromUrl,
        code,
        `${window.location.origin}/dashboard/welcome`,
      );
    }
  }, [clientId, isLoading]);

  return (
    <div className={classes.pageContainer}>
      <Button onClick={redirectToXero}>Login to Xero</Button>
    </div>
  );
};
