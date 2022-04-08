import {useAccountDataForAdminPage} from '../useAccountDataForAdminPage';

describe('useAccountDataForAdminPage test', () => {
  it('should generated with id', () => {
    const accountData = {
      id: 1,
    };
    expect(useAccountDataForAdminPage(accountData)).toHaveProperty('id', 1);
  });
  it('should generated with default id', () => {
    expect(useAccountDataForAdminPage(undefined)).toHaveProperty('id', '');
    expect(useAccountDataForAdminPage(null)).toHaveProperty('id', '');
    expect(useAccountDataForAdminPage({})).toHaveProperty('id', '');
  });
});
