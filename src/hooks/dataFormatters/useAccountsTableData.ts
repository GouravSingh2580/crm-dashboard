import moment from 'moment';
import { extractProgressStatus } from 'helpers/accountList';
import { UIDateFormat } from 'helpers/dateTimeFormat';
import { ProgressTrackerGroup } from 'services/account';
import { capitalizeFirstLetter } from 'helpers/text-transformer';
import { IAccountListItem } from 'models/account';

export interface IAccountItemRow {
  registeredDate: string;
  companyId: string;
  companyName: string;
  entityType: string;
  id: string;
  insights: {
    ytdExpense: number;
  };
  ownerEmail: string;
  ownerId: string;
  ownerName: string;
  progress: ProgressTrackerGroup[];
  status: string;
  dayInStatus: number;
  llcForm: string;
  bankPreference: string;
  signaturePackage: string;
  directDeposit: string;
  [key: string]: any;
}

const useAccountRow = (item: IAccountListItem): IAccountItemRow => {
  const {
    createdAt,
    companyId,
    companyName,
    entityType,
    id,
    insights,
    ownerEmail,
    ownerId,
    ownerName,
    progress,
    status,
  } = item;
  return {
    registeredDate: UIDateFormat(createdAt),
    companyId,
    companyName,
    entityType,
    id,
    insights,
    ownerEmail,
    ownerId,
    ownerName,
    progress,
    status: capitalizeFirstLetter(status?.label),
    dayInStatus: moment().diff(moment(status?.updatedAt), 'days'),
    ...extractProgressStatus(progress),
  };
};

export const useAccountsTableData = (
  accounts: IAccountListItem[],
): IAccountItemRow[] => accounts.map(useAccountRow);
