import UserData from 'models/UserData';
import create from 'zustand';

interface BookkeepingState {
  isBookkeeper: boolean;
  setIsBookkeeper: (value: boolean) => void;
  setupState: (userData: UserData) => void;
}

export const useBookkeepingStore = create<BookkeepingState>((set) => ({
  isBookkeeper: false,
  setIsBookkeeper: (value: boolean) => set({ isBookkeeper: value }),
  setupState: (userData: UserData) => {
    const role = userData?.userInfo.role || 'Customer';
    set({ isBookkeeper: role === 'Admin' });
  },
}));

// eslint-disable-next-line max-len
export const useBookkeepingState = (): BookkeepingState => useBookkeepingStore((state: BookkeepingState) => ({ ...state }));
