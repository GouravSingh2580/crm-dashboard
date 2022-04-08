const initData = {
  accountId: undefined,
  name: {
    first: '',
    middle: '',
    last: '',
  },
  dob: '',
  bankName: '',
  routingNumber: '',
  bankAccountNumber: '',
  bankAccountType: '',
};

export const useUserDataForAdminPage = (userData: any) => {
  const data = userData != null ? userData : {};
  return { ...initData, ...data };
};

