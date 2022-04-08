import { filterEnabledActions } from "../helpers";
import { IAction } from '../constant';

describe('filterEnabledActions test', () => {
  const sampleActions = [
    {
      id: 'welcome',
      text: 'Dashboard',
      path: '/welcome',
    },
    {
      id: 'documents',
      text: 'Documents',
      path: '',
    },
    {
      id: 'banks',
      text: 'Bank accounts',
      path: '',
      featureFlag: 'bookkeeping',
    },
  ];
  const sampleFlags = {
    bookkeeping: true
  }
  it('should filter empty array', () => {
    expect(filterEnabledActions([], sampleFlags)).toStrictEqual([]);
  });

  it('should return full array when enabling feature flag', () => {
    expect(filterEnabledActions(sampleActions as unknown as IAction[], sampleFlags)).toEqual(sampleActions);
  });

  it('should return filtered array when disable feature flag', () => {
    expect(filterEnabledActions(sampleActions as unknown as IAction[], { bookkeeping: false })).toEqual([
      {
        id: 'welcome',
        text: 'Dashboard',
        path: '/welcome',
      },
      {
        id: 'documents',
        text: 'Documents',
        path: '',
      }
    ]);
  });

  it('should return full array when all action is not depend on feature flag', () => {
    const anotherSampleActions = sampleActions.filter(action => !action.featureFlag);
    expect(filterEnabledActions(anotherSampleActions as unknown as IAction[], sampleFlags)).toEqual([
      {
        id: 'welcome',
        text: 'Dashboard',
        path: '/welcome',
      },
      {
        id: 'documents',
        text: 'Documents',
        path: '',
      }
    ]);
  })
})
