import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { StageSkeleton } from 'components/ProgressTracker/StageSkeleton';
import { Incorporation } from './Incorporation';
import { AccountVerification } from './AccountVerification';
import { FormCompletion } from './FormCompletion';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
  },
}));
interface IAdminProgressTrackerProps {
  companyId: string,
  companyData: any,
  userData: any,
}

export const AdminProgressTracker: React.FC<IAdminProgressTrackerProps> = ({
  companyId,
  companyData,
  userData,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {companyData?.entityType ? <Incorporation
        companyData={companyData}
        userData={userData}
      /> : <StageSkeleton />}
      {companyData?.entityType ? <AccountVerification
        companyId={companyId}
        companyData={companyData}
        userData={userData}
      /> : <StageSkeleton />}
      {companyData?.entityType ? <FormCompletion
        companyData={companyData}
        userData={userData}
      /> : <StageSkeleton />}
    </div>
  );
};
