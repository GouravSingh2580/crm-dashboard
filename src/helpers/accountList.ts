import {
  ProgressTrackerGroup,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  Status,
} from 'services/account';
import { getLatestStatus, findByGroupAndStage } from 'helpers/progressTracker';
import { findByProps } from 'components/ProgressTracker/AccountVerification/util';
import { UIDateFormat } from 'helpers/dateTimeFormat';

const extractLatestStatus = (
  progress: ProgressTrackerGroup[],
  props: findByProps,
): string => {
  const data = findByGroupAndStage(progress, {
    group: props.group,
    stage: props.stage,
  });
  const currentStatus: Status | null = getLatestStatus(
    data?.status,
  );
  if (currentStatus) {
    return `${currentStatus.updatedAt}`;
  }
  return '';
};

const findProgressStatusText = (
  progress: ProgressTrackerGroup[],
  props: findByProps,
): string => {
  const latestStatus = extractLatestStatus(progress, props);
  if (latestStatus) {
    return UIDateFormat(latestStatus);
  }
  return '-';
};

const findLLCStatus = (progress: ProgressTrackerGroup[]): string => {
  const steps: findByProps[] = [
    {
      group: ProgressTrackerGroups.Incorporation,
      stage: ProgressTrackerStages.PersonalDetails,
    },
    {
      group: ProgressTrackerGroups.Incorporation,
      stage: ProgressTrackerStages.CompanyDetails,
    },
    {
      group: ProgressTrackerGroups.Incorporation,
      stage: ProgressTrackerStages.AddressDetails,
    },
    {
      group: ProgressTrackerGroups.AccountVerification,
      stage: ProgressTrackerStages.UploadIdentityProof,
    },
  ];
  let statusDate: string[] = steps.map((step) =>
    extractLatestStatus(progress, step),
  );
  if (statusDate.filter((d) => d).length === steps.length) {
    // all steps are completed
    statusDate = statusDate.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return UIDateFormat(statusDate[0]);
  }
  return '-';
};

export function extractProgressStatus(progress: ProgressTrackerGroup[]) {
  const llcStatus = findLLCStatus(progress);
  return {
    llcForm: llcStatus,
    bankPreference: findProgressStatusText(progress, {
      group: ProgressTrackerGroups.FormCompletion,
      stage: ProgressTrackerStages.BankSelection,
    }),
    signaturePackage: findProgressStatusText(progress, {
      group: ProgressTrackerGroups.FormCompletion,
      stage: ProgressTrackerStages.DocumentSigning,
    }),
    directDeposit: findProgressStatusText(progress, {
      group: ProgressTrackerGroups.AccountVerification,
      stage: ProgressTrackerStages.DirectDepositInformation,
    }),
  };
}
