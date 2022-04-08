import { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Loading } from 'components/common';
import { Sidebar } from 'layouts/Sidebar';
import { ProgressTrackerLayout } from 'layouts/ProgressTrackerLayout';
import { Onboarding } from 'components/Onboarding';
import { RoleBasedRouting } from 'RoleBasedRouting';
import { Routes } from './fnRoutes';
import { CONSTANTS } from './constants/common';

const SignUp = lazy(() => import('./views/SignUp'));
const PostAuth = lazy(() => import('./views/PostAuth'));
const Login = lazy(() => import('./views/Login'));
const LogoutView = lazy(() => import('./views/LogoutView'));
const TermsAndConditions = lazy(() => import('./views/TermsAndConditions'));
const GustoAuth = lazy(() => import('./views/GustoAuth'))

const Subscription = lazy(() => import('./views/userSubscription'));
const Calculator = lazy(() => import('./views/calculator/index'));
const CalculatorResult = lazy(() => import('./views/calculator/result'));

interface ICustomRedirect {
  location?: {
    pathname?: string,
    search?: string,
  }
}

const CustomRedirect = ({ location = {} }: ICustomRedirect) => {
  const { pathname, search } = location;

  if (pathname === '/' && search) {
    return <div />;
  }
  return <Redirect from="/" to={Routes.HOME()} />;
};

export const Routing = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      {/* dashboard routes */}
      <Route path="/dashboard" component={Sidebar} />

      <Route path="/subscription" exact component={Subscription} />

      <Route path="/postlogin*" component={PostAuth} />
      <Route path="/postsignup*" exact component={PostAuth} />
      <Route path="/signup" exact component={SignUp} />
      <Route path="/login" exact component={Login} />
      <Route path="/logout" exact component={LogoutView} />
      <Route path="/calculator" exact component={Calculator} />
      <Route path="/calculator/result" exact component={CalculatorResult} />
      <RoleBasedRouting path="/terms" exact component={TermsAndConditions} role={CONSTANTS.USER_ROLES.CUSTOMER} />
      <RoleBasedRouting role={CONSTANTS.USER_ROLES.CUSTOMER} path="/onboarding/:id(business-type|incorporation-status)" exact component={Onboarding} />
      <Route
        exact
        path={Routes.PROGRESS_TRACKER}
        component={ProgressTrackerLayout}
      />
      <RoleBasedRouting path="/gusto/callback" exact role={CONSTANTS.USER_ROLES.ADMIN} component={GustoAuth} />
      <CustomRedirect />
    </Switch>
  </Suspense>
);
