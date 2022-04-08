import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useFeatureFlagIdentify } from 'hooks/useFeatureFlag';
import { RoleBasedRouting } from 'RoleBasedRouting';
import { CONFIG } from '../config';
import { SideBarLayout } from '../components/common';
import { AuthService } from '../services';

const Accounts = lazy(() => import('views/accounts'));
const AdminProfile = lazy(() => import('views/AdminProfile'));
const Documents = lazy(() => import('views/Documents'));
const Company = lazy(() => import('views/Company'));
const Welcome = lazy(() => import('views/dashboard'));
const MyAccount = lazy(() => import('views/MyAccount'));
const MyBankAccount = lazy(() => import('views/bank/BankAccountPage'));
const Transactions = lazy(() => import('views/bank/BankTransactions'));
const NotFoundPage = lazy(() =>
  import('views/NotFoundPage').then((df) => ({ default: df.NotFoundPage })),
);

export const Sidebar = () => {
  const role = (!AuthService.isCustomer() && AuthService.userRole()) || 'Admin';

  // setup feature flag
  useFeatureFlagIdentify();

  return (
    <SideBarLayout>
      <Switch>
        <RoleBasedRouting
          role="Customer"
          path="/dashboard/welcome"
          component={Welcome}
        />
        <RoleBasedRouting
          role="Customer"
          path="/dashboard/account"
          component={MyAccount}
        />
        <RoleBasedRouting
          isEnabled={CONFIG.enableDocuments}
          role="Customer"
          path="/dashboard/documents"
          exact
          component={Documents}
        />

        <RoleBasedRouting
          role="Customer"
          path="/dashboard/banks"
          component={MyBankAccount}
        />

        <RoleBasedRouting
          role="Customer"
          path="/dashboard/transactions"
          component={Transactions}
        />

        <RoleBasedRouting
          role={role}
          path="/dashboard/accounts/:id"
          exact
          component={Company}
        />

        <RoleBasedRouting
          role={role}
          path="/dashboard/accounts"
          exact
          component={Accounts}
        />

        <RoleBasedRouting
          role={role}
          path="/dashboard/profile"
          exact
          component={AdminProfile}
        />

        <Route path="/dashboard/*" component={NotFoundPage} />
      </Switch>
    </SideBarLayout>
  );
};
