import Api from './axios';

export interface ISaveXeroCodeProps {
  code: string;
  // eslint-disable-next-line camelcase
  redirect_url: string;
}

export const saveXeroCodeToServer = async (
  accountId: string,
  params: ISaveXeroCodeProps,
) => Api.post(`accounts/${accountId}/xero`, params);

