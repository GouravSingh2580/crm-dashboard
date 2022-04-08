import { AuthService } from 'services/auth';
import { CONFIG } from 'config';
import { payrollService } from './axios';

const redirectURI = CONFIG.gustoRedirectUri;

export interface GustoAccountResp {
  id: number;
  email: string;
}
export const getCurrentGustoAccount = async (): Promise<GustoAccountResp> =>
  payrollService.get<GustoAccountResp>('/me').then((resp) => resp.data);

export interface GustoCompanyResp {
  id: number;
  name: string;
  uuid: string;
}
export const getGustoCompanies = async (): Promise<GustoCompanyResp[]> =>
  payrollService
    .get<GustoCompanyResp[]>('/companies')
    .then((resp) => resp.data);

export const processGustoAuth = async (code: string) => {
  const userId = AuthService.userId();
  return payrollService.post(
    '/auth',
    {},
    {
      params: {
        code,
        redirectURI,
        userId,
      },
    },
  );
};

export const connectGustoCompany = async (accountId: string, uuid: string) =>
  payrollService.post(`/account/${accountId}/company`, {
    gustoCompanyUUID: uuid,
  });

export const disconnectGustoCompany = async (accountId: string) =>
  payrollService.delete(`/account/${accountId}/company`)
