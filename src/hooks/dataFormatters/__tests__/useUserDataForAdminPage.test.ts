import {useUserDataForAdminPage} from '../useUserDataForAdminPage';

describe('', () => {
  const defaultData = {
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

  it('should return default data', () => {
    expect(useUserDataForAdminPage(null)).toStrictEqual(defaultData);
    expect(useUserDataForAdminPage(undefined)).toStrictEqual(defaultData);
    expect(useUserDataForAdminPage({})).toStrictEqual(defaultData);
  });

  it('should return data', () => {
    const data = {
      accountId: 1,
      name: {
        first: 'foo',
        middle: 'o',
        last: 'bar',
      },
      dob: '01/01/1999',
      bankName: 'great bank',
      routingNumber: '1234567890',
      bankAccountNumber: '1234567890',
    };
    expect(useUserDataForAdminPage(data)).toStrictEqual({
      accountId: 1,
      name: {
        first: 'foo',
        middle: 'o',
        last: 'bar',
      },
      dob: '01/01/1999',
      bankName: 'great bank',
      routingNumber: '1234567890',
      bankAccountNumber: '1234567890',
      bankAccountType: '',
    });
  });
});
