import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { Company } from 'services';
import { CustomerDiscussionStatus, IAccount } from 'models/account';
import { useUpdateAccount } from 'hooks/api/useAccounts';
import { useUpdateCompany } from 'hooks/api/useCompanies';
import { queryClient } from 'states/reactQueryClient';
import { UserInfo } from 'services/users';
import { Spacer } from 'components/Spacer';
import userIcon from 'icons/businessHealth/user.svg';
import {
  HealthInsurance,
  IncorporationHealth,
  OverallHealth,
  RetirementPlan,
  Payroll,
} from './healthStatus';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: theme.spacing(4, 7),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  image: {
    width: 16,
    height: 16,
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  entityTypeContainer: {
    backgroundColor: '#bbc0d0',
    color: theme.palette.text.primary,
    borderRadius: 16,
    padding: theme.spacing(0.5, 2),
  },
}));

interface Props {
  companyData: Company;
  userData: UserInfo;
  accountData: IAccount;
}

export const AdminBusinessHealth = (props: Props) => {
  const classes = useStyles();
  const { companyData, userData, accountData } = props;

  const { mutateAsync: updateAccount } = useUpdateAccount(userData.accountId, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['account', userData.accountId]);
    },
  });
  const { mutateAsync: updateCompany } = useUpdateCompany({
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'company/user',
        'userid',
        userData.id,
      ]);
    },
  });

  const updateAccountData = async (
    fieldName: string,
    newData: CustomerDiscussionStatus | string | boolean,
  ) => {
    await updateAccount({ [fieldName]: newData });
  };

  const updateCompanyData = async (fieldName: string, newData: string) => {
    await updateCompany({
      id: companyData.id || '',
      data: {
        [fieldName]: newData,
      },
    });
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.rowContainer}>
        <Typography variant="h7B">{`Incorporation Health — `}</Typography>
        <Typography>{accountData.companyName}</Typography>
        <Typography className={classes.entityTypeContainer}>
          {accountData.entityType}
        </Typography>
      </div>
      <Spacer height={1} />
      <div className={classes.rowContainer}>
        <img src={userIcon} className={classes.image} alt="user" />
        <Typography>{accountData.ownerName}</Typography>
      </div>
      {/* <Spacer height={1} /> // todo: display user last login after we have the data from api
      <div className={classes.rowContainer}>
        <img src={flagIcon} className={classes.image} alt="flag" />
        <Typography>{"Last user's login: "}</Typography>
        <Typography>{`${daySinceLogin} ${
          daySinceLogin > 1 ? 'days' : 'day'
        } ago`}</Typography>
      </div> */}
      <Spacer height={4} />
      <OverallHealth accountData={accountData} companyData={companyData} />
      <Spacer height={2} />
      <IncorporationHealth
        companyData={companyData}
        updateCompanyData={updateCompanyData}
      />
      <Spacer height={2} />
      <HealthInsurance
        accountData={accountData}
        onStatusChange={updateAccountData}
      />
      <Spacer height={2} />
      <RetirementPlan
        accountData={accountData}
        onStatusChange={updateAccountData}
      />
      <Spacer height={2} />
      <Payroll
        accountData={accountData}
        updateAccountData={updateAccountData}
      />
    </div>
  );
};
