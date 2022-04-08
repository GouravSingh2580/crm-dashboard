import create from 'zustand';

export enum Stage {
  Loading = 'loading',
  Setup = 'setup',
  BankView = 'view',
  Error = 'error',
}

interface State {
  stage: Stage;
  setStage: (newStage: Stage) => void;
}

export const useStore = create<State>((set) => ({
  stage: Stage.Loading,
  setStage: (newStage: Stage) => set({ stage: newStage }),
}));
