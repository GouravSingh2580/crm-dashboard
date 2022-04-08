import moment from 'moment';
import { AxiosError } from 'axios';
import { Company } from 'models/company';
import { AuthService } from './auth';
import { api } from './axios';
import { getCompanyByUserId } from './companies';

export interface UserInfo {
  id: string;
  email: string;
  stage: string;
  role: string;
  name: {
    first?: string;
    middle?: string;
    last?: string;
  };
  companyId?: string;
  dob?: string;
  bankName?: string;
  routingNumber?: string;
  bankAccountNumber?: string;
  bankAccountType?: string;
  progress?: Array<{
    group: string,
    step: string,
  }>;
  // Hubspot
  contactId: string;
  lastAcceptedVersion: string | undefined;
  tncAcceptedAt: Date;
  accountId?: string;
}

export interface UserIdentity {
  ssn: string;
}

export const getCurrentUser = async (): Promise<UserInfo> => {
  const { data } = await api.get<{ data: UserInfo }>('users/me');
  return data.data;
};

export const getUser = async (id: string): Promise<UserInfo> => {
  const { data } = await api.get<{ data: UserInfo }>(`users/${id}`);
  return data.data;
};

export const upsertUser = async (params: any): Promise<{ data: UserInfo }> => {
  const { data } = await api.post('users', params);
  return data;
};

export const updateUser = (params: any, userId?: string): Promise<never> => {
  const id = userId ?? AuthService.userId();
  const param = { ...params };
  if (param.dob) {
    param.dob = moment(params.dob).format('MM/DD/YYYY');
  }
  return api.patch(`users/${id}`, param);
};

export const updateUserById = (
  id: string,
  params: Partial<UserInfo>,
): Promise<never> => api.patch<Partial<UserInfo>, never>(`users/${id}`, params);

export const getUserIdentity = async (userId: string | undefined) => {
  const id = userId ?? AuthService.userId();
  try {
    const { data } = await api.get<{ data: any }>(`users/${id}/identity`);
    return data.data;
  } catch (error) {
    if ((error as AxiosError).response) {
      throw new Error((error as AxiosError<Error>).response?.data?.message);
    } else {
      throw new Error('There is an error while fetching user identity');
    }
  }
};

export const getUserCompanies = async (
  id: string,
): Promise<Company[]> => {
  const data = await getCompanyByUserId(id);
  if (data != null) {
    return data;
  }
  return [];
}

export const getCurrentUserCompanies = async (): Promise<Company[]> => {
  const userId = AuthService.userId();
  return getUserCompanies(userId!);
};

export const updateIdentityByUserId = async (
  id: string,
  params: UserIdentity,
): Promise<any> => {
  const { data } = await api.put(`users/${id}/identity`, params);
  return data;
};

export const UsersService = {
  getCurrentUser,
  getCurrentUserCompanies,
  getUser,
  getUserCompanies,
  getUserIdentity,
  updateUserById,
  updateIdentityByUserId,
  upsertUser,
};
