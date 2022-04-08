import { useContext, createContext } from 'react';

export const SidebarContext = createContext(localStorage.getItem('sidebarOpen') !== 'false');
export const getSidebarContextProvider = () => SidebarContext.Provider;
export const setSidebarOpen = (open: boolean) => {
  localStorage.setItem('sidebarOpen', String(open))
}
export const useSidebarOpen = () => useContext(SidebarContext);
