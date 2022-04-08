import { IAction, ISubAction } from './constant';

interface Flags {
  [key: string]: boolean;
}

export const filterEnabledActions = (
  actions: Array<IAction | ISubAction>,
  flags: Flags,
) =>
  actions.filter(
    (action) =>
      !action.featureFlag ||
      (action.featureFlag != null && flags[action.featureFlag] === true),
  );
