import { AuthService } from 'services';

export const Routes = {
  HOME: () => (AuthService.isAdmin() ? '/dashboard/accounts' : '/dashboard/welcome'),
  SIGNUP: '/signup',
  LOGIN: '/login',
  LOGOUT: '/logoout',
  POST_LOGIN: '/postlogin',
  TERMS_CONDITIONS: '/terms',
  POST_SIGNUP: '/postsignup',
  WELCOME: '/dashboard/welcome',
  ACCOUNTS: '/dashboard/accounts',
  TAX_LIABILITY_FORM: '/dashboard/tax-form',
  SUBSCRIPTION: '/subscription',
  DOCUMENTS: '/dashboard/documents',
  CALCULATOR: '/calculator',
  CALCULATOR_RESULT: '/calculator/result',
  MY_ACCOUNT: '/dashboard/account',
  MY_BANK: '/dashboard/banks',
  PROGRESS_TRACKER: '/progress-tracker',
  TRANSACTIONS: '/dashboard/transactions',
  ENTITY_SELECTION: '/onboarding/business-type',
  PROFILE: '/dashboard/profile', // for admin only to integrate gusto
};
