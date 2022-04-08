import { ENTITY_MAPPING } from 'constants/common';
import {
  ProgressTrackerGroup,
  ProgressTrackerGroups,
  ProgressTrackerStages,
} from 'services/account';
import { findByGroupAndStage, getLatestStatus } from 'helpers/progressTracker';
import { get } from 'lodash';

export const initialState = (entityType: string) => ({
  [ProgressTrackerStages.PersonalDetails]: {
    data: {},
    updatedAt: null,
    status: null,
    label: 'Personal Details',
  },
  [ProgressTrackerStages.CompanyDetails]: {
    data: {},
    updatedAt: null,
    status: null,
    label: 'Company Details',
  },
  [ProgressTrackerStages.AddressDetails]: {
    data: {},
    updatedAt: null,
    status: null,
    label: 'Business Address',
  },
  ...(entityType === ENTITY_MAPPING.sole_prop && {
    [ProgressTrackerStages.FilingDocuments]: {
      data: {},
      updatedAt: null,
      status: null,
      label: 'Filing Documents',
    },
  }),
});

export const reducer = (
  state: any,
  action: { type: ProgressTrackerStages; value: ProgressTrackerGroup[] },
) => {
  switch (action.type) {
    case ProgressTrackerStages.PersonalDetails: {
      const data = findByGroupAndStage(action.value, {
        group: ProgressTrackerGroups.Incorporation,
        stage: ProgressTrackerStages.PersonalDetails,
      });

      return {
        ...state,
        [ProgressTrackerStages.PersonalDetails]: {
          ...state[ProgressTrackerStages.PersonalDetails],
          data,
          ...getLatestStatus(data?.status),
        },
      };
    }
    case ProgressTrackerStages.CompanyDetails: {
      const data = findByGroupAndStage(action.value, {
        group: ProgressTrackerGroups.Incorporation,
        stage: ProgressTrackerStages.CompanyDetails,
      });

      return {
        ...state,
        [ProgressTrackerStages.CompanyDetails]: {
          ...state[ProgressTrackerStages.CompanyDetails],
          data,
          ...getLatestStatus(data?.status),
        },
      };
    }
    case ProgressTrackerStages.AddressDetails: {
      const data = findByGroupAndStage(action.value, {
        group: ProgressTrackerGroups.Incorporation,
        stage: ProgressTrackerStages.AddressDetails,
      });

      return state[ProgressTrackerStages.AddressDetails]
        ? {
            ...state,
            [ProgressTrackerStages.AddressDetails]: {
              ...state[ProgressTrackerStages.AddressDetails],
              data,
              ...getLatestStatus(data?.status),
            },
          }
        : state;
    }
    case ProgressTrackerStages.FilingDocuments: {
      const data = findByGroupAndStage(action.value, {
        group: ProgressTrackerGroups.Incorporation,
        stage: ProgressTrackerStages.FilingDocuments,
      });

      return state[ProgressTrackerStages.FilingDocuments]
        ? {
            ...state,
            [ProgressTrackerStages.FilingDocuments]: {
              ...state[ProgressTrackerStages.FilingDocuments],
              data,
              ...getLatestStatus(data?.status),
            },
          }
        : state;
    }
    default:
      return state;
  }
};

export const isStepCompleted = (state: any, step: ProgressTrackerStages) =>
  get(state[step], 'status', '') === 'completed';
