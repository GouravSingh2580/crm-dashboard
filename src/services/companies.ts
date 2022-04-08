import { ALLOWED_BANKS_BACKEND, getBankDisplayName } from 'enums';
import moment from 'moment';
import { Company, CompanyApi } from 'models/company';
import { isNil, omitBy } from 'lodash';
import api from './axios';
import { AuthService } from './auth';

export const transformCompany = (company: CompanyApi): Company =>
  omitBy(
    {
      ...company,
      bankName: getBankDisplayName(company.bankName || '') || company.bankName,
    } as Company,
    isNil,
  );

export const getCompanyById = async (id: string): Promise<Company> => {
  const { data } = await api.get<{ data: CompanyApi }>(`companies/${id}`);
  return transformCompany(data.data);
};

export const getCompanyByUserId = async (id?: string): Promise<Company[]> => {
  const userId = id ?? AuthService.userId();
  const { data } = await api.get<{ data: CompanyApi[] }>(
    `users/${userId}/companies`,
  );

  return data.data.map(transformCompany);
};

export const transformCompanyDataForUpdate = (params: Partial<Company>) => {
  const newParams: CompanyApi = { ...params };
  if (newParams.incorporationDate) {
    newParams.incorporationDate = moment(params.incorporationDate).format(
      'MM/DD/YYYY',
    );
  }
  if (!newParams.ein) {
    delete newParams.ein;
  }
  if (newParams.bankName) {
    newParams.bankName =
      ALLOWED_BANKS_BACKEND[newParams.bankName] || newParams.bankName;
  }
  return newParams;
};

export const createCompanyByUserId = async (
  userId: string,
  params: Company,
) => {
  const newParams = transformCompanyDataForUpdate(params);
  await api.post(`users/${userId}/companies`, newParams);
};

export const updateCompanyById = async (id: string, params: Company) => {
  const param = transformCompanyDataForUpdate(params);
  const { data } = await api.patch(`companies/${id}`, param);
  return data;
};

export const upsertCompanyByUserId = async (id: string, params: Company) => {
  const param = transformCompanyDataForUpdate(params);
  const { data } = await api.post(`users/${id}/companies`, param);
  return data;
};

export type { Company };
