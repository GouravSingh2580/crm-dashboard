import { useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { setIdentify } from 'helpers/heap';
import { useSavedCalculatorState } from 'states';
import { AuthService, HubspotService, UsersService } from 'services';
import { AxiosError } from 'axios';
import { hasStatusCode, StatusCode } from 'services/errors';
import { Loading } from 'components/common';
import { Routes } from 'fnRoutes';
import { useContactId } from '../hooks';

interface UserAuth0 {
  email: string;
}

const PostAuth = () => {
  const history = useHistory();
  const { contactId, resetContactId } = useContactId();
  const { persistedData } = useSavedCalculatorState();
  const { user, getAccessTokenSilently, isLoading } = useAuth0<UserAuth0>();

  /**
   * Update hubspot props.
   *
   * 1. If contactId is present means user has came from one of following flow
   *    - Through marketing email link i.e. hs_cid available in querystring.
   *    - Regsitering himself through the download report form on calculator result page.
   * 2. If both are not available means user has done his calculations and directly trying to
   * register using `join formations` on result page.
   */
  const updateHubSpotProps = useCallback(
    async (userAuth0: UserAuth0) => {
      let params = {
        contactId: '',
      };

      if (!contactId) {
        const { contactId: _contactId } =
          await HubspotService.upsertContactProperties({
            email: userAuth0.email,
            firstName: null,
            results: persistedData || {},
          });
        params = {
          contactId: _contactId,
        };
      }

      // To prevent using the same information
      resetContactId();
      return params;
    },
    [contactId, persistedData, resetContactId],
  );

  const getUserInfo = useCallback(
    async (userAuth0: UserAuth0) => {
      // set identity for heap tracking
      setIdentify(userAuth0.email);
      try {
        await UsersService.getCurrentUser();
      } catch (error) {
        if (hasStatusCode(error as AxiosError, StatusCode.NotFound)) {
          const { contactId: hubspotContactId } = await updateHubSpotProps(
            userAuth0,
          );
          // Register user
          const { email } = userAuth0;
          await UsersService.upsertUser({ email, contactId: hubspotContactId });

          if (hubspotContactId) {
            // If contact Id is null we get it in updateHubSpotProps()
            await HubspotService.updateTimeContactProperties(
              HubspotService.TimestampAccountType.REGISTRATION,
              hubspotContactId,
            );
          }
        } else {
          throw error;
        }
      } finally {
        AuthService.clearAllData(true);
        await AuthService.refresh();
        history.push(Routes.HOME());
      }
    },
    [history, updateHubSpotProps],
  );

  useEffect(() => {
    const saveUserToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          AuthService.userToken(token);
        }
      } catch (error) {
        history.push(Routes.LOGIN);
      }
    };
    const processUser = async () => {
      if (user && !isLoading) {
        await saveUserToken();
        await getUserInfo(user);
        // @ts-ignore
      } else if (!user && !isLoading && !window.Cypress) {
        // when use purposely enter /postlogin url, verify the access token
        // if access token can be retrieved, redirect to homepage
        // otherwise, redirect to login
        try {
          await getAccessTokenSilently();
          history.push(Routes.HOME());
        } catch (e) {
          history.push(Routes.LOGIN);
        }
      }
    };
    processUser();
  }, [user, isLoading, history, getAccessTokenSilently, getUserInfo]);

  // Cypress Login
  useEffect(() => {
    // @ts-ignore
    if (!window.Cypress) return;
    const auth0: null | {
      token: string;
      user: {
        email: string;
      };
    } = JSON.parse(localStorage.getItem('auth0Cypress')!);
    if (!auth0) return;
    AuthService.userToken(auth0.token);
    getUserInfo(auth0.user);
  }, [getUserInfo]);

  useEffect(() => {
    if (user) {
      Sentry.setUser({
        email: user?.email,
      });
    }
  }, [user]);

  return <Loading />;
};

export default PostAuth;
