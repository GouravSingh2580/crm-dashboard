import { useAccountsTableData } from '../useAccountsTableData';
import { IAccountListItem } from 'models/account';
import moment from 'moment';

describe('useAccountsTableData test', () => {
  it('should return default data', () => {
    expect(useAccountsTableData([])).toStrictEqual([]);
  });
  it('should return generated data', () => {
    const data: IAccountListItem[] = [
      {
        id: '61268a98f3bb3878775c469f',
        status: {
          label: 'NEW',
          updatedAt: moment().subtract('3', 'day').toISOString(),
          updatedBy: '61313607be6422d7e340f1b0',
        },
        progress: [],
        rightSignatureURL: 'https://google.com/google',
        insights: {
          ytdExpense: 0,
        },
        ownerName: 'Toan two Customer',
        ownerId: '61268a98f3bb3878775c46a0',
        entityType: 'Sole-Prop',
        ownerEmail: 'toan+2@formationscorp.com',
        companyName: 'Test',
        companyId: '61268ac5fe6170fdd47dcdc5',
        createdAt: '2021-08-25T18:23:20Z',
      },
    ];

    expect(useAccountsTableData(data)).toStrictEqual([
      {
        registeredDate: '8/25/2021',
        companyId: '61268ac5fe6170fdd47dcdc5',
        companyName: 'Test',
        entityType: 'Sole-Prop',
        id: '61268a98f3bb3878775c469f',
        insights: {
          ytdExpense: 0,
        },
        ownerEmail: 'toan+2@formationscorp.com',
        ownerId: '61268a98f3bb3878775c46a0',
        ownerName: 'Toan two Customer',
        progress: [],
        status: 'New',
        dayInStatus: 3,
        llcForm: '-',
        bankPreference: '-',
        signaturePackage: '-',
        directDeposit: '-',
      },
    ]);
  });
});
