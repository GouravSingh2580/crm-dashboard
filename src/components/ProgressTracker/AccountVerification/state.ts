import {
  ProgressTrackerGroup,
  ProgressTrackerGroups,
  ProgressTrackerStages,
} from 'services/account';
import { ENTITY_MAPPING } from 'constants/common';
import { getLatestStatus, findByGroupAndStage } from 'helpers/progressTracker';
import { getCurrentCommentByUpdatedAt } from './util';

export const initialState = (entityType: string) => ({
  [ProgressTrackerStages.UploadIdentityProof]: {
    data: {},
    status: null,
    label: 'Upload Identity Proof',
    comment: '',
  },
  [ProgressTrackerStages.UploadLastYearTaxStatement]: {
    data: {},
    status: null,
    label: "Upload Last Year's Tax Return",
    comment: '',
  },
  ...(entityType !== ENTITY_MAPPING.sole_prop && {
    [ProgressTrackerStages.DocumentOfIncorporation]: {
      data: {},
      status: null,
      label: 'Documents of Incorporation',
      comment: '',
    },
  }),
  [ProgressTrackerStages.DirectDepositInformation]: {
    data: {},
    status: null,
    label: 'Direct Deposit Information',
    comment: '',
  },
});

export const reducer = (
  state: any,
  action: { type: ProgressTrackerStages; value: ProgressTrackerGroup[] },
) => {
  switch (action.type) {
    case ProgressTrackerStages.UploadIdentityProof: {
      const data = findByGroupAndStage(action.value, {
        group: ProgressTrackerGroups.AccountVerification,
        stage: ProgressTrackerStages.UploadIdentityProof,
      });

      return {
        ...state,
        [ProgressTrackerStages.UploadIdentityProof]: {
          ...state[ProgressTrackerStages.UploadIdentityProof],
          data,
          ...getLatestStatus(data?.status),
          comment: getCurrentCommentByUpdatedAt(data?.status),
        },
      };
    }
    case ProgressTrackerStages.UploadLastYearTaxStatement: {
      const data = findByGroupAndStage(action.value, {
        group: ProgressTrackerGroups.AccountVerification,
        stage: ProgressTrackerStages.UploadLastYearTaxStatement,
      });

      return {
        ...state,
        [ProgressTrackerStages.UploadLastYearTaxStatement]: {
          ...state[ProgressTrackerStages.UploadLastYearTaxStatement],
          data,
          ...getLatestStatus(data?.status),
          comment: getCurrentCommentByUpdatedAt(data?.status),
        },
      };
    }
    case ProgressTrackerStages.DocumentOfIncorporation: {
      const data = findByGroupAndStage(action.value, {
        group: ProgressTrackerGroups.AccountVerification,
        stage: ProgressTrackerStages.DocumentOfIncorporation,
      });

      return state[ProgressTrackerStages.DocumentOfIncorporation]
        ? {
            ...state,
            [ProgressTrackerStages.DocumentOfIncorporation]: {
              ...state[ProgressTrackerStages.DocumentOfIncorporation],
              data,
              ...getLatestStatus(data?.status),
              comment: getCurrentCommentByUpdatedAt(data?.status),
            },
          }
        : state;
    }
    case ProgressTrackerStages.DirectDepositInformation: {
      const data = findByGroupAndStage(action.value, {
        group: ProgressTrackerGroups.AccountVerification,
        stage: ProgressTrackerStages.DirectDepositInformation,
      });

      return {
        ...state,
        [ProgressTrackerStages.DirectDepositInformation]: {
          ...state[ProgressTrackerStages.DirectDepositInformation],
          data,
          ...getLatestStatus(data?.status),
          comment: getCurrentCommentByUpdatedAt(data?.status),
        },
      };
    }
    default:
      return state;
  }
};
