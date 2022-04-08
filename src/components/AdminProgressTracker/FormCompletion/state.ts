import {
  IAccount,
  ProgressTrackerGroups,
  ProgressTrackerStages,
} from 'services/account';
import {
  findByGroupAndStage,
  getLatestStatus,
} from 'helpers/progressTracker';

export const initialState = () => ({
  rightSignatureURL: '',
  steps: {
    [ProgressTrackerStages.BankSelection]: {
      data: {},
      updatedAt: null,
      status: null,
      label: 'Bank Selection',
    },
    [ProgressTrackerStages.DocumentSigning]: {
      data: {},
      updatedAt: null,
      status: null,
      label: 'Document Signing',
    },
  },
});

export const reducer = (
  state: any,
  action: { type: ProgressTrackerStages | string; value: IAccount },
) => {
  switch (action.type) {
    case ProgressTrackerStages.BankSelection: {
      const data = findByGroupAndStage(action.value.progress, {
        group: ProgressTrackerGroups.FormCompletion,
        stage: ProgressTrackerStages.BankSelection,
      });
      return {
        ...state,
        steps: {
          ...state.steps,
          [ProgressTrackerStages.BankSelection]: {
            ...state.steps[ProgressTrackerStages.BankSelection],
            data,
            ...getLatestStatus(data?.status),
          },
        },
      };
    }
    case ProgressTrackerStages.DocumentSigning: {
      const data = findByGroupAndStage(action.value.progress, {
        group: ProgressTrackerGroups.FormCompletion,
        stage: ProgressTrackerStages.DocumentSigning,
      });
      return {
        ...state,
        steps: {
          ...state.steps,
          [ProgressTrackerStages.DocumentSigning]: {
            ...state.steps[ProgressTrackerStages.DocumentSigning],
            data,
            ...getLatestStatus(data?.status),
          },
        },
      };
    }
    case 'updateRightSignature': {
      return {
        ...state,
        rightSignatureURL: action.value.rightSignatureURL
      }
    }
    default:
      return state;
  }
};
