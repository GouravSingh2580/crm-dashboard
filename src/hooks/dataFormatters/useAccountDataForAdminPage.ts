import { IAccount } from 'models/account';

const initData: IAccount = {
  id: '',
  status: {
    label: 'NEW',
    updatedBy: '',
    updatedAt: '',
  },
  createdAt: '',
  progress: [],
};

export const useAccountDataForAdminPage = (accountData: IAccount | undefined): IAccount => {
  if (!accountData) {
    return initData;
  }
  return { ...initData, ...accountData };
};

