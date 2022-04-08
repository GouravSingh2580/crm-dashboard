import { getCurrentUser } from 'services/users';
import { CONSTANTS } from '../constants/common';

const userId = (id?: string) => {
  if (id) {
    localStorage.setItem('fnUserId', id);
  }
  return localStorage.getItem('fnUserId');
};

const userCompanyId = (id?: string) => {
  if (id) {
    localStorage.setItem('fnUserCompanyId', id);
  }
  return localStorage.getItem('fnUserCompanyId');
};

const userRole = (role?: string) => {
  if (role) {
    localStorage.setItem('fnUserRole', role);
  }
  return localStorage.getItem('fnUserRole');
};

const userToken = (token?: string) => {
  if (token) {
    localStorage.setItem('fnUserToken', token);
  }
  return localStorage.getItem('fnUserToken');
};

/*
  Registered - Steps 1-3
  IncoporationDataReceived - Welcome page
*/
const userStage = (stage?: string) => {
  if (stage) {
    localStorage.setItem('fnUserStage', stage);
  }
  return localStorage.getItem('fnUserStage');
};

const userEmail = (email?: string) => {
  if (email) {
    localStorage.setItem('fnUserEmail', email);
  }
  return localStorage.getItem('fnUserEmail');
};

interface NameVariable {
  first?: string;
  last?: string;
  middle?: string;
}
const userName = (name?: NameVariable) => {
  if (name) {
    const { first, last } = name;
    localStorage.setItem('fnUserName', `${first} ${last}`);
  }
  return localStorage.getItem('fnUserName');
};

// cache T&C version
let fnUserLatestTnCVersion: string | undefined;

const userConsent = (lastAcceptedVersion?: string) => {
  if (lastAcceptedVersion) {
    fnUserLatestTnCVersion = lastAcceptedVersion;
  }
  return fnUserLatestTnCVersion;
};

const isAdmin = () =>
  Object.values(CONSTANTS.USER_ROLES).includes(userRole()!) &&
  userRole() !== CONSTANTS.USER_ROLES.CUSTOMER;

const isCustomer = () => userRole() === CONSTANTS.USER_ROLES.CUSTOMER;

//! Deprecated method, do not use
const incorporationDataReceived = () =>
  (userStage() || '').toLowerCase() ===
  'IncoporationDataReceived'.toLowerCase();

const clearAllData = (withoutToken = false) => {
  localStorage.removeItem('fnUserEmail');
  localStorage.removeItem('fnUserRole');
  localStorage.removeItem('fnUserStage');
  localStorage.removeItem('fnUserId');
  localStorage.removeItem('fnUserLatestTnCVersion');
  localStorage.removeItem('sidebarOpen'); // create sidebar open setting
  fnUserLatestTnCVersion = undefined;
  if (!withoutToken) {
    localStorage.removeItem('fnUserToken');
  }
};

const refresh = async () => {
  const userData = await getCurrentUser();
  const { id, email, stage, role, name, lastAcceptedVersion, companyId } =
    userData || {};
  userId(id);
  userCompanyId(companyId);
  userEmail(email);
  userStage(stage);
  userRole(role);
  userName(name);
  userConsent(lastAcceptedVersion);
  return true;
};

export const AuthService = {
  userId,
  userCompanyId,
  userRole,
  userToken,
  userStage,
  userEmail,
  isAdmin,
  isCustomer,
  clearAllData,
  incorporationDataReceived,
  refresh,
  userName,
  userConsent,
};
