/* eslint-disable indent */
import {
  getLatestStatus,
  findByGroupAndStage,
} from 'helpers/progressTracker';
import {
  ProgressTrackerGroup,
  ProgressTrackerGroups,
  ProgressTrackerStages,
} from 'services/account';
import { useCallback, useEffect, useReducer } from 'react';
import { useAccount } from 'hooks/api/useAccounts';
import { get } from 'lodash';
import { ENTITY_MAPPING } from 'constants/common';

export const initialState = (entityType: string) => ({
  [ProgressTrackerStages.UploadIdentityProof]: {
    data: {},
    updatedAt: null,
    status: null,
    label: 'Identity Proof',
  },
  [ProgressTrackerStages.UploadLastYearTaxStatement]: {
    data: {},
    updatedAt: null,
    status: null,
    label: "Last Year's Tax Return",
  },
  ...((entityType !== ENTITY_MAPPING.sole_prop) && {
    [ProgressTrackerStages.DocumentOfIncorporation]: {
      data: {},
      updatedAt: null,
      status: null,
      label: 'Documents of Incorporation',
    },
  }),
  [ProgressTrackerStages.DirectDepositInformation]: {
    data: {},
    updatedAt: null,
    status: null,
    label: 'Direct Deposit Information',
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
        },
      };
    }
    default:
      return state;
  }
};

export const useSetupState = (
  accountId: string | undefined,
  entityType: string = '',
) => {
  const [state, dispatch] = useReducer(reducer, initialState(entityType));

  const list = [
    ProgressTrackerStages.UploadIdentityProof,
    ProgressTrackerStages.UploadLastYearTaxStatement,
    ProgressTrackerStages.DocumentOfIncorporation,
    ProgressTrackerStages.DirectDepositInformation,
  ];

  const { account } = useAccount(accountId);
  useEffect(() => {
    if (account != null) {
      const progress = get(account, 'progress', []);
      list.forEach((key) => {
        dispatch({
          type: key,
          value: progress,
        });
      });
    }
  }, [account]);

  const isStepCompleted = useCallback(
    (step: ProgressTrackerStages) =>
      get(state[step], 'status', '') === 'completed',
    [state],
  );

  return {
    state,
    dispatch,
    isStepCompleted,
  };
};
