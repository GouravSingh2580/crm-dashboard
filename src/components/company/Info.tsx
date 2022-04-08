import { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

import queryClient from 'states/reactQueryClient';
import { useUpdateAccountStatus } from 'hooks/api/useAccounts';
import { Tag } from 'components/common';
import { useCompanyName } from 'hooks/dataFormatters';
import { ReactComponent as CompanyLogoExample } from 'icons/company-logo-example.svg';
import useLoading from 'hooks/useLoading';
import { showErrorToast, showSuccessToast } from 'components/toast/showToast';
import { Company } from 'models/company';
import { UserInfo } from 'services/users';
import { AccountStatus, IAccount } from 'models/account';
import { getErrorMessage } from 'helpers/error';
import { get } from 'lodash';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(4, 0),
  },
  companyLogo: {},
  companyInfoBlock: {
    marginLeft: theme.spacing(4),
  },
  companyName: {
    fontWeight: 'bold',
  },
  companyInfo: {
    color: theme.palette.gray.main,
  },
  accountStatusContainer: {
    marginLeft: theme.spacing(8),
    width: '300px',
  },
}));

const styles = makeStyles(() => ({
  selectACTIVE: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3B965E',
    },
  },
  selectNEW: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ED6808',
    },
  },
  labelACTIVE: {
    color: '#3B965E',
  },
  labelNEW: {
    color: '#ED6808',
  },
}));

interface Props {
  companyData: Company;
  userData: UserInfo;
  accountData: IAccount & {
    status: {
      label: AccountStatus;
    };
  };
}

export const Info = ({ companyData, userData, accountData }: Props) => {
  const classes = useStyles();
  const selectClasses = styles();

  const {
    id: accountId,
    status: { label },
  } = accountData;

  const [accountStatus, setAccountStatus] = useState<AccountStatus | ''>('');

  useEffect(() => {
    setAccountStatus(label);
  }, [label]);

  const { name, isPending } = useCompanyName(companyData);
  const {
    name: { first, last },
  } = userData;

  const { mutateAsync: updateStatus, isLoading: isStatusUpdating } =
    useUpdateAccountStatus({
      onSuccess: () => {
        showSuccessToast('Status is updated successfully!');
        queryClient.invalidateQueries('account');
        queryClient.invalidateQueries('accounts');
        queryClient.invalidateQueries('accountsMeta');
      },
      onError: (e) => {
        showErrorToast(`Error has been occurred: ${getErrorMessage(e)}`);
      },
    });

  const { entityType, ein, state } = companyData;

  const getInfoLine = () => {
    const result = [];

    if (first || last) {
      result.push(`${first} ${last}`);
    }
    if (state) {
      result.push(state);
    }
    if (entityType) {
      result.push(entityType);
    }
    result.push('1 member'); // temporary, in the future we will have more members in the company
    if (ein) {
      result.push(`EIN ${ein}`);
    }

    return result.join(' · ');
  };

  const onStatusChange = ({
    target: { value },
  }: SelectChangeEvent<'' | AccountStatus>) => {
    setAccountStatus(value as AccountStatus);
    return updateStatus({ id: accountId!, label: value as AccountStatus });
  };

  const loading = useLoading(isStatusUpdating);

  return (
    <div className={classes.info}>
      <div className={classes.companyLogo}>
        <CompanyLogoExample />
      </div>
      <div className={classes.companyInfoBlock}>
        <Typography className={classes.companyName} variant="h4" component="h4">
          {name}
          {isPending ? <Tag value="Pending" /> : null}
        </Typography>
        <Typography
          className={classes.companyInfo}
          variant="body1"
          component="div"
        >
          {getInfoLine()}
        </Typography>
      </div>
      <div className={classes.accountStatusContainer}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel className={get(selectClasses, `label${accountStatus}`)}>
            Status
          </InputLabel>
          <Select
            value={accountStatus}
            onChange={onStatusChange}
            label="Status"
            className={get(selectClasses, `select${accountStatus}`)}
            data-testid="select-status"
          >
            <MenuItem value="NEW">New</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="ARCHIVED">Archived</MenuItem>
          </Select>
        </FormControl>
        {loading}
      </div>
    </div>
  );
};
