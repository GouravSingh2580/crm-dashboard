import { useEffect, useState } from 'react';
import { useMediaQuery, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { loadStripe } from '@stripe/stripe-js';
import { useHookstate } from '@hookstate/core';
import { useHistory } from 'react-router-dom';

import { Routes } from '../fnRoutes';
import { MainLayout } from '../layouts';
import { SubscriptionAPI } from '../services/subscription';
import { CONFIG } from '../config';
import PricingDesktop from '../components/subscription/desktop/pricing';
import PricingMobile from '../components/subscription/mobile/index';
import { SubscriptionState } from '../states';
import {
  useUserData,
  useUpdateTimeContactProperties,
  useSubscriptionCheckout,
} from '../hooks';
import { TimestampAccountType } from '../services/hubspot';
import { Loading } from '../components/common';
import { getCurrentUserCompanies } from '../services/users';

const UserSubscription = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const subscriptionState = useHookstate(SubscriptionState);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const {
    mutate: checkout,
    data: checkoutData,
    error: checkoutError,
    isLoading: subscriptionIsLoading,
  } = useSubscriptionCheckout();
  const history = useHistory();
  const { data: userData, isLoading: userDataIsLoading } = useUserData();
  const { mutate: updateTimeContactProperties } =
    useUpdateTimeContactProperties();
  const [isLoading, setIsLoading] = useState(true);

  // User data
  useEffect(() => {
    if (!userData) {
      return;
    }
    if (!userData.isDataFilled()) {
      history.push(Routes.ONBOARDING, {
        showPopup: false,
      });
      return;
    }
    if (userData.hasUserSubscribed()) {
      history.push(Routes.HOME());
      return;
    }
    subscriptionState.isSoleProp.set(userData.isCompanySoleProp());
    updateTimeContactProperties({
      contactId: userData.userInfo.contactId,
      property: TimestampAccountType.PRICING_VIEWED,
    });
  }, [userData, history, updateTimeContactProperties]);

  useEffect(() => {
    const getData = async () => {
      if (checkoutData?.success) {
        history.push(Routes.HOME());
      } else if (checkoutData?.sessionId) {
        const stripe = await loadStripe(CONFIG.stripeClientId);
        await stripe?.redirectToCheckout({ sessionId: checkoutData.sessionId });
      }
    };
    getData();
  }, [checkoutData, history]);

  useEffect(() => {
    setError(checkoutError);
  }, [checkoutError]);

  const handleJoin = (plan) => {
    subscriptionState.plan.set(plan);
    checkout(subscriptionState.value);
  };

  useEffect(() => {
    const getData = async () => {
      const [data, companiesData] = await Promise.all([
        SubscriptionAPI.ListPlans(),
        getCurrentUserCompanies(),
      ]);
      data.forEach((plan) => {
        if (plan.type === 'INCORPORATION') {
          subscriptionState.incorporationPlan.set(plan);
        }
      });
      setPlans(data);
      const company = companiesData[0] ?? null;
      if (!company) {
        setError(new Error('No company was retrieved'));
        return;
      }
      const { state } = company.contactDetails.physicalAddress;

      setIsLoading(true);
      const stateFeePlan = await SubscriptionAPI.GetStateFee(state);
      subscriptionState.stateFeePlan.set(stateFeePlan);
      setIsLoading(false);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Pricing = (props) =>
    isSmallScreen ? (
      <PricingMobile {...props} />
    ) : (
      <PricingDesktop {...props} />
    );

  const onCloseErrorSnackbar = () => setError(null);

  if (userDataIsLoading) {
    return <Loading />;
  }
  return (
    <MainLayout header={false} footer={false}>
      {plans && plans.length ? (
        <Pricing
          plans={plans}
          onJoin={handleJoin}
          isLoading={subscriptionIsLoading || isLoading}
        />
      ) : null}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={onCloseErrorSnackbar}
      >
        <MuiAlert onClose={onCloseErrorSnackbar} severity="error">
          {error?.message}
        </MuiAlert>
      </Snackbar>
    </MainLayout>
  );
};

export default UserSubscription;
